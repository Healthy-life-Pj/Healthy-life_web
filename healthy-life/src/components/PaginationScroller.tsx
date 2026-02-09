import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemDto, ProductDetailResponseDto } from "../types/dto";
import { Rating } from "@mui/material";
import "../style/home/allProduct.css";
import { useCookies } from "react-cookie";
import CartModal from "./CartModal";
import axios from "axios";
import { CART_PATH, CART_PRODUCT, IMG_PATH, MAIN_APT_PATH, MY_CART, PRODUCT_IMG, WISH_LIST_PATH } from "../constants";

interface PaginationScrollProps {
  products: ProductDetailResponseDto[];
}

const PaginationScroller = ({ products }: PaginationScrollProps) => {
  const navigator = useNavigate();
  const [cartItemData, setCartItemData] = useState<CartItemDto[]>([]);
  const [cookies] = useCookies(["token"]);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClickProductDetail = (
    product: ProductDetailResponseDto | null
  ) => {
    navigator(`/product/productDetail/${product?.pId}`);
  };

  const handleMouseEnter = (index: number) => {
    setActiveProduct(index);
  };
  const handleMouseLeave = () => {
    setActiveProduct(null);
  };

  const openModal = async (pId: number) => {
    setModalIsOpen(true);
    if (!cookies.token) {
      navigator("/login");
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

  const closeModal = () => setModalIsOpen(false);
  

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const unitPrice = (pPrice: number) => {
    return pPrice.toLocaleString();
  };

  const addToWishlist = async (pId: number) => {
    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigator("/login");
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
        }
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


  useEffect(() => {
    setActiveProduct(null);
    setModalIsOpen(false);
  }, [products]);

  return (
    <div className="productContain">
      <div className="productListLine"></div>
      {products.map((product, index) => (
        <div
          key={product.pId ? product.pId : `product-${index}`}
          className="productDiv"
        >
          <div
            className="productImg"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClickProductDetail(product)}
          >
            <img
              src={`${IMG_PATH}${PRODUCT_IMG}/${product.pImgUrl}`}
              alt={product.pName}
              className="allProductImage"
              onClick={() => handleClickProductDetail(product)}
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
            <li>
              <h4>{cutText(product.pName, 11)}</h4>
              <p>{unitPrice(product.pPrice)}원</p>
            </li>
          </ul>
          <div className="productHoverBtnAllDiv">
            {activeProduct === index && (
              <div
              className="cartWishHoverBtn"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              >
                <button
                  className="productHoverBtn"
                  onClick={() => openModal(product.pId)}
                >
                  CART
                </button>
                <button 
                  className="productHoverBtn"
                  onClick={() => addToWishlist(product.pId)}
                >
                  WISH
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <CartModal
        cartItem={cartItemData}
        isOpen={modalIsOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default PaginationScroller;
