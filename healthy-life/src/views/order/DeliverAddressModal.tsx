import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { useCookies } from "react-cookie";
import { DeliveryAddress } from "../../types";
import { DELIVER_ADDRESS_DELETE, DELIVER_ADDRESS_GET, DELIVER_ADDRESS_IS_DEFAULT, DELIVER_ADDRESS_PATH, MAIN_APT_PATH } from "../../constants";
import AddressSearch from "./AddressSearch";
import '../../style/modal/adressModal.css';

interface DeliverAddressProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  AddressFetchData: () => void;
  onSelectAddress: (address: DeliveryAddress) => void; 
}

const DeliverAddressModal: React.FC<DeliverAddressProps> = ({isOpen, onClose, onOpen, onSelectAddress, AddressFetchData}) => {
  const [cookies] = useCookies(["token"]);
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const [addressData, setAddressData] = useState<DeliveryAddress[]>([]);
  const [address, setAddress] = useState<DeliveryAddress>({
    deliverAddressId: 0,
    userId: 0,
    postNum: 0,
    address: "",
    addressDetail: "",
    default: false,
  });

  const openAddressModal = () => {
    setIsOpenSearch(true);
    onClose();
  };

  const closeAddressModal = () => {
    setIsOpenSearch(false);
    onOpen();
  };

  const deliverAddressFetchData = async () => {
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_GET}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        }
      });
      const addressList = response.data.data.deliverAddressDto;
      setAddressData(addressList);
    } catch (error) {
      console.error("배송지 조회 실패:", error);
    }
  };

  const handleSetDefaultAddress = async (deliverAddressId: number) => {
    try {
      await axios.put(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_IS_DEFAULT}/${deliverAddressId}`, {}, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        }
      });
      deliverAddressFetchData();
      AddressFetchData();
    } catch (error) {
      console.error("기본배송지 설정 실패:", error);
    }
  };

  const handleDeleteAddress = async (deliverAddressId: number) => {
    if (!window.confirm("이 배송지를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_DELETE}/${deliverAddressId}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        }
      });
      deliverAddressFetchData();
    } catch (error) {
      console.error("배송지 삭제 실패:", error);
    }
  };

  const handleAddressSelect = (selectedAddress: DeliveryAddress) => {
    setAddress(selectedAddress);
    onSelectAddress(selectedAddress);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      deliverAddressFetchData();
    }
  }, [isOpen]);

  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modalContent"
        overlayClassName="modalOverlay"
        ariaHideApp={false}
      >
        <h2>배송주소</h2>
        <button onClick={openAddressModal}>주소 등록</button>

        <ul className="paymentModalFlexBox">
          {addressData.length > 0 ? (
            addressData.map((a) => (
              <li key={a.deliverAddressId}>
                <div>
                  <input
                    type="radio"
                    name="deliveryAddress"
                    value={a.deliverAddressId}
                    onChange={() => handleAddressSelect(a)}
                    checked={address.deliverAddressId === a.deliverAddressId}
                  />
                </div>
                <div>{a.postNum}</div>
                <div>{a.address}</div>
                <div>{a.addressDetail}</div>
                <button onClick={() => handleSetDefaultAddress(a.deliverAddressId)}>
                  {a.default ? "기본배송지" : "기본배송지 설정"}
                </button>
                <button onClick={() => handleDeleteAddress(a.deliverAddressId)}>삭제</button>
              </li>
            ))
          ) : (
            <li style={{ textAlign: "center", padding: "40px", color: "#999" }}>
              등록된 배송지가 없습니다
            </li>
          )}
        </ul>

        <button onClick={onClose} className="paymentModalCloseButton">
          닫기
        </button>
      </ReactModal>

      <ReactModal
        isOpen={isOpenSearch}
        onRequestClose={closeAddressModal}
        className="modalContent"
        overlayClassName="modalOverlay"
        ariaHideApp={false}
      >
        <h2>주소 검색</h2>
        <AddressSearch
          fetchData={deliverAddressFetchData}
          addressData={address}
          setAddressData={setAddress}
          validMessage=""
          isClose={closeAddressModal}
        />
      </ReactModal>
    </div>
  );
};

export default DeliverAddressModal;
