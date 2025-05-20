import React, { useState } from 'react'
import ReactModal from 'react-modal';
import "../../style/nonmember/nonmemberModal.css"
import "../../style/nonmember/nonMember.css"


interface userData {
  name: string;
  orderNumber: string | number;
  password: string | number
}



function NonMember() {

  let initialValue = {
    name: '',
    orderNumber: '',
    password: ''
  }

  const [nonMemberOrder, setNonMemberOrder] = useState<userData>(initialValue);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const{name, orderNumber, password} = nonMemberOrder;


  const openModal = (e: React.FormEvent) => {
    e.preventDefault()

    setModalIsOpen(true);
  }


  const closeModal = () => {
    setModalIsOpen(false)
    setNonMemberOrder(initialValue);
  }

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  
    const {name, value} = e.target

    setNonMemberOrder({

      ...nonMemberOrder,

      [name]: value

    });

  };

  return (
    <div className='nonMemberContainer'>
        <br />
        <br />
        <h2>주문조회</h2>
        <br />
      
        <form className='nonMemberForm'>
        <div className='nonMemberFormContainer'>
          <div className='nonMemberData'>
          <p>주문자이름 *</p>
          <br />
          <p>주문번호 *</p>
          <br />
          <p>비회원주문 비밀번호 *</p>
          </div>
    

        <div className='nonMemberInput'>
          <input type="text" name='name'  value={name} onChange={inputHandler}/>
          <br />
          <input type="text" name='orderNumber' value={orderNumber} onChange={inputHandler}/>
          <br />
          <input type="text" name='password' value={password} onChange={inputHandler}/>
        </div>



        </div>
        </form>
        <br />

        <div className='nonMemberButton'>
        <button  className="openModalButton" onClick={openModal}>조회</button>
        </div>
        
          <br />
          
          <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modalContent"
          overlayClassName="modalOverlay"
          >
            <div>
                <h2>비회원 주문처리 현황</h2>

                <div>
                  {!name || !orderNumber || !password ? 
                  <div>
                    <br />
                    이름, 주문번호 또는 비회원주문 비밀번호를 잘 못 입력하셨습니다.
                    <br />
                    <br />
                  </div>  
                  : 
                  <div>
                    <br />
                    <h3>주문내역</h3>
                    <br />
                    <div className='orderList'>



                    <div className='orderListImages'>
                        <img src="https://cdn.pixabay.com/photo/2017/08/25/11/10/plum-2679782_1280.jpg" alt="비회원주문상품이미지1" />
                        <br />
                      <div>
                        <span>주문번호: {orderNumber}</span>
                        <br />
                        <span>가격: 20000원</span>
                        <br />
                        <span>수량: 1</span>
                      </div>
                  
                    </div>
                      <br />
                      <br />
                    <div className='orderListInformation'>
                    <img src="https://cdn.pixabay.com/photo/2016/03/05/19/02/vegetables-1238252_1280.jpg" alt="비회원주문상품이미지2"/>
                    <br />
                    <div>
                      <span>주문번호: {orderNumber} </span>
                      <br />
                      <span>가격: 20000원</span>
                      <br />
                      <span>수량: 1</span>
                    </div>
                    </div>



                    </div>

                  </div>
                }
                </div>
              <button onClick={closeModal} className='closeModalButton'>닫기</button>
            </div>
          </ReactModal>
    </div>
  )
}

export default NonMember