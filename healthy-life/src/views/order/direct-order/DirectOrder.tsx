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
  IMG_PATH,
  MAIN_APT_PATH,
  ORDER_PATH,
  PRODUCT_IMG,
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
  const IMP_SRC = "https://cdn.iamport.kr/v1/iamport.js";
  const IMP_CODE = process.env.REACT_APP_IAMPORT_CODE ?? "";

  const { pId, quantity } = useParams();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const [productData, setProductData] = useState<Product>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);
  const [iamportReady, setIamportReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<"card" | "kakaopay">("card");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const decodeJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

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

  const [option, setOption] = useState("");
  const [addressData, setAddressData] = useState<DeliveryAddress>({
    deliverAddressId: 0,
    address: "",
    addressDetail: "",
    postNum: 0,
    userId: 0,
    default: false,
  });

  const handleOpenAddressModal = () => setIsAddressOpen(true);

  const handleClosePaymentModal = () => {
    setIsOpen(false);
    navigate("/mypage/orderApp");
  };

  const userdataForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (event: SelectChangeEvent) => {
    setOption(event.target.value as string);
  };

  const productFetchData = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}/${pId}`,
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
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        },
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
        },
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

  const payAndOrderKG = async () => {
    console.log("결제 버튼 클릭");
    setErrorMsg(null);

    if (!iamportReady) {
      setErrorMsg("결제 모듈 준비 중입니다.");
      return;
    }
    if (!addressData?.deliverAddressId) {
      setErrorMsg("배송지를 선택해 주세요.");
      return;
    }
    if (!agreed) {
      setErrorMsg("구매약관에 동의해 주세요.");
      return;
    }

    const qty = Math.max(Number(quantity ?? 1), 1);
    const totalAmount = (productData?.pPrice ?? 0) * qty + 3000;
    const shippingRequestOption = option?.trim()
      ? option.trim()
      : "요청사항 없음";

    const payload = cookies.token ? decodeJwt(cookies.token) : null;

    const finalUid =
      Number(userData?.userId) ||
      Number(
        payload?.userId ??
          payload?.id ??
          (typeof payload?.sub === "string" && /^\d+$/.test(payload.sub)
            ? payload.sub
            : 0),
      ) ||
      0;

    if (!finalUid) {
      setErrorMsg("사용자 정보를 확인할 수 없습니다. 다시 로그인 해주세요.");
      return;
    }

    const merchantUid = `HL-U${finalUid}-P${pId}-T${Date.now()}`;

    let payRsp: any = null;

    try {
      setPaying(true);

      const params: any = {
        pg: "html5_inicis",
        pay_method: payMethod,
        merchant_uid: merchantUid,
        name: productData?.pName || "헬스라이프 주문",
        amount: totalAmount,
        buyer_name: userData.name || "",
        buyer_tel: userData.userPhone || "",
        custom_data: JSON.stringify({
          userId: finalUid,
          productId: Number(pId),
          quantity: qty,
          deliverAddressId: addressData.deliverAddressId,
          expectedAmount: totalAmount,
        }),
      };

      payRsp = await requestPay(params);

      const res = await axios.post(
        `${MAIN_APT_PATH}${ORDER_PATH}/${pId}`,
        {
          quantity: qty,
          orderRecipientName: userData.name,
          orderRecipientPhone: userData.userPhone,
          shippingRequest: shippingRequestOption,
          shippingCost: 3000,
          deliverAddressId: addressData.deliverAddressId,
          kgPayment: {
            impUid: payRsp.imp_uid,
            merchantUid: payRsp.merchant_uid,
          },
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
          validateStatus: () => true,
        },
      );

      const body = res?.data ?? {};
      const ok = res.status === 200 && body?.result === true;

      const d = body?.data ?? {};
      const orderCode =
        d.orderCode ??
        d.order?.orderCode ??
        (Array.isArray(d.orderDetails) &&
          d.orderDetails[0]?.order?.orderCode) ??
        merchantUid;

      if (!ok) {
        console.warn("주문 실패 → 결제 취소 진행");

        await axios.post(
          `${MAIN_APT_PATH}/payments/iamport/cancel`,
          {
            impUid: payRsp.imp_uid,
            merchantUid: payRsp.merchant_uid,
            reason: "주문 생성 실패로 인한 결제 취소",
          },
          {
            headers: { Authorization: `Bearer ${cookies.token}` },
            withCredentials: true,
          },
        );

        setErrorMsg(
          body?.message || "주문 처리에 실패하여 결제가 취소되었습니다.",
        );
        return;
      }

      setOrderNo(orderCode);
      setIsOpen(true);
    } catch (e: any) {
      const msg = e?.message ?? "";

      if (msg.includes("잔액") || msg.includes("한도")) {
        alert("카드 잔액 또는 한도가 부족합니다.");
      } else if (msg.includes("취소")) {
        alert("결제가 취소되었습니다.");
      } else {
        alert("결제에 실패했습니다.");
      }

      console.error("[ORDER FLOW FAIL]", e);
      setErrorMsg(msg || "처리 중 오류가 발생했습니다.");
    } finally {
      setPaying(false);
    }
  };

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (!cookies.token) {
      // alert 제거
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

  // 불필요했던 deliver.userId 로그 제거
  useEffect(() => {
    console.log("userId(from GET_USER):", userData.userId);
    console.log("deliverAddressId:", addressData.deliverAddressId);
  }, [userData, addressData]);

  // ✅ 결제 버튼 활성 조건에 userId 포함
  const ready =
    iamportReady &&
    Number(addressData?.deliverAddressId) > 0 &&
    productData?.pPrice != null &&
    Number(userData?.userId) > 0;

  useEffect(() => {
    const reasons: string[] = [];
    if (!iamportReady) reasons.push("결제 모듈 준비 중");
    if (!(Number(addressData?.deliverAddressId) > 0))
      reasons.push("배송지 미선택");
    if (productData?.pPrice == null) reasons.push("상품 정보 미로딩");
    if (!(Number(userData?.userId) > 0)) reasons.push("사용자 정보 확인 중");
    if (!agreed) reasons.push("약관 동의 필요");
    console.log("[PAY READY CHECK]", {
      iamportReady,
      deliverAddressId: addressData?.deliverAddressId,
      pPrice: productData?.pPrice,
      userId: userData?.userId,
      agreed,
      reasons,
    });
  }, [
    iamportReady,
    addressData?.deliverAddressId,
    productData?.pPrice,
    userData?.userId,
    agreed,
  ]);

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
                onChange={userdataForm}
                value={userData.userPhone ?? ""}
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
              <div className="orderProductImgPDiv">
                <div className="orderProductImgDiv">
                  <img
                    src={`${IMG_PATH}${PRODUCT_IMG}/${productData?.pImgUrl}`}
                    alt={productData?.pName}
                    className="orderProductImg"
                  />
                </div>
                <p className="dailySet">{productData?.pName}</p>
              </div>
              <ul className="orderProductUl">
                <li className="dailyMany">
                  <span className="orderProductInfo">상품금액: </span>
                  {productData?.pPrice}
                </li>
                <li className="dailyPrice">
                  <span className="orderProductInfo">주문수량: </span>
                  {quantity}
                </li>
                <li className="orderProduct">
                  <span className="orderProductInfo">총 금액: </span>
                  {productData?.pPrice &&
                    productData?.pPrice * Number(quantity)}
                </li>
              </ul>
            </div>
          </div>

          <div className="deliveryRequest section">
            <Box sx={{ width: "100%", minWidth: 100, margin: "1%" }}>
              <FormControl fullWidth>
                <InputLabel id="delivery-req-label">배송요청사항</InputLabel>
                <Select
                  labelId="delivery-req-label"
                  id="delivery-req"
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
              <div className="MethodRadioBox">
                <label style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="radio"
                    name="paymethod"
                    value="card"
                    checked={payMethod === "card"}
                    onChange={() => setPayMethod("card")}
                  />
                  &nbsp;신용/체크카드 (KG이니시스)
                </label>
              </div>
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
                : null}
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
            <Checkbox
              {...label}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
          </div>

          {(!ready || !agreed) && (
            <div
              style={{
                color: "#999",
                marginTop: 6,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              {!iamportReady && "• 결제 모듈 준비 중 "}
              {!(Number(addressData?.deliverAddressId) > 0) && "• 배송지 선택 "}
              {productData?.pPrice == null && "• 상품 정보 확인 "}
              {!agreed && "• 약관 동의 체크 "}
            </div>
          )}

          <button onClick={payAndOrderKG}>
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

        <DeliverAddressModal
          isOpen={isAddressOpen}
          onClose={() => setIsAddressOpen(false)}
          onOpen={handleOpenAddressModal}
          AddressFetchData={deliverAddressFetchData}
          onSelectAddress={(selectedAddress) => setAddressData(selectedAddress)}
        />
      </div>
    </div>
  );
}

export default DirectOrder;
