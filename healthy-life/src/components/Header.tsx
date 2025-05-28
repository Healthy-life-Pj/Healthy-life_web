import React, { useEffect, useState } from "react";
import "../style/componentStyle/HeaderStyle.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/KakaoTalk_20240822_203008371.png";
import userAuthStore from "../stores/user.store";
import { useCookies } from "react-cookie";

export default function Header() {
  const [search, setSearch] = useState<string>("");
  const {username, isAuthenticated, logout} = userAuthStore();
  const [cookies, setCookies, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.token) {
      logout();
    }
  }, [cookies.token,logout]);

  const handleLougoutClick = () => {
    setCookies("token", "", { expires: new Date() });
    removeCookie("token", { path: "/"});
    logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="headerFlexBox">
        <div className="logo">
          <Link to={"/"}>
            <img className="realLogo" src={Logo} alt="로고" />
          </Link>
        </div>
        <div className="buttonFlexBox1">
          <div>
            {isAuthenticated ? 
            <div className="button1">
            <span className="usernameSpan">{username}</span>
            <span className="buttonFlexBox1Span">|</span>
            <Link to={"/"} onClick={handleLougoutClick}>로그아웃</Link>
            <span className="buttonFlexBox1Span">|</span>
            <Link to={"/mypage/orderApp"}>주문조회</Link>
            <span className="buttonFlexBox1Span">|</span>
            <Link to={"/myPage"}>마이페이지</Link>
            </div>
            :
            <div className="button3">
            <Link to={"/login"}>로그인</Link>
            <span className="buttonFlexBox1Span">|</span>
            <Link to={"/signUp"}>회원가입</Link>
            </div>
            }
          </div>
        </div>
      </div>
    </header>
  );
}
