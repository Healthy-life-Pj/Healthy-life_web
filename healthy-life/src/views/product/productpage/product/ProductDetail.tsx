import React, { useEffect, useState } from "react";
import "../../../../style/detailProductSlider/productSlider.css";
import "../../../../style/product/productDetail.css";
import ProductTap from "./ProductTap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import axios from "axios";
import {
  AUTH_PATH,
  CART_PATH,
  CART_PRODUCT,
  IMG_PATH,
  MAIN_APT_PATH,
  MY_CART,
  PRODUCT_IMG,
  PRODUCT_PATH,
} from "../../../../constants";
import { useCookies } from "react-cookie";
import { CartItemDto, ProductDetailResponseDto } from "../../../../types/dto";
import CartModal from "../../../../components/CartModal";

const ProductDetail = () => {
  const { pId } = useParams();
  const [cartItemData, setCartItemData] = useState<CartItemDto[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [cookies] = useCookies(["token"]);
  const [product, setProduct] = useState<ProductDetailResponseDto | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigator = useNavigate();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const fetchData = async (id: string) => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}/${id}`
      );
      const data = response.data.data;
      setProduct(data);
      setRating(data?.averageRating ?? 0);
      if (!response.data.data) {
        navigator(-1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async () => {
    if (!cookies.token) {
      navigator("/login");
      alert("로그인이 필요합니다.");
    }
    try {
      await axios.post(
        `${MAIN_APT_PATH}${CART_PATH}${CART_PRODUCT}/${pId}`,
        {
          productQuantity: quantity,
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
      openModal();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pId) {
      fetchData(pId);
    }
  }, [pId]);

  const handleCartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(value);
  };

  const priceUnit = (price: number) => {
    return price.toLocaleString();
  };

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  if (!product) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="prodcutDetailPageContainer">
      <div className="productDetailPage">
        <div className="divProductImage">
          <img
            className="productImgInDiv"
            src={`${IMG_PATH}${PRODUCT_IMG}/${product.pImgUrl}`}
            alt={product?.pName}
          />
        </div>
        <div className="productData">
          <div className="productNameRating">
            <p>{cutText(product.pName, 8)}</p>
            <Box
              sx={{
                "& > legend": { mt: 4 },
                display: "flex",
                justifyContent: "start",
              }}
            >
              <Rating
                name="half-rating-read"
                value={rating}
                precision={0.5}
                readOnly
              />
            </Box>
          </div>
          <div className="productDataLine"></div>
          <div className="producPriceDiv">
            <div className="productPriceBox">
              <div>가격 :</div>
              <div>{priceUnit(product?.pPrice)} 원</div>
            </div>
            <div>
              <label>주문수량 : </label>
              <input
                className="countInput"
                type="number"
                name="quantit"
                value={quantity}
                min={1}
                max={product?.pStockStatus}
                onChange={handleCartChange}
              />
            </div>
          </div>
          <div className="productDataLine"></div>
          <div className="deliveryMethod">
            <div className="totalPrieDiv">
              <div className="totalPriceD">총 상품 금액 :</div>
              <span className="totalPriceSpan">
                {priceUnit(product?.pPrice * quantity)}
                <span> 원</span>
              </span>
            </div>
            <div className="deliveryKind">일반배송 | 2000원</div>
            <div className="productDetailbutton">
              <div className="putinCartButton">
                <button className="wishCartBtn" onClick={addToCart}>
                  CART
                </button>
                <button
                  className="wishCartBtn"
                  onClick={() => navigator("/myPage/wishlist")}
                >
                  WISH
                </button>
              </div>
              <button
                onClick={() => navigator(`/order/${pId}/${quantity}`)}
                className="orderButton"
              >
                주문
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProductTap data={product} />
      <CartModal
        cartItem={cartItemData}
        isOpen={modalIsOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProductDetail;
