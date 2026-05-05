import React, { useEffect, useState } from "react";
import "../../../style/mypage/MypageMain.css";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { User } from "../../../types";
import axios from "axios";
import {
  GET_USER,
  MAIN_APT_PATH,
  ORDER_PATH,
  USER_PATH,
} from "../../../constants/api";
import { useCookies } from "react-cookie";
import { OrderDto, OrderGetRequestDto } from "../../../types/dto";
import { useNavigate } from "react-router-dom";

function MypageUp() {
  const nabigator = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [orderDatas, setOrderDatas] = useState<OrderDto[]>([]);
  const [cookies] = useCookies(["token"]);
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  function formatDateToLocalYYYYMMDD(date: Date): string {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split("T")[0];
  }

  const [orderDate] = useState<OrderGetRequestDto>({
    startOrderDate: formatDateToLocalYYYYMMDD(thirtyDaysAgo),
    endOrderDate: formatDateToLocalYYYYMMDD(today),
  });

  const userInfoData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${USER_PATH}${GET_USER}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        },
      );
      setUserData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const orderFetchData = async () => {
    const validStatus = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "SHIPPED",
      "DELIVERED",
    ];
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${ORDER_PATH}`, {
        params: orderDate,
        headers: { Authorization: `Bearer ${cookies.token}` },
        withCredentials: true,
      });
      const orderList: OrderDto[] = response.data.data.orders;
      setOrderDatas(
        orderList.filter((o) =>
          o.orderDetails.some((od) => validStatus.includes(od.orderStatus)),
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    userInfoData();
    orderFetchData();
  }, []);

  return (
    <div className="mypageMainContainer">
      <ul className="mypageUpUl">
        <li>
          <AccountCircleIcon />
          <br />
          {userData?.userNickName}
        </li>
        <li className="myshoppingLine"></li>
        <li>
          <MilitaryTechIcon />
          <br />
          {userData?.userMemberGrade}
        </li>
        <li className="myshoppingLine"></li>
        <li className="mypageUpIcon" onClick={() => nabigator("/my-page/membership")}>
          <CardMembershipIcon />
          <br />
          멤버십
        </li>
        <li className="myshoppingLine"></li>
        <li className="mypageUpIcon" onClick={() => nabigator("/my-page")}>
          <LocalShippingIcon />
          <br />
          <span>{orderDatas.length}개</span>
          <br />
          주문
        </li>
      </ul>
    </div>
  );
}

export default MypageUp;
