import { ProductProps } from './AllReview';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../../style/home/AllReview.css'
import { useState } from 'react';
import ReactModal from 'react-modal';

const AllProductList =(products:ProductProps[])  => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reviews, setReviews] = useState<ProductProps | null>(null);
  
  const openModal = (id: number) => {
    const product = products.find(product => product.id === id);
    if (product) {
      setReviews(product);
      setModalIsOpen(true);
    }
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
    setReviews(null);
  };  

  
  return (
    <div className='reviewImageContainer'>
      <div className="allProductImageList">
      {products.map(product => (
        <div onClick={() => openModal(product.id)} className='reviewBox' key={product.id}>
          <img src={product.image} alt={product.title} />
          <div className='productInform'>
          <h5>{product.title}</h5>
          <div className='reveiwInfoDiv'>
          <span className='allrevieprofile'><AccountCircleIcon/></span>
          <p className='reviewP'>{product.id} . {product.date}</p>
          </div>
          <div className='reviewContent'>
          <pre>{product.content}</pre>
          </div>
          </div>
          </div>
      ))}

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
        >
      <h2>후기</h2>
      <div className='reveiwModal'>
        {reviews ? (
          <div>
            <img 
            src={reviews.image} 
            alt={reviews.title} 
            className='modalImage'/>
            <div className='reviewModalInfpo'>
            <h5>{reviews.title}</h5>
            <div className='countInfo'>
            <AccountCircleIcon/> 
            <p> {reviews.id} | {reviews.date} </p>
            </div>
            <pre>{reviews.content}</pre>
          </div>
          </div>
        ) : (
          <p>Loading Post</p>
        )}
      <button onClick={closeModal} className="closeReviewModalBtn">후기 닫기</button>
      </div>
      </ReactModal>
      </div>
    </div>
  )
}
export default AllProductList;