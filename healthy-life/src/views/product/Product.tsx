import React, { useEffect, useState } from "react";
import "../../style/home/allProduct.css";
import PaginationScroller from "../../components/PaginationScroller";
import usePaginationScroll from "../../hooks/paginationHook";
import {
  AUTH_PATH,
  CATEGORY_DETAIL_PRODUCTS,
  CATEGORY_PRODUCTS,
  MAIN_APT_PATH,
  PRODUCT_PATH,
} from "../../constants/api";
import { useParams } from "react-router-dom";

const Product: React.FC = () => {
  const { pCategoryName } = useParams<{ pCategoryName?: string }>();
  const pCategory = pCategoryName || "";
  const [selectedDetail, setSelectedDetail] = useState<string>("전체보기");
  const [categoryDetailList, setCategoryDetailList] = useState<string[]>([]);
  const [btnStatus, setBtnStatus] = useState<string>("default");
  const [useDetailApi, setUseDetailApi] = useState<boolean>(false);

  const { data, loading, resetAndFetchData, updatedParams } =
    usePaginationScroll({
      apiUrl01: `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${CATEGORY_PRODUCTS}`,
      apiUrl02: `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${CATEGORY_DETAIL_PRODUCTS}`,
      limit: 10,
      extraParams: {
        pCategoryName: pCategory,
        pCategoryDetailName: useDetailApi ? selectedDetail : "",
      },
    });

  const categoryMap: Record<string, string[]> = {
    닭가슴살_육류: ["전체보기", "닭가슴살", "달걀", "소고기"],
    도시락: ["전체보기", "볶음밥", "주먹밥", "즉석밥"],
    간식: ["전체보기", "에너지바", "과자", "베이커리"],
    음료: ["전체보기", "물", "탄산수", "프로틴음료", "커피", "차", "제로음료"],
    샐러드: ["전체보기", "닭가슴살샐러드", "연어샐러드", "큐브스테이크샐러드"],
    비건: ["전체보기", "간식", "간편식", "식재료"],
    저당: ["전체보기", "저당간식", "저당음료", "저당드레싱"],
    해산물: ["전체보기", "생선", "해조류", "어패류"],
    견과류: ["전체보기", "견과류"],
  };

  useEffect(() => {
    if (!pCategoryName || !(pCategoryName in categoryMap)) {
      setCategoryDetailList([]);
      setSelectedDetail("전체보기");
      setUseDetailApi(false);
      updatedParams({
        pCategoryName: pCategory,
        pCategoryDetailName: "",
      });
      return;
    }

    setCategoryDetailList(categoryMap[pCategoryName]);
    setSelectedDetail("전체보기");
    setUseDetailApi(false);
    updatedParams({
      pCategoryName: pCategory,
      pCategoryDetailName: "",
    });
  }, [pCategoryName]);

  useEffect(() => {
    updatedParams({
      pCategoryName: pCategory,
      pCategoryDetailName: useDetailApi ? selectedDetail : "",
    });
  }, [selectedDetail, useDetailApi]);

  useEffect(() => {
    if (selectedDetail === "전체보기") {
      setUseDetailApi(false);
      updatedParams({
        pCategoryName: pCategory,
        pCategoryDetailName: "",
      });
    }
  }, [selectedDetail]);

  const handleCategoryDetailClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const selectedValue = e.currentTarget.value;
    setSelectedDetail(selectedValue);
    setUseDetailApi(selectedValue !== "전체보기");
  };

  const handleSortChange = (sortBy: string) => {
    setBtnStatus(sortBy);
    resetAndFetchData(sortBy);
  };

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

  return (
    <div className="allProductbListBox">
      <div className="productListDiv">
        <h2 className="categoryNameTitle">{pCategoryName}</h2>
        <span className="categoryButtonList" key={pCategoryName}>
          {categoryDetailList.map((detail) => (
            <span key={detail} className="categorySpan">
              <button
                style={{
                  color: selectedDetail === detail ? "#1478FF" : "#333",
                }}
                onClick={handleCategoryDetailClick}
                value={detail}
                className="categoryButton"
              >
                {detail}
              </button>
            </span>
          ))}
        </span>
        <div className="itemCotianerDiv">
          <div className="allProductFilterBtn">
            {buttons.map((button, index) => (
              <div key={index}>
                <button
                  style={btnStyle(button.sortBy)}
                  className="sortByBtn"
                  value={button.sortBy}
                  onClick={() => handleSortChange(button.sortBy)}
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

export default Product;
