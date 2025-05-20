import React, { useState } from "react";
import Chicken from "./NutsContent";
import "../../../style/home/allProduct.css";
import Pagination from "./Pagination";

export interface ProductProps {
  id: number;
  title: string;
  image: string;
}

const products: ProductProps[] = [
  {
    id: 3,
    title: "Produt 3",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 4,
    title: "Produt 4",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 5,
    title: "Produt 5",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 6,
    title: "Produt 6",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 7,
    title: "Produt 7",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 8,
    title: "Produt 8",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 9,
    title: "Produt 9",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 10,
    title: "Produt 10",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 11,
    title: "Product 11",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 12,
    title: "Produt 12",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 13,
    title: "Produt 13",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 14,
    title: "Produt 14",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 15,
    title: "Produt 15",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 16,
    title: "Produt 16",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 17,
    title: "Produt 17",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 18,
    title: "Produt 18",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 19,
    title: "Produt 19",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 20,
    title: "Produt 20",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 21,
    title: "Product 21",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 22,
    title: "Produt 22",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 23,
    title: "Produt 23",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 24,
    title: "Produt 24",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 25,
    title: "Produt 25",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 26,
    title: "Produt 26",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 27,
    title: "Produt 27",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 28,
    title: "Produt 28",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 29,
    title: "Produt 29",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 30,
    title: "Produt 30",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 31,
    title: "Produt 31",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 32,
    title: "Produt 32",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 33,
    title: "Produt 33",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 34,
    title: "Produt 34",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 35,
    title: "Produt 35",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 36,
    title: "Produt 36",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 37,
    title: "Produt 37",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 38,
    title: "Produt 38",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 39,
    title: "Produt 39",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 40,
    title: "Produt 40",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 41,
    title: "Produt 41",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 42,
    title: "Produt 42",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 43,
    title: "Produt 43",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 44,
    title: "Produt 44",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 45,
    title: "Produt 45",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 46,
    title: "Produt 46",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 47,
    title: "Produt 47",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 48,
    title: "Produt 48",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 49,
    title: "Produt 49",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 50,
    title: "Produt 50",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 51,
    title: "Produt 51",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 52,
    title: "Produt 52",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 53,
    title: "Produt 53",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 54,
    title: "Produt 54",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 55,
    title: "Produt 55",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 56,
    title: "Produt 56",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 57,
    title: "Produt 57",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 58,
    title: "Produt 58",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 59,
    title: "Produt 59",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 60,
    title: "Produt 60",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
  {
    id: 61,
    title: "Produt 61",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
  },
];

const Nuts: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [checkinPerPage] = useState<number>(16);

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
export default Nuts;

export interface PaginationProps {
  checkinPerPage: number;
  totalProducts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}
