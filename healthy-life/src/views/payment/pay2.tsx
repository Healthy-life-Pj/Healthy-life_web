import React, { useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Pay2() {
  const[isOpen, setIsOpen] = useState<boolean>(false)


  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='pay2Container'>
      <div className='payInformation'>
      <h3>결제 정보</h3>
          <br />
          <span>상품금액</span>
          <br />
          <br />
          <span>할인 금액</span>
          <br />
          <br />
          <span>배송비</span>
          <br />
          <br />
          <span>총 결제 금액</span>
          <br />
          <br />
          <div className='checkBoxFlexBox'>
          <Checkbox {...label}/>
          <span>구매약관조건 동의</span>
          </div>
          <br />
          <br />
          <button onClick={openModal}>결제하기</button>
      </div>
          
          <ReactModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          className='modalContent'
          overlayClassName='modalOverlay'
          >
            <div className='paymentModalFlexBox'>
              <br />
              <br />
            <h2>결제가 완료되었습니다.</h2>
            <br />
            <br />
            <Link to={'/'} ><button onClick={closeModal}className='paymentModalCloseButton'>닫기</button></Link>
            </div>
          </ReactModal>
        </div>



  )
}

export default Pay2