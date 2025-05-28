import React from 'react'
import { Link } from 'react-router-dom'
import "../../../style/auth/signUp/signUpStart.css"
import Logo from "../../../assets/images/KakaoTalk_20240822_203008371.png";

function SignUpStart() {
  return (
    <div className='signUpStartContainer'> 
        <ul className='signUpList'>
          <Link to={"/signUp/healthylife"}>
          <li className='signUpHealthy singUpLink'><img className="realLogoSignUp" src={Logo} alt="로고" /> 회원가입</li>
          </Link>
          <Link to={"/singUp/kakao"}>
          <li className='signUpKakao singUpLink'>kakao 회원가입</li>
          </Link>
          <Link to={"/singUp/naver"}>
          <li className='signUpNaver singUpLink'>Naver 회원가입</li>
          </Link>
        </ul>
      </div>
  )
}

export default SignUpStart