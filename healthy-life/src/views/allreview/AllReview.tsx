import React, { useState } from 'react'
import Pagination from './Pagination';

import '../../style/home/AllReview.css'
import AllReviewList from './AllReviewList';

export interface ProductProps {
  id: number;
  title: string;
  image: string;
  content: string;
  date: string;
}

const products:ProductProps[] = [
  {id: 1, title: 'Product 1', content: 'review 내용', date: '2024.08.27',image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 2, title: 'Produt 2', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 3, title: 'Produt 3', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 4, title: 'Produt 4', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 5, title: 'Produt 5', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 6, title: 'Produt 6', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 7, title: 'Produt 7', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 8, title: 'Produt 8', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 9, title: 'Produt 9', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 10, title: 'Produt 10', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 11, title: 'Product 11', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 12, title: 'Produt 12', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 13, title: 'Produt 13', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 14, title: 'Produt 14', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 15, title: 'Produt 15', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 16, title: 'Produt 16', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 17, title: 'Produt 17', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 18, title: 'Produt 18', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 19, title: 'Produt 19', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 20, title: 'Produt 20', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 21, title: 'Product 21', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 22, title: 'Produt 22', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 23, title: 'Produt 23', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 24, title: 'Produt 24', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 25, title: 'Produt 25', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 26, title: 'Produt 26', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 27, title: 'Produt 27', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 28, title: 'Produt 28', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 29, title: 'Produt 29', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
  {id: 30, title: 'Produt 30', content: 'review 내용', date: '2024.08.27', image: 'https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg'},
];

const AllReview: React.FC  = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ProductPerPage] = useState<number>(16);

  const indexOfLastPost = currentPage * ProductPerPage;
  const indexOfFirstPost = indexOfLastPost - ProductPerPage;


  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='allProductContainer'>
      <h2 style={{marginBottom:"50px"}}>고객 전체 후기</h2>

    <div className='allProductList'>
      {/* <AllReviewList products={currentProducts} /> */}
    </div>
    <Pagination 
    productPerPage={ProductPerPage}
    totalProducts={products.length}
    paginate={paginate}
    currentPage={currentPage}
    />
    </div>
  )
}
export default AllReview;

export interface PaginationProps {
  ProductPerPage: number;
  totalProducts: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}