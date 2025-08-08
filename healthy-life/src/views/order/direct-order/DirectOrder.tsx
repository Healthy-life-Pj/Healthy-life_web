import React, { useEffect, useRef, useState } from "react";
import "../../../style/payment/payment.css";
import { useNavigate, useParams } from "react-router-dom";
import { DeliveryAddress, Product, User } from "../../../types";
import axios from "axios";
import {
  AUTH_PATH,
  DELIVER_ADDRESS_GET,
  DELIVER_ADDRESS_PATH,
  GET_USER,
  MAIN_APT_PATH,
  ORDER_PATH,
  PRODUCT_PATH,
  USER_PATH,
} from "../../../constants";
import { useCookies } from "react-cookie";
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import "../../../style/Order.css";
import ReactModal from "react-modal";
import DeliverAddressModal from "../DeliverAddressModal";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

function DirectOrder() {
  const { pId, quantity } = useParams();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [productData, setProductData] = useState<Product>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<User>({
    userId: 0,
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    userNickName: "",
    userGender: "F",
    userBirth: new Date(),
    userEmail: "",
    userPhone: "",
    userMemberGrade: "병아리",
    joinPath: "home",
    snsId: null,
  });

  const handleOpenAddressModal = () => {
    setIsAddressOpen(true);
  }

  const closeAddressModal = () => {
    setIsAddressOpen(!isAddressOpen);
  }

  const [option, setOption] = React.useState("");
  const [addressData, setAddressData] = useState<DeliveryAddress>({
    deliverAddressId: 0,
    address: "",
    addressDetail: "",
    postNum: 0,
    userId: 0,
    default: false,
  });

  const userdataForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  const productFetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}/${pId}`
      );
      setProductData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const userFetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${USER_PATH}${GET_USER}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      setUserData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

    const deliverAddressFetchData = async () => {
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_GET}`, {
        headers : {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        }
      });
      const addressList = response.data.data.deliverAddressDto
      const defaultAddress = addressList.filter((a:DeliveryAddress) => a.default === true)[0];
      setAddressData(defaultAddress);
    } catch (error) {
      console.error(error);
    }
  }

  const orderFetchData = async () => {
    try {
      await axios.post(
        `${MAIN_APT_PATH}${ORDER_PATH}/${pId}`,
        {
          quantity: quantity,
          orderRecipientName: userData.name,
          orderRecipientPhone: userData.userPhone,
          shippingRequest: option,
          deliverAddressId: addressData.deliverAddressId, 
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      setIsOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    if (!cookies.token) {
      navigate("/login");
      alert("로그인이 필요합니다.");
    }
    deliverAddressFetchData();
    productFetchData();
    userFetchData();
  }, []);

  return (
    <div className="paymentHead">
      <h3>주문 결제</h3>
      <div className="paymentContainer">
        <div className="pay1Container">
          <div className="deliveryAddress section">
            <h3>배송지</h3>
            <Box
              component="form"
              className="customBox"
              noValidate
              autoComplete="off"
            >
              <TextField
                className="deliveryTextField"
                label="성함"
                variant="standard"
                name="name"
                value={userData.name ?? ""}
                onChange={userdataForm}
                style={{ fontSize: "13px" }}
              />
              <TextField
                className="deliveryTextField"
                label="전화번호"
                name="userPhone"
                variant="standard"
                onChange={userdataForm}
                value={userData.userPhone ?? ""}
              />
            </Box>
          </div>

          <ul className='deliveryAddress' key={addressData.deliverAddressId}>
            <li>{addressData.postNum}</li>
            <li>{addressData.address}</li>
            <li>{addressData.addressDetail}</li>
          </ul>
          <button onClick={() => setIsAddressOpen(true)}>주소변경</button>
          <div className="productInformationContainer section">
            <h3>상품정보</h3>
            <div className="productInformation">
              <div className="orderProductImgPDiv">
                <div className="orderProductImgDiv">
                  <img
                    src={productData?.pImageUrl}
                    alt={productData?.pName}
                    className="orderProductImg"
                  />
                </div>
                <p className="dailySet">{productData?.pName}</p>
              </div>
              <ul className="orderProductUl">
                <li className="dailyMany">
                  {" "}
                  <span className="orderProductInfo">상품금액: </span>{" "}
                  {productData?.pPrice}
                </li>
                <li className="dailyPrice">
                  <span className="orderProductInfo">주문수량: </span>{" "}
                  {quantity}
                </li>
                <li className="orderProduct">
                  <span className="orderProductInfo">총 금액: </span>{" "}
                  {productData?.pPrice &&
                    productData?.pPrice * Number(quantity)}
                </li>
              </ul>
            </div>
          </div>

          <div className="deliveryRequest section">
            <Box sx={{ width: "100%", minWidth: 100, margin: "1%" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  배송요청사항
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={option}
                  label="option"
                  onChange={handleChange}
                >
                  <MenuItem value="직접 수령하겠습니다">
                    직접 수령하겠습니다
                  </MenuItem>
                  <MenuItem value="부재 시 경비실에 맡겨주세요">
                    부재 시 경비실에 맡겨주세요
                  </MenuItem>
                  <MenuItem value="배송 전 연락 바랍니다">
                    배송 전 연락 바랍니다
                  </MenuItem>
                  <MenuItem value="문 앞에 놔두십시오">
                    문 앞에 놔두십시오
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          <div className="paymentMethod section">
            <h3>결제방법 선택</h3>
            <div className="MethodButtonBox">
              <button className="orderMothodBtn">KG결제</button>
              <button className="orderMothodBtn">카카오결제</button>
            </div>
          </div>
        </div>
        <div className="payInformation">
          <h3>결제 정보</h3>
          <ul>
            <li className="payInformationLi">
              <span className="orderProductInfo">상품금액 : </span>
              {productData?.pPrice
                ? productData?.pPrice * Number(quantity)
                : null}{" "}
              개
            </li>
            <li className="payInformationLi">
              <span className="orderProductInfo">배송비 : </span>
              3,000원
            </li>
            <li className="payInformationLi">
              <span className="orderProductInfo">총 결제 금액 : </span>
              {productData?.pPrice
                ? productData?.pPrice * Number(quantity) + 3000
                : null}
            </li>
          </ul>
          <div className="checkBoxFlexBox">
            <Checkbox {...label} />
            <span>구매약관조건 동의</span>
          </div>
          <button onClick={orderFetchData}>결제하기</button>
        </div>
        <ReactModal
          isOpen={isOpen}
          onRequestClose={closeAddressModal}
          className="modalContent"
          overlayClassName="modalOverlay"
        >
          <div className="paymentModalFlexBox">
            <h2>결제가 완료되었습니다.</h2>
              <button onClick={closeAddressModal} className="paymentModalCloseButton">
                닫기
              </button>
          </div>
        </ReactModal>
        <DeliverAddressModal 
        isOpen={isAddressOpen} 
        onClose={closeAddressModal} 
        onOpen={handleOpenAddressModal}
        AddressFetchData={deliverAddressFetchData}
        onSelectAddress={(selectedAddress) => setAddressData(selectedAddress)}
        />
      </div>
    </div>
  );
}
export default DirectOrder;
