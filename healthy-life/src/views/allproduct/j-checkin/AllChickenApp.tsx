import React, { useState } from "react";
import Chicken from "./Chicken";
import "../../../style/home/allProduct.css";
import Pagination from "./Pagination";
import { ProductDetail } from "../../../types";

export interface ProductProps {
  id: number;
  title: string;
  image: string;
}

const AllChickenApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [checkinPerPage] = useState<number>(16);
  const [products, setProduct] = useState<ProductDetail[]>([]);
  const indexOfLastPost = currentPage * checkinPerPage;
  const indexOfFirstPost = indexOfLastPost - checkinPerPage;
  const currentProducts = products.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="allProductbBox">
      <h2>닭가슴살/육류</h2>

      <ul className="allProductButtonList">
        <li>
          <button>닭가슴살</button>
        </li>
        <li>
          <button>달걀</button>
        </li>
        <li>
          <button>소고기</button>
        </li>
      </ul>
      <div className="itemCotianer">
        <ul className="allProductSelectBtn">
          <li value="">
            <button>조회순</button>
          </li>
          <li>|</li>
          <li value="">
            <button>가격 높은순</button>
          </li>
          <li>|</li>
          <li value="">
            <button>가격 낮은순</button>
          </li>
        </ul>
        <div className="allProductList">
          <Chicken products={currentProducts} />
        </div>
      </div>
      <Pagination
        productPerPage={checkinPerPage}
        totalProducts={products.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};
export default AllChickenApp;

