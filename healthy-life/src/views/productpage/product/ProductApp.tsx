import React from 'react'
import Product from './Product';
import ProductTap from './ProductTap';
import "../../../style/detailProductSlider/productSlider.css"
import "../../../style/product/product.css"
import RelatedItemSlider from './RelatedItemSlider';

const images = [
  'https://cdn.pixabay.com/photo/2017/08/25/11/10/plum-2679782_1280.jpg',
  'https://cdn.pixabay.com/photo/2023/04/26/19/56/pasta-7953208_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/03/05/19/02/vegetables-1238252_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/09/23/09/31/smoothie-3697014_1280.jpg',
  'https://cdn.pixabay.com/photo/2015/04/05/10/15/natural-products-707578_1280.jpg'
];

export default function ProductApp() {
  return (
    <div className='productContainer'>
      <br />
      <br />
      <Product images={images}/>
      <br />
      <RelatedItemSlider images={images}/>
      <br />
      <br />
      <ProductTap/>
      <br />
      <br />
      <br />
    </div>
  )
}