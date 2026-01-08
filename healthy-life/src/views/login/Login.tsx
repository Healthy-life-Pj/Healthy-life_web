import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ReactModal from 'react-modal';
import { useLogin } from '../../hooks/useLogin';
import { useOAuth } from '../../hooks/useOAuth';
import OAuthJoin from '../join/OAuthJoin';
import '../../style/login/login.css';

interface userLogin {
  id: string | number
  password: string | number
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

let initialValue: userLogin = {
  id: '',
  password: ''
}

ReactModal.setAppElement('#root');

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [login, setLogin] = useState<userLogin>(initialValue);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // OAuth 회원가입 모드 상태
  const [isSignupMode, setIsSignupMode] = useState(false);

  const { isLoading, error, loginResult, performLogin, clearError, clearLoginResult } = useLogin();
  const {
    isLoading: oauthLoading,
    error: oauthError,
    oauthResult,
    needsSignup,
    oauthSignupData,
    loginWithKakao,
    loginWithGoogle,
    loginWithNaver,
    clearError: clearOAuthError,
    clearResult: clearOAuthResult,
    clearSignupData
  } = useOAuth();

  // OAuth 회원가입이 필요할 때 모드 변경
  useEffect(() => {
    if (needsSignup && oauthSignupData) {
      setIsSignupMode(true);
      setModalIsOpen(false);
    }
  }, [needsSignup, oauthSignupData]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const { id, password } = login;

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setLogin({
      ...login,
      [name]: value
    })

    if (error) clearError();
    if (oauthError) clearOAuthError();
  }

  // OAuth 회원가입 성공 핸들러
  const handleOAuthSignupSuccess = (userData: any) => {
    // 성공 후 메인 페이지로 이동
    window.location.href = '/';
  };

  // 로그인 모드로 돌아가기
  const backToLogin = () => {
    setIsSignupMode(false);
    clearSignupData();
  };

  const loginModalHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !password) {
      setModalIsOpen(true);
      return;
    }

    const result = await performLogin(String(id), String(password));

    if (result.success) {
      setModalIsOpen(true);
    }
  }

  useEffect(() => {
    if (oauthResult) {
      setModalIsOpen(true);
    }
  }, [oauthResult]);

  const closeModal = () => {
    setModalIsOpen(false);
    setLogin({
      id: '',
      password: ''
    });
    clearLoginResult();
    clearError();
    clearOAuthResult();
    clearOAuthError();
    clearSignupData();
  }

  const getSafeUserInfo = (user: SafeUser | null) => {
    if (!user) return null;

    return {
      name: user.name || '사용자',
      nickName: user.userNickName || '닉네임 없음',
      email: user.userEmail || null,
      phone: user.userPhone || null,
      memberGrade: user.userMemberGrade || '일반회원',
      userId: user.userId
    };
  };

  const handlePageNavigation = (path: string) => {
    closeModal();
    window.location.href = path;
  };

  const isAnyLoading = isLoading || oauthLoading;
  const displayError = error || oauthError;
  const displayResult = loginResult || oauthResult;
  const safeUserInfo = getSafeUserInfo(displayResult);

  // OAuth 회원가입 모드일 때 렌더링
  if (isSignupMode) {
    return (
      <OAuthJoin
        oauthSignupData={oauthSignupData}
        onSignupSuccess={handleOAuthSignupSuccess}
        onBackToLogin={backToLogin}
      />
    );
  }

  // 기존 로그인 화면 렌더링
  return (
    <div className='loginContainer login-container'>
      <Box>
        {displayError && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {displayError}
          </Alert>
        )}

        <div className='loginForm login-form'>
          <TextField
            label="아이디"
            id='userId'
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
              startAdornment: <InputAdornment position='start'>👤</InputAdornment>
            }}
            value={id}
            onChange={inputHandler}
            name='id'
            disabled={isAnyLoading}
            error={!!displayError && !id}
            placeholder="아이디를 입력하세요"
          />

          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outline-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="userPassword"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    disabled={isAnyLoading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              value={password}
              onChange={inputHandler}
              label="Password"
              name='password'
              disabled={isAnyLoading}
              error={!!displayError && !password}
              placeholder="비밀번호를 입력하세요"
            />
          </FormControl>

          <button
            className='loginButton login-button'
            onClick={loginModalHandler}
            disabled={isAnyLoading}
          >
            {isLoading ? (
              <div className="login-button-content">
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <span className="loading-text">로그인 중...</span>
              </div>
            ) : (
              '🔐 로그인'
            )}
          </button>

          {/* OAuth 버튼들 */}
          <div className="oauth-section">
            <p className="oauth-section-title">
              또는 소셜 계정으로 로그인
            </p>

            <div className="oauth-buttons-container">
              <button
                onClick={loginWithGoogle}
                disabled={isAnyLoading}
                className="oauth-button google"
              >
                {oauthLoading ? (
                  <div className="oauth-button-content">
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                    <span>Google 처리중...</span>
                  </div>
                ) : (
                  <>🔵 Google로 로그인</>
                )}
              </button>

              <button
                onClick={loginWithKakao}
                disabled={isAnyLoading}
                className="oauth-button kakao"
              >
                {oauthLoading ? (
                  <div className="oauth-button-content">
                    <CircularProgress size={16} />
                    <span>Kakao 처리중...</span>
                  </div>
                ) : (
                  <>🟡 Kakao로 로그인</>
                )}
              </button>

              <button
                onClick={loginWithNaver}
                disabled={isAnyLoading}
                className="oauth-button naver"
              >
                {oauthLoading ? (
                  <div className="oauth-button-content">
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                    <span>Naver 처리중...</span>
                  </div>
                ) : (
                  <>🟢 Naver로 로그인</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 로그인 성공/실패 모달 */}
        <div className='modalContainer modal-container'>
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="modalContent modal-content"
            overlayClassName="modalOverlay modal-overlay"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
          >
            {!id || !password ? (
              <div className="modal-header">
                <h3>⚠️ 입력 오류</h3>
                <p>아이디 혹은 비밀번호를 입력하세요</p>
                <button
                  onClick={closeModal}
                  className='closeModalButton modal-button default'
                >
                  확인
                </button>
              </div>
            ) : safeUserInfo ? (
              <div>
                <div className="modal-header">
                  <h3>🎉 로그인 성공!</h3>
                  <div className="modal-welcome">
                    환영합니다, <strong>{safeUserInfo.nickName}</strong>님!
                  </div>
                </div>

                <div className="modal-user-info">
                  <p>
                    <strong>👤 닉네임:</strong> {safeUserInfo.nickName}
                  </p>
                  {safeUserInfo.email && (
                    <p>
                      <strong>📧 이메일:</strong> {safeUserInfo.email}
                    </p>
                  )}
                  {safeUserInfo.phone && (
                    <p>
                      <strong>📱 전화번호:</strong> {safeUserInfo.phone}
                    </p>
                  )}
                  <p>
                    <strong>⭐ 회원등급:</strong> {safeUserInfo.memberGrade}
                  </p>
                </div>

                {oauthResult && (
                  <div className="modal-success-message">
                    ✅ 소셜 로그인으로 연결되었습니다!
                  </div>
                )}

                <div className="modal-buttons">
                  <button
                    onClick={() => handlePageNavigation('/')}
                    className='closeModalButton modal-button primary'
                  >
                    🏠 메인으로
                  </button>
                  <button
                    onClick={() => handlePageNavigation('/mypage')}
                    className='closeModalButton modal-button secondary'
                  >
                    👤 마이페이지
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-loading">
                <h3>로그인 처리 중...</h3>
                <CircularProgress size={32} sx={{ mt: 2, mb: 2 }} />
                <p>잠시만 기다려주세요...</p>
                <button
                  onClick={closeModal}
                  className='closeModalButton modal-button default'
                >
                  취소
                </button>
              </div>
            )}
          </ReactModal>
        </div>

        <div className="bottom-links">
          <p>
            <a href='/login/FindId' className="link-primary">
              🔍 아이디 찾기
            </a>
            {' | '}
            <a href='/login/FindPassword' className="link-primary">
              🔑 비밀번호 찾기
            </a>
            <br />
            <br />
            <a href='/join' className="link-success">
              ✨ 회원가입
            </a>
            {' | '}
            <a href='/nonMember' className="link-primary">
              🛒 비회원 구매
            </a>
          </p>
        </div>
      </Box>
    </div>
  )
}

export default Login