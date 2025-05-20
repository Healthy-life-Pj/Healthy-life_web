import React, { useState } from 'react'
import '../../../style/currentProduct/currentProduct.css'
import { Link } from 'react-router-dom';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


function CurrentProduct() {

  const[knell1, setKnell1] = useState<string>('')
  const[knell2, setKnell2] = useState<string>('')
  const[knell3, setKnell3] = useState<string>('')
  const[knell4, setKnell4] = useState<string>('')
  const [value, setValue] = React.useState<number | null>(4);
  
  
  
  
  const buttonClickHandler1 = () => {
    if(knell1 === ''){
      alert('등록되었습니다.')
      setKnell1('삭제되었습니다.')
    } else if (knell1 === '삭제되었습니다.'){
      alert('삭제되었습니다.')
      setKnell1('')
    } 
    }  
    
    
    const buttonClickHandler2 = () =>{
      if (knell2 === ''){
        alert('등록되었습니다.')
        setKnell2('삭제되었습니다.')
    } else if (knell2 === '삭제되었습니다.'){
      alert('삭제되었습니다.')
      setKnell2('')
    }
}
  
  const buttonClickHandler3 = () =>{
    if (knell3 === ''){
      alert('등록되었습니다.')
      setKnell3('삭제되었습니다.')
    } else if (knell3 === '삭제되었습니다.'){
      alert('삭제되었습니다.')
      setKnell3('')
    }
  }

  const buttonClickHandler4 = () =>{
    if (knell4 === ''){
      alert('등록되었습니다.')
      setKnell4('삭제되었습니다.')
    } else if (knell4 === '삭제되었습니다.'){
      alert('삭제되었습니다.')
      setKnell4('')
    }
  } 
  
  
  return (
    <div className='currentProductContainer'>
      <h2>최근 본 상품</h2>
      <br />
    <div className='imagesFlexBox'>
      <div className='imageBox'>
      <img src="https://cdn.pixabay.com/photo/2017/02/15/10/39/salad-2068217_1280.jpg" alt="최근본상품이미지1" />
      <br />
      <p>[웰메이드] 저칼로리 야채 파스타</p>
      <br />
      <Box
      sx={{
        '& > legend': { mt: 4 },
      }}
      >
      <Rating name="read-only" value={value} readOnly />
      </Box>
      <br />
      <br />
      <h3>13,000원</h3>
      <br />
      <br />
      <hr />
      <br />
      <Link className='button2Link' to={'/cart'}><LocalGroceryStoreIcon /></Link>
      <button onClick={buttonClickHandler1}>{
        knell1 ? <FavoriteOutlinedIcon/> :
        <FavoriteBorderOutlinedIcon/>
        }</button>
      <DeleteOutlineOutlinedIcon/>
      </div>

      <div className='imageBox'>
      <img src="https://cdn.pixabay.com/photo/2016/03/05/19/02/vegetables-1238252_1280.jpg" alt="최근본상품이미지2" />
      <br />
      <p>유기농 종합 야채 선물 세트 </p>
      <br />
      <Box
      sx={{
        '& > legend': { mt: 4 },
      }}
      >
      <Rating name="read-only" value={value} readOnly />
      </Box>
      <br />
      <br />
      <h3>49,000원</h3>
      <br />
      <br />
      <hr />
      <br />
      <Link className='button2Link' to={'/cart'}><LocalGroceryStoreIcon /></Link>
      <button onClick={buttonClickHandler2}>{
        knell2 ?   <FavoriteOutlinedIcon/> :
        <FavoriteBorderOutlinedIcon/>
        }</button>
      <DeleteOutlineOutlinedIcon/>
      </div>

      <div className='imageBox'>
      <img src="https://cdn.pixabay.com/photo/2018/09/23/09/31/smoothie-3697014_1280.jpg" alt="최근본상품이미지3" />
      <br />
      <p>유기농 야채 스무디 500ML</p>
      <br />
      <Box
      sx={{
        '& > legend': { mt: 4 },
      }}
      >
      <Rating name="read-only" value={value} readOnly />
      </Box>
      <br />
      <br />
      <h3>10,000원</h3>
      <br />
      <br />
      <hr />
      <br />
      <Link className='button2Link' to={'/cart'}><LocalGroceryStoreIcon /></Link>
      <button onClick={buttonClickHandler3}>{
        knell3 ?   <FavoriteOutlinedIcon/> :
        <FavoriteBorderOutlinedIcon/>
        }</button>
      <DeleteOutlineOutlinedIcon/>
      </div>

      <div className='imageBox'>
      <img src="https://cdn.pixabay.com/photo/2017/08/25/11/10/plum-2679782_1280.jpg" alt="최근본상품이미지4" />
      <br />
      <p>[냉동] 데일리 블루베리 세트</p>
      <br />
      <Box
      sx={{
        '& > legend': { mt: 4 },
      }}
      >
      <Rating name="read-only" value={value} readOnly />
      </Box>
      <br />
      <br />
      <h3>45,000원</h3>
      <br />
      <br />
      <hr />
      <br />
      <Link className='button2Link' to={'/cart'}><LocalGroceryStoreIcon /></Link>
      <button onClick={buttonClickHandler4}>{
        knell4 ?   <FavoriteOutlinedIcon/> :
        <FavoriteBorderOutlinedIcon/>
        }</button>
      <DeleteOutlineOutlinedIcon/>
      </div>
      
    </div>
    
    </div>
  )
}


export default CurrentProduct