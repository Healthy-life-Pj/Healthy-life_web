import React, { useState } from "react";
import { ReviewListDto } from "../types/dto";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReactModal from "react-modal";
import { Rating } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../style/Review.css";
import "../style/ModalExample.css";
import { IMG_PATH } from "../constants";
import { Camera } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface PaginationScrollProps {
  reviews: ReviewListDto[];
}

function ReviewPaginationScrollProps({ reviews }: PaginationScrollProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [review, setReview] = useState<ReviewListDto | null>(null);
  const navigate = useNavigate();

  const openModal = (id: number) => {
    if (reviews == null) return null;
    const review = reviews.find((review) => review.reviewId === id);
    if (review) {
      setReview(review);
      setModalIsOpen(true);
    }
  };

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setReview(null);
  };
  return (
    <div className="allProductImageList">
      {reviews.map((review, index) => (
        <div
          onClick={() => openModal(review.reviewId)}
          className="reviewBox"
          key={review.reviewId || index}
        >
          <div className="reviewImgDiv">
            <img
              className="reviewImgUrl"
              src={`${IMG_PATH}/${review.reviewImgUrl}`}
              alt={String(review.reviewId)}
            />
          </div>
          <div className="productInform">
            <div className="reviewListPNameRatingDiv">
            <h6 className="reviewPnameLink" onClick={() => navigate(`/product/productDetail/${review.pId}`)}>{review.pName}</h6>
              <Rating
                style={{ fontSize: "12px" }}
                name="half-rating-read"
                defaultValue={review.reviewRating}
                precision={0.5}
                readOnly
              />
            </div>
            <div className="reveiwInfoDiv">
              <AccountCircleIcon style={{ fontSize: "20px" }} />
              <div className="reviewP">
                {review.userNickName} | {review.reviewCreatAt}
              </div>
            </div>
          </div>
        </div>
      ))}

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="reviewModalBackgroundBox"
        overlayClassName="modal-overlay"
      >
        <div className="reveiwModal">
          {review ? (
            <div className="reviewModalContainer">
              <div className="reviewTitle">
                <span onClick={closeModal} className="closeReviewModalBtn">
                  <CloseIcon style={{ fontSize: "20px" }} />
                </span>
              </div>
              <div className="reviewModalMainBox">
                <div className="modalImageDiv">
                  {!review.pImgUrl ? (
                    <img
                      className="modalImage"
                      src={`${IMG_PATH}/${review.reviewImgUrl}`}
                    />
                  ) : (
                    <Camera />
                  )}
                </div>
                <div className="reviewModalInfo">
                  <div className="reviewPNameRatingDiv">
                  <h6 className="reviewPnameLink" onClick={() => navigate(`/product/productDetail/${review.pId}`)}>{review.pName}</h6>
                    <Rating
                      style={{ fontSize: "12px" }}
                      name="half-rating-read"
                      defaultValue={review.reviewRating}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                  <div className="countInfo">
                    <AccountCircleIcon style={{ fontSize: "20px" }} />
                    <p className="countInfoSpan">
                      {" "}
                      <span>{review.userNickName}</span>
                      <span>|</span>
                      <span>{review.reviewCreatAt}</span>{" "}
                    </p>
                  </div>
                </div>
                <div className="reviewInfoDiv">
                  <div className="reviewPreLine"></div>
                  <pre className="reviewPre">{review.reviewContent}</pre>
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

export default ReviewPaginationScrollProps;
