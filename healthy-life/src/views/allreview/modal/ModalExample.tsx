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
      <button onClick={openModal} className="open-modal-button">Open Modal</button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Modal Title</h2>
        <p>This is the content of the modal</p>
        <button onClick={closeModal} className="close-modal-button">Close Modal</button>
      </ReactModal>
    </div>
  );
};

export default ModalExample;
