import React from 'react'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import '../../../style/mypage/ReviewWrite.css'
import { Link } from 'react-router-dom';

function ReviewWrite() {
  return (
    <div className='ReviewWriteContainer'>
      <h2>후기등록</h2>
        <div className='ReviewStar'>
          <StarBorderIcon />
          <StarBorderIcon />
          <StarBorderIcon />
          <StarBorderIcon />
          <StarBorderIcon />
        </div>
        <form className='formContainer'>
        <div className='ReviewWriteTitleDiv'>
        <label htmlFor="">제목</label> 
        <span className='titleLine'>|</span>    
        <input type="text" className='ReviewWriteTitle'/>
        </div>
          <textarea className='ReviewWriteContent' placeholder='내용을 입력해주세요.'/>
        </form>
        <div className='ImgContainer'>
          <div className='ImgContainerDiv'></div>
          <div className='ImgContainerDiv'></div>
          <div className='ImgContainerDiv'></div>
          <div className='fileBox'>
            <label htmlFor="">업로드</label>
            <input type="file" className='fileInpout'/>
          </div>
        </div>
          <div className='ReviewWriteBtn'>
            <Link to={'/mypage/myreview'}><button className='reviewWritebtn'>등록</button></Link>
            <Link to={'/mypage/myreview'}><button className='reviewWritebtn'>취소</button></Link>
          </div>
    </div>
  )
}

export default ReviewWrite