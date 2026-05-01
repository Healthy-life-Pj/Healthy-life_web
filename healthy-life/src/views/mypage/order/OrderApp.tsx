import React from 'react'
import BasicTabs from './BasicTabs'
import '../../../style/mypage/Order.css'

function OrderApp() {
  return (
    <div className='orderContainer'>
      <h2>주문내역 조회</h2>
      <BasicTabs />
    </div>
  )
}

export default OrderApp

