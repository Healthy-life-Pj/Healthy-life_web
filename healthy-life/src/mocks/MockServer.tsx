import React, { useEffect, useState } from 'react'
// import { Item } from '../types';
import axios from 'axios';

function MockServer() {
  // const [itmes, setItems] = useState<Item[]>([]);

  // const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // // ! 데이터 가져오기(fetch)
  // const fetchItem = async() => {
  //   const reponse = await axios.get('http://localhost:3001/items');
  //   setItems(reponse.data);
  // }

  // useEffect(() => {
  //   fetchItem();
  // }, []);


  return (
    <div>
      <h2>Mock Sever CURD</h2>
      
    </div>
  )
}

export default MockServer