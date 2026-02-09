import React, { useEffect, useRef, useState } from "react";
import "../../style/home/allProduct.css";
import {
  MAIN_APT_PATH,
  PHYSIQUE_PRODUCTS,
  PRODUCT_PATH,
} from "../../constants";
import PaginationScroller from "../../components/PaginationScroller";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useRecommandPaginationHook from "../../hooks/recommandPagiantionHook";
import PhysiqueSurvey from "./PhysiqueSurvey";

const PhysiqueProduct = () => {
  const [btnStatus, setBtnStatus] = useState<string>("default");
  const [cookies] = useCookies(["token"]);
  const hasAlerted = useRef(false);
  const navigate = useNavigate();
  const [physiqueUpdated] = useState(false);

  const { data, loading, resetAndFetchData, fetchData } = useRecommandPaginationHook({
    apiUrl: `${MAIN_APT_PATH}${PRODUCT_PATH}${PHYSIQUE_PRODUCTS}`,
    limit: 10,
    chooseSort: btnStatus,
  });

  const buttons = [
    { label: "기본순", sortBy: "default" },
    { label: "별점순", sortBy: "rating" },
    { label: "좋아요순", sortBy: "like" },
    { label: "가격낮은순", sortBy: "lower" },
    { label: "가격높은순", sortBy: "higher" },
  ];

  const btnStyle = (button: string) => ({
    color: btnStatus === button ? "#FF7B54" : "black",
  });

  const handleSortClick = (sortBy: string) => {
    setBtnStatus(sortBy);
    resetAndFetchData(sortBy);
  };

  useEffect(() => {
    if (!cookies.token && !hasAlerted.current) {
      alert("로그인이 필요합니다.");
      hasAlerted.current = true;
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    resetAndFetchData(btnStatus);
  }, [physiqueUpdated]);

  return (
    <div className="allProductbListBox">
      <PhysiqueSurvey onSearch={()=>fetchData(1)} />
      <div className="productListDiv">
        <h2>체질추천 상품</h2>
        {data.length > 0 ? (
          <div className="itemCotianerDiv">
            <div className="allProductFilterBtn">
              {buttons.map((button, index) => (
                <div className="sortByBtnDiv" key={index}>
                  <button
                    style={btnStyle(button.sortBy)}
                    className="sortByBtn"
                    value={button.sortBy}
                    onClick={() => handleSortClick(button.sortBy)}
                  >
                    {button.label}
                  </button>
                  {index < buttons.length - 1 && (
                    <span className="spanCutLine">|</span>
                  )}
                </div>
              ))}
            </div>
            <div className="allProductList">
              {loading ? (
                <p>로딩중...</p>
              ) : (
                <PaginationScroller products={data} />
              )}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default PhysiqueProduct;
