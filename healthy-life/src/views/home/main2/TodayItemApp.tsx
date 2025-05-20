import React from 'react'
import TodayItem from './TodayItem'



const images = [
  'https://cdn.pixabay.com/photo/2017/08/25/11/10/plum-2679782_1280.jpg',
  'https://cdn.pixabay.com/photo/2023/04/26/19/56/pasta-7953208_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/03/05/19/02/vegetables-1238252_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/09/23/09/31/smoothie-3697014_1280.jpg',
  'https://cdn.pixabay.com/photo/2015/04/05/10/15/natural-products-707578_1280.jpg'
];


export default function TodayItemApp() {
  return (
    <div className='todayItem'>
      <div className='h3TodayItem'>
      <h3>오늘의 아이템</h3>
      </div>
      <TodayItem images={images}/>
    </div>
  )
}
