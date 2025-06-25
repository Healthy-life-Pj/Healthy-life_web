import React, { useEffect, useState } from "react";
import "../../../style/mypage/MypageMain.css";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { OrderDetailResponseDto, OrderGetRequestDto } from "../../../types/dto";
import { MAIN_APT_PATH, ORDER_PATH } from "../../../constants";
import SmallPagination from "../../../components/SmallPagination";

function Mypage() {
  const [cookies] = useCookies(["token"]);
  const navigator = useNavigate();
  const [datas, setDatas] = useState<OrderDetailResponseDto[]>([]);
  const [orderChangeBtn, setOrderChangeBtn] = useState<String>(''); 
  const [currentPage, setCurrentPage] = useState<number>(1);  
  const [postsPerPage] = useState<number>(5);

  const indexOfLastPsot = currentPage * postsPerPage;
  const indexOfFitstPost = indexOfLastPsot - postsPerPage;
  
  const currentPosts = Array.isArray(datas)
    ? datas.slice(indexOfFitstPost, indexOfLastPsot)
    : [];
    
  const paginate = (pateNumber: number) => setCurrentPage(pateNumber);

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const [orderDate, setOrderDate] = useState<OrderGetRequestDto>({
    startOrderDate: thirtyDaysAgo.toISOString().split('T')[0],
    endOrderDate: today.toISOString().split('T')[0]
  });


  const getfetchData = async (orderDate: OrderGetRequestDto) => {
    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigator(`/login`);
      return;
    }
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${ORDER_PATH}`, {
        params: orderDate,
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
        withCredentials: true,
      });
      setDatas(response.data.data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const putFetchData = async (orderDetailId: number, newStatus: string) => {
    try {
      await axios.put(`${MAIN_APT_PATH}${ORDER_PATH}/${orderDetailId}`, null, 
        {
          params:{ orderStatus: newStatus },
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
        withCredentials: true,
      }
    );

    getfetchData(orderDate);

    } catch (error) {
        console.error(error);
    }
  } 

  function orderStatusCount(status: string) {
    if (!datas) return 0;
    const result =  datas.filter(data => data.orderStatus === status);
    return result.length;
  }

  useEffect(() => {
    getfetchData(orderDate);
  }, []);

  function orderStateKorean(word: string) {
    switch(word) {
      case "PENDING":
        return "대기중"
      case "CONFIRMED": 
        return "확인됨"
      case "PREPARING": 
        return "준비중"
      case "SHIPPED": 
        return "배송중"
      case "DELIVERED": 
        return "배송 완료"
      case "CANCELLED": 
        return "주문 취소"
      case "REFUNDED": 
        return "환불"
      case 'RETURN':
        return '반품';
      case 'EXCHANGE':
        return '교환';
    } 
  }

  return (
    <div>
      <div className="myPageConatiner">
        <div className="mypageAllContainer">
          <div className="mypageSuvContainer">
            <h4>나의 주문처리현황</h4>
            <ul className="olderListUlA">
              <li>
                <span className="mypagePrice">
                  {datas?.length ? orderStatusCount("PENDING") : 0}
                </span>
                <span>대기중</span>
              </li>
              <li className="orderArrow">
                <span className="orderArrow">
                  <ArrowForwardIosRoundedIcon />
                </span>
              </li>
              <li>
                <span className="mypagePrice">
                  {datas?.length ? orderStatusCount("CONFIRMED") : 0}
                </span>
                <span>확인됨</span>
              </li>
              <li className="orderArrow">
                <span className="orderArrow">
                  <ArrowForwardIosRoundedIcon />
                </span>
              </li>
              <li>
                <span className="mypagePrice">
                  {datas?.length ? orderStatusCount("PREPARING") : 0}
                </span>
                <span>배송준비중</span>
              </li>
              <li className="orderArrow">
                <span className="orderArrow">
                  <ArrowForwardIosRoundedIcon />
                </span>
              </li>
              <li>
                <span className="mypagePrice">
                  {datas?.length ? orderStatusCount("SHIPPED") : 0}
                </span>
                <span>배송중</span>
              </li>
              <li>
                <span className="orderArrow">
                  <ArrowForwardIosRoundedIcon />
                </span>
              </li>
              <li>
                <span className="mypagePrice"></span>
                {datas?.length ? orderStatusCount("DELIVERED") : 0}
                <span>배송완료</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="orderListCotainer">
          <ul className="orderListUl">
            {currentPosts.map((data, index) => (
              <li className="myPageOrderInfoBox" key={data.orderDetailId}>
                <p className="orderListUlLiP myPageOrderStatusP">{orderStateKorean(data.orderStatus)}</p>
                <div className="myOrderLi">
                <div className="orderProductImgDiv">
                <img className="orderProductImg" src={data.pImgUrl} alt={data.pName} />
                </div>
                <div className="myPageOrderInfoDiv">
                <p className="orderListUlLiP myPageOrderDateP">{data.orderDate}</p>
                <p className="orderListUlLiPName">{data.pName}</p>
                {/* <p className="orderListUlLiPName">{data.price.toLocaleString()}원</p>
                <p className="orderListUlLiPName">{data.quantity} 개</p>
                <p className="orderListUlLiPName">{data.totalPrice.toLocaleString()}원</p> */}
                <p className="orderListUlLiP"><span>결제금액 : </span>{data.totalAmount.toLocaleString()}원</p>
                <button>상세보기</button>
                </div>
                </div>
                <div className="myPageOrderBtnDiv">
                  <button
                    className="myPageOrderBtn"
                    onClick={(e) => putFetchData(data.orderDetailId, "CANCELLED")}
                  >
                    취소
                  </button>
                  <button
                    className="myPageOrderBtn"
                    onClick={(e) => putFetchData(data.orderDetailId, "RETURN")}
                  >
                    반품
                  </button>
                  <button
                    className="myPageOrderBtn"
                    onClick={(e) => putFetchData(data.orderDetailId, "EXCHANGE")}
                  >
                    교환
                  </button>
                </div>
                {Array.isArray(currentPosts) && index < currentPosts.length - 1 && <div className="orderListLine"></div>}
              </li>
            ))}
          </ul>
            <SmallPagination currentPage={currentPage} paginate={paginate} productPerPage={postsPerPage}   totalProducts={Array.isArray(datas) ? datas.length : 0}/>
        </div>
      </div>
    </div>
  );
}

export default Mypage;
