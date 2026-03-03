import { Button, OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react'
import "../../../../style/auth/login/login.css"
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { MAIN_APT_PATH, UPDATE_PASSWORD_BY_EMAIL } from '../../../../constants';

// JWT에서 username 추출용 타입
interface DecodedToken {
  username: string;
}

// 비밀번호 업데이트 요청 데이터 타입
interface UpdatePasswordData {
  password: string;
  confirmPassword: string;
}

// 토큰을 디코딩해서 username 반환
const fetchUserInfoForCertification = (token: string): Promise<{ username: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded.username) {
        reject(new Error('유효하지 않은 토큰입니다.'));
        return;
      }
      resolve({ username: decoded.username });
    } catch (e) {
      reject(e);
    }
  });
};

// 비밀번호 변경 API 호출
// PUT /api/v1/users/me/password/email?token=...
// Body: { userPassword, confirmUserPassword } → PasswordUpdateRequestDto 필드명과 일치
const updateUserPassword = async (data: UpdatePasswordData, token: string): Promise<void> => {
  await axios.put(
    `${MAIN_APT_PATH}${UPDATE_PASSWORD_BY_EMAIL}`,
    {
      userPassword: data.password,
      confirmUserPassword: data.confirmPassword,
    },
    { params: { token } }
  );
};

function FindPasswordResult() {
  const { token } = useParams<{ token: string }>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchUserInfoForCertification(token)
        .then((info) => setUsername(info.username))
        .catch((e) => {
          console.error('fail to fetch user', e);
          alert('유효하지 않은 인증 링크입니다.');
          navigate('/login/');
        });
    }
  }, [token]);

  const passwordInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const passwordConfirmInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const updatePasswordInClickHandler = () => {
    const data = { password, confirmPassword };

    if (data.password !== data.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!token) {
      alert('잘못된 인증 경로 입니다.');
      return;
    }

    updateUserPassword(data, token)
      .then(() => {
        alert('비밀번호 변경에 성공하셨습니다.');
        navigate('/login/');
      })
      .catch((e) => {
        console.error('fail to update password', e);
        alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <>
      <div className="find-pw-wrapper">
        <div>
          <div className="find-pw-header">
            <h2>비밀번호 재설정</h2>
          </div>
          <div className="find-pw-body">
            <div>
              <div>
                <p>재설정 할 비밀번호</p>
                <OutlinedInput
                  type="password"
                  name="password"
                  placeholder="변경할 비밀번호를 입력해주세요."
                  onChange={passwordInputHandler}
                  value={password}
                  size="small"
                />
              </div>
              <div>
                <p>설정한 비밀번호 재확인</p>
                <OutlinedInput
                  type="password"
                  name="passwordConfirm"
                  placeholder="입력하신 비밀번호를 재입력해주세요."
                  onChange={passwordConfirmInputHandler}
                  value={confirmPassword}
                  size="small"
                />
              </div>
            </div>
            <Button
              variant="contained"
              onClick={updatePasswordInClickHandler}
              sx={{
                fontFamily: 'Pretendard',
                height: '100%',
                backgroundColor: '#0085ff',
                color: '#ffffff',
                borderRadius: '18px',
              }}
            >
              비밀번호 재설정 하기
            </Button>
          </div>
          <div className="find-pw-dog">
            <div className="speech-bubble">
              <p>{username}님 재설정할 비밀번호를 입력해 주세요!</p>
            </div>
            <p className="dog-imo">🐶</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindPasswordResult;
