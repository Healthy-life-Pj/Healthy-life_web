import React from "react";
import "../../../style/home/MainBanner.css";

const MainBanner = () => {
  return(
  <div className="mainBannerVideoDiv">
    <video autoPlay loop muted className="mainBannerVideo">
      <source src="/videos/healthy.mp4" type="video/mp4"></source>
    </video>
  </div>
  );
};
export default MainBanner;
