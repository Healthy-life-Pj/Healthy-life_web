import React, { useEffect, useState } from "react";
import "../../../style/mypage/MypageMain.css";

import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  OrderDetailDto,
  OrderDto,
  OrderGetRequestDto,
} from "../../../types/dto";
import { MAIN_APT_PATH, ORDER_PATH } from "../../../constants";
import SmallPagination from "../../../components/SmallPagination";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Mypage() {
  const [cookies] = useCookies(["token"]);
  const navigator = useNavigate();
  const [orderDatas, setOrderDatas] = useState<OrderDto[]>([]);
  const [orderChangeBtn, setOrderChangeBtn] = useState<String>("");
  const [openOrderDetailId, setOpenOrderDetailId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(5);

  const indexOfLastPsot = currentPage * postsPerPage;
  const indexOfFitstPost = indexOfLastPsot - postsPerPage;

  const currentPosts = Array.isArray(orderDatas)
    ? orderDatas.slice(indexOfFitstPost, indexOfLastPsot)
    : [];

  const paginate = (pateNumber: number) => setCurrentPage(pateNumber);

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const [orderDate, setOrderDate] = useState<OrderGetRequestDto>({
    startOrderDate: thirtyDaysAgo.toISOString().split("T")[0],
    endOrderDate: today.toISOString().split("T")[0],
  });

  const toggleOpen = (id: number) => {
    setOpenOrderDetailId((prev) => (prev === id ? null : id));
  };

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
      const allOrder = response.data.data.orders;
      setOrderDatas(allOrder);
    } catch (error) {
      console.error(error);
    }
  };

  const putFetchData = async (orderDetailId: number, newStatus: string) => {
    try {
      await axios.put(`${MAIN_APT_PATH}${ORDER_PATH}/${orderDetailId}`, null, {
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
    getfetchData(orderDate);
  }, []);
  
useEffect(() => {
  console.log("🔎 전체 주문 수:", orderDatas.length);
  orderDatas.forEach((o) => {
    console.log(`📦 주문번호 ${o.orderId}: 상품 수 = ${o.orderDetails?.length}`);
  });
}, [orderDatas]);


  function getOrderSummaryName(order: OrderDto) {
    const firstProductName = order.orderDetails[0].pName;
    const extraCount = order.orderDetails.length - 1;

    return extraCount > 0
      ? `${firstProductName} 외 ${extraCount}개`
      : `${firstProductName}`;
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
          <ul className="orderListUl">
            {currentPosts.map((data, index) => (
              <li className="myPageOrderInfoBox" key={data.orderId}>
                <div className="myOrderOrderDateDetailBtnDiv">
                  <p className="orderListUlLiP myPageOrderDateP">
                    {data.orderDate}
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
                      }}
                    />
                  </button>
                </div>
                <div className="myPageOrderInfoDiv">
                  <div>
                    <div>
                      <img src={data.orderDetails?.[0]?.pImgUrl || "/default.jpg"} alt="" />
                    </div>
                    <p className="orderListUlLiP orderListPname">
                      {getOrderSummaryName(data)}
                    </p>
                  </div>
                  <p className="orderListUlLiP orderListTotalAmount">
                    {data.totalAmount?.toLocaleString()}원
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {/* <ReactModal
            isOpen={openOrderDetailId != null}
            onRequestClose={() => setOpenOrderDetailId(null)}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            {orderDatas && (
              <div>
                <div>
                  <div>
                    <img
                      src={openOrderDetail.pImgUrl}
                      alt={openOrderDetail.pName}
                    />
                  </div>
                  <div>
                    <p>
                      <span>수령인 : </span>
                      {openOrderDetail.orderRecipientName}
                    </p>
                    <p>
                      <span>연락처 : </span>
                      {openOrderDetail.orderRecipientPhone}
                    </p>
                    <p>
                      <span>주소 : </span>
                      {openOrderDetail.deliverAddress.postNum}
                      {openOrderDetail.deliverAddress.address}
                      {openOrderDetail.deliverAddress.addressDetail}
                    </p>
                  </div>
                  <div className="myPageOrderBtnDiv">
                    <button
                      className="myPageOrderBtn"
                      onClick={(e) =>
                        putFetchData(data.orderDetailId, "CANCELLED")
                      }
                    >
                      취소
                    </button>
                    <button
                      className="myPageOrderBtn"
                      onClick={(e) =>
                        putFetchData(data.orderDetailId, "RETURN")
                      }
                    >
                      반품
                    </button>
                    <button
                      className="myPageOrderBtn"
                      onClick={(e) =>
                        putFetchData(data.orderDetailId, "EXCHANGE")
                      }
                    >
                      교환
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ReactModal> */}
          {}
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
