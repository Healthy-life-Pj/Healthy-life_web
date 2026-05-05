import React, { useEffect, useState } from "react";
import "../../../style/home/main2.css";
import {
  ProductDetailResponseDto,
  ProductListResponseDto,
} from "../../../types/dto";
import axios from "axios";
import {
  ALL_PRODUCTS,
  AUTH_PATH,
  IMG_PATH,
  MAIN_APT_PATH,
  PRODUCT_IMG,
  PRODUCT_PATH,
} from "../../../constants/api";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [datas, setDatas] = useState<ProductListResponseDto[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${ALL_PRODUCTS}`,
      );

      const responseData = response.data.data;

      const sortedBestItems = responseData.sort(
        (a: ProductDetailResponseDto, b: ProductDetailResponseDto) =>
          b.averageRating - a.averageRating,
      );

      const bestItem = sortedBestItems.slice(0, 9);
      setDatas(bestItem);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? datas.length - 1 : prevIndex - 1,
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === datas.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const visibleProduct = datas.slice(currentIndex, currentIndex + 1);
  if (visibleProduct.length < 1) {
    visibleProduct.push(...datas.slice(0, 1 - visibleProduct.length));
  }

  const handleClickProductDetail = (data: ProductListResponseDto | null) => {
    navigate(`/product/productDetail/${data?.pId}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bannerSlider">
      <button className="bannerPrevButton1" onClick={handlePrevClick}>
        &#10094;
      </button>
      {visibleProduct.map((data, index) => (
        <div
          key={data.pId}
          className="bannerImgDiv"
          onClick={() => handleClickProductDetail(data)}
        >
          <img
            className="bannerImagesljw"
            key={data.pId}
            src={`${IMG_PATH}${PRODUCT_IMG}/${data.pImgUrl}`}
            alt={data.pName}
          />
        </div>
      ))}
      <button className="bannerNextButton1" onClick={handleNextClick}>
        &#10095;
      </button>
    </div>
  );
};

export default Banner;
