import React from 'react'
import '../../style/survey/suerveyStyle.css'
import { Link } from 'react-router-dom'

export default function SurveryListAllerge() {
  return (
    <div>
    <div className='surveyContainer'>
        <h3>체질/기호 선택</h3>
      <h5>평소에 알레르기가 있나요?</h5>
      <ul className='surveyList'>
        <li>견과류</li>
        <li>갑각류</li>
        <li>유제품</li>
        <li>상관없습니다.</li>
      </ul>

      <div className='surveyBtn'>
      <Link to={"/survey/diabetes"}><button className='surveyNextBtn'>Next</button></Link>
      <br />
      <Link to={"/"}><button className='surveySkipBtn'>Skip</button></Link>
      </div>
    </div>
    </div>
  )
}
