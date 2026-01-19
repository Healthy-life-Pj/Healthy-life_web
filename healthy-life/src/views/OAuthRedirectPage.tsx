import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import styled from 'styled-components';

const OAuthRedirectPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setCookie] = useCookies(['accessToken']);

  useEffect(() => {
    const token = searchParams.get('token');
    const expirationTime = searchParams.get('expirationTime');
    const error = searchParams.get('error');

    // 팝업 창인지 확인
    const isPopup = window.opener && window.opener !== window;

    if (error) {
      if (isPopup) {
        // 부모 창에 에러 메시지 전송
        window.opener.postMessage({ type: 'OAUTH_ERROR', error }, window.location.origin);
        window.close();
      } else {
        alert(`로그인 실패: ${error}`);
        navigate('/login');
      }
      return;
    }

    if (token && expirationTime) {
      // JWT 토큰을 쿠키에 저장
      const expires = new Date(Date.now() + Number(expirationTime));
      setCookie('accessToken', token, {
        path: '/',
        expires,
        secure: false,
        sameSite: 'lax'
      });

      if (isPopup) {
        // 부모 창에 성공 메시지 전송
        window.opener.postMessage({ type: 'OAUTH_SUCCESS', token }, window.location.origin);
        // 잠시 후 팝업 닫기
        setTimeout(() => {
          window.close();
        }, 500);
      } else {
        // 일반 창이면 메인 페이지로 이동
        navigate('/');
      }
    } else {
      if (isPopup) {
        window.opener.postMessage({ type: 'OAUTH_ERROR', error: '토큰을 받지 못했습니다' }, window.location.origin);
        window.close();
      } else {
        alert('로그인 처리 중 오류가 발생했습니다.');
        navigate('/login');
      }
    }
  }, [searchParams, navigate, setCookie]);

  return (
    <Container>
      <Content>
        <Spinner>⏳</Spinner>
        <Message>로그인 처리 중...</Message>
        <SubMessage>잠시만 기다려주세요</SubMessage>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Spinner = styled.div`
  font-size: 48px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const SubMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

export default OAuthRedirectPage;
