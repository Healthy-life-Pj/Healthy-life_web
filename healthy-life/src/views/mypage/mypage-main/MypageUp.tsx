import React from "react";
import '../../../style/mypage/MypageMain.css'
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

function MypageUp() {
  return (
    <div className="mypageUpContainer">
      <div className="mypageMainContainer">
        <ul>
          <li>
            <AccountCircleIcon />
            <br />
            회원이름
          </li>
          <li className="myshoppingLine"></li>
          <li>
            <MilitaryTechIcon />
            <br />
            회원등급
          </li>
          <li className="myshoppingLine"></li>
          <li>
            <CardMembershipIcon />
            <br />
            멤버십
          </li>
          <li className="myshoppingLine"></li>
          <li>
            <MonetizationOnIcon />
            <br />
            <span>0원</span>
            <br />
            적립금
          </li>
          <li className="myshoppingLine"></li>
          {/* <li><PercentSharpIcon /><br /><span>0개</span><br />쿠폰 </li> */}
          {/* <li className='myshoppingLine'></li> */}
          <li>
            <LocalShippingIcon />
            <br />
            <span>0개</span>
            <br />
            주문
          </li>
        </ul>
      </div>
    </div>      
  );
}

export default MypageUp;
