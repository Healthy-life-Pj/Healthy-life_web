import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import axios from "axios";
import { DELIVER_ADDRESS_DELETE, DELIVER_ADDRESS_GET, DELIVER_ADDRESS_IS_DEFAULT, DELIVER_ADDRESS_PATH, MAIN_APT_PATH } from "../../constants";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { DeliveryAddress } from "../../types";
import AddressSearch from "./AddressSearch";

interface DeliverAddressProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  AddressFetchData: () => void;
  onSelectAddress: (address: DeliveryAddress) => void; 
}

const DeliverAddressModal: React.FC<DeliverAddressProps> = ({isOpen, onClose, onOpen, onSelectAddress, AddressFetchData}) => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const [addressData, setAddressData] = useState<DeliveryAddress[]>([]);
  const [validAddress, setValidAddress] = useState<string>("");
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
  }

  const closeAddressModal = () => {
    setIsOpenSearch(false);
    onOpen();
  }

  const deliverAddressFetchData = async () => {
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_GET}`, {
        headers : {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        }
      });
      const addressList = response.data.data.deliverAddressDto
      setAddressData(addressList);
    } catch (error) {
      console.error(error);
    }
  }

  const isDefaultAddressFetchData = async (deliverAddressId:number) => {
    try {
      await axios.put(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_IS_DEFAULT}/${deliverAddressId}`, {}, {
        headers : {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        }
      });
      deliverAddressFetchData();
      AddressFetchData();
    } catch (error) {
      console.error(error);
    }
  }

  const deleteDeliverAddressFetchData = async (deliverAddressId:number) => {
    try {
      await axios.delete(`${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_DELETE}/${deliverAddressId}`, {
        headers : {
          Authorization: `Bearer ${cookies.token}`,
          withCredentials: true,
        }
      });
      deliverAddressFetchData();
    }  catch (error) {
      console.error(error);
    }
  }

  const handleAddressSelect = (selectedAddress: DeliveryAddress) => {
    setAddress(selectedAddress);
    onSelectAddress(selectedAddress);
    onClose();                     
  }

  useEffect(() => {
    deliverAddressFetchData();
  }, []);

  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
        <h2>배송주소</h2>
        <button onClick={openAddressModal}>주소등록</button>
        <ul className="paymentModalFlexBox" >
          {addressData.map((a, idx) => 
          <li key={`${a.deliverAddressId}-${idx}`}>
            <div><input type="radio" value={a.deliverAddressId} onChange={() => handleAddressSelect(a)}/></div>
            <div>{a.postNum}</div>
            <div>{a.address}</div>
            <div>{a.addressDetail}</div>
            <button onClick={() => isDefaultAddressFetchData(a.deliverAddressId) }>{a.default ? <p>기본배송지</p> : <p>기본배송지 설정</p> }</button>
            <button onClick={() => deleteDeliverAddressFetchData(a.deliverAddressId)}>삭제</button>
            <button onClick={() => deleteDeliverAddressFetchData(a.deliverAddressId)}>수정</button>
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
      >
        주소검색
        <AddressSearch
          fetchData={deliverAddressFetchData}
          addressData={address}
          setAddressData={setAddress}
          validMessage={validAddress}
          isClose={closeAddressModal}
        />
      </ReactModal>
    </div>
  );
};

export default DeliverAddressModal;
