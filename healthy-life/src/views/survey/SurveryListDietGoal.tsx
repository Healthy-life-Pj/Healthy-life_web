import React from 'react'
import '../../style/survey/suerveyStyle.css'
import { Link } from 'react-router-dom'

export default function SurveryListDietGoal() {
  return (
    <div>
    <div className='surveyContainer'>
        <h3>체질/기호 선택</h3>
      <h5>식단의 목적이 무엇인가요?</h5>
      <ul className='surveyList'>
        <li>근육증가</li>
        <li>체중감소</li>
        <li>영양소 섭취</li>
        <li>체중증가</li>
      </ul>

      <div className='surveyBtn'>
      <Link to={"/recommand"}><button className='surveyNextBtn'>결과</button></Link>
      <br />
      <Link to={"/"}><button className='surveySkipBtn'>Skip</button></Link>
      </div>
    </div>
    </div>
  )
}
