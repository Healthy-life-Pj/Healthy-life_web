import React from 'react';
import styled from 'styled-components';

const API_URL = 'http://localhost:4040';

const OAuthLoginButtons: React.FC = () => {
  const handleKakaoLogin = () => {
    window.location.href = `${API_URL}/oauth2/authorization/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${API_URL}/oauth2/authorization/naver`;
  };

  return (
    <Container>
      <OAuthButton onClick={handleKakaoLogin} bgColor="#FEE500" textColor="#000000">
        <IconWrapper>💬</IconWrapper>
        카카오로 시작하기
      </OAuthButton>

      <OAuthButton onClick={handleNaverLogin} bgColor="#03C75A" textColor="#FFFFFF">
        <IconWrapper>N</IconWrapper>
        네이버로 시작하기
      </OAuthButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
`;

const OAuthButton = styled.button<{ bgColor: string; textColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 24px;
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const IconWrapper = styled.span`
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export default OAuthLoginButtons;
