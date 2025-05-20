import React from 'react'
import BestItem from './BestItem'
import '../../../style/home/main2.css'
import '../../../style/home/productList.css'



const images = ['https://cdn.pixabay.com/photo/2017/08/25/11/10/plum-2679782_1280.jpg',
  'https://cdn.pixabay.com/photo/2023/04/26/19/56/pasta-7953208_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/03/05/19/02/vegetables-1238252_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/09/23/09/31/smoothie-3697014_1280.jpg',
  'https://cdn.pixabay.com/photo/2015/04/05/10/15/natural-products-707578_1280.jpg'];


export default function BestItemApp() {
  return (
    <div className='bestItem'>
      <div className='h3bestItem'>
      <h3>인기상품</h3>
      </div>
      <BestItem images={images} />
    </div>
  )
}
