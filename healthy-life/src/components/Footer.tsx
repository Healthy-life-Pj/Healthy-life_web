import React from "react";
import "../style/componentStyle/footerStyle.css";
export default function Footer() {
  return (
    <div className="AllFootercontainer">
      <div className="footerTotalContainer">
        <div className="footerContainer">
          <h5>
            Healthy-life
            company
          </h5>
          <div className="companyInformation">
            <ul>
              <li>
                <strong>COMPANY</strong>: 주식회사 Healthy-Life
              </li>
              <li>
                <strong>CEO</strong>: --
              </li>
              <li>
                <strong>PHONE</strong>: 070-3344-2212
              </li>
              <li>
                <strong>E-MAIL</strong>:helthylife@naver.com
              </li>
              <li>
                <strong>BUSINESS LICENCE</strong>: 111-55533-666444
              </li>
              <li>
                <strong>ADRESS</strong>: 부산광역시 부산진구 중앙로 113-1 4층
              </li>
            </ul>
          </div>

          <div className="companyTime">
            <ul>
              <li>
                <h2>운영시간</h2>
              </li>
              <li>
                <strong>평일</strong>: 09:00 - 17:00
              </li>
              <li>
                <strong>점심</strong> 12:00 - 13:00
              </li>
              <li>
                <strong>토요일 일요일 공휴일 휴무</strong>
              </li>
            </ul>
          </div>
        </div>

        <p className="copyRight">
          COPYRIGHT (C) 2024 Healthy-Life ALL RIGHTS REVERVED /
        </p>
      </div>
    </div>
  );
}
