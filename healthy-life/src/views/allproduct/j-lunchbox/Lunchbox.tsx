import React, { useEffect, useState } from "react";
import "../../../style/home/allProduct.css";
import Pagination from "./Pagination";
import LunchboxContent from "./LuchboxContent";
import { useSearchParams } from "react-router-dom";
import { ProductDetail } from "../../../types";
import axios from "axios";


const Lunchbox:React.FC<{products: ProductDetail[]}> = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [checkinPerPage] = useState<number>(16);
  const [products, setProducts] = useState<ProductDetail[]>([]); 
  const [tagFilter, setTagFilter] = useSearchParams();
  //카테고리
  const filter = tagFilter.get('category') || '';

  const fetchUsers = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/productList`);
      
      const data = response.data;

      setProducts(data);
    } catch (e) {
      console.error("Error fetching data: ", e);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilter = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setTagFilter({tag: e.target.value})
  }

  const indexOfLastPost = currentPage * checkinPerPage;
  const indexOfFirstPost = indexOfLastPost - checkinPerPage;
  const currentProducts = products.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="allProductbBox">
      <h2>도시락</h2>

      <select className="allProductButtonList" value={filter} onChange={handleFilter}>
          <option value={" "}>전체</option>
          <option value={"볶음밥"}>볶음밥</option>
          <option value={"주먹밥"}>주먹밥</option>
          <option value={"즉석밥"}>즉석밥</option>
      </select>
      <div className="itemCotianer">
        <ul className="allProductFilterBtn">
          <li value="">
            <button>전체</button>
          </li>
          <li>|</li>
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
          <LunchboxContent products={currentProducts} />
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
export default Lunchbox;

export interface PaginationProps {
  checkinPerPage: number;
  totalProducts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}
