import React, { useEffect, useState } from 'react';

// OAuth 콜백 컴포넌트
const OAuthCallback: React.FC = () => {
  const [status, setStatus] = useState('로그인 처리중...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        // URL에서 파라미터 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        // 현재 경로에서 OAuth 제공자 확인
        const currentPath = window.location.pathname.toLowerCase();
        let provider = 'unknown';
        
        if (currentPath.includes('google')) {
          provider = 'google';
          setStatus('구글 로그인 처리중...');
        } else if (currentPath.includes('kakao')) {
          provider = 'kakao';
          setStatus('카카오 로그인 처리중...');
        } else if (currentPath.includes('naver')) {
          provider = 'naver';
          setStatus('네이버 로그인 처리중...');
        }

        console.log('OAuth 콜백 처리:', { provider, code, error, path: currentPath });

        if (error) {
          // OAuth 에러가 있는 경우
          console.error(`${provider} OAuth 에러:`, error, errorDescription);
          
          const errorMessage = `로그인 실패: ${errorDescription || error}`;
          setError(errorMessage);
          setStatus('로그인에 실패했습니다.');
          
          // 부모 창에 에러 메시지 전송
          if (window.opener && !window.opener.closed) {
            try {
              window.opener.postMessage({
                type: 'OAUTH_ERROR',
                provider: provider,
                error: errorDescription || error
              }, window.location.origin);
            } catch (postMessageError) {
              console.warn('부모 창 메시지 전송 실패:', postMessageError);
            }
          }
          
          // 3초 후 창 닫기
          setTimeout(() => {
            try {
              window.close();
            } catch (closeError) {
              console.warn('창 닫기 실패:', closeError);
              // 창이 닫히지 않으면 메인 페이지로 리다이렉트
              window.location.href = '/login';
            }
          }, 3000);
          
        } else if (code) {
          // OAuth 코드가 있는 경우 (성공)
          console.log(`${provider} OAuth 코드 받음:`, code);
          setStatus('로그인 정보를 처리중입니다...');
          
          // 부모 창에 성공 메시지 전송
          if (window.opener && !window.opener.closed) {
            try {
              window.opener.postMessage({
                type: 'OAUTH_SUCCESS',
                provider: provider,
                code: code
              }, window.location.origin);
              
              setStatus('로그인이 완료되었습니다.');
              
              // 메시지 전송 후 잠시 기다렸다가 창 닫기
              setTimeout(() => {
                try {
                  window.close();
                } catch (closeError) {
                  console.warn('창 닫기 실패:', closeError);
                  window.location.href = '/';
                }
              }, 1500);
            } catch (postMessageError) {
              console.warn('부모 창 메시지 전송 실패:', postMessageError);
              // postMessage 실패 시 직접 메인 페이지로 이동
              setStatus('로그인이 완료되었습니다. 메인 페이지로 이동합니다.');
              setTimeout(() => {
                window.location.href = '/';
              }, 2000);
            }
          } else {
            // 부모 창이 없는 경우 (직접 접근한 경우)
            setStatus('로그인이 완료되었습니다. 메인 페이지로 이동합니다.');
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
          
        } else {
          // 코드도 에러도 없는 경우
          console.warn('OAuth 콜백에 코드나 에러가 없습니다.');
          const errorMessage = '로그인 정보를 찾을 수 없습니다.';
          setError(errorMessage);
          setStatus('로그인 처리에 문제가 발생했습니다.');
          
          if (window.opener && !window.opener.closed) {
            try {
              window.opener.postMessage({
                type: 'OAUTH_ERROR',
                provider: provider,
                error: errorMessage
              }, window.location.origin);
            } catch (postMessageError) {
              console.warn('부모 창 메시지 전송 실패:', postMessageError);
            }
          }
          
          setTimeout(() => {
            try {
              window.close();
            } catch (closeError) {
              window.location.href = '/login';
            }
          }, 3000);
        }
        
      } catch (err) {
        console.error('OAuth 콜백 처리 중 오류:', err);
        const errorMessage = '로그인 처리 중 오류가 발생했습니다.';
        setError(errorMessage);
        setStatus('오류가 발생했습니다.');
        
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage({
              type: 'OAUTH_ERROR',
              provider: 'unknown',
              error: errorMessage
            }, window.location.origin);
          } catch (postMessageError) {
            console.warn('부모 창 메시지 전송 실패:', postMessageError);
          }
        }
        
        setTimeout(() => {
          try {
            window.close();
          } catch (closeError) {
            window.location.href = '/login';
          }
        }, 3000);
      }
    };

    // 컴포넌트 마운트 시 콜백 처리 실행
    handleOAuthCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      margin: 0,
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        padding: '2rem',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        maxWidth: '400px',
        width: '100%',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* 로딩 스피너 또는 에러 아이콘 */}
        <div style={{ marginBottom: '1.5rem' }}>
          {!error ? (
            <div style={{
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              borderTop: '4px solid white',
              width: '48px',
              height: '48px',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
          ) : (
            <div style={{
              fontSize: '48px',
              color: '#ff6b6b'
            }}>
              ❌
            </div>
          )}
        </div>
        
        <h2 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.5rem',
          fontWeight: '600' 
        }}>
          {error ? '로그인 실패' : '로그인 처리중'}
        </h2>
        
        <p style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1rem',
          lineHeight: '1.5',
          opacity: 0.9
        }}>
          {status}
        </p>
        
        {error && (
          <div style={{
            color: '#ff6b6b',
            background: 'rgba(255, 107, 107, 0.15)',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            fontSize: '0.9rem',
            border: '1px solid rgba(255, 107, 107, 0.3)'
          }}>
            {error}
          </div>
        )}
        
        <p style={{ 
          fontSize: '0.8rem', 
          opacity: 0.7, 
          marginTop: '1.5rem',
          marginBottom: 0,
          fontStyle: 'italic'
        }}>
          {error ? '잠시 후 창이 자동으로 닫힙니다.' : '잠시만 기다려주세요...'}
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;