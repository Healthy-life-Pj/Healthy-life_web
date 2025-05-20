import React, { useState } from 'react'
import '../../../style/home/main2.css'
import { Link } from 'react-router-dom';
import ReactModal from 'react-modal';
import { Slide } from '@mui/material';

interface bestItemSliderProps {
  images: string[];
}


export default function BestItem(images: bestItemSliderProps )  {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setActiveProduct(index);
    };

    const hanldeMouseLeave = () => {
      setActiveProduct(null);
    };


    const openModal = () => {
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
    };


    const handlePrevClick = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.images.length -1 : prevIndex -1) );
    };


    const handleNextClick = () => {
      setCurrentIndex((prevIndex) => (prevIndex === images.images.length -1 ? 0: prevIndex +1 ));
    };


    const visibleImages = images.images.slice(currentIndex, currentIndex + 3);
    if(visibleImages.length < 3) {
      visibleImages.push(...images.images.slice(0, 3 - visibleImages.length));
    };


  return (
    <div className='bestItemSlider'>

      <div className='bestItemImagesContainer'>
        {visibleImages.map((image, index) => (
          <div key={index} className='bestItemImageMap'>
            <Link to={"/productdetail"}>
            <img src={image}
            alt={`Slide ${index}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => hanldeMouseLeave}
            />
            <h4>product</h4>
            <p>price: 30000원</p>
            </Link>
            <div
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => hanldeMouseLeave}
            >
              {activeProduct === index && (
                <div
                className='allProductHoverBtn1'
                >
                <button onClick={openModal}>cart</button>
                <button>Wish</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className='bestItemButtonContainer1'>
        <button className='mainPrevButton' onClick={handlePrevClick}>&#10094;</button>
        <button className='mainNextButton' onClick={handleNextClick}>&#10095;</button>
      </div>   
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
            {visibleImages.map((image, index) => (
              <div key={index} className="relatedModalImage1">
                <img src={image} alt={`Slide ${index}`} />
                <p>product {index}</p>
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
  )
}
