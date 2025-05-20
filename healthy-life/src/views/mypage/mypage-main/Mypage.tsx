import React, { useState } from "react";
import "../../../style/mypage/MypageMain.css";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

function Mypage() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [productPerpage] = useState<number>(16);

  return (
    <div>
      <div className="myPageConatiner">
        <div className="mypageAllContainer">
          <div className="mypageSuvContainer">
            <h4>나의 주문처리현황</h4>
            <ul className="olderListUlA">
              <li>
                {" "}
                <span className="mypagePrice">0</span>
                <span>결제</span>
              </li>
              <li className="orderArrow">
                <span className="orderArrow">
                  <ArrowForwardIosRoundedIcon />
                </span>
              </li>
              <li>
                <span className="mypagePrice">0</span>
                <span>배송준비중</span>
              </li>
              <li className="orderArrow">
                <span className="orderArrow">
                  <ArrowForwardIosRoundedIcon />
                </span>
              </li>
              <li>
                <span className="mypagePrice">0</span> <span>배송중</span>
              </li>
              <li>
                <span className="orderArrow">
                  <ArrowForwardIosRoundedIcon />
                </span>
              </li>
              <li>
                <span className="mypagePrice">0</span> <span>배송완료</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="orderListCotainer">
          <h4>주문내역</h4>
          <ul className="orderListUl">
            <li>주문내역</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Mypage;
