import React from 'react'
import { Link, useNavigate} from 'react-router-dom'

import  '../../style/componentStyle/SubNav.css'
  
export default function SubNav() {
  const navigate = useNavigate();

  const pCategoryNameNavigate = (pCategoryName:string) => {
    navigate(`/products/${pCategoryName}`);
  }
  return (
    <div> 
      <div className='subNavContainer'>
        <ul>
        <li className='subNavibarCursor' onClick={() => pCategoryNameNavigate("닭가슴살_육류")}>닭가슴살/육류</li>
          <li onClick={() => pCategoryNameNavigate("도시락")}>도시락</li>
          <li onClick={() => pCategoryNameNavigate("간식")}>간식</li>
          <li onClick={() => pCategoryNameNavigate("음료")}>음료</li>
          <li onClick={() => pCategoryNameNavigate("샐러드")}>샐러드</li>
          <li onClick={() => pCategoryNameNavigate("비건")}>비건</li>
          <li onClick={() => pCategoryNameNavigate("저당")}>저당</li>
          <li onClick={() => pCategoryNameNavigate("해산물")}>해산물</li>
          <li onClick={() => pCategoryNameNavigate("견과류")}>견과류</li>
        </ul>
      </div>  
    </div>
  )
}
