import React, { useEffect, useState } from "react";
import "../../../style/home/main2.css";
import { CartItemDto, ProductDetailResponseDto } from "../../../types/dto";
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
} from "../../../constants";
import CartModal from "../../../components/CartModal";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function BestItemApp() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [cartItemData, setCartItemData] = useState<CartItemDto[]>([]);
  const [modalOpen, setModalIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [datas, setDatas] = useState<ProductDetailResponseDto[]>([]);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetailResponseDto | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${ALL_PRODUCTS}`
      );

      const responseData = response.data.data;

      const sortedBestItems = responseData.sort(
        (a: ProductDetailResponseDto, b: ProductDetailResponseDto) =>
          b.averageRating - a.averageRating
      );

      const bestItem = sortedBestItems.slice(0, 9);
      setDatas(bestItem);
    } catch (error) {
      console.error("error");
    }
  };

  const handleMouseEnter = (index: number) => {
    setActiveProduct(index);
  };

  const hanldeMouseLeave = () => {
    setActiveProduct(null);
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

  const visibleImages = datas.slice(currentIndex, currentIndex + 3);
  if (visibleImages.length < 3) {
    visibleImages.push(...datas.slice(0, 3 - visibleImages.length));
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bestItemSlider">
      <div className="bestItemImagesContainer">
        {visibleImages.map((data, index) => (
          <div key={index} className="bestItemImageMap">
            <img
              src={`${IMG_PATH}${PRODUCT_IMG}/${data.pImgUrl}`}
              alt={data.pName}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => hanldeMouseLeave}
            />
            <div
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={hanldeMouseLeave}
            >
              {activeProduct === index && (
                <div className="allProductHoverBtn1">
                  <button onClick={() => openModal(data.pId)}>cart</button>
                  <button>Wish</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <CartModal
          cartItem={cartItemData}
          isOpen={modalOpen}
          onClose={closeModal}
        />
      )}
      <div className="bestItemButtonContainer1">
        <button className="mainPrevButton" onClick={handlePrevClick}>
          &#10094;
        </button>
        <button className="mainNextButton" onClick={handleNextClick}>
          &#10095;
        </button>
      </div>
    </div>
  );
}
