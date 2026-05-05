import "../../style/home/AllReview.css";
import useReviewPaginationHook from "../../hooks/reviewPaginationHook";
import {
  ALL_REVIEWS,
  AUTH_PATH,
  MAIN_APT_PATH,
  REVIEW_PATH,
} from "../../constants/api";
import ReviewPaginationScrollProps from "../../components/ReviewPaginationScrollProps";
import "../../style/Review.css";

const AllReviewList = () => {
  const { data, loading } = useReviewPaginationHook({
    apiUrl: `${MAIN_APT_PATH}${AUTH_PATH}${REVIEW_PATH}${ALL_REVIEWS}`,
    limit: 10,
  });

  return (
    <div className="allReviewContainer">
      <h3>전체 후기</h3>
      <div className="reviewImageContainer">
        {loading ? (
          <p>로딩중.....</p>
        ) : (
          <ReviewPaginationScrollProps reviews={data} />
        )}
      </div>
    </div>
  );
};
export default AllReviewList;
