import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
  createInputHandler,
  createGenderHandler,
  openAddressSearch,
  submitSignup,
  handleApiError
} from '../../utils/formUtils';
import DuplicateCheckInput from '../../common/DuplicateCheckInput';
import '../../style/OAuth/OAuthJoin.css';

// OAuth 회원가입용 인터페이스
interface OAuthSignupForm {
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
}

// OAuth 데이터 인터페이스
interface OAuthSignupData {
  provider?: string;
  name?: string;
  nickname?: string;
  email?: string;
  oauthCode?: string;
  state?: string;
}

// Props 인터페이스
interface OAuthJoinProps {
  oauthSignupData: OAuthSignupData | null;
  onSignupSuccess: (userData: any) => void;
  onBackToLogin: () => void;
}

const initialSignupForm: OAuthSignupForm = {
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
  postNum: 0
};

const OAuthJoin: React.FC<OAuthJoinProps> = ({
  oauthSignupData,
  onSignupSuccess,
  onBackToLogin
}) => {
  const [signupForm, setSignupForm] = useState<OAuthSignupForm>(initialSignupForm);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  // 커스텀 훅 사용
  const {
    errors,
    duplicateChecks,
    isLoading: validationLoading,
    validateField,
    handleDuplicateCheck,
    validateForm,
    getDuplicateButtonText,
    getDuplicateButtonStyle,
    isDuplicateButtonDisabled,
    clearError,
    resetDuplicateCheck,
    resetValidation
  } = useFormValidation();

  // 입력 핸들러 생성
  const signupInputHandler = createInputHandler(
    setSignupForm,
    resetDuplicateCheck,
    clearError,
    validateField,
    () => setSignupError('')
  );

  // 성별 변경 핸들러 생성
  const handleGenderChange = createGenderHandler(setSignupForm, clearError);

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    openAddressSearch((data) => {
      setSignupForm(prev => ({
        ...prev,
        address: data.address,
        postNum: data.postNum
      }));
    });
  };

  // 중복 체크 핸들러 래퍼
  const handleFieldDuplicateCheck = (field: 'username' | 'userNickName' | 'userEmail' | 'userPhone') => {
    handleDuplicateCheck(field, signupForm[field]);
  };

  // OAuth 회원가입 처리
  const handleOAuthSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['username', 'password', 'confirmPassword', 'name', 'userNickName', 'userBirth', 'userPhone'];

    if (!validateForm(signupForm, requiredFields, true)) {
      setSignupError('입력한 정보를 다시 확인해주세요.');
      return;
    }

    setSignupLoading(true);
    setSignupError('');

    try {
      const signUpData = {
        ...signupForm,
        oauthProvider: oauthSignupData?.provider,
        oauthCode: oauthSignupData?.oauthCode,
        oauthState: oauthSignupData?.state
      };

      const response = await submitSignup(signUpData, true, oauthSignupData?.provider);

      if (response.data.result) {
        const { token, exprTime, user } = response.data.data;

        if (token) {
          localStorage.setItem('accessToken', token);
          if (exprTime) {
            localStorage.setItem('tokenExpiry', new Date(Date.now() + exprTime * 1000).toISOString());
          }
          localStorage.setItem('user', JSON.stringify(user));
        }

        alert(`🎉 ${oauthSignupData?.provider} 연동 회원가입을 축하합니다! ${signupForm.name}님`);
        onSignupSuccess({ token, exprTime, user });
      } else {
        setSignupError('회원가입에 실패했습니다: ' + response.data.message);
      }
    } catch (error) {
      const errorMessage = handleApiError(error, 'OAuth 회원가입 중 오류가 발생했습니다.');
      setSignupError(errorMessage);
    } finally {
      setSignupLoading(false);
    }
  };

  const isAnyLoading = signupLoading || validationLoading;

  return (
    <div className={`loginContainer oauth-join-container`}>
      <Box>
        <div className="oauth-header">
          <h2>🎉 {oauthSignupData?.provider} 연동 회원가입</h2>
          <p>소셜 로그인이 확인되었습니다. 추가 정보를 입력해주세요.</p>
        </div>

        {signupError && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {signupError}
          </Alert>
        )}

        <form onSubmit={handleOAuthSignup}>
          <div className="oauth-form-container">

            {/* 아이디 중복 체크 */}
            <DuplicateCheckInput
              label="아이디 *"
              name="username"
              value={signupForm.username}
              placeholder="영문과 숫자 포함 8~15자"
              disabled={isAnyLoading}
              onChange={signupInputHandler}
              onDuplicateCheck={() => handleFieldDuplicateCheck('username')}
              duplicateButtonText={getDuplicateButtonText('username')}
              duplicateButtonStyle={getDuplicateButtonStyle('username', signupForm)}
              isDuplicateButtonDisabled={isDuplicateButtonDisabled('username', signupForm)}
              error={errors.username}
              duplicateStatus={duplicateChecks.username}
              useInlineStyle={true}
            />

            <TextField
              label="비밀번호 *"
              name="password"
              type="password"
              value={signupForm.password}
              onChange={signupInputHandler}
              placeholder="영문, 숫자, 특수문자 포함 8~16자"
              disabled={isAnyLoading}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />

            <TextField
              label="비밀번호 확인 *"
              name="confirmPassword"
              type="password"
              value={signupForm.confirmPassword}
              onChange={signupInputHandler}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isAnyLoading}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <TextField
              label="이름 *"
              name="name"
              value={signupForm.name}
              onChange={signupInputHandler}
              placeholder="이름을 입력해주세요"
              disabled={isAnyLoading}
              fullWidth
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                endAdornment: signupForm.name && oauthSignupData?.name ? (
                  <InputAdornment position="end">
                    <span className="auto-fill-indicator">✓ 자동입력</span>
                  </InputAdornment>
                ) : null,
              }}
            />

            {/* 닉네임 중복 체크 */}
            <DuplicateCheckInput
              label="닉네임 *"
              name="userNickName"
              value={signupForm.userNickName}
              placeholder="한글, 영문, 숫자 3~10자"
              disabled={isAnyLoading}
              onChange={signupInputHandler}
              onDuplicateCheck={() => handleFieldDuplicateCheck('userNickName')}
              duplicateButtonText={getDuplicateButtonText('userNickName')}
              duplicateButtonStyle={getDuplicateButtonStyle('userNickName', signupForm)}
              isDuplicateButtonDisabled={isDuplicateButtonDisabled('userNickName', signupForm)}
              error={errors.userNickName}
              duplicateStatus={duplicateChecks.userNickName}
              autoFillIndicator={!!(signupForm.userNickName && (oauthSignupData?.nickname || oauthSignupData?.name))}
              useInlineStyle={true}
            />

            {/* 이메일 중복 체크 */}
            <DuplicateCheckInput
              label="이메일"
              name="userEmail"
              type="email"
              value={signupForm.userEmail}
              placeholder="example@domain.com"
              disabled={isAnyLoading}
              onChange={signupInputHandler}
              onDuplicateCheck={() => handleFieldDuplicateCheck('userEmail')}
              duplicateButtonText={getDuplicateButtonText('userEmail')}
              duplicateButtonStyle={getDuplicateButtonStyle('userEmail', signupForm)}
              isDuplicateButtonDisabled={isDuplicateButtonDisabled('userEmail', signupForm)}
              error={errors.userEmail}
              duplicateStatus={duplicateChecks.userEmail}
              autoFillIndicator={!!(signupForm.userEmail && oauthSignupData?.email)}
              useInlineStyle={true}
            />

            {/* 전화번호 중복 체크 */}
            <DuplicateCheckInput
              label="전화번호 *"
              name="userPhone"
              value={signupForm.userPhone}
              placeholder="01012345678 (하이픈 제외)"
              disabled={isAnyLoading}
              onChange={signupInputHandler}
              onDuplicateCheck={() => handleFieldDuplicateCheck('userPhone')}
              duplicateButtonText={getDuplicateButtonText('userPhone')}
              duplicateButtonStyle={getDuplicateButtonStyle('userPhone', signupForm)}
              isDuplicateButtonDisabled={isDuplicateButtonDisabled('userPhone', signupForm)}
              error={errors.userPhone}
              duplicateStatus={duplicateChecks.userPhone}
              useInlineStyle={true}
            />

            <TextField
              label="생년월일 *"
              name="userBirth"
              value={signupForm.userBirth}
              onChange={signupInputHandler}
              placeholder="생년월일: 990101 (6자리)"
              inputProps={{ maxLength: 6 }}
              disabled={isAnyLoading}
              fullWidth
              error={!!errors.userBirth}
              helperText={errors.userBirth}
            />

            {/* 성별 선택 */}
            <div className="gender-section">
              <label className="gender-label">성별 *</label>
              <div className="gender-options">
                <label className="gender-option">
                  <input
                    type="radio"
                    name="userGender"
                    value="M"
                    checked={signupForm.userGender === 'M'}
                    onChange={handleGenderChange}
                    disabled={isAnyLoading}
                  />
                  남자
                </label>
                <label className="gender-option">
                  <input
                    type="radio"
                    name="userGender"
                    value="F"
                    checked={signupForm.userGender === 'F'}
                    onChange={handleGenderChange}
                    disabled={isAnyLoading}
                  />
                  여자
                </label>
              </div>
              {errors.userGender && (
                <p className="error-text">{errors.userGender}</p>
              )}
            </div>

            {/* 주소 (선택사항) */}
            <div className="address-container">
              <TextField
                label="주소"
                name="address"
                value={signupForm.address}
                placeholder="주소검색 버튼을 클릭하세요"
                disabled={true}
                className="address-input"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                disabled={isAnyLoading}
                className="address-search-btn"
              >
                주소검색
              </button>
            </div>

            <TextField
              label="상세주소"
              name="addressDetail"
              value={signupForm.addressDetail}
              onChange={signupInputHandler}
              placeholder="상세주소를 입력하세요"
              disabled={isAnyLoading}
              fullWidth
            />

            {/* 버튼들 */}
            <div className="button-container">
              <button
                type="submit"
                disabled={isAnyLoading}
                className="submit-button"
              >
                {isAnyLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    <span className="loading-text">처리 중...</span>
                  </>
                ) : (
                  '✅ 회원가입 완료'
                )}
              </button>

              <button
                type="button"
                onClick={onBackToLogin}
                disabled={isAnyLoading}
                className="back-button"
              >
                ← 로그인으로
              </button>
            </div>
          </div>
        </form>
      </Box>
    </div>
  );
};

export default OAuthJoin;