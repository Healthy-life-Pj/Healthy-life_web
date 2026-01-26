import React, { useEffect, useState } from "react";
import "../../../style/mypage/MypageMain.css";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  OrderDto,
  OrderGetRequestDto,
} from "../../../types/dto";
import { IMG_PATH, MAIN_APT_PATH, ORDER_PATH, ORDER_PUT_ORDER_STATUS } from "../../../constants";
import SmallPagination from "../../../components/SmallPagination";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ReactModal from "react-modal";

function Mypage() {
  const [cookies] = useCookies(["token"]);
  const navigator = useNavigate();
  const [orderDatas, setOrderDatas] = useState<OrderDto[]>([]);
  const [selectOrderDetail, setSelectOrderDetail] = useState<number[]>([]);
  const [orderChangeBtn, setOrderChangeBtn] = useState<String>("");
  const [openOrderDetailId, setOpenOrderDetailId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);

  function formatDateToLocalYYYYMMDD(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split("T")[0];
  }

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [orderDate] = useState<OrderGetRequestDto>({
    startOrderDate: formatDateToLocalYYYYMMDD(thirtyDaysAgo),
    endOrderDate: formatDateToLocalYYYYMMDD(today),
  });

  const indexOfLastPsot = currentPage * postsPerPage;
  const indexOfFitstPost = indexOfLastPsot - postsPerPage;

  const currentPosts = Array.isArray(orderDatas)
    ? orderDatas.slice(indexOfFitstPost, indexOfLastPsot)
    : [];

  const paginate = (pateNumber: number) => setCurrentPage(pateNumber);

  const toggleOpen = (id: number) => {
    setOpenOrderDetailId((prev) => (prev === id ? null : id));
  };

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
  
  const openOrder = orderDatas.find((order) => order.orderId === openOrderDetailId);

  const handleCheckBoxChange = (orderDetailId:number) => {
    setSelectOrderDetail(prev => 
      prev.includes(orderDetailId)
      ? prev.filter(id => id !== orderDetailId)
      : [...prev, orderDetailId]
    );
  };

  const putFetchData = async (orderDetailId: number[], newStatus: string) => {
    try {
      await axios.put(`${MAIN_APT_PATH}${ORDER_PATH}${ORDER_PUT_ORDER_STATUS}`, {orderDetailIds : orderDetailId}, {
        params: { orderStatus: newStatus },
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
        withCredentials: true,
      });

      getfetchData(orderDate);
    } catch (error) {
      console.error(error);
    }
  };

  function orderStatusCount(status: string) {
    if (!orderDatas) return 0;
    const result = orderDatas.filter((data) =>
      data.orderDetails.some((detail) => detail.orderStatus === status)
    );
    return result.length;
  }

  useEffect(() => {
    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigator(`/login`);
      return;
    }
    getfetchData(orderDate);
  }, []);

  function getOrderSummaryName(order: OrderDto) {
    const firstProductName = order.orderDetails[0].pName;
    const extraCount = order.orderDetails.length - 1;

    return extraCount > 0
      ? `${firstProductName} 외 ${extraCount}개`
      : `${firstProductName}`;
  }

  function orderStatusButtonContent(orderStatus: string) {
    if(orderStatus === "RETURN") {
      return "반품취소"
    } else if (orderStatus === "EXCHANGE") {
      return "교환취소"
    } else {
    return "";
    }
  }

  function orderStateKorean(word: string) {
    switch (word) {
      case "PENDING":
        return "대기중";
      case "CONFIRMED":
        return "확인됨";
      case "PREPARING":
        return "준비중";
      case "SHIPPED":
        return "배송중";
      case "DELIVERED":
        return "배송 완료";
      case "CANCELLED":
        return "주문 취소";
      case "REFUNDED":
        return "환불";
      case "RETURN":
        return "반품";
      case "EXCHANGE":
        return "교환";
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
                  {orderDatas?.length ? orderStatusCount("PENDING") : 0}
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
                  {orderDatas?.length ? orderStatusCount("CONFIRMED") : 0}
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
                  {orderDatas?.length ? orderStatusCount("PREPARING") : 0}
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
                  {orderDatas?.length ? orderStatusCount("SHIPPED") : 0}
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
                {orderDatas?.length ? orderStatusCount("DELIVERED") : 0}
                <span>배송완료</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="orderListCotainer">
          <p className="mypageCommentP">당일 기준 30일이내의 주문건만 조회 됩니다.</p>
          <ul className="orderListUl">
            {currentPosts.map((data, index) => (
              <li className="myPageOrderInfoBox" key={data.orderId}>
                <div className="myOrderOrderDateDetailBtnDiv">
                    <p className="orderListUlLiP myPageOrderCodeP">
                      {data.orderCode}
                    </p>
                  <button
                    className="orderDetailBtn"
                    onClick={() => toggleOpen(data.orderId)}
                  >
                    <ArrowForwardIosIcon
                      style={{
                        backgroundColor: "#e0e0e0",
                        color: "black",
                        border: "none",
                        fontSize: "15px"
                      }}
                    />
                  </button>
                </div>
                <div className="myPageOrderInfoDiv">
                  <div className="myPageOrderListContent">
                    <div className="myPageOrderImgDiv">
                      <img
                        src={`${IMG_PATH}${data.orderDetails[0].pImgUrl}`}
                        alt={data.orderDetails[0].pName}
                      />
                    </div>
                    <p className="orderListUlLiP orderListPname">
                      {getOrderSummaryName(data)}
                    </p>
                  </div>
                  <p className="orderListUlLiP orderListTotalAmount">
                    {(data.totalAmount+3000).toLocaleString()} 원
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <ReactModal
            isOpen={openOrderDetailId != null}
            onRequestClose={() => setOpenOrderDetailId(null)}
            className="orderDetailmodalContent"
            overlayClassName="modal-overlay"
          >
            {openOrder && (
              <>
                <div className="orderDetailModalInfoDiv">
                  <p className="orderDetailModalInfoP">
                    <span>수령인 : </span>
                    {openOrder.orderRecipientName}
                  </p>
                  <p className="orderDetailModalInfoP">
                    <span>연락처 : </span>
                    {openOrder.orderRecipientPhone}
                  </p>
                  <p className="orderDetailModalInfoP">
                    <span>주소 : </span>
                    {openOrder.deliverAddress?.postNum}
                    {openOrder.deliverAddress?.address}
                    {openOrder.deliverAddress?.addressDetail}
                  </p>
                  <p className="orderDetailModalInfoP">
                    <span>주문번호 : </span>{openOrder.orderCode}
                  </p>
                  <p className="orderDetailModalInfoP">
                    <span>주문날짜 : </span> {openOrder.orderDate.replaceAll("-",".").slice(0, 9) + "." + openOrder.orderDate.slice(11, 19)}
                  </p>
                </div>
                <div className="orderDetailModalOrderContent">
                {openOrder.orderDetails.map(orderDetail => (
                <div className="orderDetailModalContainer" key={orderDetail.orderDetailId}>
                  <p className="orderDetailModalOrderStatus">{orderStateKorean(orderDetail.orderStatus)}</p>
                  <div className="orderDetailModlaImgPDiv">
                  <input type="checkbox" onChange={() => handleCheckBoxChange(orderDetail.orderDetailId)}/>
                  <div className="orderDetailModalImgDiv">
                    <img className="orderDetailModalImg"
                      src={`${IMG_PATH}${orderDetail.pImgUrl}`}
                      alt={orderDetail.pName}
                    />
                  </div>
                  <div className="orderDetailModalPNameDiv">
                    <p className="orderDetailModalPName">{orderDetail.pName}</p>
                  </div>
                  <div className="orderModalCancelBtnDiv">
                  {["RETURN", "EXCHANGE"].includes(orderDetail.orderStatus) 
                  ?
                  <button
                    className="orderStatusChangeCancelBtn"
                    onClick={() => putFetchData([orderDetail.orderDetailId], "DELIVERED") 
                    }
                  >{orderStatusButtonContent(orderDetail.orderStatus)}</button>
                  : null
                  }
                  </div>
                  </div>
                  <ul className="orderDetailModalList">
                    <li className="orderDetailModalListLi"><span className="orderDetailModalListLiSpan">수량 :</span> {orderDetail.quantity}개</li>
                    <li className="orderDetailModalListLi"><span className="orderDetailModalListLiSpan">제품가 :</span> {orderDetail.price.toLocaleString()}원</li>
                    <li className="orderDetailModalListLi"><span className="orderDetailModalListLiSpan">총 상품금액 :</span> {orderDetail.totalPrice.toLocaleString()}원</li>
                  </ul>
                </div>
                ))}
                </div>
                <div className="orderStatusChangeBtnDiv">
                  <button
                    className="orderStatusChangeBtn"
                    onClick={() => putFetchData(selectOrderDetail, "CANCELLED") 
                    }
                  >
                    취소
                  </button>
                  <button
                    className="orderStatusChangeBtn"
                    onClick={() =>  putFetchData(selectOrderDetail,  "RETURN")
                    }
                  >
                    반품
                  </button>
                  <button
                    className="orderStatusChangeBtn"
                    onClick={() => putFetchData(selectOrderDetail, "EXCHANGE")
                    }
                  >
                    교환
                  </button>
                </div>
              </>
            )}
          </ReactModal>
          <SmallPagination
            currentPage={currentPage}
            paginate={paginate}
            productPerPage={postsPerPage}
            totalProducts={Array.isArray(orderDatas) ? orderDatas.length : 0}
          />
        </div>
      </div>
    </div>
  );
}

export default Mypage;
