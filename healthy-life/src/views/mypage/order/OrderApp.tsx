import React from 'react'
import BasicTabs from './BasicTabs'
import '../../../style/mypage/Order.css'

function OrderApp() {
  return (
    <div className='orderContainer'>
      <h2>나의 주문처리 현황</h2>
      <BasicTabs />
    </div>
  )
}

export default OrderApp

