import React from "react";
import { Link } from "react-router-dom";

import "../../../style/mypage/MypageNav.css";

const MypageNav: React.FC = () => {
  return (
    <div className="mypagNavContainer">
      <div className="myPageNavDiv">
          <span className="mypageTitle">마이 페이지</span>
        <ul className="myPageNavBox">
          <li className="mypageNavTitle">주문관리</li>
          <li>
            <Link to="/mypage/orderApp">
              <span className="mypageMenue">주문처리 현황</span>
            </Link>
          </li>
          <li className="mypageNavLine"></li>
          <li className="mypageNavTitle">활동관리</li>
          <li>
            <Link to="/mypage/myreview">
              <span className="mypageMenue">후기</span>
            </Link>
          </li>
          <li>
            <Link to="/mypage/wishlist">
              <span className="mypageMenue">위시리스트</span>
            </Link>
          </li>
          <li>
            <Link to="/mypage/current">
              <span className="mypageMenue">최근 상품목록</span> 
            </Link>
          </li>
          <li className="mypageNavLine"></li>
          <li className="mypageNavTitle">혜택관리</li>
          <li>
            <Link to="/mypage/mileage">
              <span className="mypageMenue">적립금 내역</span>
            </Link>
          </li>
          <li>
            <Link to="/mypage/membership"><span className="mypageMenue">등급별 혜택</span></Link>
          </li>
          <li className="mypageNavLine"></li>
          <li className="mypageNavTitle">회원정보관리</li>
          <li>
            <Link to="/mypage/userinformation">
            <span className="mypageMenue">내 정보</span></Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default MypageNav;
