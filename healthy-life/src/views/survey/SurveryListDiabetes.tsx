import React from 'react'
import '../../style/survey/suerveyStyle.css'
import { Link } from 'react-router-dom'

export default function SurveryListDiabetes() {
  return (
    <div>
    <div className='surveyContainer'>
        <h3>체질/기호 선택</h3>
      <h5>평소에 혈당 관리가 필요하신가요?</h5>
      <ul className='surveyList'>
        <li>혈당수치가 평소에 높습니다.</li>
        <li>혈당수치가 평소에 낮습니다.</li>
        <li>상관없습니다.</li>
      </ul>

      <div className='surveyBtn'>
      <Link to={"/survey/dietgoal"}><button className='surveyNextBtn'>Next</button></Link>
      <br />
      <Link to={"/"}><button className='surveySkipBtn'>Skip</button></Link>
      </div>
    </div>
    </div>
  )
}
