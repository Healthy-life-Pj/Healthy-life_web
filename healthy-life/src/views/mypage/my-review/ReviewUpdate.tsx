import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  IMG_PATH,
  MAIN_APT_PATH,
  MY_REVIEW_ONE,
  REVIEW_PATH,
  REVIEW_PUT,
} from "../../../constants";
import { ReviewRequestDto, ReviewResponseDto } from "../../../types/dto";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import "../../../style/mypage/ReviewWrite.css";

function ReviewUpdate() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const [reviewData, setReviewData] = useState<ReviewResponseDto | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewRequestDto>({
    reviewContent: "",
    reviewImgUrl: null,
    reviewRating: 0,
  });
  const [reviewImgPreview, setReviewImgPreview] = useState<string>("");

  const didRun = useRef(false); 

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    getFetchData();
  }, []);

  const getFetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${REVIEW_PATH}${MY_REVIEW_ONE}/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      const reviewDto = response.data.data;
      setReviewData(reviewDto);
      setReviewForm({
        reviewContent: reviewDto.reviewContent,
        reviewRating: reviewDto.reviewRating,
        reviewImgUrl: null,
      });
      if (reviewDto.reviewImgUrl) {
        setReviewImgPreview(`${IMG_PATH}/${reviewDto.reviewImgUrl}`);
      }
    } catch (error) {
      console.error(error);
      navigate("/mypage/my-review");
    }
  };

  const updateFetchData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cookies.token) return;
  
    if (!reviewForm.reviewContent.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }
  
    const formData = new FormData();
    formData.append("reviewContent", reviewForm.reviewContent);
    formData.append("reviewRating", String(reviewForm.reviewRating));
    if (reviewForm.reviewImgUrl instanceof File) {
      formData.append("reviewImgUrl", reviewForm.reviewImgUrl);
    }

    try {
      await axios.put(
        `${MAIN_APT_PATH}${REVIEW_PATH}${REVIEW_PUT}/${reviewId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      alert("리뷰 수정 완료!");
      navigate("/mypage/my-review");
    } catch (error) {
      console.error(error);
      alert("리뷰 수정 실패");
    }
  };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setReviewForm((prev) => ({ ...prev, reviewImgUrl: file }));

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setReviewImgPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewPostChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="ReviewWriteContainer">
      <h2>후기수정</h2>
      <div className="ReviewStar">
        <p>{reviewData?.pName}</p>
        <Rating
          name="reviewRating"
          value={reviewForm.reviewRating}
          onChange={(event, newValue) => {
            setReviewForm((prev) => ({
              ...prev,
              reviewRating: newValue || 0,
            }));
          }}
          precision={0.5}
        />
      </div>
      <form
        className="formContainer"
        onSubmit={(e) => {
          e.preventDefault();
          updateFetchData(e);
        }}
      >
        <textarea
          className="ReviewWriteContent"
          name="reviewContent"
          value={reviewForm.reviewContent}
          placeholder="내용을 입력해주세요."
          onChange={handleReviewPostChange}
        />
        <div className="ImgContainer">
          <div className="ImgContainerDiv">
            {reviewImgPreview ? (
              <img className="imgPreview" src={reviewImgPreview} alt="미리보기" />
            )
          : <CropOriginalIcon />
          }
          </div>
          <div className="fileBox">
            <label className="fileBoxBtn" htmlFor="reviewImgUrl">
              <AddPhotoAlternateIcon />
            </label>
            <input
              type="file"
              id="reviewImgUrl"
              name="reviewImgUrl"
              className="fileInpout"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="ReviewWriteBtn">
          <button type="submit" className="reviewWritebtn">
            수정
          </button>
          <button
            type="button"
            className="reviewWritebtn"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewUpdate;
