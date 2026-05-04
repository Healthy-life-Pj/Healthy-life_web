import React, { useState } from "react";
import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import { CartItemDto } from "../types/dto";
import SmallPagination from "./SmallPagination";
import "../style/modal/cartModal.css";
import { IMG_PATH, PRODUCT_IMG } from "../constants";

interface CartModalProps {
  cartItem: CartItemDto[] | [];
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ cartItem, isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cartPerPage] = useState<number>(4);
  const navigate = useNavigate();

  const indexOfLastPost = currentPage * cartPerPage;
  const indexOfFirstPost = indexOfLastPost - cartPerPage;

  const currentPosts = Array.isArray(cartItem)
    ? cartItem.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const closeModal = () => {
    onClose();
  };

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="cartModalContent"
        overlayClassName="cartModalOverlay"
      >
        <div className="cartModal">
          <h2 className="cartTitle">장바구니</h2>
          <div className="cartModalContainerDiv">
            <ul className="cartModalList">
              {currentPosts.map((data, index) => (
                <li className="cartItemLi" key={`${data.pId}-${index}`}>
                  <div className="cartItemImgDiv">
                    <img
                      className="cartItemImg"
                      src={`${IMG_PATH}${PRODUCT_IMG}/${data.pImgUrl}`}
                      alt={data.pName}
                    />
                  </div>
                  <p className="cartItemContent">{cutText(data.pName, 6)}</p>
                  <p className="cartItemContent">
                    {data.productPrice.toLocaleString()}원
                  </p>
                  <p className="cartItemContent">
                    주문수량 : {data.productQuantity}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="smallPaginationCartModal">
            <SmallPagination
              productPerPage={cartPerPage}
              totalProducts={cartItem.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
          <div className="modalButtonContainer">
            <button onClick={() => navigate("/cart")} className="modalLinkeBtn">
              장바구니 이동
            </button>
            <button className="modalLinkeBtn" onClick={onClose}>
              쇼핑계속하기
            </button>
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default CartModal;
