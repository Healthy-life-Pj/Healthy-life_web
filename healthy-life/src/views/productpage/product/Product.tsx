import React, { useState } from 'react'
import '../../../style/detailProductSlider/productSlider.css'
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

interface productImages{
  images: string[]
}


const Product: React.FC<productImages> = ({images}) => {
  const [value, setValue] = React.useState<number | null>(4);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length -1 : prevIndex -1 ));
  }

  const handleNextClick = () => {
    setCurrentIndex((prevIndex)=> (prevIndex === images.length -1 ? 0 : prevIndex + 1));
  }


  const visibleImages = images.slice(currentIndex, currentIndex + 4);
  if(visibleImages.length < 4){
    visibleImages.push(...images.slice(0, 4 -visibleImages.length));
  }

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <div className='prodcutDetailPageContainer'>
      <div className='productDetailPage'>
        
        <div className='productImage'>
          <img src='https://cdn.pixabay.com/photo/2018/09/23/09/31/smoothie-3697014_1280.jpg' alt="상세페이지 상품 이미지"/>
        </div>


        <div className='productData'>
          <h3>유기농 야채 스무디 500ML</h3>  
          <br />
          <div className='productGuide'>
            <p>
            정기배송 신청 구매 시에만 정기 배송 가능한 상품입니다. 내가 원하는 주기에 맞추어 정기배송으로 편리하게 만나보세요 !!
            </p>
          </div>      
        <br />
        <Box
      sx={{
        '& > legend': { mt: 4 },
        display: 'flex',
        justifyContent: 'start'
      }}
    >
    <Rating name="read-only" value={value} readOnly />
    <p style={{color: 'gray', marginLeft: '5px'}}>4.2</p>
    <p style={{marginLeft: '5px'}}>(62)</p>
    </Box>
        <h1>12,000원</h1>
        <br />
          <hr />
          <br />
        <div className='deliveryMethod'>
          <p>배송방법</p>
          
          <div className='deliveryKind'>
            <p> <span className='regularDelivery'>정기배송</span>  |  2500원 <span className='freeDelivery'>12000원 이상 무료배송</span> </p>
            <p>일반배송 | 2500원  |  12000원 이상 무료 배송</p>
          </div> 
          </div>
          <br />
        <hr />
        <br />
        <div className='announcement'>
          <p>공지사항</p>

          <div className='announcementContents'>
          <p>정기배송과 일반구매 모두 가능한 상품입니다</p>
          <p>정기배송 구매시 적립금과 쿠폰사용 불가하며,</p>
          <p>적립&증정 사은품은 회차별 자동결제 시점에 따라 변동될 수 있습니다.</p>
        </div>
          </div>
        <br />
        <hr />
        <br />
        <span style={{color: 'gray'}}>옵션선택</span>
        <br />
        <select name="productOption" id="option" >
          <option value="선택">옵션</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <br />
        <p style={{fontSize: '16px'}}>총 상품 금액 <span  style={{fontSize: '32px', fontWeight: 'bold'}}>12,000</span>원</p>
        <br />
        <div className='productDetailbutton'>
          
          <div className='putinCartButton'>
          <button onClick={openModal} >장바구니</button>
          <Link to={'/myPage/wishlist'}><button >WISH</button></Link>
          </div>
          <br />
          <div className='orderButton'>
          <Link to={'/payment'}><button >주문</button></Link>
          </div>
        </div>

        </div>


        <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modalContent"
        overlayClassName="modalOverlay"
        >

          <div className='modal'>
            <h2>장바구니(모달창)</h2>
              <br />
              <br />
              <br />
          <div className='cartModalContainer'>
            
              <button className='prevButton' onClick={handlePrevClick}>&#10094;</button>
            <div className='modalImages'>
              {visibleImages.map((image, index) => (
          <div key={index} className='relatedModalImage'>
            <img src={image} alt={`slide ${index}`} />
          </div>
        ))}
        <button className='nextButton' onClick={handleNextClick}>&#10095;</button>
            </div>
          



          </div>

          <br />
          <br />
          
          <div className='modalButtonContainer'>
          <Link to={'/payment'}> <button>바로주문</button></Link>
          <Link to={'/cart'}><button>장바구니 이동</button></Link>
          <button onClick={closeModal}>쇼핑계속하기</button>
          </div>
          
          </div>

        </ReactModal>
      </div>
      <br />
      <br />


      


    </div>
  )
}

export default Product