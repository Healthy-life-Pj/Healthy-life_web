import React, { useState } from 'react'
import { OrderDetailResponseDto } from '../../../types/dto'

interface orderDetailProps {
  id: number
}

const OrderDetailModal: React.FC<orderDetailProps> = (id) => {
  const [orderDetailData, setOrderDetailData] = useState<OrderDetailResponseDto | null>(null);

  const fetch = async() => {
    // try {
    //   const response =  
    // }
  }
  return (
    <div></div>
  )
}

export default OrderDetailModal