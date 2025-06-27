import { useState, useEffect, useRef, useCallback } from 'react';

// 타입 정의
interface OAuthConfig {
  googleClientId?: string;
  kakaoClientId?: string;
  naverClientId?: string;
  apiBaseUrl?: string;
}

// 🎯 백엔드 응답 타입 정의
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
  errorType?: 'SERVER_ERROR' | 'VALIDATION_ERROR' | 'USER_NOT_FOUND' | 'MISSING_REQUIRED_FIELDS';
  debugInfo?: any;
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
  debugInfo: any;
  loginWithGoogle: () => void;
  loginWithKakao: () => void;
  loginWithNaver: () => void;
  clearError: () => void;
  clearResult: () => void;
  clearSignupData: () => void;
  proceedToSignup: () => void;
}

export const useOAuth = (config?: OAuthConfig): UseOAuthReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [oauthResult, setOauthResult] = useState<SafeUser | null>(null);
  const [needsSignup, setNeedsSignup] = useState<boolean>(false);
  const [oauthSignupData, setOauthSignupData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // 팝업 창과 타이머 참조
  const popupRef = useRef<Window | null>(null);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popupMonitorRef = useRef<NodeJS.Timeout | null>(null);

  // 설정값들 (useCallback 의존성에서 안정적이도록)
  const GOOGLE_CLIENT_ID = config?.googleClientId || process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const KAKAO_CLIENT_ID = config?.kakaoClientId || process.env.REACT_APP_KAKAO_CLIENT_ID;
  const NAVER_CLIENT_ID = config?.naverClientId || process.env.REACT_APP_NAVER_CLIENT_ID;
  const API_BASE_URL = config?.apiBaseUrl || 'http://localhost:4040/api/v1/auth';

  // 리다이렉트 URL들
  const KAKAO_REDIRECT_URL = `${window.location.origin}/api/v1/auth/kakao`;
  const NAVER_REDIRECT_URL = `${window.location.origin}/api/v1/auth/naver`;
  const GOOGLE_REDIRECT_URL = `${window.location.origin}/api/v1/auth/google`;

  // 🔍 디버깅 정보 저장 함수 (useCallback)
  const saveDebugInfo = useCallback((info: any) => {
    const timestamp = new Date().toISOString();
    const debugData = {
      timestamp,
      ...info
    };
    setDebugInfo(debugData);
    console.log('🔧 디버깅 정보 저장:', debugData);
  }, []);

  // 🎯 에러 타입 분석 함수 (useCallback)
  const analyzeError = useCallback((status: number, responseData: OAuthErrorResponse, requestData: any): { errorType: string, needsSignup: boolean } => {
    console.log('🔍 상세 에러 분석:', { status, responseData, requestData });
    
    // 디버깅 정보 저장
    saveDebugInfo({
      type: 'error_analysis',
      status,
      responseData,
      requestData,
      timestamp: Date.now()
    });
    
    // 400 에러들 분석
    if (status === 400) {
      const message = responseData?.message || responseData?.error || '';
      const code = responseData?.code || responseData?.errorCode || '';
      
      console.log('📝 400 에러 상세 분석:', { message, code });
      
      // 🎯 회원가입 필요 패턴들
      const signupPatterns = [
        // 영어 패턴
        /user.*not.*found/i,
        /missing.*required.*field/i,
        /phone.*required/i,
        /additional.*info.*required/i,
        /profile.*incomplete/i,
        /signup.*required/i,
        /registration.*needed/i,
        
        // 한국어 패턴
        /사용자.*찾을.*수.*없/i,
        /필수.*정보.*부족/i,
        /전화번호.*필요/i,
        /추가.*정보.*필요/i,
        /프로필.*완성.*않/i,
        /회원가입.*필요/i,
        
        // 코드 패턴
        /USER_NOT_FOUND/i,
        /MISSING_REQUIRED_FIELDS/i,
        /PHONE_REQUIRED/i,
        /ADDITIONAL_INFO_REQUIRED/i,
        /INCOMPLETE_PROFILE/i,
        /SIGNUP_REQUIRED/i
      ];
      
      const needsSignup = signupPatterns.some(pattern => 
        pattern.test(message) || pattern.test(code)
      );
      
      console.log('🎯 회원가입 필요 여부:', needsSignup);
      
      if (needsSignup) {
        return { errorType: 'USER_NOT_FOUND', needsSignup: true };
      } else {
        return { errorType: 'VALIDATION_ERROR', needsSignup: false };
      }
    }
    
    // 401: 인증 실패
    if (status === 401) {
      return { errorType: 'VALIDATION_ERROR', needsSignup: false };
    }
    
    // 404: 사용자 없음 (회원가입 필요)
    if (status === 404) {
      return { errorType: 'USER_NOT_FOUND', needsSignup: true };
    }
    
    // 5xx: 서버 오류
    if (status >= 500) {
      return { errorType: 'SERVER_ERROR', needsSignup: false };
    }
    
    return { errorType: 'SERVER_ERROR', needsSignup: false };
  }, [saveDebugInfo]);

  // 🎯 안전한 사용자 데이터 처리 함수 (useCallback)
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
      name: userData.name || userData.nickname || userData.userNickName || '사용자',
      userNickName: userData.userNickName || userData.nickname || userData.name || '닉네임 없음',
      userEmail: userData.userEmail || userData.email || null,
      userPhone: userData.userPhone || userData.phone || null,
      userGender: userData.userGender || userData.gender || null,
      userBirth: userData.userBirth || userData.birth || null,
      userMemberGrade: userData.userMemberGrade || userData.memberGrade || '일반회원'
    };
  }, []);

  // 팝업 정리 함수
  const cleanupPopup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      try {
        popupRef.current.close();
      } catch (error) {
        console.warn('팝업 닫기 실패:', error);
      }
    }
    popupRef.current = null;

    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
      popupTimerRef.current = null;
    }
    
    if (popupMonitorRef.current) {
      clearInterval(popupMonitorRef.current);
      popupMonitorRef.current = null;
    }
  }, []);

  // 🚀 백엔드로 코드 전송하는 함수 (✅ useCallback으로 최적화!)
  const sendCodeToBackend = useCallback(async (provider: string, code: string): Promise<OAuthResult> => {
    console.log(`🚀 ${provider} 로그인 처리 시작`);
    console.log('🌍 현재 환경:', { 
      NODE_ENV: process.env.NODE_ENV,
      origin: window.location.origin,
      API_BASE_URL
    });
    
    try {
      // 🔍 요청 데이터 상세 준비
      let requestBody: any = { 
        code,
        provider,
        timestamp: Date.now()
      };
      
      if (provider === 'naver') {
        const savedState = sessionStorage.getItem('naver_state');
        if (savedState) {
          requestBody.state = savedState;
          console.log('🔐 Naver state 추가:', savedState);
        } else {
          console.warn('⚠️ Naver state가 sessionStorage에 없습니다!');
        }
      }

      // 🔍 요청 정보 상세 로깅
      const requestInfo = {
        method: 'POST',
        url: `${API_BASE_URL}/oauth/${provider}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': navigator.userAgent,
          'Referer': window.location.href
        },
        body: requestBody,
        codeLength: code.length,
        codePrefix: code.substring(0, 10) + '...'
      };
      
      console.log('📤 상세 요청 정보:', requestInfo);
      
      // 디버깅 정보 저장
      saveDebugInfo({
        type: 'request',
        provider,
        requestInfo,
        timestamp: Date.now()
      });

      const response = await fetch(`${API_BASE_URL}/oauth/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      // 🔍 응답 정보 상세 로깅
      const responseInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        ok: response.ok
      };
      
      console.log('📡 상세 응답 정보:', responseInfo);

      const responseText = await response.text();
      console.log('📄 응답 본문:', responseText);

      // 디버깅 정보 저장
      saveDebugInfo({
        type: 'response',
        provider,
        responseInfo,
        responseText,
        timestamp: Date.now()
      });

      if (!response.ok) {
        let responseData: OAuthErrorResponse = {};
        try {
          responseData = JSON.parse(responseText) as OAuthErrorResponse;
        } catch (e) {
          responseData = { message: responseText };
        }

        // 🎯 에러 타입 분석
        const { errorType, needsSignup } = analyzeError(response.status, responseData, requestBody);
        console.log('🔍 에러 분석 결과:', { errorType, needsSignup });

        if (needsSignup) {
          // 🎉 회원가입이 필요한 경우
          console.log('✨ 회원가입 필요 - OAuth 데이터 저장');
          
          const signupData = {
            provider,
            oauthCode: code,
            ...(provider === 'naver' && { state: requestBody.state }),
            ...(responseData?.oauthData || {}),
            timestamp: Date.now()
          };
          
          setOauthSignupData(signupData);
          setNeedsSignup(true);
          setError('');
          cleanupPopup();
          
          return { 
            success: false, 
            needsSignup: true, 
            oauthData: signupData,
            errorType: errorType as any,
            debugInfo: { requestInfo, responseInfo, responseData }
          };
        } else {
          // 🚨 진짜 오류인 경우
          let errorMessage = `${provider} 로그인에 실패했습니다.`;
          
          if (errorType === 'SERVER_ERROR') {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else if (errorType === 'VALIDATION_ERROR') {
            errorMessage = responseData.message || `${provider} 로그인 정보가 올바르지 않습니다.`;
          }
          
          setError(errorMessage);
          cleanupPopup();
          
          return { 
            success: false, 
            error: errorMessage, 
            errorType: errorType as any,
            debugInfo: { requestInfo, responseInfo, responseData }
          };
        }
      }

      // 성공 처리
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }

      console.log('✅ 파싱된 응답:', result);

      if (result.result && result.data) {
        const { token, exprTime, user } = result.data;
        const safeUser = sanitizeUserData(user);
        
        console.log('🎉 로그인 성공:', { hasToken: !!token, exprTime, safeUser });
        
        // 토큰 저장
        if (token) {
          localStorage.setItem('accessToken', token);
          if (exprTime) {
            localStorage.setItem('tokenExpiry', new Date(Date.now() + exprTime * 1000).toISOString());
          }
          localStorage.setItem('user', JSON.stringify(safeUser));
        }
        
        setOauthResult(safeUser);
        setError('');
        setNeedsSignup(false);
        cleanupPopup();
        
        return { 
          success: true, 
          user: safeUser,
          debugInfo: { requestInfo, responseInfo, result }
        };
      } else {
        const errorMessage = result.message || `${provider} 로그인에 실패했습니다.`;
        console.log('❌ 로그인 실패:', result);
        setError(errorMessage);
        cleanupPopup();
        
        return { 
          success: false, 
          error: errorMessage,
          debugInfo: { requestInfo, responseInfo, result }
        };
      }
      
    } catch (error) {
      console.error(`❌ ${provider} 로그인 오류:`, error);
      
      let errorMessage = '네트워크 오류가 발생했습니다.';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      cleanupPopup();
      
      return { 
        success: false, 
        error: errorMessage, 
        errorType: 'SERVER_ERROR',
        debugInfo: { error: error?.toString() }
      };
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, saveDebugInfo, analyzeError, sanitizeUserData, cleanupPopup]);

  // 팝업 모니터링 함수
  const startPopupMonitoring = useCallback((popup: Window, provider: string) => {
    if (popupMonitorRef.current) {
      clearInterval(popupMonitorRef.current);
    }

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
      } catch (error) {
        console.warn('팝업 상태 확인 실패:', error);
      }
    }, 1000);

    popupTimerRef.current = setTimeout(() => {
      if (popup && !popup.closed) {
        popup.close();
      }
      cleanupPopup();
      if (isLoading) {
        setIsLoading(false);
        setError(`${provider} 로그인 시간이 초과되었습니다.`);
      }
    }, 5 * 60 * 1000);
  }, [isLoading, cleanupPopup]);

  // 범용 OAuth 로그인 함수
  const performOAuthLogin = useCallback((provider: string, url: string, clientId?: string) => {
    if (!clientId) {
      setError(`${provider} 클라이언트 ID가 설정되지 않았습니다.`);
      return;
    }

    // 기존 상태 초기화
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
    } catch (error) {
      console.error(`${provider} 팝업 열기 실패:`, error);
      setIsLoading(false);
      setError(`${provider} 로그인 창을 열 수 없습니다.`);
    }
  }, [cleanupPopup, startPopupMonitoring]);

  // OAuth 로그인 함수들
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
    sessionStorage.setItem('naver_state', state);
    
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?` +
      `response_type=code&` +
      `client_id=${NAVER_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URL)}&` +
      `state=${state}`;
    
    performOAuthLogin('Naver', naverLoginUrl, NAVER_CLIENT_ID);
  }, [NAVER_CLIENT_ID, NAVER_REDIRECT_URL, performOAuthLogin]);

  // 🎉 회원가입으로 진행
  const proceedToSignup = useCallback((): void => {
    if (oauthSignupData) {
      const signupUrl = `/join?oauth=true&provider=${oauthSignupData.provider}`;
      sessionStorage.setItem('oauthSignupData', JSON.stringify(oauthSignupData));
      window.location.href = signupUrl;
    }
  }, [oauthSignupData]);

  // 상태 초기화 함수들
  const clearError = useCallback((): void => {
    setError('');
  }, []);

  const clearResult = useCallback((): void => {
    setOauthResult(null);
  }, []);

  const clearSignupData = useCallback((): void => {
    setNeedsSignup(false);
    setOauthSignupData(null);
  }, []);

  // ✅ postMessage 이벤트 리스너 설정 (의존성 최적화)
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, provider, code, error: messageError } = event.data;

      if (type === 'OAUTH_SUCCESS' && code && provider) {
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
  }, [sendCodeToBackend, cleanupPopup]); // ✅ 의존성 배열 명시

  // ✅ OAuth 콜백 처리 (직접 접근 시) - 의존성 최적화
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
          const savedState = sessionStorage.getItem('naver_state');
          
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
  }, [sendCodeToBackend]); // ✅ 의존성 배열 명시

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupPopup();
    };
  }, [cleanupPopup]);

  // 페이지 언로드 시 팝업 정리
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
    // 기존 상태
    isLoading,
    error,
    oauthResult,
    
    // 새로운 상태
    needsSignup,
    oauthSignupData,
    debugInfo,
    
    // 기존 함수
    loginWithGoogle,
    loginWithKakao,
    loginWithNaver,
    clearError,
    clearResult,
    
    // 새로운 함수
    clearSignupData,
    proceedToSignup
  };
};