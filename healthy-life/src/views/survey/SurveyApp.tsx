import React from 'react'
import '../../style/survey/suerveyStyle.css'
import { Link } from 'react-router-dom';

const SurveyApp = () => {
  return (
    <div className='surveyContainer'>
        <h3>체질/기호 선택</h3>
      <h5>평소식단을 어떻게하시나요?</h5>
      <ul className='surveyList'>
        <li>비건식</li>
        <li>육식</li>
        <li>지중해식</li>
        <li>상관없습니다.</li>
      </ul>

      <div className='surveyBtn'>
      <Link to={"/survey/allerge"}><button className='surveyNextBtn'>Next</button></Link>
      <br />
      <Link to={"/"}><button className='surveySkipBtn'>Skip</button></Link>
      </div>
    </div>
  )
}

export default SurveyApp;