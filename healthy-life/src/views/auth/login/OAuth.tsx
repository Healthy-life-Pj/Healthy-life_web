import React from 'react';
import { AUTH_PATH, MAIN_APT_PATH } from '../../../constants';
import GoogleIcon from '../../../assets/icons/google-icon.svg';
import KakaoIcon from '../../../assets/icons/kakao-icon.png';
import NaverIcon from '../../../assets/icons/naver-icon.png';

import '../../../style/auth/login/OAuth.css';

const BACKEND_URL = 'http://localhost:4040';

export default function OAuth() {
  const handleGoogleLogin = () => {
    console.log('Google 로그인 버튼 클릭');
    const url = `${BACKEND_URL}/oauth2/authorization/google`;
    console.log('리다이렉트 URL:', url);
    window.location.href = url;
  };

  const handleKakaoLogin = () => {
    console.log('Kakao 로그인 버튼 클릭');
    const url = `${BACKEND_URL}/oauth2/authorization/kakao`;
    console.log('리다이렉트 URL:', url);
    window.location.href = url;
  };

  const handleNaverLogin = () => {
    console.log('Naver 로그인 버튼 클릭');
    const url = `${BACKEND_URL}/oauth2/authorization/naver`;
    console.log('리다이렉트 URL:', url);
    window.location.href = url;
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