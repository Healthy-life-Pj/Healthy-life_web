import React, { useState } from "react";
import "../../../style/home/allProduct.css";
import {
  ALL_PRODUCTS,
  AUTH_PATH,
  MAIN_APT_PATH,
  PRODUCT_PATH,
} from "../../../constants/api";
import PaginationScroller from "../../../components/PaginationScroller";
import useAllproductpaginationHook from "../../../hooks/allProductPagination";

const AllProduct: React.FC = () => {
  const [btnStatus, setBtnStatus] = useState<string>("default");

  const { data, loading, resetAndFetchData} = useAllproductpaginationHook({
    apiUrl: `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${ALL_PRODUCTS}`,
    limit: 10,
    chooseSort: btnStatus
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

  return (
    <div className="allProductbListBox">
      <div className="productListDiv">
          <h2>전체 상품</h2>
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
        </div>
      </div>
  );
};
export default AllProduct;
