import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductDetailResponseDto } from "../types/dto";
import { Rating } from "@mui/material";
import "../style/home/allProduct.css"
import { useCookies } from "react-cookie";
import CartModal from "./CartModal";

interface PaginationScrollProps {
  products: ProductDetailResponseDto[];
}

const PaginationScroller = ({ products }: PaginationScrollProps) => {
  const navigator = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClickProductDetail = (product: ProductDetailResponseDto | null) => {
    navigator(`/product/productDetail/${product?.pId}`);
  };

  const handleMouseEnter = (index: number) => {
    setActiveProduct(index);
  };
  const handleMouseLeave = () => {
    setActiveProduct(null);
  };

  const openModal = () =>{
    setModalIsOpen(true);
    if (!cookies.token) {
      navigator("/login");
      alert("로그인이 필요합니다.");
    }
  } 
    
  const closeModal = () => setModalIsOpen(false);

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const unitPrice = (pPrice: number) => {
    return pPrice.toLocaleString();
  }

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
                src={product.pImgUrl}
                alt={product.pName}
                className="allProductImage"
                onClick={() => handleClickProductDetail(product)}
              />
            </div>
            <div className="productLine"></div>
              <ul className="productContent"
              onClick={() => handleClickProductDetail(product)}
              >
                <li>
                  <h4>{cutText(product.pName, 11)}</h4>
                  <p>{unitPrice(product.pPrice)}원</p>
                </li>
                <li>
                  <Rating
                    name="half-rating-read"
                    defaultValue={product?.averageRating}
                    precision={0.5}
                    readOnly
                  />
                </li>
              </ul>
              <CartModal product={product} isOpen={modalIsOpen} onClose={closeModal}/>
          <div
          className="productHoverBtnAllDiv"
          >
            {activeProduct === index && (
              <div className="cartWishHoverBtn"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}>
                <button className="productHoverBtn" onClick={openModal}>CART</button>
                <button className="productHoverBtn" >WISH</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaginationScroller;
