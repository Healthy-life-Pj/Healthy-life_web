import React, { useEffect, useRef, useState } from "react";
import "../../../style/home/MainBanner.css";
import { useFetcher } from "react-router-dom";

interface MainBannerProps {
  images: string[];
}

const MainBanner: React.FC<MainBannerProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hadleTransitionEnd = () => {
    if (currentIndex === images.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);

      if (sliderRef.current) {
        sliderRef.current.style.transition = "none";
        sliderRef.current.style.transition = "translateX(0)";
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      handleNextClick();
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (
      isTransitioning &&
      currentIndex === images.length &&
      sliderRef.current
    ) {
      sliderRef.current.style.transition = "transform 1s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${
        (currentIndex + 1) * 100
      })`;
    }
  }, [currentIndex, isTransitioning, images.length]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const visibleImages = images.slice(currentIndex, currentIndex + 1);
  if (visibleImages.length < 1) {
    visibleImages.push(...images.slice(0, 1 - visibleImages.length));
  }

  return (
    <div className="bannerImages">
      {visibleImages.map((image, index) => (
        <div
          key={index}
          className="bannerDiv"
          ref={sliderRef}
          onTransitionEnd={hadleTransitionEnd}
        >
          <img
            src={image}
            alt={`banner ${index}`}
            className="mainBannerImages"
          />
          <div className="emptyBox">
            {/* <div className="bannerSlide">
            <img src={images[0]} alt="Slide 0" />
            </div> */}
            <div className="sliderBtnDiv">
              <button className="prevClick" onClick={handlePrevClick}>
                &#10094;
              </button>
              <span className="centerBar">|</span>
              <button className="nextClick" onClick={handleNextClick}>
                &#10095;
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainBanner;
