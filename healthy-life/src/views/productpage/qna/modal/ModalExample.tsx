import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './ModalExample.css';

ReactModal.setAppElement('#root');

const ModalExample: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="modal-container">
      <button onClick={openModal} className="openModalBtn">문의하기</button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className='qnaModalTotal'>
        <h2>문의하기</h2>
          <textarea placeholder='문의 내용을입력하세요.'/>
        <div className='modalBtn'>
        <button onClick={closeModal} className="commandModalBtn">취소하기</button>
        <button
        className='commandModalBtn'
        >등록하기</button>
        </div>
        <div className='qnaFooter'>
          <h5>상품 Q&A 작성 유의사항</h5>
          <p>
            상품 Q&A는 상품 및 상품 구매 과정(배송, 반품/취소, 교환/변경)에 대해 판매자에게 문의하는 ​게시판입니다.
            상품 및 상품 구매 과정과 관련 없는 비방/욕설/명예훼손성 게시글 및 상품과 관련 없는 광고글 등 부적절한 게시글 등록 시 글쓰기 제한 및 게시글이 삭제 조치 될 수 있습니다.
            전화번호, 이메일 등 개인 정보가 포함된 글 작성이 필요한 경우 판매자만 볼 수 있도록 비밀글로 문의해 주시기 바랍니다.
            상품에 대한 이용 후기는 리뷰에 남겨 주세요.
          </p>
        </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default ModalExample;
