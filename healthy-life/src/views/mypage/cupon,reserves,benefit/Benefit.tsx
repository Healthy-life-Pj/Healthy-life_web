import React from "react";
import "../../../style/benefit/benefit.css";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";
import Looks6Icon from "@mui/icons-material/Looks6";

function Benefit() {
  return (
    <div className="head">
      <h2>멤버십 등급</h2>
      <div className="benefitContainer">
        <div className="gradeContainer">
          <div className="Icon">
            <LooksOneIcon /> <div className="membershipName">독수리</div>
          </div>
          <div className="grade">
            <p>60만원 이상 구매</p>
          </div>
        </div>
        <div className="gradeContainer">
          <div className="Icon">
            <LooksTwoIcon /> <div>오골계</div>
          </div>
          <div className="grade">
            <p>40만원이상 구매</p>
          </div>
        </div>
        <div className="gradeContainer">
          <div className="Icon">
            <Looks3Icon /> <div>닭</div>
          </div>
          <div className="grade">
            <p>20만원 이상 구매</p>
          </div>
        </div>
        <div className="gradeContainer">
          <div className="Icon">
            <Looks4Icon /> <div>병아리</div>
          </div>
          <div className="grade">
            <p>20만원 미만 구매시</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Benefit;
