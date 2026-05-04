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
            <Link to="/my-page/order">
              <span className="mypageMenue">주문내역 조회</span>
            </Link>
          </li>
          <li>
            <Link to="/my-page/shipping">
              <span className="mypageMenue">배송조회</span>
            </Link>
          </li>
          <li className="my-pageNavLine"></li>
          <li className="mypageNavTitle">활동관리</li>
          <li>
            <Link to="/my-page/my-review">
              <span className="mypageMenue">후기</span>
            </Link>
          </li>
          <li>
            <Link to="/my-page/wishlist">
              <span className="mypageMenue">위시리스트</span>
            </Link>
          </li>
          <li>
            <Link to="/my-page/my-qna">
              <span className="mypageMenue">나의 qna</span>
            </Link>
          </li>
          <li className="mypageNavLine"></li>
          <li className="mypageNavTitle">회원정보관리</li>
          <li>
            <Link to="/my-page/userinformation">
              <span className="mypageMenue">내 정보</span>
            </Link>
          </li>
          <li>
            <Link to="/my-page/physique">
              <span className="mypageMenue">체질/기호 태그</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default MypageNav;
