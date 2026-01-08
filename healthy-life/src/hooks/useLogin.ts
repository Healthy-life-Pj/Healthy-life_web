import { useState, useCallback } from 'react';
import { SafeUser } from '../types/dto';

interface LoginResponse {
  result: boolean;
  message: string;
  data?: {
    userId: number;
    username: string;
    userNickName: string;
    userBirth: string;
    userGender: 'M' | 'F';
    userEmail: string;
    userPhone: string;
    deliverAddress: any[];
    userMemberGrade: string;
    token: string;
    exprTime: number;
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

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loginResult, setLoginResult] = useState<SafeUser | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4040/api/v1/auth';

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

    const safeUser: SafeUser = {
      userId: typeof userData.userId === 'number' ? userData.userId : null,
      username: typeof userData.username === 'string' ? userData.username.trim() : null,
      name: typeof userData.name === 'string' ? userData.name.trim() :
        typeof userData.userNickName === 'string' ? userData.userNickName.trim() : '사용자',
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

    Object.keys(safeUser).forEach(key => {
      const value = safeUser[key as keyof SafeUser];
      if (typeof value === 'string' && value.trim() === '') {
        (safeUser as any)[key] = null;
      }
    });

    return safeUser;
  }, []);

  const performLogin = useCallback(async (username: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    setError('');
    setLoginResult(null);

    try {
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

        setLoginResult(safeUser);
        return { success: true, user: safeUser };

      } else {
        const errorMessage = result.message || '아이디 또는 비밀번호가 올바르지 않습니다.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

    } catch (error) {
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
  }, [API_BASE_URL, sanitizeUserData]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = safeStorage.getItem('accessToken');
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
          const { token: newToken, exprTime, deliverAddress, ...userData } = result.data;

          safeStorage.setItem('accessToken', newToken);
          safeStorage.setItem('tokenExpiry', new Date(Date.now() + exprTime * 1000).toISOString());

          if (userData) {
            const safeUser = sanitizeUserData(userData);
            safeStorage.setItem('user', JSON.stringify(safeUser));
            setLoginResult(safeUser);
          }

          return true;
        }
      }

      logout();
      return false;
    } catch {
      logout();
      return false;
    }
  }, [API_BASE_URL, sanitizeUserData]);

  const clearError = useCallback((): void => {
    setError('');
  }, []);

  const clearLoginResult = useCallback((): void => {
    setLoginResult(null);
  }, []);

  const logout = useCallback((): void => {
    safeStorage.removeItem('accessToken');
    safeStorage.removeItem('tokenExpiry');
    safeStorage.removeItem('user');
    setLoginResult(null);
    setError('');

    try {
      window.dispatchEvent(new Event('logout'));
    } catch {
      // Ignore event dispatch errors
    }
  }, []);

  const isLoggedIn = useCallback((): boolean => {
    const token = safeStorage.getItem('accessToken');
    const expiry = safeStorage.getItem('tokenExpiry');

    if (!token || !expiry) return false;

    try {
      const expiryDate = new Date(expiry);
      const now = new Date();

      if (expiryDate.getTime() - now.getTime() < 5 * 60 * 1000) {
        refreshToken();
      }

      return now < expiryDate;
    } catch {
      return false;
    }
  }, [refreshToken]);

  const getCurrentUser = useCallback((): SafeUser | null => {
    if (!isLoggedIn()) return null;

    try {
      const userStr = safeStorage.getItem('user');
      if (!userStr) return null;

      const userData = JSON.parse(userStr);
      return sanitizeUserData(userData);
    } catch {
      return null;
    }
  }, [isLoggedIn, sanitizeUserData]);

  return {
    isLoading,
    error,
    loginResult,
    performLogin,
    clearError,
    clearLoginResult,
    logout,
    isLoggedIn,
    getCurrentUser,
    refreshToken
  };
};