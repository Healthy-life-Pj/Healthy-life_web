import React, { useEffect, useState } from 'react'
import '../../../style/QnA.css'
import ModalExample from './modal/ModalExample';
import axios from 'axios';
import Pagination from './Pagination';


// interface PostProps {
//   id: number;
//   content: string;
// }


const QNA = () => {
  // const [posts, setPosts] = useState<PostProps[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  // const [postsPerPage] = useState<number>(5);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setLoading(true);
  //     const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
  //     setPosts(response.data);
  //     setLoading(false);
  //   }

  //   fetchPosts();
  // }, []);

  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // // Change page
  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  return (
    <div className='productQnaContainer'>
    <div className='titleModalBtnDiv'>
      <h5>QnA</h5>
      <ModalExample/>
    </div>
    <div>
      <ul className='qnaTotalUl'>
        <li className='qnaTotalLi'>
            <p>답벼완료여부</p>
            <pre>리뷰 내용 ...... 끄젓끄젓 </pre>
            <p>(id****) | (등록날짜)</p>
        </li>
        <li className='qnaTotalLi'>
            <p>답벼완료여부</p>
            <pre>리뷰 내용 ...... 끄젓끄젓 </pre>
            <p>(id****) | (등록날짜)</p>
        </li>
      </ul>
    </div>
        <div className='pagination'>
        {/* <Pagination 
    productPerPage={postsPerPage}
    totalProducts={posts.length}
    paginate={paginate}
    currentPage={currentPage}
    /> */}
    </div>
    </div>
  )
  }
export default QNA