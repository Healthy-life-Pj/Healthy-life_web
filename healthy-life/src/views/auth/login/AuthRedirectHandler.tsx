import React,  { useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthRedirectHandler() {

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const expirTime = params.get("expirTime");

    if (accessToken) {
      console.log("accessToken:",accessToken);

      navigate(`/signin/?accessToken=${accessToken}&expirTime=${expirTime}`);
    } else {
      console.error("필요한 파라미터가 없습니다.");
    }
  }, [location, navigate]);

  return <div>처리 중...</div>;
}