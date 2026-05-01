import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";

function OAuth() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [, setCookies] = useCookies(["token"]);
  const exprTime = searchParams.get("exprTime");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token && exprTime) {
      const expires = new Date(Date.now() + Number(exprTime));
      setCookies("token", token, {
        path: "/",
        expires,
      });
      navigate("/");
  }
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default OAuth;
