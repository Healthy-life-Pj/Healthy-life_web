import React from 'react'
import '../../style/mypage/mypage.css'
import { Route, Routes } from 'react-router-dom'
import MypageNav from './mypage-main/MypageNav'
import OrderApp from './order/OrderApp'
import WishApp from './wish/WishApp'
import Userinformation from './userInformation/Userinformation'
import ReviewWrite from './my-review/ReviewWrite'
import Mypage from './mypage-main/Mypage'
import MypageUp from './mypage-main/MypageUp'
import ReviewList from './my-review/MyReview'
import ReviewUpdate from './my-review/ReviewUpdate'
import MyQnA from './my-qna/MyQnA'
import PhysiquePage from './my-physique/MyPhysiquePage'
import ShippingList from './shipping/ShippingList'
import Membership from './membership/Membership'


function MyPageMain() {
  return (
    <div className='mypageTotalContainer'>
      <div className='mypageHeader'>
      <MypageUp/>
      </div>
      <div className='mypageNavRoutesBox'>
      <MypageNav/>
      <Routes>
        <Route path='/' element={<Mypage/>}/> 
        <Route path='/orderApp' element={<OrderApp />}/>
        <Route path='/shipping' element={<ShippingList />}/>
        <Route path='/my-review' element={<ReviewList />}/>
        <Route path='/wishlist' element={<WishApp />}/>
        <Route path='/my-qna' element={<MyQnA />}/>
        <Route path='/userinformation' element={<Userinformation />}/>
        <Route path='/my-review/write/:orderDetailId/:pName' element={<ReviewWrite />}/>
        <Route path='/my-review/update/:reviewId' element={<ReviewUpdate />}/>
        <Route path="/physique" element={<PhysiquePage />} />
        <Route path="/membership" element={<Membership />} />
      </Routes>
      </div>
    </div>
  )
}

export default MyPageMain