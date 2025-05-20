import React from 'react'
import '../../../style/mypage/Order.css'

function OrderList() {
  return (
    <div> 
    <div className='orderList'>
      <ul className='orderUl'>
        <li className='orderLi'>
          <img src="https://media.istockphoto.com/id/1978764024/ko/%EC%82%AC%EC%A7%84/%EB%8B%AD-%EA%B0%80%EC%8A%B4%EC%82%B4%EC%9D%84-%ED%86%B5%EC%A7%B8%EB%A1%9C-%EA%B5%AC%EC%9B%8C-%EB%A0%88%EB%AA%AC%EC%9D%84-%EA%B3%81%EB%93%A4%EC%9D%B8-%EB%8F%84%EB%A7%88%EC%97%90-%EC%96%87%EA%B2%8C-%EC%8D%AC-%EC%9A%94%EB%A6%AC.jpg?s=612x612&w=is&k=20&c=XhrdCckx2Ll8Et4G0800GOtZqAM7abV5n2HjYtoh1n4=" alt="" />
          <h5>상품이름</h5>
          <p>상품 옵션</p>
          <div className='orderListBtn'>
            <button className='orderBtn'>취소</button>
            <button className='orderBtn'>교환</button>
            <button className='orderBtn'>반품</button>
            <button className='orderBtn'>확정</button>
          </div>
      </li>
      </ul>
    </div>
    </div>
  )
}

export default OrderList