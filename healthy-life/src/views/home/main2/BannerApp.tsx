import React from 'react'
import Banner from './Banner'


const bannerImages =[
  "https://cdn.pixabay.com/photo/2016/04/02/18/28/strawberries-1303374_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/08/19/18/46/plums-1605914_1280.jpg"
]







export default function BannerApp() {
  
  return (
    <div className='banner'>
      <Banner bannerImages= {bannerImages} />
    </div>
  )
}