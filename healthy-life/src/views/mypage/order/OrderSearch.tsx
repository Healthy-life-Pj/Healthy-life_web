import React, { useEffect, useState } from 'react'
import { OrderDto, OrderGetRequestDto } from '../../../types/dto';
import OrderList from './OrderList';
import axios from 'axios';
import { MAIN_APT_PATH, ORDER_PATH } from '../../../constants';
import { useCookies } from 'react-cookie';


function Order() {
  const [cookies] = useCookies(["token"]);
  const [orderDatas, setOrderDatas] = useState<OrderDto[]>([]);

  function formatDateToLocalYYYYMMDD(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split("T")[0];
  }
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
  
    const [orderDate, setOrderDate] = useState<OrderGetRequestDto>({
      startOrderDate: formatDateToLocalYYYYMMDD(thirtyDaysAgo),
      endOrderDate: formatDateToLocalYYYYMMDD(today),
    });

    const getfetchData = async (orderDate: OrderGetRequestDto) => {
      try {
        const response = await axios.get(`${MAIN_APT_PATH}${ORDER_PATH}`, {
          params: orderDate,
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        });
        const allOrder = response.data.data.orders;
        setOrderDatas(allOrder);
      } catch (error) {
        console.error(error);
      }
    };

    const orderDateChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setOrderDate((prev) => ({
        ...prev,
        [name] : value,
      }))
    }

    const month = (month: number) => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      const minusDay = 30 * month;
      thirtyDaysAgo.setDate(today.getDate() - minusDay)
      const newDates = {
        startOrderDate : formatDateToLocalYYYYMMDD(thirtyDaysAgo),
        endOrderDate : formatDateToLocalYYYYMMDD(today),
      };
      setOrderDate(newDates);
      getfetchData(newDates);
    }

    useEffect(() => {
      getfetchData(orderDate);
    }, []);
  
  return (
    <div>
    <div className='orderSearchContainer'>
    <div className='monthBtn'>
    <button onClick={() => month(1)}>1개월</button>
    <button onClick={() => month(6)}>6개월</button>
    <button onClick={() => month(12)}>12개월</button>
    </div>
    <div className='orderDate'>
    <input type="date" name='startOrderDate' value={orderDate.startOrderDate} onChange={orderDateChange}/>
    <span>~</span>
    <input type="date" name='endOrderDate' value={orderDate.endOrderDate} onChange={orderDateChange}/>
    </div>
    <button type='submit' onClick={() => getfetchData(orderDate)} className='searchBtn'>조회</button>
  </div>
  <div className='orderListContainerBox'>
    <OrderList orderDatas={orderDatas} getfetchData={() => getfetchData(orderDate)}/>
  </div>
  </div>
  )
}

export default Order