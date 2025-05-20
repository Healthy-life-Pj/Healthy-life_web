import React from 'react'
import ReviewList from './ReviewList'
import '../../../style/mypage/Review.css'
import { Link } from 'react-router-dom'

function ReviewApp() {
  return (
    <div className='reviewContainer'>
      <h2>후기</h2>
        <div className='reviewAppContainer'>
          <h4>작성할 후기</h4>
          <ul className='reviewAppList'>
            <li>
              <img src="https://cdn.pixabay.com/photo/2024/02/11/13/33/kumquats-8566508_1280.jpg" alt="" className='reveiwAppImage'/>
              <h5>상품명</h5>
              <Link to={'/mypage/review/write'}><button className='reviewWrightBtn'>후기작성</button></Link>
            </li>
          </ul>
        </div>
        <div>
          <ReviewList />
        </div>
    </div>
  )
}

export default ReviewApp