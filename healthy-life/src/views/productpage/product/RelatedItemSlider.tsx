import React, { useState } from 'react'
import '../../../style/detailProductSlider/productSlider.css'

interface productImages{
  images: string[]
}


const RelatedItemSlider: React.FC<productImages> = ({images}) => {
  const [currentIndex, setCurrentIndex] = useState(0);


  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length -1 : prevIndex -1 ));
  }

  const handleNextClick = () => {
    setCurrentIndex((prevIndex)=> (prevIndex === images.length -1 ? 0 : prevIndex + 1));
  }


  const visibleImages = images.slice(currentIndex, currentIndex + 4);
  if(visibleImages.length < 4){
    visibleImages.push(...images.slice(0, 4 -visibleImages.length));
  }

  return (
    <div>
      <div className='relatedItem'>
      <button className='prevButton' onClick={handlePrevClick}>&#10094;</button>
      <div className='relatedItemImagesContainer'>
        {visibleImages.map((image, index) => (
          <div key={index} className='relatedItemImage'>
            <img src={image} alt={`slide ${index}`} />
          </div>
        ))}
      </div>
      <button className='nextButton' onClick={handleNextClick}>&#10095;</button>
        
      </div>
    </div>
  )
}

export default RelatedItemSlider