import React from 'react'
import '../../style/mypage/mypage.css'
import { Route, Routes } from 'react-router-dom'
import MypageNav from './mypage-main/MypageNav'
import OrderApp from './order/OrderApp'
import ReviewApp from './review/ReviewApp'
import WishApp from './wish/WishApp'
import CurrentProduct from './currentProducts/CurrentProduct'
import Reserves from './cupon,reserves,benefit/Reserves'
import Cupon from './cupon,reserves,benefit/Cupon'
import Benefit from './cupon,reserves,benefit/Benefit'
import Userinformation from './userInformation/Userinformation'
import ReviewWrite from './review/ReviewWrite'
import Mypage from './mypage-main/Mypage'
import MypageUp from './mypage-main/MypageUp'


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
        <Route path='/myreview' element={<ReviewApp />}/>
        <Route path='/wishlist' element={<WishApp />}/>
        <Route path='/current' element={<CurrentProduct />}/>
        <Route path='/mileage' element={<Reserves />}/>
        <Route path='/coupon' element={<Cupon />}/>
        <Route path='/membership' element={<Benefit />}/>
        <Route path='/userinformation' element={<Userinformation />}/>
        <Route path='/review/write' element={<ReviewWrite />}/>
      </Routes>
      </div>
    </div>
  )
}

export default MyPageMain