import React, { useEffect, useState } from "react";
import "../../../style/mypage/Order.css";
import {
  OrderDto
} from "../../../types/dto";
import SmallPagination from "../../../components/SmallPagination";
import ReactModal from "react-modal";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import { IMG_PATH, MAIN_APT_PATH, ORDER_PATH, ORDER_PUT_ORDER_STATUS, ORDER_PUT_RETURN_EXCHAGE } from "../../../constants";
import { useCookies } from "react-cookie";

interface OrderSearchResultProps {
  orderDatas: OrderDto[];
  getfetchData: () => Promise<void>;
}

const OrderList = ({ orderDatas, getfetchData }: OrderSearchResultProps) => {
    const [cookies] = useCookies(["token"]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage] = useState<number>(4);
  const [openOrderDetailId, setOpenOrderDetailId] = useState<number | null>(
    null
  );
  const [selectOrderDetail, setSelectOrderDetail] = useState<number[]>([]);
  const [orders, setOrders] = useState<OrderDto[]|undefined>(undefined);
  
  const toggleOpen = (id: number) => {
    setOpenOrderDetailId((prev) => (prev === id ? null : id));
  };
  
  const indexOfLastPsot = currentPage * postsPerPage;
  const indexOfFitstPost = indexOfLastPsot - postsPerPage;
  
  const currentPosts = Array.isArray(orders)
  ? orders.slice(indexOfFitstPost, indexOfLastPsot)
  : [];
  const openOrder = orders?.find((order) => order.orderId === openOrderDetailId);

  const paginate = (pateNumber: number) => setCurrentPage(pateNumber);

  const putFetchData = async (orderDetailId: number[], newStatus: string) => {
      try {
        await axios.put(`${MAIN_APT_PATH}${ORDER_PATH}${ORDER_PUT_ORDER_STATUS}`, {orderDetailIds : orderDetailId}, {
          params: { orderStatus: newStatus },
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        });
        getfetchData();
      } catch (error) {
        console.error(error);
      }
    };

  const cancelReturnAndExchage = async(orderDetailId:number) => {
    try{
      await axios.put(`${MAIN_APT_PATH}${ORDER_PATH}${ORDER_PUT_RETURN_EXCHAGE}/${orderDetailId}`, {
        headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
      });
        getfetchData();
    } catch (error) {
      console.log(error);
    }
  }

  const orderCancel = async(imp:string) => {
    try{
      console.log("openOrder:", openOrder);
      console.log("impUid:", openOrder?.impUid);
      await axios.post(`${MAIN_APT_PATH}${ORDER_PATH}/pay/cancel`, 
        {impUid : imp},
        { headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
      })
      getfetchData();
    } catch (error) {
      console.error(error);
    }
  }

useEffect(() => {
  setOrders(orderDatas);
}, [orderDatas]);

  function getOrderSummaryName(order: OrderDto) {
    const firstProductName = order.orderDetails[0].pName;
    const extraCount = order.orderDetails.length - 1;

    return extraCount > 0
      ? `${firstProductName} 외 ${extraCount}개`
      : `${firstProductName}`;
  }


  function orderStatusButtonContent(orderStatus: string) {
    if (orderStatus === "RETURN_REQUEST") {
      return "반품취소";
    } else if (orderStatus === "EXCHANGE_REQUEST") {
      return "교환취소";
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

    case "RETURN_REQUEST":
      return "반품 신청";
    case "RETURN_IN_PROGRESS":
      return "반품 진행중";
    case "RETURNED":
      return "반품 완료";

    case "EXCHANGE_REQUEST":
      return "교환 신청";
    case "EXCHANGE_IN_PROGRESS":
      return "교환 진행중";
    case "EXCHANGED":
      return "교환 완료";

    default:
      return "";
  }
}

    const handleCheckBoxChange = (orderDetailId:number) => {
    setSelectOrderDetail(prev => 
      prev.includes(orderDetailId)
      ? prev.filter(id => id !== orderDetailId)
      : [...prev, orderDetailId]
    );
  };

  return (
    <div>
      <div className="orderList">
        <ul className="orderListUl">
          {currentPosts.map((data, index) => (
            <li className="myPageOrderInfoBox" key={data.orderId}>
              <div className="myOrderOrderDateDetailBtnDiv">
                <p className="orderListUlLiP myPageOrderDateP">
                  {data.orderCode}
                </p>
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
                      border: "none"
                    }}
                  />
                </button>
              </div>
              <div className="myPageOrderInfoDiv">
                <div>
                  <div>
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
                  {data.totalAmount?.toLocaleString()}원
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
                <p className="orderDetailModalInfoP">{openOrder.orderDate}</p>
              </div>
              <div className="orderDetailModalOrderContent">
                {openOrder.orderDetails.map((orderDetail) => (
                  <div
                    className="orderDetailModalContainer"
                    key={orderDetail.orderDetailId}
                  >
                    <p className="orderDetailModalOrderStatus">
                      {orderStateKorean(orderDetail.orderStatus)}
                    </p>
                    <div className="orderDetailModlaImgPDiv">
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCheckBoxChange(orderDetail.orderDetailId)
                        }
                      />
                      <div className="orderDetailModalImgDiv">
                        <img
                          className="orderDetailModalImg"
                          src={``}
                          alt={orderDetail.pName}
                        />
                      </div>
                      <div className="orderDetailModalPNameDiv">
                        <p className="orderDetailModalPName">
                          {orderDetail.pName}
                        </p>
                      </div>
                      <div className="orderModalCancelBtnDiv">
                        {["RETURNED", "EXCHANGED"].includes(
                          orderDetail.orderStatus
                        ) ? (
                          <button
                            className="orderStatusChangeCancelBtn"
                            onClick={() =>
                              cancelReturnAndExchage(orderDetail.orderDetailId)
                            }
                          >
                            {orderStatusButtonContent(orderDetail.orderStatus)}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <ul className="orderDetailModalList">
                      <li className="orderDetailModalListLi">
                        <span className="orderDetailModalListLiSpan">
                          수량 :
                        </span>{" "}
                        {orderDetail.quantity}개
                      </li>
                      <li className="orderDetailModalListLi">
                        <span className="orderDetailModalListLiSpan">
                          제품가 :
                        </span>{" "}
                        {orderDetail.price.toLocaleString()}원
                      </li>
                      <li className="orderDetailModalListLi">
                        <span className="orderDetailModalListLiSpan">
                          총 상품금액 :
                        </span>{" "}
                        {orderDetail.totalPrice.toLocaleString()}원
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
              <div className="orderStatusChangeBtnDiv">
                <button
                  className="orderStatusChangeBtn"
                  onClick={() => orderCancel(openOrder.impUid)}
                >
                  취소
                </button>
                <button
                  className="orderStatusChangeBtn"
                  onClick={() => putFetchData(selectOrderDetail, "RETURN_REQUEST")}
                >
                  반품
                </button>
                <button
                  className="orderStatusChangeBtn"
                  onClick={() => putFetchData(selectOrderDetail, "EXCHANGE_REQUEST")}
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
  );
};

export default OrderList;
