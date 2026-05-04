import React, { useEffect, useState } from "react";
import "../../../style/mypage/ReviewWrite.css";
import { useNavigate, useParams } from "react-router-dom";
import { Rating } from "@mui/material";
import { ReviewRequestDto } from "../../../types/dto";
import { useCookies } from "react-cookie";
import axios from "axios";
import { MAIN_APT_PATH, REVIEW_PATH } from "../../../constants";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

function ReviewWrite() {
  const navigate = useNavigate();
  const { orderDetailId, pName } = useParams();
  const [reviewData, setReviewData] = useState<ReviewRequestDto>({
    reviewContent: "",
    reviewImgUrl: null as File | null,
    reviewRating: 0,
  });
  const [cookies] = useCookies(["token"]);
  const [reviewImg, setReviewImg] = useState<any>(null);

  const fetchData = async () => {
    if (cookies.token) {
      const formData = new FormData();
      formData.append("reviewContent", reviewData.reviewContent);
      formData.append("reviewRating", String(reviewData.reviewRating));
      formData.append("reviewImgUrl", reviewData.reviewImgUrl);

      if (!formData.get("reviewContent")) {
        alert("내용을 입력해주세요.");
        return;
      }
      if (formData.get("reviewRating") === "0") {
        alert("별점을 입력해주세요.");
        return;
      }
      try {
        await axios.post(
          `${MAIN_APT_PATH}${REVIEW_PATH}/${orderDetailId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          },
        );
        alert("리뷰등록 완료!");
        navigate(-1);
      } catch (error) {
        console.error(error);
        alert("리뷰등록 실패");
      }
    } else {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!!e.target.files) {
      const reviewImgFile: FileList = e.target.files;
      setReviewData((prev) => ({
        ...prev,
        [e.target.name]: reviewImgFile[0],
      }));
    }
  };

  const handleReviewPostChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setReviewImg(e.target?.result);
    };

    if (!!reviewData.reviewImgUrl) {
      fileReader.readAsDataURL(reviewData.reviewImgUrl);
    }
    if (!cookies.token) navigate("/login");
  }, [reviewData.reviewImgUrl]);

  return (
    <div className="ReviewWriteContainer">
      <h2>후기등록</h2>
      <div className="ReviewStar">
        <p>{pName}</p>
        <Rating
          name="reviewRating"
          value={reviewData.reviewRating || 0}
          onChange={(event, newValue) => {
            setReviewData((prev) => ({
              ...prev,
              reviewRating: newValue || 0,
            }));
          }}
          precision={0.5}
        />
      </div>
      <form className="formContainer">
        <textarea
          className="ReviewWriteContent"
          name="reviewContent"
          value={reviewData.reviewContent}
          placeholder="내용을 입력해주세요."
          onChange={handleReviewPostChange}
        />
      </form>
      <div className="ImgContainer">
        <div className="ImgContainerDiv">
          {reviewImg ? (
            <img className="imgPreview" src={reviewImg} alt="리뷰사진" />
          ) : (
            <ImageNotSupportedIcon
              style={{ fontSize: "50px", color: "#a2a2a2" }}
            />
          )}
        </div>
        <div className="fileBox">
          <label className="fileBoxLabel" htmlFor="reviewImgUrl">
            <AddPhotoAlternateIcon
              style={{ fontSize: "40px", color: "#4f4f4f" }}
            />
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
        <button className="reviewWritebtn" onClick={fetchData}>
          등록
        </button>
        <button
          type="button"
          className="reviewWritebtn"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default ReviewWrite;
