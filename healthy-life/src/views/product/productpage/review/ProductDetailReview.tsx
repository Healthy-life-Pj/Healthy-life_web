import React, { useEffect, useState } from "react";
import "../../../../style/Review.css";
import { Rating } from "@mui/material";
import { ReviewResponseDto } from "../../../../types/dto";
import axios from "axios";
import {
  AUTH_PATH,
  IMG_PATH,
  MAIN_APT_PATH,
  REVIEW_PATH,
  REVIEW_PRODUCT,
} from "../../../../constants/api";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ReactModal from "react-modal";
import "../../../../style/ModalExample.css";
import SmallPagination from "../../../../components/SmallPagination";

function Review() {
  const { pId } = useParams();
  const [reviewData, setReviewData] = useState<ReviewResponseDto[]>([]);
  const [reviewModal, setReviewModal] = useState<ReviewResponseDto | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productPerPage] = useState<number>(5);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = (id: number) => {
    if (reviewData == null) return null;
    const review = reviewData.find((review) => review.reviewId === id);
    if (review) {
      setModalIsOpen(true);
      setReviewModal(review);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setReviewModal(null);
  };

  const indexOfLastPost = currentPage * productPerPage;
  const indexOfFirstPost = indexOfLastPost - productPerPage;
  const currentProducts = reviewData.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${REVIEW_PATH}${REVIEW_PRODUCT}/${pId}`,
      );

      setReviewData(response.data.data.reviewListDto);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pId) fetchData();
  }, []);

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div className="productReviewContainer">
      <div className="titleSelctDiv">
        <h5>전체 후기</h5>
        <div className="labelInput"></div>
      </div>
      <div>
        <ul className="totalUl">
          {currentProducts.length > 0 ? (
            currentProducts.map((review) => (
              <li key={review.reviewId} className="reviewDetaiLi">
                <div className="reviewli">
                  <div className="reviewStar">
                    <span className="userNameSpan">{review.username}</span>
                    <div>
                      <Rating
                        style={{ fontSize: "12px" }}
                        name="half-rating-read"
                        defaultValue={review.reviewRating}
                        precision={0.5}
                        readOnly
                      />
                    </div>
                    <span className="reviewAtSpan">{review.reviewCreatAt}</span>
                  </div>
                </div>
                <div className="reviewLiLine"></div>
                <div className="reivewContentPreDiv">
                  <pre
                    onClick={() => openModal(review.reviewId)}
                    className="reviewContentPrev"
                  >
                    {cutText(review.reviewContent, 40)}
                  </pre>
                </div>
                <div className="reviewLiLine"></div>
                <div
                  className="reviewImgUrlDiv"
                  onClick={() => openModal(review.reviewId)}
                >
                  <img
                    className="reivewImg"
                    src={`${IMG_PATH}/${review.reviewImgUrl}`}
                    alt={String(review.reviewId)}
                  />
                </div>
              </li>
            ))
          ) : (
            <p style={{ color: "#8f8f8f" }}>상품리뷰가 없습니다.</p>
          )}
        </ul>
      </div>
      <div className="pagination">
        <SmallPagination
          productPerPage={productPerPage}
          totalProducts={reviewData.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="reveiwModal">
          {reviewModal ? (
            <div className="reviewModalContainer">
              <div className="reviewTitle">
                <h4>후기</h4>
                <span
                  onClick={closeModal}
                  className="closeProductDetailReviewModalBtn"
                >
                  <CloseIcon style={{ fontSize: "20px" }} />
                </span>
              </div>
              <div className="reviewModalMainBox">
                <div className="modalImageDiv">
                  <img
                    src={reviewModal.reviewImgUrl}
                    alt={String(reviewModal.reviewId)}
                    className="modalImage"
                  />
                </div>
                <div className="reviewModalInfo">
                  <h5>{reviewModal.pName}</h5>
                  <div className="countInfo">
                    <span className="countInfoSpan">
                      {" "}
                      {reviewModal.username} | {reviewModal.reviewCreatAt}{" "}
                    </span>
                  </div>
                  <Rating
                    style={{ fontSize: "12px" }}
                    name="half-rating-read"
                    defaultValue={reviewModal.reviewRating}
                    precision={0.5}
                    readOnly
                  />
                </div>
                <div className="reviewInfoDiv">
                  <div className="reviewPreLine"></div>
                  <pre className="reviewPre">{reviewModal.reviewContent}</pre>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading Post</p>
          )}
        </div>
      </ReactModal>
    </div>
  );
}

export default Review;
