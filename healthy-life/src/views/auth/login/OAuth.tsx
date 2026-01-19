import React, { useEffect } from 'react';
import { AUTH_PATH, MAIN_APT_PATH } from '../../../constants';
import GoogleIcon from '../../../assets/icons/google-icon.svg';
import KakaoIcon from '../../../assets/icons/kakao-icon.png';
import NaverIcon from '../../../assets/icons/naver-icon.png';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import '../../../style/auth/login/OAuth.css';

const BACKEND_URL = 'http://localhost:4040';

export default function OAuth() {
  const [cookies] = useCookies(['accessToken']);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'OAUTH_SUCCESS') {
        console.log('OAuth 로그인 성공!');
        navigate('/');
      } else if (event.data.type === 'OAUTH_SIGNUP') {
        console.log('OAuth 회원가입 필요');
        navigate('/signup');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);

  const openOAuthPopup = (provider: string) => {
    const url = `${BACKEND_URL}/oauth2/authorization/${provider}`;
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      url,
      `${provider}_login`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }

    const checkPopup = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopup);
        console.log('OAuth 팝업이 닫혔습니다');
      }
    }, 500);
  };

  const handleKakaoLogin = () => {
    console.log('Kakao 로그인 버튼 클릭');
    openOAuthPopup('kakao');
  };

  const handleNaverLogin = () => {
    console.log('Naver 로그인 버튼 클릭');
    openOAuthPopup('naver');
  };

  return (
    <div className="oauth-buttons-container">
      <button onClick={handleKakaoLogin} type="button">
        <img src={KakaoIcon} alt="Kakao" />
        Kakao
      </button>

      <button onClick={handleNaverLogin} type="button">
        <img src={NaverIcon} alt="Naver" />
        Naver
      </button>
    </div>
  );
}