import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

import '../../style/cart.css'
import { Link } from 'react-router-dom';

// interface CartProps {
//   id: number;
//   title: string;
//   option: string;
//   price: number;
// }

const CartAPP = () => {
  // const [product, setProduct] = useState()
  return (
    <div className='totalCart'>
      <h3>장바구니</h3>
      <div className='cartContainer'> 
        <div className='cartButton'>
          <button>모두선택</button>
          <button>모두해제</button>
        </div>
          <ul className='cartList'>
            <li className='cartLi'>
              <input type="checkbox" className='cartCheckbox'/>
              <img src="https://cdn.pixabay.com/photo/2024/04/08/16/11/ai-generated-8683863_1280.jpg" alt="" className='cartImage'/>
              <h4>상품이름</h4>
              <p>상품옵션</p>
              <input type="number" min={1} className='productAmount'/>
              <p>금액</p>
              <span className='deleteBtn'><CloseIcon /></span>
            </li>
          </ul>

          <div className='totalContainer'>
            <ul className='totalContainerUl'>
              <li className='totalPrice'>
                <p>전체 상품 금액</p> 
                <p className='wonPrice'><span>10,000</span> 원</p>
              </li>
              <li className='deliveryFee'>
                <p>배송비</p>
                <p className='wonPrice'><span>10,000</span> 원</p>
              </li>
              <li className='totalPrice'>
                <p>총 결제금액</p> 
                <p className='wonPrice'><span>10,000</span> 원</p>
              </li>
            </ul>
          </div>
          <div className='processBtn'>
            <button className='processButton'>계속쇼핑하기</button>
            <Link to={'/payment'}><button className='processButton'>결제하기</button></Link>
          </div>
      </div>
    </div>
  )
}

export default CartAPP