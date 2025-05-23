import React from 'react'
import "../../../../style/product/productIntroduce.css"
import { ProductDetailResponseDto } from '../../../../types/dto';

interface ProductIntroduceProps {
  data: ProductDetailResponseDto;
}

const ProductIntroduce: React.FC<ProductIntroduceProps> = ({ data }: ProductIntroduceProps) => {
  return (
    <div className='productIntroduceDiv'>
      <ul className='productIntroduceUl'>
        <li className='productIntroduceLi'>
          <div className='productIntroduceLiLi'>제품설명:</div>
          <div className='productIntroduceLiLi'>{data.pDescription}</div>
        </li>
        <li className='productIntroduceLi'>
          <div className='productIntroduceLiLi'>원재료명:</div>
          <div className='productIntroduceLiLi'>{data.pIngredients}</div>
        </li>
        <li className='productIntroduceLi'>
          <div className='productIntroduceLiLi'>영양성분:</div> 
          <div className='productIntroduceLiLi'>{data.pNutritionInfo}</div>
        </li>
        <li className='productIntroduceLi'>
          <div className='productIntroduceLiLi'>조리방법:</div> 
          <div className='productIntroduceLiLi'>{data.pUsage}</div>
        </li>
        <div className='productIntroduceLine'></div>
        <li className='productIntroduceLi'>
          <div className='productIntroduceLiLi'>제조사:</div> 
          <div className='productIntroduceLiLi'>{data.pManufacturer}</div>
        </li>
        <li className='productIntroduceLi'>
          <div className='productIntroduceLiLi'>원산지:</div> 
          <div className='productIntroduceLiLi'>{data.pOrigin}</div>
        </li>
      </ul>
    </div>
  )
}

export default ProductIntroduce