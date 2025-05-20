import React from 'react'
import '../../../style/mypage/Order.css'



function Return() {
  return (
    <div className='orderSearchContainer'>
    <div className='monthBtn'>
    <button>1개월</button>
    <button>6개월</button>
    <button>12개월</button>
    </div>
    <div className='orderDate'>
    <input type="date" /><span>~</span><input type="date" />
    </div>
    <button className='searchBtn'>조회</button>
  </div>
  )
}

export default Return;