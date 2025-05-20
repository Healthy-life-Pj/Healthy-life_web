import { useState } from "react";
import "../../../style/home/allProduct.css";
import { Link } from "react-router-dom";
import ReactModal from "react-modal";
import "../../../style/modal/cartModal.css";
import { ProductDetail } from "../../../types";
import axios from "axios";

const Chicken: React.FC<{ products: ProductDetail[] }> = ({ products }) => {
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [modalOpen, setmodalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailProduct, setdetailProduct] = useState<ProductDetail | null>(
    null
  );

  const openDetail = async (productId: number) => {
    try {
      const item = products.find((item) => item.productId === productId);
      if (item) {
        await axios.put(`http://localhost:3001/Product/${productId}`); // 서버에 업데이트 요청
      }
    } catch (error) {
      console.error("조회수 업데이트 중 오류 발생:", error);
    }
    // 조회수 증가 함수
  };

  // 버튼호버 함수
  const handleMouseEnter = (index: number) => {
    setActiveProduct(index);
  };
  const handleMouseLeave = () => {
    setActiveProduct(null);
  };

  // 모달창 함수
  const openModal = () => {
    setmodalOpen(true);
  };
  const closeModal = () => {
    setmodalOpen(false);
  };

  // 방향 버튼
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + 4);
  if (visibleProducts.length < 4) {
    visibleProducts.push(...products.slice(0, 4 - visibleProducts.length));
  }

  return (
    <div className="allProductImageContain">
      {products.map((product, index) => (
        <div
          key={product.productId}
          className="allProductContain"
          onClick={() => openDetail(product.productId)} // 클릭 시 조회수 증가 함수 호출
        >
          <Link to={"/productdetail"}>
            <div
              className="imgDiv"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="allProductImage"
              />
            </div>
            <div className="productLine"></div>
            <div>
              <ul className="productContent">
                <li>
                  <h4>{product.name}</h4>
                  <p>{product.price}원</p>
                </li>
                <li>
                  <p>{product.category}</p>
                  <p>{product.productType}</p>
                </li>
              </ul>

              <p></p>
            </div>
          </Link>
          <div
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {activeProduct === index && (
              <div className="allProductHoverBtn">
                <button onClick={openModal}>CART</button>
                <button>WISH</button>
              </div>
            )}
          </div>
        </div>
      ))}

      <ReactModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="modalContianerCart"
        overlayClassName="modalOverlay"
      >
        <div className="modal">
          <h2>장바구니</h2>
          <div className="modalContainerCart">
            <button className="prevButton" onClick={handlePrevClick}>
              &#10094;
            </button>
            <div className="modalImages">
              {visibleProducts.map((product) => (
                <div key={product.productId} className="relatedModalImage">
                  <img src={product.imageUrl} alt={product.name} />
                  <p>{product.name}</p>
                </div>
              ))}
              <button className="nextButton" onClick={handleNextClick}>
                &#10095;
              </button>
            </div>

            <div className="modalButtonContainer">
              <Link to={"/payment"}>
                {" "}
                <button>바로주문</button>
              </Link>
              <Link to={"/cart"}>
                <button>장바구니 이동</button>
              </Link>
              <button onClick={closeModal}>쇼핑계속하기</button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Chicken;
