import { useState, useEffect, useRef, useCallback } from 'react';

interface OAuthConfig {
  googleClientId?: string;
  kakaoClientId?: string;
  naverClientId?: string;
  apiBaseUrl?: string;
}

interface OAuthErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  errorCode?: string;
  oauthData?: {
    email?: string;
    name?: string;
    nickname?: string;
    provider?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface OAuthResult {
  success: boolean;
  user?: SafeUser;
  error?: string;
  needsSignup?: boolean;
  oauthData?: any;
  errorType?: 'SERVER_ERROR' | 'VALIDATION_ERROR' | 'USER_NOT_FOUND' | 'MISSING_REQUIRED_FIELDS' | 'AUTH_FAILED';
}

interface SafeUser {
  userId?: number | null;
  username?: string | null;
  name?: string | null;
  userNickName?: string | null;
  userEmail?: string | null;
  userPhone?: string | null;
  userGender?: 'M' | 'F' | null;
  userBirth?: string | null;
  userMemberGrade?: string | null;
}

interface UseOAuthReturn {
  isLoading: boolean;
  error: string;
  oauthResult: SafeUser | null;
  needsSignup: boolean;
  oauthSignupData: any;
  loginWithGoogle: () => void;
  loginWithKakao: () => void;
  loginWithNaver: () => void;
  clearError: () => void;
  clearResult: () => void;
  clearSignupData: () => void;
  proceedToSignup: () => void;
}

const safeStorage = {
  getItem: (key: string, storage: Storage = localStorage): string | null => {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string, storage: Storage = localStorage): boolean => {
    try {
      storage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem: (key: string, storage: Storage = localStorage): boolean => {
    try {
      storage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

export const useOAuth = (config?: OAuthConfig): UseOAuthReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [oauthResult, setOauthResult] = useState<SafeUser | null>(null);
  const [needsSignup, setNeedsSignup] = useState<boolean>(false);
  const [oauthSignupData, setOauthSignupData] = useState<any>(null);

  const popupRef = useRef<Window | null>(null);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popupMonitorRef = useRef<NodeJS.Timeout | null>(null);
  const processingRef = useRef<Map<string, boolean>>(new Map());

  const GOOGLE_CLIENT_ID = config?.googleClientId || process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const KAKAO_CLIENT_ID = config?.kakaoClientId || process.env.REACT_APP_KAKAO_CLIENT_ID;
  const NAVER_CLIENT_ID = config?.naverClientId || process.env.REACT_APP_NAVER_CLIENT_ID;
  const API_BASE_URL = config?.apiBaseUrl || process.env.REACT_APP_API_BASE_URL || 'http://localhost:4040/api/v1/auth';

  const KAKAO_REDIRECT_URL = `${window.location.origin}/api/v1/auth/kakao`;
  const NAVER_REDIRECT_URL = `${window.location.origin}/api/v1/auth/naver`;
  const GOOGLE_REDIRECT_URL = `${window.location.origin}/api/v1/auth/google`;

  const validateClientId = useCallback((provider: string, clientId?: string): boolean => {
    if (!clientId?.trim()) {
      setError(`${provider} 로그인 설정이 올바르지 않습니다. 관리자에게 문의하세요.`);
      return false;
    }
    return true;
  }, []);

  const analyzeError = useCallback((status: number, responseData: OAuthErrorResponse): { errorType: string, needsSignup: boolean } => {
    if (status === 400) {
      const message = responseData?.message || responseData?.error || '';
      const code = responseData?.code || responseData?.errorCode || '';

      const signupRequiredPatterns = [
        /sign in failed/i,
        /signin failed/i,
        /user.*not.*found/i,
        /account.*not.*found/i,
        /missing.*required.*field/i,
        /additional.*info.*required/i,
        /registration.*needed/i,
        /사용자.*찾을.*수.*없/i,
        /계정.*없/i,
        /가입.*필요/i,
        /등록.*필요/i,
        /USER_NOT_FOUND/i,
        /ACCOUNT_NOT_FOUND/i,
        /SIGNUP_REQUIRED/i
      ];

      const needsSignup = signupRequiredPatterns.some(pattern =>
        pattern.test(message) || pattern.test(code)
      );

      return needsSignup
        ? { errorType: 'USER_NOT_FOUND', needsSignup: true }
        : { errorType: 'AUTH_FAILED', needsSignup: false };
    }

    if (status === 401) return { errorType: 'AUTH_FAILED', needsSignup: false };
    if (status === 404) return { errorType: 'USER_NOT_FOUND', needsSignup: true };
    if (status >= 500) return { errorType: 'SERVER_ERROR', needsSignup: false };

    return { errorType: 'AUTH_FAILED', needsSignup: false };
  }, []);

  const sanitizeUserData = useCallback((userData: any): SafeUser => {
    if (!userData || typeof userData !== 'object') {
      return {
        userId: null,
        username: null,
        name: '사용자',
        userNickName: '닉네임 없음',
        userEmail: null,
        userPhone: null,
        userGender: null,
        userBirth: null,
        userMemberGrade: '일반회원'
      };
    }

    return {
      userId: userData.userId || null,
      username: userData.username || null,
      name: userData.userNickName || userData.name || '사용자',
      userNickName: userData.userNickName || '닉네임 없음',
      userEmail: userData.userEmail || userData.email || null,
      userPhone: userData.userPhone || userData.phone || null,
      userGender: userData.userGender || userData.gender || null,
      userBirth: userData.userBirth || userData.birth || null,
      userMemberGrade: userData.userMemberGrade || userData.memberGrade || '일반회원'
    };
  }, []);

  const cleanupPopup = useCallback(() => {
    if (popupRef.current) {
      try {
        if (!popupRef.current.closed) {
          popupRef.current.close();
        }
      } catch {
        // Ignore errors when closing popup
      }
      popupRef.current = null;
    }

    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = null;
    }

    if (popupMonitorRef.current) {
      clearInterval(popupMonitorRef.current);
      popupMonitorRef.current = null;
    }
  }, []);

  const isProcessing = useCallback((key: string): boolean => {
    return processingRef.current.get(key) === true;
  }, []);

  const setProcessing = useCallback((key: string, value: boolean) => {
    if (value) {
      processingRef.current.set(key, true);
    } else {
      processingRef.current.delete(key);
    }
  }, []);

  const sendCodeToBackend = useCallback(async (provider: string, code: string): Promise<OAuthResult> => {
    const requestKey = `${provider}-${code}`;

    if (isProcessing(requestKey)) {
      return { success: false, error: '이미 처리 중인 요청입니다.' };
    }

    setProcessing(requestKey, true);

    try {
      const requestBody: any = {
        code: code,
        provider: provider.toUpperCase(),
        timestamp: Date.now()
      };

      if (provider.toLowerCase() === 'naver') {
        const savedState = safeStorage.getItem('naver_state', sessionStorage);
        if (savedState) {
          requestBody.state = savedState;
        }
      }

      const endpoint = `${API_BASE_URL}/oauth/${provider.toLowerCase()}`;

      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody),
        });
      } catch (fetchError) {
        const errorMessage = fetchError instanceof TypeError && fetchError.message.includes('fetch')
          ? '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.'
          : '네트워크 오류가 발생했습니다.';

        setError(errorMessage);
        cleanupPopup();

        return {
          success: false,
          error: errorMessage,
          errorType: 'SERVER_ERROR'
        };
      }

      const responseText = await response.text();

      if (!response.ok) {
        let responseData: OAuthErrorResponse = {};
        try {
          responseData = JSON.parse(responseText) as OAuthErrorResponse;
        } catch {
          responseData = { message: responseText };
        }

        const { errorType, needsSignup } = analyzeError(response.status, responseData);

        if (needsSignup) {
          const signupData = {
            provider: provider.toUpperCase(),
            oauthCode: code,
            ...(provider.toLowerCase() === 'naver' && { state: requestBody.state }),
            timestamp: Date.now(),
            ...(responseData?.oauthData || {})
          };

          setOauthSignupData(signupData);
          setNeedsSignup(true);
          setError('');

          safeStorage.setItem('oauthSignupData', JSON.stringify(signupData), sessionStorage);
          cleanupPopup();

          return {
            success: false,
            needsSignup: true,
            oauthData: signupData,
            errorType: errorType as any
          };
        } else {
          let errorMessage = `${provider} 로그인에 실패했습니다.`;

          if (errorType === 'SERVER_ERROR') {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else if (errorType === 'AUTH_FAILED') {
            errorMessage = `${provider} 로그인에 실패했습니다. 다시 시도해주세요.`;
          } else if (errorType === 'VALIDATION_ERROR') {
            errorMessage = responseData.message || `${provider} 로그인 정보가 올바르지 않습니다.`;
          } else {
            errorMessage = responseData.message || responseData.error || errorMessage;
          }

          setError(errorMessage);
          cleanupPopup();

          return {
            success: false,
            error: errorMessage,
            errorType: errorType as any
          };
        }
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }

      if (result.result && result.data) {
        const { token, exprTime, deliverAddress, ...userData } = result.data;
        const safeUser = sanitizeUserData(userData);
        if (token) {
          safeStorage.setItem('accessToken', token);
          if (exprTime) {
            safeStorage.setItem('tokenExpiry', new Date(Date.now() + exprTime * 1000).toISOString());
          }
          safeStorage.setItem('user', JSON.stringify(safeUser));
        }

        setOauthResult(safeUser);
        setError('');
        setNeedsSignup(false);
        cleanupPopup();

        return {
          success: true,
          user: safeUser
        };
      } else {
        const errorMessage = result.message || `${provider} 로그인에 실패했습니다.`;
        setError(errorMessage);
        cleanupPopup();

        return {
          success: false,
          error: errorMessage
        };
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '예상치 못한 오류가 발생했습니다.';

      setError(errorMessage);
      cleanupPopup();

      return {
        success: false,
        error: errorMessage,
        errorType: 'SERVER_ERROR'
      };
    } finally {
      setIsLoading(false);
      setProcessing(requestKey, false);
    }
  }, [API_BASE_URL, analyzeError, sanitizeUserData, cleanupPopup, isProcessing, setProcessing]);

  const startPopupMonitoring = useCallback((popup: Window, provider: string) => {
    if (popupMonitorRef.current) {
      clearInterval(popupMonitorRef.current);
    }

    let crossOriginAttempts = 0;
    const maxCrossOriginAttempts = 3;

    popupMonitorRef.current = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(popupMonitorRef.current!);
          popupMonitorRef.current = null;
          popupRef.current = null;

          if (isLoading) {
            setIsLoading(false);
            setError(`${provider} 로그인이 취소되었습니다.`);
          }
        }
        crossOriginAttempts = 0;
      } catch {
        crossOriginAttempts++;

        if (crossOriginAttempts >= maxCrossOriginAttempts) {
          clearInterval(popupMonitorRef.current!);
          popupMonitorRef.current = null;
        }
      }
    }, 1000);

    popupTimerRef.current = setTimeout(() => {
      cleanupPopup();
      if (isLoading) {
        setIsLoading(false);
        setError(`${provider} 로그인 시간이 초과되었습니다.`);
      }
    }, 5 * 60 * 1000);
  }, [isLoading, cleanupPopup]);

  const performOAuthLogin = useCallback((provider: string, url: string, clientId?: string) => {
    if (!validateClientId(provider, clientId)) {
      return;
    }

    setNeedsSignup(false);
    setOauthSignupData(null);
    cleanupPopup();
    setIsLoading(true);
    setError('');

    try {
      const popup = window.open(
        url,
        `${provider.toLowerCase()}Login`,
        'width=500,height=600,scrollbars=yes,resizable=yes,top=100,left=100'
      );

      if (popup) {
        popupRef.current = popup;
        startPopupMonitoring(popup, provider);
        popup.focus();
      } else {
        setIsLoading(false);
        setError('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      }
    } catch {
      setIsLoading(false);
      setError(`${provider} 로그인 창을 열 수 없습니다.`);
    }
  }, [cleanupPopup, startPopupMonitoring, validateClientId]);

  const loginWithGoogle = useCallback((): void => {
    const googleLoginUrl = "https://accounts.google.com/o/oauth2/auth?" +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URL)}&` +
      `response_type=code&` +
      `scope=openid email profile&` +
      `access_type=offline&` +
      `prompt=select_account`;

    performOAuthLogin('Google', googleLoginUrl, GOOGLE_CLIENT_ID);
  }, [GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL, performOAuthLogin]);

  const loginWithKakao = useCallback((): void => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${KAKAO_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URL)}&` +
      `response_type=code&` +
      `scope=profile_nickname,account_email&` +
      `prompt=login`;

    performOAuthLogin('Kakao', kakaoAuthUrl, KAKAO_CLIENT_ID);
  }, [KAKAO_CLIENT_ID, KAKAO_REDIRECT_URL, performOAuthLogin]);

  const loginWithNaver = useCallback((): void => {
    const state = Math.random().toString(36).substr(2, 11) + Date.now().toString(36);
    safeStorage.setItem('naver_state', state, sessionStorage);

    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?` +
      `response_type=code&` +
      `client_id=${NAVER_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URL)}&` +
      `state=${state}`;

    performOAuthLogin('Naver', naverLoginUrl, NAVER_CLIENT_ID);
  }, [NAVER_CLIENT_ID, NAVER_REDIRECT_URL, performOAuthLogin]);

  const proceedToSignup = useCallback((): void => {
    if (oauthSignupData) {
      const signupUrl = `/join?oauth=true&provider=${oauthSignupData.provider}`;
      safeStorage.setItem('oauthSignupData', JSON.stringify(oauthSignupData), sessionStorage);
      window.location.href = signupUrl;
    }
  }, [oauthSignupData]);

  const clearError = useCallback((): void => {
    setError('');
  }, []);

  const clearResult = useCallback((): void => {
    setOauthResult(null);
  }, []);

  const clearSignupData = useCallback((): void => {
    setNeedsSignup(false);
    setOauthSignupData(null);
    safeStorage.removeItem('oauthSignupData', sessionStorage);
  }, []);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, provider, code, error: messageError } = event.data;

      if (type === 'OAUTH_SUCCESS' && code && provider) {
        const requestKey = `${provider}-${code}`;
        if (isProcessing(requestKey)) {
          return;
        }
        await sendCodeToBackend(provider, code);
      } else if (type === 'OAUTH_ERROR') {
        setError(messageError || `${provider} 로그인 중 오류가 발생했습니다.`);
        setIsLoading(false);
        cleanupPopup();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [sendCodeToBackend, cleanupPopup, isProcessing]);

  useEffect(() => {
    const handleDirectCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const currentPath = window.location.pathname;

      if (code && currentPath.includes('/api/v1/auth/')) {
        if (currentPath.includes('kakao')) {
          await sendCodeToBackend('kakao', code);
        }
        else if (currentPath.includes('naver')) {
          const state = urlParams.get('state');
          const savedState = safeStorage.getItem('naver_state', sessionStorage);

          if (state !== savedState) {
            setError('네이버 로그인 보안 검증에 실패했습니다.');
            return;
          }

          await sendCodeToBackend('naver', code);
        }
        else if (currentPath.includes('google')) {
          await sendCodeToBackend('google', code);
        }
      }
    };

    handleDirectCallback();
  }, [sendCodeToBackend]);

  useEffect(() => {
    return () => {
      cleanupPopup();
      processingRef.current.clear();
    };
  }, [cleanupPopup]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupPopup();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [cleanupPopup]);

  return {
    isLoading,
    error,
    oauthResult,
    needsSignup,
    oauthSignupData,
    loginWithGoogle,
    loginWithKakao,
    loginWithNaver,
    clearError,
    clearResult,
    clearSignupData,
    proceedToSignup
  };
};