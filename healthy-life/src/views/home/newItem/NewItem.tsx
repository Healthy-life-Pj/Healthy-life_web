import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ALL_PRODUCTS,
  AUTH_PATH,
  CART_PATH,
  CART_PRODUCT,
  IMG_PATH,
  MAIN_APT_PATH,
  MY_CART,
  PRODUCT_IMG,
  PRODUCT_PATH,
  WISH_LIST_PATH,
} from "../../../constants/api";
import { CartItemDto, ProductDetailResponseDto } from "../../../types/dto";
import "../../../style/home/allProduct.css";
import "../../../style/home/main1.css";
import { Rating } from "@mui/material";
import CartModal from "../../../components/CartModal";
import { useCookies } from "react-cookie";

const NewItemSlider = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [cartItemData, setCartItemData] = useState<CartItemDto[]>([]);
  const [datas, setDatas] = useState<ProductDetailResponseDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${ALL_PRODUCTS}`,
      );
      const responseData = response.data.data;

      const sortedNewItems = responseData.sort(
        (a: ProductDetailResponseDto, b: ProductDetailResponseDto) =>
          b.pId - a.pId,
      );

      const newItems = sortedNewItems.slice(0, 9);

      setDatas(newItems);
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
      prevIndex === 0 ? datas.length - 1 : prevIndex - 1,
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === datas.length - 1 ? 0 : prevIndex + 1,
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
        },
      );

      const response = await axios.get(
        `${MAIN_APT_PATH}${CART_PATH}${MY_CART}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        },
      );
      setCartItemData(response.data.data.cartItem || []);
      setModalIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => setModalIsOpen(false);

  const addToWishlist = async (pId: number) => {
    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${MAIN_APT_PATH}${WISH_LIST_PATH}/products/${pId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        },
      );
      alert("위시리스트에 추가되었습니다.");
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("이미 위시리스트에 추가된 상품입니다.");
      } else {
        console.error(error);
        alert("위시리스트 추가에 실패했습니다.");
      }
    }
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
    product: ProductDetailResponseDto | null,
  ) => {
    navigate(`/product/productDetail/${product?.pId}`);
  };

  return (
    <div className="sliderContainer">
      <div className="h3Container">
        <h3>새로운 상품</h3>
        <div className="slider">
          <button className="prev" onClick={handlePrevClick}>
            &#10094;
          </button>
          <div className="sliderImagesContainer">
            {visibleProduct.map((product, index) => (
              <div key={product.pId} className="sliderDiv">
                <div
                  className="productSliderImg"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClickProductDetail(product)}
                >
                  <img
                    src={`${IMG_PATH}${PRODUCT_IMG}/${product.pImgUrl}`}
                    alt={product.pName}
                    className="allProductImage"
                  />
                </div>
                <div className="productLine"></div>
                <ul
                  className="productContent"
                  onClick={() => handleClickProductDetail(product)}
                >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(product.pId);
                      }}
                    >
                      CART
                    </button>
                    <button
                      className="sliderProductHoverBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product.pId);
                      }}
                    >
                      WISH
                    </button>
                  </div>
                )}
              </div>
            ))}
            <CartModal
              cartItem={cartItemData}
              isOpen={modalIsOpen}
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
