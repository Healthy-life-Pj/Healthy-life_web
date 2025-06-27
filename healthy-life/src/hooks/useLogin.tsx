import { useState, useCallback } from 'react';
import { SafeUser } from '../types/dto';

interface LoginResponse {
  result: boolean;
  message: string;
  data?: {
    token: string;
    exprTime: number;
    user: any;
    deliverAddressList?: any[];
  };
}

interface LoginResult {
  success: boolean;
  user?: SafeUser;
  error?: string;
}

interface UseLoginReturn {
  isLoading: boolean;
  error: string;
  loginResult: SafeUser | null;
  performLogin: (username: string, password: string) => Promise<LoginResult>;
  clearError: () => void;
  clearLoginResult: () => void;
  logout: () => void;
  isLoggedIn: () => boolean;
  getCurrentUser: () => SafeUser | null;
  refreshToken: () => Promise<boolean>;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loginResult, setLoginResult] = useState<SafeUser | null>(null);

  // API URL
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4040/api/v1/auth';

  // 🎯 안전한 사용자 데이터 처리 함수
  const sanitizeUserData = (userData: any): SafeUser => {
    if (!userData || typeof userData !== 'object') {
      console.warn('유효하지 않은 사용자 데이터:', userData);
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

    // 각 필드를 안전하게 처리
    const safeUser: SafeUser = {
      userId: typeof userData.userId === 'number' ? userData.userId : null,
      username: typeof userData.username === 'string' ? userData.username.trim() : null,
      name: typeof userData.name === 'string' ? userData.name.trim() : '사용자',
      userNickName: typeof userData.userNickName === 'string' ? userData.userNickName.trim() : 
                   typeof userData.nickname === 'string' ? userData.nickname.trim() : '닉네임 없음',
      userEmail: typeof userData.userEmail === 'string' ? userData.userEmail.trim() : 
                typeof userData.email === 'string' ? userData.email.trim() : null,
      userPhone: typeof userData.userPhone === 'string' ? userData.userPhone.trim() : 
                typeof userData.phone === 'string' ? userData.phone.trim() : null,
      userGender: (userData.userGender === 'M' || userData.userGender === 'F') ? userData.userGender : null,
      userBirth: typeof userData.userBirth === 'string' ? userData.userBirth.trim() : null,
      userMemberGrade: typeof userData.userMemberGrade === 'string' ? userData.userMemberGrade.trim() : '일반회원'
    };

    // 빈 문자열을 null로 변환
    Object.keys(safeUser).forEach(key => {
      const value = safeUser[key as keyof SafeUser];
      if (typeof value === 'string' && value.trim() === '') {
        (safeUser as any)[key] = null;
      }
    });

    console.log('처리된 안전한 사용자 데이터:', safeUser);
    return safeUser;
  };

  // 실제 로그인 API 호출 함수
  const performLogin = useCallback(async (username: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    setError('');
    setLoginResult(null);

    try {
      // 입력값 검증
      if (!username || !password) {
        throw new Error('아이디와 비밀번호를 입력해주세요.');
      }

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: LoginResponse = await response.json();
      console.log('로그인 API 응답:', result);
      
      if (result.result && result.data) {
        // 로그인 성공
        const { token, exprTime, user } = result.data;
        
        // 🎯 안전한 사용자 데이터 처리
        const safeUser = sanitizeUserData(user);
        
        // 토큰 저장
        if (token) {
          localStorage.setItem('accessToken', token);
          if (exprTime) {
            localStorage.setItem('tokenExpiry', new Date(Date.now() + exprTime * 1000).toISOString());
          }
          localStorage.setItem('user', JSON.stringify(safeUser));
        }
        
        setLoginResult(safeUser);
        return { success: true, user: safeUser };
        
      } else {
        // 로그인 실패
        const errorMessage = result.message || '아이디 또는 비밀번호가 올바르지 않습니다.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
      
    } catch (error) {
      console.error('로그인 오류:', error);
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
        } else if (error.message.includes('401')) {
          errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.';
        } else if (error.message.includes('500')) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('아이디와 비밀번호를')) {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  // 토큰 갱신 함수
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.result && result.data) {
          const { token: newToken, exprTime, user } = result.data;
          
          // 새 토큰 저장
          localStorage.setItem('accessToken', newToken);
          localStorage.setItem('tokenExpiry', new Date(Date.now() + exprTime * 1000).toISOString());
          
          // 사용자 정보 업데이트 (있는 경우)
          if (user) {
            const safeUser = sanitizeUserData(user);
            localStorage.setItem('user', JSON.stringify(safeUser));
            setLoginResult(safeUser);
          }
          
          return true;
        }
      }

      // 토큰 갱신 실패 시 로그아웃
      logout();
      return false;
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      logout();
      return false;
    }
  }, [API_BASE_URL]);

  // 에러 초기화
  const clearError = useCallback((): void => {
    setError('');
  }, []);

  // 로그인 결과 초기화
  const clearLoginResult = useCallback((): void => {
    setLoginResult(null);
  }, []);

  // 로그아웃
  const logout = useCallback((): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('user');
    setLoginResult(null);
    setError('');
    
    // 다른 탭에서도 로그아웃 처리
    try {
      window.dispatchEvent(new Event('logout'));
    } catch (error) {
      console.warn('로그아웃 이벤트 발송 실패:', error);
    }
  }, []);

  // 로그인 상태 확인 (토큰 유효성 검사)
  const isLoggedIn = useCallback((): boolean => {
    const token = localStorage.getItem('accessToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) return false;
    
    try {
      const expiryDate = new Date(expiry);
      const now = new Date();
      
      // 토큰이 5분 이내에 만료될 예정이면 갱신 시도
      if (expiryDate.getTime() - now.getTime() < 5 * 60 * 1000) {
        refreshToken();
      }
      
      return now < expiryDate;
    } catch (error) {
      console.warn('토큰 만료 시간 확인 실패:', error);
      return false;
    }
  }, [refreshToken]);

  // 현재 사용자 정보 가져오기 (안전하게)
  const getCurrentUser = useCallback((): SafeUser | null => {
    if (!isLoggedIn()) return null;
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const userData = JSON.parse(userStr);
      return sanitizeUserData(userData);
    } catch (error) {
      console.warn('사용자 정보 파싱 실패:', error);
      return null;
    }
  }, [isLoggedIn]);

  return {
    // 상태
    isLoading,
    error,
    loginResult,
    
    // 함수
    performLogin,
    clearError,
    clearLoginResult,
    logout,
    isLoggedIn,
    getCurrentUser,
    refreshToken
  };
};