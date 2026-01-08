import { useState, useCallback } from 'react';
import axios from 'axios';

// 유효성 검사 에러 인터페이스
interface ValidationErrors {
  [key: string]: string;
}

// 중복 체크 상태 인터페이스
interface DuplicateChecks {
  username: boolean | null;
  userNickName: boolean | null;
  userEmail: boolean | null;
  userPhone: boolean | null;
}

// 유효성 검사 규칙 인터페이스
interface ValidationRule {
  required: string;
  pattern?: RegExp;
  patternMessage?: string;
}

// 유효성 검사 규칙
const validationRules: { [key: string]: ValidationRule } = {
  username: {
    required: '아이디를 입력하세요.',
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/,
    patternMessage: '아이디는 영문과 숫자를 포함하여 8~15자이어야 합니다.'
  },
  password: {
    required: '비밀번호를 입력하세요.',
    pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/,
    patternMessage: '비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자이어야 합니다.'
  },
  name: {
    required: '이름을 입력하세요.',
    pattern: /^[가-힣a-zA-Z]{2,10}$/,
    patternMessage: '이름은 한글 또는 영문으로 2~10자이어야 합니다.'
  },
  userNickName: {
    required: '닉네임을 입력하세요.',
    pattern: /^[가-힣a-zA-Z\d]{3,10}$/,
    patternMessage: '닉네임은 한글, 영문, 숫자로 3~10자이어야 합니다.'
  },
  userEmail: {
    required: '이메일을 입력하세요.',
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    patternMessage: '올바른 이메일 형식을 입력하세요.'
  },
  userPhone: {
    required: '전화번호를 입력하세요.',
    pattern: /^01[016789]\d{7,8}$/,
    patternMessage: '올바른 전화번호 형식을 입력하세요. (예: 01012345678)'
  },
  userBirth: {
    required: '생년월일을 입력하세요.',
    pattern: /^\d{6}$/,
    patternMessage: '생년월일은 6자리 숫자로 입력하세요. (예: 990101)'
  },
  address: {
    required: '주소를 입력하세요.'
  },
  addressDetail: {
    required: '상세주소를 입력하세요.'
  }
};

// 필드 라벨 매핑
export const fieldLabels: { [key: string]: string } = {
  username: '아이디',
  password: '비밀번호',
  confirmPassword: '비밀번호 확인',
  name: '이름',
  userNickName: '닉네임',
  userEmail: '이메일',
  userPhone: '전화번호',
  userBirth: '생년월일',
  address: '주소',
  addressDetail: '상세주소'
};

// 중복 체크 API 엔드포인트 매핑
const duplicateEndpoints: { [key in keyof DuplicateChecks]: string } = {
  username: 'duplicate/username',
  userNickName: 'duplicate/user_nickname',
  userEmail: 'duplicate/user_email',
  userPhone: 'duplicate/user_phone'
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [duplicateChecks, setDuplicateChecks] = useState<DuplicateChecks>({
    username: null,
    userNickName: null,
    userEmail: null,
    userPhone: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4040/api/v1/auth';

  // 단일 필드 유효성 검사
  const validateField = useCallback((fieldName: string, value: string, formData?: any) => {
    const rule = validationRules[fieldName];
    if (!rule) return;

    let errorMessage = '';

    if (!value) {
      errorMessage = rule.required;
    } else if (rule.pattern && !rule.pattern.test(value)) {
      errorMessage = rule.patternMessage || rule.required;
    } else if (fieldName === 'confirmPassword' && formData && value !== formData.password) {
      errorMessage = '비밀번호가 일치하지 않습니다.';
    }

    if (errorMessage) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: errorMessage
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, []);

  // 중복 체크
  const handleDuplicateCheck = useCallback(async (field: keyof DuplicateChecks, value: string) => {
    if (!value || errors[field]) {
      alert('올바른 값을 입력한 후 중복 체크를 해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = duplicateEndpoints[field];
      const response = await axios.get(`${API_BASE_URL}/${endpoint}/${value}`);
      const isDuplicate = response.data.data;

      setDuplicateChecks(prev => ({
        ...prev,
        [field]: !isDuplicate // 사용가능하면 true, 중복이면 false
      }));

      if (isDuplicate) {
        setErrors(prev => ({
          ...prev,
          [field]: '이미 사용 중입니다.'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        alert('사용 가능합니다.');
      }
    } catch (error) {
      console.error(`${field} 중복 체크 오류:`, error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          alert('잘못된 요청입니다. 입력값을 확인해주세요.');
        } else if (error.response?.status === 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          alert('중복 체크 중 오류가 발생했습니다.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }

      setDuplicateChecks(prev => ({
        ...prev,
        [field]: null
      }));
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, errors]);

  // 전체 폼 유효성 검사
  const validateForm = useCallback((formData: any, requiredFields: string[], isOAuth = false) => {
    let isValid = true;
    const newErrors: ValidationErrors = {};

    // 필수 필드 검사
    requiredFields.forEach(field => {
      const value = formData[field] as string;
      if (!value || value.trim() === '') {
        newErrors[field] = `${fieldLabels[field]}을(를) 입력하세요.`;
        isValid = false;
      }
    });

    // 성별 검사 (필요한 경우)
    if (formData.hasOwnProperty('userGender') && !formData.userGender) {
      newErrors.userGender = '성별을 선택해주세요.';
      isValid = false;
    }

    // 중복 체크 확인
    const duplicateFields: (keyof DuplicateChecks)[] = ['username', 'userNickName', 'userEmail', 'userPhone'];
    
    duplicateFields.forEach(field => {
      // OAuth의 경우 이메일이 선택사항
      if (isOAuth && field === 'userEmail' && !formData.userEmail) {
        return;
      }

      // 필수 필드가 아닌 경우 값이 없으면 스킵
      if (!requiredFields.includes(field) && !formData[field]) {
        return;
      }

      if (duplicateChecks[field] !== true) {
        const label = fieldLabels[field];
        if (duplicateChecks[field] === null) {
          newErrors[field] = `${label} 중복 체크를 완료해주세요.`;
        } else if (duplicateChecks[field] === false) {
          newErrors[field] = `${label}이(가) 중복됩니다. 다른 값을 입력해주세요.`;
        }
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [duplicateChecks]);

  // 중복 체크 버튼 텍스트
  const getDuplicateButtonText = useCallback((field: keyof DuplicateChecks) => {
    if (duplicateChecks[field] === true) {
      return '사용 가능';
    } else if (duplicateChecks[field] === false) {
      return '재확인';
    }
    return '중복확인';
  }, [duplicateChecks]);

  // 중복 체크 버튼 스타일
  const getDuplicateButtonStyle = useCallback((field: keyof DuplicateChecks, formData: any) => {
    const status = duplicateChecks[field];
    let backgroundColor = '#2196f3';
    
    if (status === true) {
      backgroundColor = '#4caf50'; // 성공 - 녹색
    } else if (status === false) {
      backgroundColor = '#f44336'; // 중복 - 빨간색
    }

    return {
      padding: '10px 15px',
      backgroundColor,
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: (!formData[field] || !!errors[field] || isLoading) ? 'not-allowed' : 'pointer',
      opacity: (!formData[field] || !!errors[field] || isLoading) ? 0.7 : 1,
      fontSize: '12px',
      minWidth: '80px'
    };
  }, [duplicateChecks, errors, isLoading]);

  // CSS 클래스 방식 (기존 JoinApp용)
  const getDuplicateButtonClass = useCallback((field: keyof DuplicateChecks) => {
    const status = duplicateChecks[field];
    let baseClass = 'joinBtn';

    if (status === true) {
      baseClass += ' success';
    } else if (status === false) {
      baseClass += ' duplicate';
    }

    return baseClass;
  }, [duplicateChecks]);

  // 중복 체크 버튼 비활성화 여부
  const isDuplicateButtonDisabled = useCallback((field: keyof DuplicateChecks, formData: any) => {
    return !formData[field] || !!errors[field] || isLoading;
  }, [errors, isLoading]);

  // 에러 제거
  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // 중복 체크 상태 초기화
  const resetDuplicateCheck = useCallback((field: keyof DuplicateChecks) => {
    setDuplicateChecks(prev => ({
      ...prev,
      [field]: null
    }));
  }, []);

  // 모든 상태 초기화
  const resetValidation = useCallback(() => {
    setErrors({});
    setDuplicateChecks({
      username: null,
      userNickName: null,
      userEmail: null,
      userPhone: null,
    });
  }, []);

  return {
    errors,
    duplicateChecks,
    isLoading,
    validateField,
    handleDuplicateCheck,
    validateForm,
    getDuplicateButtonText,
    getDuplicateButtonStyle,
    getDuplicateButtonClass,
    isDuplicateButtonDisabled,
    clearError,
    resetDuplicateCheck,
    resetValidation
  };
};