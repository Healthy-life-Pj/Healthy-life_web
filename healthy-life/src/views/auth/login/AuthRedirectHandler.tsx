import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthRedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["token"]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const expirTime = params.get("expirTime");

  // 신규 SNS 회원 → 회원가입
    if (!accessToken) {
      navigate("/signUp", { replace: true });
      return;
    }

    // 기존 회원 → 로그인 완료
    const expires = expirTime
      ? new Date(Date.now() + Number(expirTime))
      : undefined;

    setCookies("token", accessToken, {
      path: "/",
      expires,
    });

    navigate("/", { replace: true });
  }, [location, navigate, setCookies]);

  return <div>로그인 처리 중...</div>;
}
