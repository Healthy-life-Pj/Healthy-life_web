import React, { useState } from 'react'
import { seaFoodProduct } from './SeaFood';
import '../../../style/home/productList.css';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';

const SeaFoodProductsLayout: React.FC<{ products: seaFoodProduct[] }> = ({ products }) => {
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [modalOpen, setmodalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);



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
  <div className="allProductImageContainer1">
    {products.map((product, index) => (
      <div key={product.id} className="allProductContain1">
        <Link to={"/productdetail"}>
          <img
            src={product.image}
            alt={product.name}
            className="allProductImage1"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          />
          <h4>{product.name}</h4>
          <p>price: 30000만원</p>
        </Link>
        <div
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          {activeProduct === index && (
            <div className="allProductHoverBtn1">
              <button onClick={openModal}>cart</button>
              <button>WISH</button>
            </div>
          )}
        </div>
      </div>
    ))}

    <ReactModal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      className="modalContianerCart1"
      overlayClassName="modalOverlay1"
    >
      <div className="modal1">
        <h2>장바구니</h2>
          <div className="modalImages1">
        <div className="modalContainerCart1">
          <div className='modalFlexBox'>
          <button className="prevButton1" onClick={handlePrevClick}>
            &#10094;
          </button>
            {visibleProducts.map((product) => (
              <div key={product.id} className="relatedModalImage1">
                <img src={product.image} alt={product.name} />
                <p>{product.name}</p>
              </div>
            ))}
            <button className="nextButton1" onClick={handleNextClick}>
              &#10095;
            </button>
          </div>
          
            
          <div className="modalButtonContainer1">
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
      </div>
    </ReactModal>
  </div>
);
};
export default SeaFoodProductsLayout;