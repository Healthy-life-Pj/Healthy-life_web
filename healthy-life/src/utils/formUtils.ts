import axios from 'axios';

// 타입 정의
type OAuthProvider = 'google' | 'kakao' | 'naver';
type JoinPath = 'home' | 'google' | 'kakao' | 'naver';

interface OAuthUserData {
  email?: string;
  name?: string;
  nickname?: string;
  provider?: string;
  oauthCode?: string;
  timestamp?: number;
  [key: string]: any;
}

// 생년월일 형식 변환 (YYMMDD -> YYYY-MM-DD)
export const formatBirthDate = (birthInput: string): string => {
  const year = parseInt(birthInput.substring(0, 2));
  const month = birthInput.substring(2, 4);
  const day = birthInput.substring(4, 6);
  const fullYear = year < 30 ? 2000 + year : 1900 + year;
  return `${fullYear}-${month}-${day}`;
};

// 주소 검색 (다음 우편번호 API)
export const openAddressSearch = (callback: (data: { address: string; postNum: number }) => void) => {
  new (window as any).daum.Postcode({
    oncomplete: function (data: any) {
      callback({
        address: data.address,
        postNum: parseInt(data.zonecode)
      });
    },
  }).open();
};

// OAuth 데이터 가져오기
const getOAuthData = (): OAuthUserData | null => {
  try {
    const oauthDataStr = sessionStorage.getItem('oauthSignupData');
    console.log('🔍 sessionStorage에서 가져온 OAuth 데이터:', oauthDataStr);
    
    if (!oauthDataStr) {
      console.warn('⚠️ sessionStorage에 oauthSignupData가 없습니다');
      return null;
    }
    
    const oauthData = JSON.parse(oauthDataStr);
    console.log('📦 파싱된 OAuth 데이터:', oauthData);
    
    if (!oauthData.provider) {
      console.warn('⚠️ OAuth 데이터에 provider가 없습니다:', oauthData);
      return null;
    }
    
    return oauthData;
  } catch (error) {
    console.error('❌ OAuth 데이터 파싱 실패:', error);
    return null;
  }
};

// 회원가입 API 호출
export const submitSignup = async (formData: any, isOAuth = false, provider?: string) => {
  console.log('🚀 submitSignup 호출:', { 
    isOAuth, 
    provider, 
    'formData.oauthProvider': formData?.oauthProvider 
  });
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4040/api/v1/auth';
  
  try {
    const birthDate = formatBirthDate(formData.userBirth);
    
    let signUpData = {
      ...formData,
      userBirth: new Date(birthDate).toISOString(),
    };

    if (isOAuth) {
      // OAuth 데이터 가져오기
      const oauthData = getOAuthData();
      
      console.log('🔍 OAuth 디버깅 정보:', {
        provider: provider,
        'formData.oauthProvider': formData.oauthProvider,
        'oauthData?.provider': oauthData?.provider,
        'oauthData 전체': oauthData
      });
      
      // provider 결정 (우선순위: 파라미터 > 폼데이터 > OAuth데이터)
      const actualProvider = (provider || formData.oauthProvider || oauthData?.provider || '').toLowerCase();
      
      console.log('🎯 최종 actualProvider:', actualProvider);
      
      if (!actualProvider || !['google', 'kakao', 'naver'].includes(actualProvider)) {
        console.error('❌ OAuth 제공자 검증 실패:', {
          actualProvider,
          'typeof actualProvider': typeof actualProvider,
          'includes google': ['google', 'kakao', 'naver'].includes(actualProvider),
          'available providers': ['google', 'kakao', 'naver']
        });
        
        // ✅ sessionStorage 없으면 fallback으로 formData에서 가져오기
        if (!oauthData && formData.oauthProvider) {
          console.log('🔄 sessionStorage 없지만 폼에서 provider 확인됨, 계속 진행');
          // provider가 있으면 계속 진행
        } else {
          throw new Error('OAuth 제공자 정보가 올바르지 않습니다.');
        }
      }

      signUpData = {
        ...signUpData,
        joinPath: actualProvider as JoinPath, // 'google', 'kakao', 'naver' 중 하나
        snsId: oauthData?.snsId || oauthData?.id || oauthData?.sub || '', // ✅ 실제 SNS 사용자 ID
        // OAuth에서 받은 정보 활용 (폼 데이터 우선)
        userEmail: formData.userEmail || oauthData?.email || '',
        name: formData.name || oauthData?.name || oauthData?.nickname || '',
        // OAuth 인증 코드 포함
        ...(oauthData?.oauthCode && { oauthCode: oauthData.oauthCode }),
      };

      console.log('🔄 OAuth 회원가입 데이터:', {
        joinPath: signUpData.joinPath,
        provider: actualProvider,
        snsId: signUpData.snsId, // ✅ 실제 SNS ID 로깅
        email: signUpData.userEmail,
        hasOAuthCode: !!oauthData?.oauthCode
      });
    } else {
      signUpData = {
        ...signUpData,
        joinPath: 'home' as JoinPath,
      };
    }

    const endpoint = isOAuth ? '/sns-sign-up' : '/sign-up';
    
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, signUpData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 성공 시 OAuth 데이터 정리
    if (isOAuth) {
      sessionStorage.removeItem('oauthSignupData');
    }

    return response;

  } catch (error) {
    console.error('회원가입 요청 실패:', error);
    throw error;
  }
};

// 에러 처리 유틸리티
export const handleApiError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage, error);
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data;
    
    switch (status) {
      case 400:
        if (responseData?.errorCode === 'INVALID_OAUTH_CODE') {
          return 'OAuth 인증이 만료되었습니다. 다시 로그인해주세요.';
        } else if (responseData?.errorCode === 'DUPLICATE_EMAIL') {
          return '이미 가입된 이메일입니다.';
        } else if (responseData?.errorCode === 'DUPLICATE_USERNAME') {
          return '이미 사용 중인 아이디입니다.';
        } else if (responseData?.message) {
          return responseData.message;
        } else {
          return '입력한 정보를 다시 확인해주세요.';
        }
      
      case 401:
        return 'OAuth 인증에 실패했습니다. 다시 로그인해주세요.';
      
      case 409:
        return '이미 가입된 사용자입니다.';
      
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      
      default:
        return responseData?.message || defaultMessage;
    }
  } else {
    return '네트워크 오류가 발생했습니다.';
  }
};

// OAuth 회원가입 상태 확인
export const isOAuthSignup = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('oauth') === 'true';
};

// OAuth 데이터로 폼 미리 채우기
export const prefillOAuthData = (
  setFormData: React.Dispatch<React.SetStateAction<any>>
): OAuthUserData | null => {
  const oauthData = getOAuthData();
  
  if (oauthData && isOAuthSignup()) {
    console.log('✅ OAuth 데이터로 폼 미리 채우기:', {
      provider: oauthData.provider,
      email: oauthData.email,
      name: oauthData.name
    });

    setFormData((prev: any) => ({
      ...prev,
      userEmail: oauthData.email || prev.userEmail || '',
      name: oauthData.name || oauthData.nickname || prev.name || '',
      oauthProvider: oauthData.provider || prev.oauthProvider || ''
    }));
  }
  
  return oauthData;
};

// OAuth 인증 만료 체크
export const checkOAuthExpiry = (): boolean => {
  const oauthData = getOAuthData();
  if (!oauthData || !oauthData.timestamp) {
    return false;
  }

  // 10분 후 만료
  const expiryTime = oauthData.timestamp + (10 * 60 * 1000);
  const now = Date.now();
  
  if (now > expiryTime) {
    console.warn('OAuth 인증이 만료되었습니다');
    sessionStorage.removeItem('oauthSignupData');
    return true;
  }
  
  return false;
};

// 입력 핸들러 생성 함수
export const createInputHandler = (
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  resetDuplicateCheck: (field: any) => void,
  clearError: (field: string) => void,
  validateField: (field: string, value: string, formData?: any) => void,
  clearMainError?: () => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      const newFormData = {
        ...prev,
        [name]: value
      };

      // 실시간 유효성 검사 (300ms 지연)
      setTimeout(() => {
        validateField(name, value, newFormData);
      }, 300);

      return newFormData;
    });

    // 중복 체크 상태 초기화
    if (name === 'username' || name === 'userNickName' || name === 'userEmail' || name === 'userPhone') {
      resetDuplicateCheck(name);
    }

    // 에러 메시지 제거
    clearError(name);
    
    // 메인 에러 제거 (선택사항)
    if (clearMainError) {
      clearMainError();
    }
  };
};

// 성별 변경 핸들러 생성 함수
export const createGenderHandler = (
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  clearError: (field: string) => void
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      userGender: value as 'M' | 'F'
    }));

    clearError('userGender');
  };
};