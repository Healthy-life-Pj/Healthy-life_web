import { useEffect, useState } from "react";
import { DeliveryAddress } from "../../types";
import "../../style/auth/signUp/address.css";
import axios from "axios";
import { DELIVER_ADDRESS_PATH, MAIN_APT_PATH } from "../../constants";
import { useCookies } from "react-cookie";

interface AddressSearchProps {
  addressData: DeliveryAddress;
  setAddressData: React.Dispatch<React.SetStateAction<DeliveryAddress>>;
  validMessage:string;
  fetchData: () => void;
  isClose: () => void; 
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  addressData,
  setAddressData,
  validMessage,
  fetchData,
  isClose
}) => {
  const [cookies] = useCookies(["token"]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let addr = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

        setAddressData((prev) => ({
          ...prev,
          postNum: Number(data.zonecode),
          address: addr,
        }));
      },
    }).open();
  };

    const createAddressFetchData = async() => {
      try {
        await axios.post(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}`, {
          postNum: addressData?.postNum,
          address: addressData?.address,
          addressDetail: addressData?.addressDetail,
        }, {
          headers : {
            Authorization: `Bearer ${cookies.token}`,
            withCredentials: true,
          }
        });
        fetchData();
        alert("주소등록 완료");
        isClose();
        setAddressData({
          deliverAddressId: 0,
          userId: 0,
          postNum: 0,
          address: "",
          addressDetail: "",
          default: false,
        });
      } catch (error) {
        console.error(error);
      }
    }

    const addressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setAddressData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

  return (
    <div className="addressContainer">
      <div className="titleAndSapnDiv">
      <p className="addressTitle">주소</p> <span className="validMessageSpan" style={{ color: "red" }}>{validMessage}</span>
      </div>
      <div className="addressRow">
        <input
          className="addressPostNumBox"
          type="text"
          value={addressData.postNum === 0 ? "" : addressData.postNum}
          readOnly
          placeholder="우편번호"
        />
        <button type="button" className="buttonSearch" onClick={handleSearchAddress}>
          우편번호 찾기
        </button>
      </div>
      <div className="addressRow">
        <input
          type="text"
          style={{ width: "386px" }}
          className="addressInputBox mainAddress"
          value={addressData.address}
          readOnly
          placeholder="주소"
        />
      </div>
      <div className="addressRow">
        <input
          type="text"
          className="addressInputBox detailAddress"
          name="addressDetail"
          value={addressData.addressDetail}
          onChange={addressChange}
          placeholder="상세주소 (필요시 건물명을 기입해주세요.)"
        />
      </div>
      <button onClick={createAddressFetchData}>주소추가</button>
    </div>
  );
};

export default AddressSearch;
