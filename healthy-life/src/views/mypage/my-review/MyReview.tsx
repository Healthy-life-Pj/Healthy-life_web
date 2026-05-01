import React, { useEffect, useRef, useState } from "react";
import "../../../style/mypage/Review.css";
import { OrderDetailResponseDto, ReviewListDto } from "../../../types/dto";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IMG_PATH,
  MAIN_APT_PATH,
  MY_REVIEWS,
  ORDER_GET_REVIEW,
  ORDER_PATH,
  REVIEW_DELETE,
  REVIEW_PATH,
} from "../../../constants";
import SmallPagination from "../../../components/SmallPagination";
import ReactModal from "react-modal";
import { Rating } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Camera } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Review() {
  const [reviewDatas, setReviewDatas] = useState<ReviewListDto[]>([]);
  const [orderDatas, setOrderDatas] = useState<OrderDetailResponseDto[]>([]);
  const [cookies] = useCookies(["token"]);
  const [orderCurrentPage, setOrderCurrentPage] = useState<number>(1);
  const [reviewCurrentPage, setReviewCurrentPage] = useState<number>(1);
  const [productPerPage] = useState<number>(5);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const [reviewModal, setReviewModal] = useState<ReviewListDto | null>(null);

  const orderIndexOfLast = orderCurrentPage * productPerPage;
  const orderIndexOfFirst = orderIndexOfLast - productPerPage;

  const reviewIndexOfLast = reviewCurrentPage * productPerPage;
  const reviewIndexOfFirst = reviewIndexOfLast - productPerPage;

  const currentOrder = Array.isArray(orderDatas)
    ? orderDatas.slice(orderIndexOfFirst, orderIndexOfLast)
    : [];

  const currentReview = Array.isArray(reviewDatas)
    ? reviewDatas.slice(reviewIndexOfFirst, reviewIndexOfLast)
    : [];

  const orderPaginate = (pageNumber: number) => setOrderCurrentPage(pageNumber);
  const reviewPaginate = (pageNumber: number) =>
    setReviewCurrentPage(pageNumber);

  const orderFetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${ORDER_PATH}${ORDER_GET_REVIEW}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );

      setOrderDatas(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const reviewFetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${REVIEW_PATH}${MY_REVIEWS}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      const reversDatas = response.data.data;
      const reviewList = reversDatas.reviewListDto;
      setReviewDatas(Array.isArray(reviewList) ? [...reviewList].reverse() : []);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFetchData = async (reviewId: number) => {
    try {
      await axios.delete(
        `${MAIN_APT_PATH}${REVIEW_PATH}${REVIEW_DELETE}/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      orderFetchData();
      reviewFetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    orderFetchData();
    reviewFetchData();
  }, []);

  const openModal = async (id: number) => {
    if (reviewDatas == null) return null;
    const review: ReviewListDto | undefined = reviewDatas.find(
      (r) => r?.reviewId === id
    );

    if (review) {
      setReviewModal(review);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setReviewModal(null);
  };

  const cutText = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  function isOver30Days(date: string): boolean {
    const orderDate = new Date(date);
    const today = new Date();
    const diffTime = today.getTime() - orderDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 30;
  }

  return (
    <div className="reviewContainer">
      <h2>후기</h2>
      <div className="reviewListContainerDiv">
        <h4>작성할 후기</h4>
        <ul className="reviewAppList">
          {currentOrder.length > 0 ? (
            <>
              {currentOrder.map((order, index) => (
                <li
                  key={`${order.orderDetailId}${index}`}
                  className="reviewAppListLi"
                >
                  <div className="reivewListLiDiv">
                    <div
                      className="reveiwAppImageDiv"
                      onClick={() =>
                        navigate(`/product/productDetail/${order.pId}`)
                      }
                    >
                      <img
                        src={order.pImgUrl}
                        alt={order.pName}
                        className="reveiwAppImage"
                      />
                    </div>
                    <div className="reviewProducNameDiv">
                      <p>{cutText(order.pName, 20)}</p>
                      <p className="reviewDateP">
                        {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <button
                      className="reviewWrightBtn"
                      onClick={() =>
                        navigate(
                          `/mypage/my-review/write/${order.orderDetailId}/${order.pName}`
                        )
                      }
                    >
                      후기작성
                    </button>
                  </div>
                  {index < currentOrder.length - 1 && (
                    <div className="reviewAListLine"></div>
                  )}
                </li>
              ))}
            </>
          ) : (
            <p style={{ color: "#454545" }}>작성할 후기가가 없습니다.</p>
          )}
        </ul>
      </div>
      <SmallPagination
        productPerPage={productPerPage}
        totalProducts={Array.isArray(orderDatas) ? orderDatas.length : 0}
        paginate={orderPaginate}
        currentPage={orderCurrentPage}
      />
      <div className="reviewListContainerDiv">
        <h4>내가 작성한 후기</h4>
        <ul className="reviewAppList">
          {reviewDatas.length > 0 ? (
            <>
              {currentReview.map((review, index) => (
                <li key={review.reviewId} className="reviewAppListLi">
                  <div className="reivewListLiDiv reviewAppListLiHeight">
                    <div
                      className="reveiwAppImageDiv"
                      onClick={() =>
                        navigate(`/product/productDetail/${review.pId}`)
                      }
                    >
                      <img
                        src={review.pImgUrl}
                        alt={review.pName}
                        className="reveiwAppImage"
                      />
                    </div>
                    <div className="reviewProducNameDiv forMargin">
                      <p>{cutText(review.pName, 11)}</p>
                      <p className="reviewDateP">{new Date(review.reviewCreatAt).toLocaleDateString()}</p>
                    </div>
                    <div className="reviewBtnDiv">
                      <button
                        onClick={() => openModal(review.reviewId)}
                        className="reviewWrightBtn2"
                      >
                        보기
                      </button>
                      {!isOver30Days(review.orderDate) ? (
                        <button
                          className="reviewWrightBtn2"
                          onClick={() =>
                            navigate(
                              `/mypage/my-review/update/${review.reviewId}`
                            )
                          }
                        >
                          수정
                        </button>
                      ) : (
                        <></>
                      )}
                      <button
                        className="reviewWrightBtn2"
                        onClick={() => deleteFetchData(review.reviewId)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  {index < currentReview.length - 1 && (
                    <div className="reviewAListLine"></div>
                  )}
                </li>
              ))}
            </>
          ) : (
            <p style={{ color: "#454545" }}>작성한 후기가 없습니다.</p>
          )}
        </ul>
      </div>
      <SmallPagination
        productPerPage={productPerPage}
        totalProducts={Array.isArray(reviewDatas) ? reviewDatas.length : 0}
        paginate={reviewPaginate}
        currentPage={reviewCurrentPage}
      />

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="reviewModalBackgroundBox"
        overlayClassName="modal-overlay"
      >
        <div className="reveiwModal">
          {reviewModal ? (
            <div className="reviewModalContainer">
              <div className="reviewTitle">
                <span onClick={closeModal} className="closeReviewModalBtn">
                  <CloseIcon style={{ fontSize: "20px" }} />
                </span>
              </div>
              <div className="reviewModalMainBox">
                <div className="modalImageDiv">
                  {!reviewModal.pImgUrl ? (
                    <img
                      className="modalImage"
                      src={`${IMG_PATH}/${reviewModal.reviewImgUrl}`}
                    />
                  ) : (
                    <Camera />
                  )}
                </div>
                <div className="reviewModalInfo">
                  <div className="reviewPNameRatingDiv">
                    <h6
                      className="reviewPnameLink"
                      onClick={() =>
                        navigate(`/product/productDetail/${reviewModal.pId}`)
                      }
                    >
                      {reviewModal.pName}
                    </h6>
                    <Rating
                      style={{ fontSize: "12px" }}
                      name="half-rating-read"
                      defaultValue={reviewModal.reviewRating}
                      precision={0.5}
                      readOnly
                    />
                  </div>
                  <div className="countInfo">
                    <AccountCircleIcon style={{ fontSize: "20px" }} />
                    <p className="countInfoSpan">
                      {" "}
                      <span>{reviewModal.userNickName}</span>
                      <span>|</span>
                      <span>{reviewModal.reviewCreatAt}</span>{" "}
                    </p>
                  </div>
                </div>
                <div className="reviewInfoDiv">
                  <div className="reviewPreLine"></div>
                  <div className="reviewContentDiv">
                    {reviewModal.reviewContent}
                  </div>
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
