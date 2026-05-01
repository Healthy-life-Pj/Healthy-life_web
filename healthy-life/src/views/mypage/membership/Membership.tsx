import React from "react";
import "../../../style/membership/membership.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";

function Membership() {
  return (
    <div className="head">
      <h2>멤버십 등급</h2>
      <div className="membershipContainer">
        <div className="gradeContainer">
          <div className="Icon">
            <LooksOneIcon /> <div className="membershipName"><p>독수리</p></div>
          </div>
          <div className="grade">
            <p>60만원 이상 구매</p>
          </div>
        </div>
        <div className="gradeContainer">
          <div className="Icon">
            <LooksTwoIcon /> <div className="membershipName"><p>오골계</p></div>
          </div>
          <div className="grade">
            <p>40만원이상 구매</p>
          </div>
        </div>
        <div className="gradeContainer">
          <div className="Icon">
            <Looks3Icon /> <div className="membershipName"><p>닭</p></div>
          </div>
          <div className="grade">
            <p>20만원 이상 구매</p>
          </div>
        </div>
        <div className="gradeContainer">
          <div className="Icon">
            <Looks4Icon /> <div><p>병아리</p></div>
          </div>
          <div className="grade">
            <p>20만원 미만 구매시</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Membership;
