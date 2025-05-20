import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductProps } from './NewItem';

const NewItemSlider: React.FC<{products: ProductProps[]}> = ({ products }) => {
  const [post, setPosts] = useState<ProductProps[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  const [modalOpen, setmodalOpen] = useState(false)

  const handleMouseEnter = (index: number) => {
    setActiveProduct(index);
  }
  const handleMouseLeave = () => {
    setActiveProduct(null);
  }

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
  };

  const openModal = () => {
    setmodalOpen(true);
  };
  const closeModal = () => {
    setmodalOpen(false);
  };

  const visibleImages = products.slice(currentIndex, currentIndex + 3);
  if (visibleImages.length < 3) {
    visibleImages.push(...products.slice(0, 3 - visibleImages.length));
  }

  return (
    <div className='slider'>
        
      <div className='sliderImagesContainer'>
        {visibleImages.map((product, index)=> (
          <div key={product.id} className='sliderImage'>
            <Link to={"/productdetail"}>
            <img 
            src={product.image} 
            alt={`Slide ${index}`} className='newItemImages'
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            />
            <h4>{product.title}</h4>
            <p>{product.price}</p>
            </Link>
            <div
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {activeProduct === index && (
              <div className="newItemSliderHoverBtn">
                <button onClick={openModal}>cart</button>
                <button>WISH</button>
              </div>
            )}
          </div>
          </div>
        ))}
      </div>
      <div className='btnconatainer'>
        <button className="prev" onClick={handlePrevClick}>&#10094;</button>
        <button className="next" onClick={handleNextClick}>&#10095;</button>
      </div>
    </div>
  );
};

export default NewItemSlider;