import React from 'react'
import { Link} from 'react-router-dom'

import  '../../style/componentStyle/SubNav.css'
  
export default function SubNav() {
  return (
    <div> 
      <div className='subNavContainer'>
        <ul>
          <li><Link to='/chicken'>닭가슴살/육류</Link></li>
          <li><Link to='/lunchbox'>도시락</Link></li>
          <li><Link to='/snack'>간식</Link></li>
          <li><Link to='/drink'>음료</Link></li>
          <li><Link to='/salad'>샐러드</Link></li>
          <li><Link to='/vegan'>비건</Link></li>
          <li><Link to='/lowersugar'>저당</Link></li>
          <li><Link to='/sea'>해산물</Link></li>
          <li><Link to='/nuts'>견과류</Link></li>
        </ul>
      </div>  
    </div>
  )
}
