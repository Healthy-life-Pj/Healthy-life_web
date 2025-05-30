import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ALL_PRODUCTS,
  AUTH_PATH,
  CART_PATH,
  CART_PRODUCT,
  MAIN_APT_PATH,
  MY_CART,
  PRODUCT_PATH,
} from "../../../constants";
import { CartItemDto, ProductDetailResponseDto } from "../../../types/dto";
import "../../../style/home/main1.css";
import { Rating } from "@mui/material";
import { Shuffle } from "@mui/icons-material";
import CartModal from "../../../components/CartModal";
import { useCookies } from "react-cookie";

const NewItemSlider = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [cartItemData, setCartItemData] = useState<CartItemDto[]>([]);
  const [datas, setDatas] = useState<ProductDetailResponseDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [modalOpen, setModalIsOpen] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${ALL_PRODUCTS}`
      );
      const data = response.data.data;
      const shuffled = data.sort(() => Math.random() - 0.5);
      setDatas(shuffled.slice(0, 9));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMouseEnter = (index: number) => {
    setActiveProduct(index);
  };
  const handleMouseLeave = () => {
    setActiveProduct(null);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? datas.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === datas.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = async (pId: number) => {
    setModalIsOpen(true);
    if (!cookies.token) {
      navigate("/login");
      alert("로그인이 필요합니다.");
    }
    try {
      await axios.post(
        `${MAIN_APT_PATH}${CART_PATH}${CART_PRODUCT}/${pId}`,
        {
          productQuantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );

      const response = await axios.get(
        `${MAIN_APT_PATH}${CART_PATH}${MY_CART}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      setCartItemData(response.data.data.cartItem || []);
      setModalIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const visibleProduct = datas.slice(currentIndex, currentIndex + 3);
  if (visibleProduct.length < 3) {
    visibleProduct.push(...datas.slice(0, 3 - visibleProduct.length));
  }

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const handleClickProductDetail = (
    product: ProductDetailResponseDto | null
  ) => {
    navigate(`/product/productDetail/${product?.pId}`);
  };

  return (
    <div className="sliderContainer">
      <div className="h3Container">
        <h3>오늘의 추천템</h3>
        <div className="slider">
          <button className="prev" onClick={handlePrevClick}>
            &#10094;
          </button>
          <div className="sliderImagesContainer">
            {visibleProduct.map((product, index) => (
              <div
                key={product.pId}
                className="sliderDiv"
                onClick={() => handleClickProductDetail(product)}
              >
                <div
                  className="productSliderImg"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={product.pImgUrl}
                    alt={product.pName}
                    className="allProductImage"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
                <div className="productLine"></div>
                <ul className="productContent">
                  <li>
                    <Rating
                      name="half-rating-read"
                      defaultValue={product?.averageRating}
                      precision={0.5}
                      readOnly
                      style={{ fontSize: "13px" }}
                    />
                  </li>
                  <li className="productContentLi">
                    <h4>{cutText(product.pName, 11)}</h4>
                    <p>{product.pPrice.toLocaleString()}원</p>
                  </li>
                </ul>
                {activeProduct === index && (
                  <div
                    className="sliderCartWishHoverBtn"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className="sliderProductHoverBtn"
                      onClick={() => openModal(product.pId)}
                    >
                      CART
                    </button>
                    <button className="sliderProductHoverBtn">WISH</button>
                  </div>
                )}
              </div>
            ))}
            <CartModal
              cartItem={cartItemData}
              isOpen={modalOpen}
              onClose={closeModal}
            />
          </div>
          <button className="next" onClick={handleNextClick}>
            &#10095;
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewItemSlider;
