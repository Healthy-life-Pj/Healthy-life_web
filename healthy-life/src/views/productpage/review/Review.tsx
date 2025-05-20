import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { AccountCircle } from '@mui/icons-material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import '../../../style/Review.css'
import { Pagination } from '@mui/material';


function Review() {
  return (
    <div className='productReviewContainer'>
      <div className='titleSelctDiv'>
      <h5>전체 후기</h5>
      <div className='labelInput'>
      <select className='reviewSelect' style={{width: '55px'}} name="" id="">
        <option value="">최신순</option>
        <option value="">과거순</option>
      </select>
      <div>
        <label>키워드 검색</label>
        <input type="text" />
        <SearchIcon style={{fontSize: '15px'}}/>
      </div>
      </div>
      </div>
      <div>
            <ul className='totalUl'>
              <li className='reviewDetaiLi'>
                <div className='reviewImgSpanDiv'>
                <div className='reviewli'>
                <div className='reviewInform'>
                <AccountCircle/>
                </div>
                <div className='reviewStar'>
                  <div>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  </div>
                <span className='idDat'>(id****) | (등록날짜)</span>
                </div>
                </div>
                  <pre>리뷰 내용 ...... 끄젓끄젓 </pre>
            </div>
            <img src="https://media.istockphoto.com/id/1978764024/ko/%EC%82%AC%EC%A7%84/%EB%8B%AD-%EA%B0%80%EC%8A%B4%EC%82%B4%EC%9D%84-%ED%86%B5%EC%A7%B8%EB%A1%9C-%EA%B5%AC%EC%9B%8C-%EB%A0%88%EB%AA%AC%EC%9D%84-%EA%B3%81%EB%93%A4%EC%9D%B8-%EB%8F%84%EB%A7%88%EC%97%90-%EC%96%87%EA%B2%8C-%EC%8D%AC-%EC%9A%94%EB%A6%AC.jpg?s=2048x2048&w=is&k=20&c=iSrDKGXu-EYF_B7sAk_VQhJ8A3bRnkMCZQ_Ahyz2Enc=" alt="" />
                </li>

              <li className='reviewDetaiLi'>
                <div className='reviewImgSpanDiv'>
                <div className='reviewli'>
                <div className='reviewInform'>
                <AccountCircle/>
                </div>
                <div className='reviewStar'>
                  <div>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  <StarBorderIcon style={{fontSize: "10px"}}/>
                  </div>
                <span className='idDat'>(id****) | (등록날짜)</span>
                </div>
                </div>
                  <pre>리뷰 내용 ...... 끄젓끄젓 </pre>
            </div>
            <img src="https://media.istockphoto.com/id/1978764024/ko/%EC%82%AC%EC%A7%84/%EB%8B%AD-%EA%B0%80%EC%8A%B4%EC%82%B4%EC%9D%84-%ED%86%B5%EC%A7%B8%EB%A1%9C-%EA%B5%AC%EC%9B%8C-%EB%A0%88%EB%AA%AC%EC%9D%84-%EA%B3%81%EB%93%A4%EC%9D%B8-%EB%8F%84%EB%A7%88%EC%97%90-%EC%96%87%EA%B2%8C-%EC%8D%AC-%EC%9A%94%EB%A6%AC.jpg?s=2048x2048&w=is&k=20&c=iSrDKGXu-EYF_B7sAk_VQhJ8A3bRnkMCZQ_Ahyz2Enc=" alt="" />
                </li>
            </ul>
      </div>
      <div className='pagination'>
      <Pagination />
      </div>
    </div>
  )
}

export default Review