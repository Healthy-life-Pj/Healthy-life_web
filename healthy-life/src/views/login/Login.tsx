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

  // 🎉 두 훅 모두 사용! (향상된 버전)
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
    clearSignupData,
    proceedToSignup
  } = useOAuth();

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
    
    // 입력시 에러 메시지 초기화
    if (error) clearError();
    if (oauthError) clearOAuthError();
  }

  // 🎉 훅을 사용한 간단한 로그인 처리!
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

  // OAuth 로그인 성공 또는 회원가입 필요 처리
  useEffect(() => {
    if (oauthResult || needsSignup) {
      setModalIsOpen(true);
    }
  }, [oauthResult, needsSignup]);

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
    clearSignupData(); // 🎉 회원가입 데이터도 초기화
  }

  // 🎯 안전한 사용자 정보 처리 함수
  const getSafeUserInfo = (user: SafeUser | null) => {
    if (!user) return null;
    
    return {
      name: user.name || '사용자',
      nickName: user.userNickName || user.username || '닉네임 없음',
      email: user.userEmail || null,
      phone: user.userPhone || null,
      memberGrade: user.userMemberGrade || '일반회원',
      userId: user.userId
    };
  };

  // 🎯 회원가입 진행 함수
  const handleProceedToSignup = () => {
    closeModal();
    proceedToSignup();
  };

  // 🎯 로그인 성공 후 페이지 이동 함수
  const handlePageNavigation = (path: string) => {
    closeModal();
    window.location.href = path;
  };

  // 로딩 상태 통합
  const isAnyLoading = isLoading || oauthLoading;
  // 에러 메시지 통합
  const displayError = error || oauthError;
  // 로그인 결과 통합
  const displayResult = loginResult || oauthResult;
  // 안전한 사용자 정보
  const safeUserInfo = getSafeUserInfo(displayResult);

  return (
    <div className='loginContainer'>
      <Box>
        {/* 통합 에러 메시지 표시 */}
        {displayError && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {displayError}
          </Alert>
        )}

        {/* 🎉 회원가입 필요 알림 */}
        {needsSignup && !displayError && (
          <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
            소셜 로그인은 성공했지만 추가 정보가 필요합니다. 회원가입을 완료해주세요.
          </Alert>
        )}

        <div className='loginForm'>
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
            className='loginButton' 
            onClick={loginModalHandler}
            disabled={isAnyLoading}
            style={{
              position: 'relative',
              opacity: isAnyLoading ? 0.7 : 1,
              cursor: isAnyLoading ? 'not-allowed' : 'pointer',
              padding: '12px 24px',
              margin: '10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isAnyLoading ? '#ccc' : '#1976d2',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              minWidth: '200px'
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                로그인 중...
              </div>
            ) : (
              '🔐 로그인'
            )}
          </button>
          
          {/* 🎉 OAuth 버튼들 */}
          <div style={{ 
            marginTop: '20px', 
            borderTop: '1px solid #eee', 
            paddingTop: '20px' 
          }}>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '15px', fontSize: '14px' }}>
              또는 소셜 계정으로 로그인
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              alignItems: 'center'
            }}>
              <button
                onClick={loginWithGoogle}
                disabled={isAnyLoading}
                style={{
                  padding: '12px 20px',
                  border: '1px solid #4285f4',
                  borderRadius: '6px',
                  backgroundColor: isAnyLoading ? '#f5f5f5' : '#4285f4',
                  color: isAnyLoading ? '#999' : 'white',
                  cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '220px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {oauthLoading ? (
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                ) : (
                  <>🔵 Google로 로그인</>
                )}
              </button>

              <button
                onClick={loginWithKakao}
                disabled={isAnyLoading}
                style={{
                  padding: '12px 20px',
                  border: '1px solid #FEE500',
                  borderRadius: '6px',
                  backgroundColor: isAnyLoading ? '#f5f5f5' : '#FEE500',
                  color: isAnyLoading ? '#999' : '#3c1e1e',
                  cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '220px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {oauthLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <>🟡 Kakao로 로그인</>
                )}
              </button>

              <button 
                onClick={loginWithNaver}
                disabled={isAnyLoading}
                style={{
                  padding: '12px 20px',
                  border: '1px solid #03C75A',
                  borderRadius: '6px',
                  backgroundColor: isAnyLoading ? '#f5f5f5' : '#03C75A',
                  color: isAnyLoading ? '#999' : 'white',
                  cursor: isAnyLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '220px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {oauthLoading ? (
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                ) : (
                  <>🟢 Naver로 로그인</>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className='modalContainer'>
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="modalContent"
            overlayClassName="modalOverlay"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
          >
            {/* 🎯 회원가입 필요한 경우 */}
            {needsSignup && oauthSignupData ? (
              <div style={{ textAlign: 'center' }}>
                <h3>🎉 소셜 로그인 성공!</h3>
                <p style={{ fontSize: '16px', margin: '15px 0', color: '#666' }}>
                  <strong>{oauthSignupData.provider}</strong> 계정 연결이 완료되었습니다.
                </p>
                
                <div style={{
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '15px',
                  margin: '20px 0'
                }}>
                  <p style={{ margin: '0', color: '#856404' }}>
                    ⚠️ 서비스 이용을 위해 추가 정보가 필요합니다.<br />
                    회원가입을 완료해주세요.
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  justifyContent: 'center',
                  marginTop: '25px'
                }}>
                  <button 
                    onClick={handleProceedToSignup}
                    style={{ 
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ 회원가입 계속하기
                  </button>
                  <button 
                    onClick={closeModal}
                    style={{ 
                      backgroundColor: '#6c757d',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : 
            /* 🎯 입력값 누락 */
            !id || !password ? (
              <div style={{ textAlign: 'center' }}>
                <h3>⚠️ 입력 오류</h3>
                <p>아이디 혹은 비밀번호를 입력하세요</p>
                <button 
                  onClick={closeModal} 
                  className='closeModalButton'
                  style={{ marginTop: '20px' }}
                >
                  확인
                </button>
              </div>
            ) : 
            /* 🎯 로그인 성공 */
            safeUserInfo ? (
              <div style={{ textAlign: 'center' }}>
                <h3>🎉 로그인 성공!</h3>
                <p style={{ fontSize: '18px', margin: '15px 0' }}>
                  환영합니다, <strong>{safeUserInfo.name}</strong>님!
                </p>
                
                {/* 안전한 정보 표시 */}
                <div style={{ 
                  textAlign: 'left', 
                  margin: '20px 0', 
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <p style={{ margin: '8px 0' }}>
                    <strong>👤 닉네임:</strong> {safeUserInfo.nickName}
                  </p>
                  {safeUserInfo.email && (
                    <p style={{ margin: '8px 0' }}>
                      <strong>📧 이메일:</strong> {safeUserInfo.email}
                    </p>
                  )}
                  {safeUserInfo.phone && (
                    <p style={{ margin: '8px 0' }}>
                      <strong>📱 전화번호:</strong> {safeUserInfo.phone}
                    </p>
                  )}
                  <p style={{ margin: '8px 0' }}>
                    <strong>⭐ 회원등급:</strong> {safeUserInfo.memberGrade}
                  </p>
                  {safeUserInfo.userId && (
                    <p style={{ margin: '8px 0', fontSize: '12px', color: '#666' }}>
                      <strong>ID:</strong> {safeUserInfo.userId}
                    </p>
                  )}
                </div>
                
                {oauthResult && (
                  <div style={{
                    color: '#4caf50', 
                    fontWeight: 'bold',
                    padding: '10px',
                    backgroundColor: '#e8f5e8',
                    borderRadius: '6px',
                    margin: '15px 0',
                    border: '1px solid #4caf50'
                  }}>
                    ✅ 소셜 로그인으로 연결되었습니다!
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  justifyContent: 'center',
                  marginTop: '25px'
                }}>
                  <button 
                    onClick={() => handlePageNavigation('/')}
                    className='closeModalButton' 
                    style={{ 
                      backgroundColor: '#4CAF50',
                      padding: '10px 20px',
                      borderRadius: '6px'
                    }}
                  >
                    🏠 메인으로
                  </button>
                  <button 
                    onClick={() => handlePageNavigation('/mypage')}
                    className='closeModalButton' 
                    style={{ 
                      backgroundColor: '#2196F3',
                      padding: '10px 20px',
                      borderRadius: '6px'
                    }}
                  >
                    👤 마이페이지
                  </button>
                </div>
              </div>
            ) : (
              /* 🎯 로딩 중 */
              <div style={{ textAlign: 'center' }}>
                <h3>로그인 처리 중...</h3>
                <CircularProgress size={32} sx={{ mt: 2, mb: 2 }} />
                <p style={{ color: '#666', fontSize: '14px' }}>
                  잠시만 기다려주세요...
                </p>
                <button 
                  onClick={closeModal} 
                  className='closeModalButton'
                  style={{ marginTop: '20px' }}
                >
                  취소
                </button>
              </div>
            )}
          </ReactModal>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            <a href='/login/FindId' style={{ textDecoration: 'none', color: '#1976d2' }}>
              🔍 아이디 찾기
            </a>
            {' | '}
            <a href='/login/FindPassword' style={{ textDecoration: 'none', color: '#1976d2' }}>
              🔑 비밀번호 찾기
            </a>
            <br />
            <br />
            <a href='/join' style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>
              ✨ 회원가입
            </a>
            {' | '}
            <a href='/nonMember' style={{ textDecoration: 'none', color: '#1976d2' }}>
              🛒 비회원 구매
            </a>
          </p>
        </div>
        
        {/* 개발용 디버그 정보 */}
        {process.env.NODE_ENV === 'development' && (displayResult || needsSignup) && (
          <details style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666',
            border: '1px solid #dee2e6'
          }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              🔧 개발용 디버그 정보 (클릭하여 펼치기)
            </summary>
            
            {displayResult && (
              <div style={{ marginTop: '10px' }}>
                <strong>로그인 결과:</strong>
                <pre style={{ 
                  marginTop: '5px', 
                  whiteSpace: 'pre-wrap',
                  fontSize: '11px',
                  backgroundColor: '#fff',
                  padding: '10px',
                  borderRadius: '4px'
                }}>
                  {JSON.stringify(displayResult, null, 2)}
                </pre>
              </div>
            )}
            
            {needsSignup && oauthSignupData && (
              <div style={{ marginTop: '10px' }}>
                <strong>회원가입 데이터:</strong>
                <pre style={{ 
                  marginTop: '5px', 
                  whiteSpace: 'pre-wrap',
                  fontSize: '11px',
                  backgroundColor: '#fff3cd',
                  padding: '10px',
                  borderRadius: '4px'
                }}>
                  {JSON.stringify(oauthSignupData, null, 2)}
                </pre>
              </div>
            )}
          </details>
        )}
      </Box>
    </div>
  )
}

export default Login