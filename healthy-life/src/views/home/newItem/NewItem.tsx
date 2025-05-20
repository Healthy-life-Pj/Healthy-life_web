import React from 'react'
import NewItemSlider from './NewItemSlider'
import '../../../style/home/main1.css'
export interface ProductProps {
  id: number;
  title: string;
  image: string;
  price: string;
  tag: string;
}

const products: ProductProps[] = [
  {
    id: 1,
    title: "Produt 1",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "20000원",
    tag: '볶음밥'
  },
  {
    id: 2,
    title: "Produt 2",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "20000원",
    tag: '볶음밥'
  },
  {
    id: 3,
    title: "Produt 3",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "20000원",
    tag: '볶음밥'
  },
  {
    id: 4,
    title: "Produt 4",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "30000원",
    tag: '볶음밥'
  },
  {
    id: 5,
    title: "Produt 5",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "29,000원",
    tag: '볶음밥'
  },
  {
    id: 6,
    title: "Produt 6",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "25,000원",
    tag: '볶음밥'
  },
  {
    id: 7,
    title: "Produt 7",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "25,000원",
    tag: '주먹밥'
  },
  {
    id: 8,
    title: "Produt 8",
    image:
      "https://cdn.pixabay.com/photo/2017/08/17/19/40/ukrainian-dill-potatoes-2652561_1280.jpg",
    price: "25,000원",
    tag: '주먹밥'
  }
]


  const NewItem: React.FC = () => {
  return (
    <div className='sliderContainer'>
      <div className='h3Container'>
      <h3>새로운 상품</h3>
      </div>
      <NewItemSlider products={products}  />
    </div>
  )
}

export default NewItem;
