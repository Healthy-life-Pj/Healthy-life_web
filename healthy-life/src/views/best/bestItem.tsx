import React, { useState } from "react";
import "../../style/home/allProduct.css";
import useAllproductpaginationHook from "../../hooks/allProductPagination";
import {
  ALL_PRODUCTS,
  AUTH_PATH,
  MAIN_APT_PATH,
  PRODUCT_PATH,
} from "../../constants";
import PaginationScroller from "../../components/PaginationScroller";

const BestItem = () => {
  const [sortBy] = useState<string>("rating");
  const { data, loading } = useAllproductpaginationHook({
    apiUrl: `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${ALL_PRODUCTS}`,
    limit: 10,
    chooseSort:sortBy
  });

  return (
    <div className="allProductbListBox">
      <div className="productListDiv">
        <h2 className="bestItemTitle">베스트 아이템</h2>
        <div className="allProductList">
          {loading ? (
            <p>로딩중...</p>
          ) : (
            <PaginationScroller products={data.slice(0, 16)} />
          )}
        </div>
      </div>
    </div>
  );
};
export default BestItem;
