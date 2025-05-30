import React, { useEffect, useState } from "react";
import "../../../style/home/SearchList.css";
import { useParams } from "react-router-dom";
import useSearchProductPaginationHook from "../../../hooks/searcchProductPagination";
import {
  AUTH_PATH,
  MAIN_APT_PATH,
  PRODUCT_PATH,
  PRODUCT_SEARCH,
} from "../../../constants";
import PaginationScroller from "../../../components/PaginationScroller";

const SearchList = () => {
  const { pName } = useParams();
  const keyword = pName || "";
  const [btnStatus, setBtnStatus] = useState<string>("default");

  const { data, loading, resetAndFetchData } = useSearchProductPaginationHook({
    apiUrl: `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${PRODUCT_SEARCH}`,
    limit: 10,
    extraParams: { pName: keyword },
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
      resetAndFetchData(btnStatus);
  }, [pName]);
  
  

  return (
    <div className="allProductbListBox">
      <div className="productListDiv">
        <h3 className="categoryNameTitle">"{pName}" 검색결과</h3>
        <div className="itemCotianerDiv">
          <div className="allProductFilterBtn">
            {buttons.map((button, index) => (
              <div key={index}>
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
              <PaginationScroller key={`${pName}-${btnStatus}`} products={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchList;
