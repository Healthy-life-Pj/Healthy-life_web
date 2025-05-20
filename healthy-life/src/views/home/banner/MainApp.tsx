import React from 'react'

import MainBanner from './MainBanner';
import banner01 from '../../../assets/images/flat-food.jpg'
import banner02 from '../../../assets/images/hand.jpg'

export default function MainApp() {
  const images = [
    banner01,
    banner02,
  ];
  return (
    <div className='images'>
      <MainBanner images={images} />
    </div>
  );
}