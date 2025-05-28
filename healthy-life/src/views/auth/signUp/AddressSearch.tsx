import { useEffect } from "react";
import { DeliveryAddress } from "../../../types";
import "../../../style/auth/signUp/address.css";

interface AddressSearchProps {
  addressData: DeliveryAddress;
  setAddressData: React.Dispatch<React.SetStateAction<DeliveryAddress>>;
  validMessage:string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  addressData,
  setAddressData,
  validMessage
}) => {
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
          value={addressData.addressDetail}
          onChange={(e) =>
            setAddressData((prev) => ({
              ...prev,
              addressDetail: e.target.value,
            }))
          }
          placeholder="상세주소 (필요시 건물명을 기입해주세요.)"
        />
      </div>
    </div>
  );
};

export default AddressSearch;
