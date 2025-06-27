import React, { useState } from 'react';
import '../../style/join/join.css';
import Term from './Term';
import axios from 'axios';

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  name: string;
  userNickName: string;
  userBirth: string;
  userEmail: string;
  userPhone: string;
  userGender: 'M' | 'F' | '';
  address: string;
  addressDetail: string;
  postNum: number;
  joinPath: string;
  snsId?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface DuplicateChecks {
  username: boolean | null;
  userNickName: boolean | null;
  userEmail: boolean | null;
  userPhone: boolean | null;
}

function JoinApp() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4040/api/v1/auth';

  // 폼 데이터 상태 (하나의 객체로 관리)
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    userNickName: '',
    userBirth: '',
    userEmail: '',
    userPhone: '',
    userGender: '',
    address: '',
    addressDetail: '',
    postNum: 0,
    joinPath: 'home',
    snsId: ''
  });

  // 에러 상태
  const [errors, setErrors] = useState<ValidationErrors>({});

  // 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 중복 체크 상태 추가
  const [duplicateChecks, setDuplicateChecks] = useState<DuplicateChecks>({
    username: null,
    userNickName: null,
    userEmail: null,
    userPhone: null,
  });

  // 모달 상태
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // 모달 열기/닫기
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // 입력값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 해당 필드의 중복 체크 상태 초기화
    if (name === 'username' || name === 'userNickName' || name === 'userEmail' || name === 'userPhone') {
      setDuplicateChecks(prev => ({
        ...prev,
        [name]: null
      }));
    }

    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // 실시간 유효성 검사 (300ms 지연)
    setTimeout(() => {
      validateField(name, value);
    }, 300);
  };

  // 성별 변경 처리
  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      userGender: value as 'M' | 'F'
    }));

    // 성별 에러 제거
    if (errors.userGender) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.userGender;
        return newErrors;
      });
    }
  };

  // 필드별 유효성 검사
  const validateField = (fieldName: string, value: string) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'username':
        if (!value) {
          errorMessage = '아이디를 입력하세요.';
        } else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/.test(value)) {
          errorMessage = '아이디는 영문과 숫자를 포함하여 8~15자이어야 합니다.';
        }
        break;

      case 'password':
        if (!value) {
          errorMessage = '비밀번호를 입력하세요.';
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(value)) {
          errorMessage = '비밀번호는 영문, 숫자, 특수문자를 포함하여 8~16자이어야 합니다.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          errorMessage = '비밀번호 확인을 입력하세요.';
        } else if (value !== formData.password) {
          errorMessage = '비밀번호가 일치하지 않습니다.';
        }
        break;

      case 'name':
        if (!value) {
          errorMessage = '이름을 입력하세요.';
        } else if (!/^[가-힣a-zA-Z]{2,10}$/.test(value)) {
          errorMessage = '이름은 한글 또는 영문으로 2~10자이어야 합니다.';
        }
        break;

      case 'userNickName':
        if (!value) {
          errorMessage = '닉네임을 입력하세요.';
        } else if (!/^[가-힣a-zA-Z\d]{3,10}$/.test(value)) {
          errorMessage = '닉네임은 한글, 영문, 숫자로 3~10자이어야 합니다.';
        }
        break;

      case 'userEmail':
        if (!value) {
          errorMessage = '이메일을 입력하세요.';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMessage = '올바른 이메일 형식을 입력하세요.';
        }
        break;

      case 'userPhone':
        if (!value) {
          errorMessage = '전화번호를 입력하세요.';
        } else if (!/^01[016789]\d{7,8}$/.test(value)) {
          errorMessage = '올바른 전화번호 형식을 입력하세요. (예: 01012345678)';
        }
        break;

      case 'userBirth':
        if (!value) {
          errorMessage = '생년월일을 입력하세요.';
        } else if (!/^\d{6}$/.test(value)) {
          errorMessage = '생년월일은 6자리 숫자로 입력하세요. (예: 990101)';
        }
        break;

      case 'address':
        if (!value) {
          errorMessage = '주소를 입력하세요.';
        }
        break;

      case 'addressDetail':
        if (!value) {
          errorMessage = '상세주소를 입력하세요.';
        }
        break;
    }

    if (errorMessage) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: errorMessage
      }));
    }
  };

  // 중복 체크 함수 수정
  const handleDuplicateCheck = async (field: 'username' | 'userNickName' | 'userEmail' | 'userPhone') => {
    const value = formData[field];

    // 먼저 해당 필드의 유효성을 검사
    if (!value || errors[field]) {
      alert('올바른 값을 입력한 후 중복 체크를 해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 백엔드 API 엔드포인트에 맞게 수정
      let endpoint = '';
      switch (field) {
        case 'username':
          endpoint = `duplicate/username/${value}`;
          break;
        case 'userNickName':
          endpoint = `duplicate/user_nickname/${value}`;
          break;
        case 'userEmail':
          endpoint = `duplicate/user_email/${value}`;
          break;
        case 'userPhone':
          endpoint = `duplicate/user_phone/${value}`;
          break;
      }

      const response = await axios.get(`${API_BASE_URL}/${endpoint}`);

      const isDuplicate = response.data.data;

      setDuplicateChecks(prev => ({
        ...prev,
        [field]: !isDuplicate // 사용가능하면 true, 중복이면 false
      }));

      // 결과 메시지 표시
      if (isDuplicate) {
        setErrors(prev => ({
          ...prev,
          [field]: '이미 사용 중입니다.'
        }));
      } else {
        // 성공 시 에러 메시지 제거
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

      // 오류 발생 시 중복 체크 상태 초기화
      setDuplicateChecks(prev => ({
        ...prev,
        [field]: null
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // 주소 검색 (다음 우편번호 API)
  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setFormData(prev => ({
          ...prev,
          address: data.address,
          postNum: parseInt(data.zonecode)
        }));

        // 주소 에러 제거
        if (errors.address) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.address;
            return newErrors;
          });
        }
      },
    }).open();
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'username', 'password', 'confirmPassword', 'name', 'userNickName',
      'userBirth', 'userEmail', 'userPhone', 'address', 'addressDetail'
    ];

    let isValid = true;
    const newErrors: ValidationErrors = {};

    requiredFields.forEach(field => {
      const value = formData[field as keyof FormData] as string;
      if (!value || value.trim() === '') {
        newErrors[field] = `${getFieldLabel(field)}을(를) 입력하세요.`;
        isValid = false;
      }
    });

    if (!formData.userGender) {
      newErrors.userGender = '성별을 선택해주세요.';
      isValid = false;
    }

    const duplicateFields: ('username' | 'userNickName' | 'userEmail' | 'userPhone')[] =
      ['username', 'userNickName', 'userEmail', 'userPhone'];

    duplicateFields.forEach(field => {
      if (duplicateChecks[field] !== true) {
        const label = getFieldLabel(field);
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
  };

  const getFieldLabel = (field: string): string => {
    const labels: { [key: string]: string } = {
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
    return labels[field] || field;
  };
  
  const getDuplicateButtonText = (field: string) => {
    if (duplicateChecks[field as keyof DuplicateChecks] === true) {
      return '사용 가능';
    } else if (duplicateChecks[field as keyof DuplicateChecks] === false) {
      return `재확인` ;
    }
    return '중복확인';
  };

  const getDuplicateButtonClass = (field: string) => {
    const status = duplicateChecks[field as keyof DuplicateChecks];
    let baseClass = 'joinBtn';

    if (status === true) {
      baseClass += ' success';
    } else if (status === false) {
      baseClass += ' duplicate';
    }

    return baseClass;
  };

  const isDuplicateButtonDisabled = (field: string) => {
    return !formData[field as keyof FormData] || !!errors[field] || isLoading;
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('입력한 정보를 다시 확인해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const year = parseInt(formData.userBirth.substring(0, 2));
      const month = formData.userBirth.substring(2, 4);
      const day = formData.userBirth.substring(4, 6);
      const fullYear = year < 30 ? 2000 + year : 1900 + year; // 30 미만이면 2000년대
      const birthDate = `${fullYear}-${month}-${day}`;

      const signUpData = {
        ...formData,
        userBirth: new Date(birthDate).toISOString(),
      };

      const response = await axios.post(`${API_BASE_URL}/sign-up`, signUpData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.result) {
        alert(`회원가입을 축하합니다. ${formData.name}님`);
        openModal();
        // 성공 후 폼 초기화나 페이지 이동 등 처리
      } else {
        alert('회원가입에 실패했습니다: ' + response.data.message);
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          alert('입력한 정보를 다시 확인해주세요.');
        } else if (error.response?.status === 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          alert('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 처리 함수 (회원가입 후 페이지 이동)
  const handleLoginRedirect = () => {
    window.location.href = '/login'; // 또는 React Router의 navigate 사용
  };

  return (
    <div className="joinContainer">
      <h2>회원가입</h2>
      <form onSubmit={handleSignUpSubmit}>
        <div className="joinContain">
          <ul className="joinUl">
            {/* 아이디 */}
            <li className="li01">
              <label htmlFor="username">아이디</label>
              <div className="checkBtn">
                <input
                  type="text"
                  name="username"
                  className="userId inputclass"
                  placeholder="영문과 숫자 포함 8~15자"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={getDuplicateButtonClass('username')}
                  onClick={() => handleDuplicateCheck('username')}
                  disabled={isDuplicateButtonDisabled('username')}
                >
                  {getDuplicateButtonText('username')}
                </button>

              </div>
            </li>
            <li><p className={`error ${duplicateChecks.username === true ? 'success' : ''}`}>{errors.username}</p></li>

            {/* 닉네임 */}
            <li className="li02">
              <label htmlFor="userNickName">닉네임</label>
              <div className="checkBtn">
                <input
                  type="text"
                  name="userNickName"
                  className="userNickName inputclass"
                  placeholder="한글, 영문, 숫자 3~10자"
                  value={formData.userNickName}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={getDuplicateButtonClass('userNickName')}
                  onClick={() => handleDuplicateCheck('userNickName')}
                  disabled={isDuplicateButtonDisabled('userNickName')}
                >
                  {getDuplicateButtonText('userNickName')}
                </button>
              </div>
            </li>
            <li><p className={`error ${duplicateChecks.userNickName === true ? 'success' : ''}`}>{errors.userNickName}</p></li>

            {/* 비밀번호 */}
            <li className="li03">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                name="password"
                className="userPassword inputclass"
                placeholder="영문, 숫자, 특수문자 포함 8~16자"
                value={formData.password}
                onChange={handleInputChange}
              />
            </li>
            <li><p className="error">{errors.password}</p></li>

            {/* 비밀번호 확인 */}
            <li className="li03">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                className="userRePasswordCheck inputclass"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </li>
            <li><p className="error">{errors.confirmPassword}</p></li>

            {/* 이름 */}
            <li className="li04">
              <label htmlFor="name">이름</label>
              <input
                className="inputName inputclass"
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                value={formData.name}
                onChange={handleInputChange}
              />
            </li>
            <li><p className="error">{errors.name}</p></li>

            {/* 주소 */}
            <li className="li05">
              <label htmlFor="address">주소</label>
              <div className="checkBtn">
                <input
                  className="userAddress inputclass"
                  name="address"
                  placeholder="주소검색 버튼을 클릭하세요"
                  value={formData.address}
                  readOnly
                />
                <button type="button" className="joinBtn" onClick={handleAddressSearch}>
                  주소검색
                </button>
              </div>
            </li>
            <li><p className="error">{errors.address}</p></li>

            {/* 상세주소 */}
            <li>
              <label htmlFor="addressDetail">상세주소</label>
              <input
                className="inputclass"
                name="addressDetail"
                placeholder="상세주소를 입력하세요"
                value={formData.addressDetail}
                onChange={handleInputChange}
              />
            </li>
            <li><p className="error">{errors.addressDetail}</p></li>

            {/* 휴대전화번호 */}
            <li className="li06">
              <label htmlFor="userPhone">휴대전화번호</label>
              <div className="checkBtn">
                <input
                  type="tel"
                  name="userPhone"
                  placeholder="01012345678 (하이픈 제외)"
                  className="inputclass"
                  value={formData.userPhone}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={getDuplicateButtonClass('userPhone')}
                  onClick={() => handleDuplicateCheck('userPhone')}
                  disabled={isDuplicateButtonDisabled('userPhone')}
                >
                  {getDuplicateButtonText('userPhone')}
                </button>
              </div>
            </li>
            <li><p className={`error ${duplicateChecks.userPhone === true ? 'success' : ''}`}>{errors.userPhone}</p></li>

            {/* 생년월일 */}
            <li className="li07">
              <label htmlFor="userBirth">생년월일</label>
              <input
                type="text"
                className="birthDiv inputclass"
                name="userBirth"
                placeholder="생년월일: 990101 (6자리)"
                maxLength={6}
                value={formData.userBirth}
                onChange={handleInputChange}
              />
            </li>
            <li><p className="error">{errors.userBirth}</p></li>

            {/* 이메일 */}
            <li>
              <label htmlFor="userEmail">이메일</label>
              <div className="checkBtn">
                <input
                  type="email"
                  name="userEmail"
                  className="inputclass"
                  placeholder="example@domain.com"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={getDuplicateButtonClass('userEmail')}
                  onClick={() => handleDuplicateCheck('userEmail')}
                  disabled={isDuplicateButtonDisabled('userEmail')}
                >
                  {getDuplicateButtonText('userEmail')}
                </button>
              </div>
            </li>
            <li><p className={`error ${duplicateChecks.userEmail === true ? 'success' : ''}`}>{errors.userEmail}</p></li>
          </ul>

          {/* 성별 */}
          <div className="li08">
            <label className="gender" htmlFor="userGender">성별</label>
            <div className="genderDiv">
              <label className="usergender">남</label>
              <input
                type="radio"
                name="userGender"
                value="M"
                checked={formData.userGender === 'M'}
                onChange={handleGenderChange}
              />
              <label>여</label>
              <input
                type="radio"
                name="userGender"
                value="F"
                checked={formData.userGender === 'F'}
                onChange={handleGenderChange}
              />
            </div>
            <p className="error">{errors.userGender}</p>
          </div>

          <Term />
        </div>

        <button
          type="submit"
          className="joinButton"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '회원가입'}
        </button>
      </form>

      {/* 성공 모달 */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>회원가입 완료!</h3>
            <p>환영합니다!</p>
            <div>
              <button onClick={closeModal}>확인</button>
              <button onClick={handleLoginRedirect}>로그인하러 가기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinApp;