import React from 'react'
import '../../../style/mypage/Review.css'


function ReviewList() {
  return (
    <div className='reviewListContainer'>
      <h4>내가 작성한 후기</h4>
      <div className='reviewList'>
        <ul>
          <li>
            <img src="https://cdn.pixabay.com/photo/2024/02/11/13/33/kumquats-8566508_1280.jpg" alt="" className='reviewImage'/>
            <h5>상품명</h5>
            <p>후기제목</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ReviewList