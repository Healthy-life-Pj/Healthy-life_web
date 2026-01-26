import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DeliveryAddress, User } from "../../../types";
import axios from "axios";
import {
  CART_CARTITEMS_LIST,
  CART_PATH,
  DELIVER_ADDRESS_GET,
  DELIVER_ADDRESS_PATH,
  GET_USER,
  MAIN_APT_PATH,
  ORDER_PATH,
  ORDER_POST_CART,
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
import qs from "qs";
import { CartItemDto } from "../../../types/dto";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

function CartOrder() {
  const IMP_SRC = "https://cdn.iamport.kr/v1/iamport.js";
  const IMP_CODE = process.env.REACT_APP_IAMPORT_CODE ?? "";
  const location = useLocation();
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const { cartItemIds } = location.state || { cartItemIds: [] };
  const [cartItemData, setCartItemData] = useState<CartItemDto[]>([]);
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [iamportReady, setIamportReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<"card" | "kakaopay">("card");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [productData, setProductData] = useState<CartItemDto[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  const [option, setOption] = React.useState("");
  const [addressData, setAddressData] = useState<DeliveryAddress>({
    deliverAddressId: 0,
    address: "",
    addressDetail: "",
    postNum: 0,
    userId: 0,
    default: false,
  });
  const decodeJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };
  const closeModal = () => {
    setIsOpen(!isOpen);
    navigate("/mypage/")
  };

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  const userdataForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const productFetchData = async () => {
    if (!cookies.token) {
      navigate("/login");
    }
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${CART_PATH}${CART_CARTITEMS_LIST}`,
        {
          params: { cartItemIds },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
      setProductData(response.data.data.cartItem || []);
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
      const u = response.data?.data;
      if (!u || !u.userId) {
        console.warn("유저 정보 누락됨:", u);
        return;
      }
      setUserData((prev) => ({ ...prev, ...u, userId: u.userId }));
    } catch (error) {
      console.error(error);
    }
  };

  const deliverAddressFetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_GET}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      const addressList: DeliveryAddress[] =
        response.data.data.deliverAddressDto || [];
      const defaultAddress = addressList.find((a) => a.default === true);
      if (defaultAddress) {
        setAddressData(defaultAddress);
      } else setIsAddressOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const requestPay = (params: any) =>
    new Promise<any>((resolve, reject) => {
      if (!window.IMP) {
        reject(new Error("Iamport SDK 미로딩"));
        return;
      }

      window.IMP.request_pay(params, (res: any) => {
        if (res?.success) resolve(res);
        else reject(new Error(res?.error_msg || "결제 실패"));
      });
    });

  const calcProductTotal = (items: CartItemDto[]) =>
    items.reduce(
      (sum, item) => sum + item.productPrice * item.productQuantity,
      0
    );

  const productTotal = calcProductTotal(productData);
  const finalAmount = productTotal + 3000;

  const payAndOrderKG = async () => {
    setErrorMsg(null);

    if (!iamportReady) return setErrorMsg("결제 모듈 준비 중입니다.");
    if (!addressData?.deliverAddressId)
      return setErrorMsg("배송지를 선택해 주세요.");
    if (!agreed) return setErrorMsg("구매약관에 동의해 주세요.");

    const shippingRequestOption = option?.trim() || "요청사항 없음";

    const payload = cookies.token ? decodeJwt(cookies.token) : null;
    const finalUid = Number(
      userData.userId || payload?.userId || payload?.id || 0
    );
    if (!finalUid) return setErrorMsg("사용자 정보 오류");

    const merchantUid = `HL-CART-U${finalUid}-T${Date.now()}`;

    try {
      setPaying(true);

      const params = {
        pg: "html5_inicis",
        pay_method: payMethod,
        merchant_uid: merchantUid,
        amount: finalAmount,
        buyer_name: userData.name,
        buyer_tel: userData.userPhone,
        custom_data: JSON.stringify({
          userId: finalUid,
          cartItemIds,
          deliverAddressId: addressData.deliverAddressId,
          expectedAmount: finalAmount,
        }),
      };

      const payRsp = await requestPay(params);
      const res = await axios.post(
        `${MAIN_APT_PATH}${ORDER_PATH}${ORDER_POST_CART}`,
        {
          cartItemIds,
          orderRecipientName: userData.name,
          orderRecipientPhone: userData.userPhone,
          shippingRequest: shippingRequestOption,
          deliverAddressId: addressData.deliverAddressId,
          shippingCost: 3000,
          kgPayment: {
            impUid: payRsp.imp_uid,
            merchantUid: payRsp.merchant_uid,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`, 
            "Content-Type": "application/json",
          },
          withCredentials: true,
          validateStatus: () => true,
        }
      );

      if (res.status !== 200 || res.data?.result !== true) {
        throw new Error("ORDER_FAILED");
      }

      setOrderNo(res.data?.data?.orderCode || merchantUid);
      setIsOpen(true);
    } catch (e: any) {
      if (e.message === "ORDER_FAILED") {
        alert("결제는 완료되었으나 주문 생성에 실패했습니다.");
      } else {
        alert("결제 처리 중 오류가 발생했습니다.");
      }
    } finally {
      setPaying(false);
    }
  };

  const didRun = useRef(false);

  const handleClosePaymentModal = () => {
    setIsOpen(false);
    navigate("/mypage/orderApp");
  };

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!cookies.token) {
      navigate("/login");
      return;
    }

    deliverAddressFetchData();
    productFetchData();
    userFetchData();

    if (!IMP_CODE) {
      console.error("REACT_APP_IAMPORT_CODE가 비어 있습니다.");
      return;
    }

    if (window.IMP) {
      window.IMP.init(IMP_CODE);
      setIamportReady(true);
      return;
    }

    const s = document.createElement("script");
    s.src = IMP_SRC;
    s.async = true;
    s.onload = () => {
      window.IMP?.init(IMP_CODE);
      setIamportReady(true);
    };
    s.onerror = () => console.error("Iamport 스크립트 로드 실패");
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    console.log("userId(from GET_USER):", userData.userId);
    console.log("deliverAddressId:", addressData.deliverAddressId);
  }, [userData, addressData]);

  const ready =
    iamportReady &&
    Number(addressData?.deliverAddressId) > 0 &&
    productData.length > 0 &&
    Number(userData?.userId) > 0 &&
    agreed;

  useEffect(() => {
    const reasons: string[] = [];
    if (!iamportReady) reasons.push("결제 모듈 준비 중");
    if (!(Number(addressData?.deliverAddressId) > 0))
      reasons.push("배송지 미선택");
    if (productData.length === 0) reasons.push("상품 정보 미로딩");
    if (!(Number(userData?.userId) > 0)) reasons.push("사용자 정보 확인 중");
    if (!agreed) reasons.push("약관 동의 필요");
  }, [iamportReady, addressData?.deliverAddressId, userData?.userId, agreed]);

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
            />
            <TextField
              className="deliveryTextField"
              label="전화번호"
              name="userPhone"
              variant="standard"
              value={userData.userPhone ?? ""}
              onChange={userdataForm}
            />
          </Box>
        </div>
        <ul className="deliveryAddress" key={addressData.deliverAddressId}>
          <li>{addressData.postNum}</li>
          <li>{addressData.address}</li>
          <li>{addressData.addressDetail}</li>
        </ul>
        <button onClick={() => setIsAddressOpen(true)}>주소변경</button>
        <div className="productInformationContainer section">
          <h3>상품정보</h3>
          <div className="productInformation">
            {productData.length === 0 ? (
              <p>선택된 상품이 없습니다.</p>
            ) : (
              productData.map((product) => (
                <div key={product.cartItemId}>
                  <div className="orderProductImgPDiv">
                    <div className="orderProductImgDiv">
                      <img
                        src={product.pImgUrl}
                        alt={product.pName}
                        className="orderProductImg"
                      />
                    </div>
                    <p className="dailySet">{product.pName}</p>
                  </div>
                  <ul className="orderProductUl">
                    <li>
                      <span className="orderProductInfo">상품금액: </span>
                      {product.productPrice.toLocaleString()}원
                    </li>
                    <li>
                      <span className="orderProductInfo">주문수량: </span>
                      {product.productQuantity}
                    </li>
                    <li>
                      <span className="orderProductInfo">총 금액: </span>
                      {(product.productPrice * product.productQuantity).toLocaleString()}원
                    </li>
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="deliveryRequest section">
          <Box sx={{ width: "100%", minWidth: 100, margin: "1%" }}>
            <FormControl fullWidth>
              <InputLabel id="delivery-req-label">배송요청사항</InputLabel>
              <Select
                labelId="delivery-req-label"
                value={option}
                label="배송요청사항"
                onChange={handleChange}
              >
                <MenuItem value="직접 수령하겠습니다">직접 수령하겠습니다</MenuItem>
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
          <label style={{ display: "block", marginBottom: 8 }}>
            <input
              type="radio"
              name="paymethod"
              checked={payMethod === "card"}
              onChange={() => setPayMethod("card")}
            />
            &nbsp;신용/체크카드 (KG이니시스)
          </label>
        </div>
      </div>
      <div className="payInformation">
        <h3>결제 정보</h3>
        <ul>
          <li className="payInformationLi">
            <span className="orderProductInfo">상품금액 : </span>
            {productTotal.toLocaleString()}원
          </li>
          <li className="payInformationLi">
            <span className="orderProductInfo">배송비 : </span>
            3,000원
          </li>
          <li className="payInformationLi">
            <span className="orderProductInfo">총 결제 금액 : </span>
            {finalAmount.toLocaleString()}원
          </li>
        </ul>

        <div className="checkBoxFlexBox">
          <Checkbox
            {...label}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>구매약관조건 동의</span>
        </div>

        <button disabled={!ready} onClick={payAndOrderKG}>
          {paying ? "처리 중..." : "결제하고 주문하기"}
        </button>
      </div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={handleClosePaymentModal}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <div className="paymentModalFlexBox">
          <h2>결제가 완료되었습니다.</h2>
          {orderNo && (
            <p style={{ marginTop: 8 }}>
              주문번호: <strong>#{orderNo}</strong>
            </p>
          )}
          <button
            onClick={handleClosePaymentModal}
            className="paymentModalCloseButton"
          >
            닫기
          </button>
        </div>
      </ReactModal>
    </div>
  </div>
);
}
export default CartOrder;
