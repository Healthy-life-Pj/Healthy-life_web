import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  AUTH_PATH,
  DELIVER_ADDRESS_DELETE,
  DELIVER_ADDRESS_GET,
  DELIVER_ADDRESS_IS_DEFAULT,
  DELIVER_ADDRESS_PATH,
  DUPLICATE_NICKNAME,
  GET_USER,
  MAIN_APT_PATH,
  USER_PATH,
} from "../../../constants";
import { DeliveryAddress } from "../../../types";
import ChangePassword from "./ChangePassword";
import DeliverAddressModal from "../../order/DeliverAddressModal";
import "../../../style/userInformation/userInformation.css";

interface UserInfo {
  username: string;
  name: string;
  userNickName: string;
  userEmail: string;
  userPhone: string;
  userBirth: string;
  userGender: "M" | "F";
  userMemberGrade: string;
}

function Userinformation() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["token"]);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    name: "",
    userNickName: "",
    userEmail: "",
    userPhone: "",
    userBirth: "",
    userGender: "M",
    userMemberGrade: "",
  });
  const [originalInfo, setOriginalInfo] = useState<UserInfo | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressList, setAddressList] = useState<DeliveryAddress[]>([]);

  const fetchUserInfo = async () => {
    if (!cookies.token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${USER_PATH}${GET_USER}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      const data = response.data.data;
      const info: UserInfo = {
        username: data.username || "",
        name: data.name || "",
        userNickName: data.userNickName || "",
        userEmail: data.userEmail || "",
        userPhone: data.userPhone || "",
        userBirth: data.userBirth ? data.userBirth.split("T")[0] : "",
        userGender: data.userGender || "M",
        userMemberGrade: data.userMemberGrade || "",
      };
      setUserInfo(info);
      setOriginalInfo(info);
    } catch (error) {
      console.error(error);
      alert("회원정보를 불러오는데 실패했습니다.");
    }
  };

  const fetchAddressList = async () => {
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_GET}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      setAddressList(response.data.data.deliverAddressDto || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetDefault = async (deliverAddressId: number) => {
    try {
      await axios.put(
        `${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_IS_DEFAULT}/${deliverAddressId}`,
        {},
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      fetchAddressList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAddress = async (deliverAddressId: number) => {
    if (!window.confirm("이 배송지를 삭제하시겠습니까?")) return;
    try {
      await axios.delete(
        `${MAIN_APT_PATH}${DELIVER_ADDRESS_PATH}${DELIVER_ADDRESS_DELETE}/${deliverAddressId}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      fetchAddressList();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchAddressList();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender: "M" | "F") => {
    setUserInfo((prev) => ({ ...prev, userGender: gender }));
  };

  const handleCheckNickname = async () => {
    if (!userInfo.userNickName.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${DUPLICATE_NICKNAME}${userInfo.userNickName}`
      );
      if (response.data.result) {
        alert("사용 가능한 닉네임입니다.");
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error(error);
      alert("닉네임 중복확인에 실패했습니다.");
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${MAIN_APT_PATH}${USER_PATH}${GET_USER}`,
        {
          name: userInfo.name,
          userNickName: userInfo.userNickName,
          userEmail: userInfo.userEmail,
          userPhone: userInfo.userPhone,
          userBirth: userInfo.userBirth,
          userGender: userInfo.userGender,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      alert("회원정보가 수정되었습니다.");
      fetchUserInfo();
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message || "회원정보 수정에 실패했습니다.";
      alert(msg);
    }
  };

  const handleCancel = () => {
    if (originalInfo) {
      setUserInfo(originalInfo);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletePassword || !deleteConfirmPassword) {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    if (deletePassword !== deleteConfirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return;
    }
    try {
      await axios.delete(`${MAIN_APT_PATH}${USER_PATH}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
        withCredentials: true,
        data: {
          userPassword: deletePassword,
          confirmUserPassword: deleteConfirmPassword,
        },
      });
      alert("회원 탈퇴가 완료되었습니다.");
      removeCookie("token", { path: "/" });
      navigate("/");
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message || "회원 탈퇴에 실패했습니다.";
      alert(msg);
    }
  };

  return (
    <div className="userInformationallContainer">
      <div className="userInformationContainer">
        <h3>회원정보 수정</h3>
        <br />

        <div className="idContainer">
          <label>아이디</label>
          <div className="idInputContainer">
            <input
              type="text"
              value={userInfo.username}
              readOnly
              style={{ backgroundColor: "#e9e9e9", cursor: "not-allowed" }}
            />
          </div>
        </div>

        <div className="nickNameContainer">
          <label>닉네임 *</label>
          <div className="nickNameInputContainer">
            <input
              type="text"
              name="userNickName"
              value={userInfo.userNickName}
              onChange={handleChange}
              placeholder="닉네임"
            />
            <button onClick={handleCheckNickname}>중복확인</button>
          </div>
        </div>

        <div className="passwordContainer">
          <label>비밀번호 *</label>
          <input
            type="text"
            value="********"
            readOnly
            onClick={() => setPasswordModalOpen(true)}
            style={{ cursor: "pointer" }}
            placeholder="클릭하여 비밀번호 변경"
          />
        </div>

        <div className="nickNameContainer">
          <label>이름 *</label>
          <div className="nickNameInputContainer">
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              placeholder="이름"
              style={{ width: "204px" }}
            />
          </div>
        </div>

        <div className="telePhoneContainer1">
          <label>휴대전화 *</label>
          <div className="telePhoneInputContainer1">
            <input
              type="text"
              name="userPhone"
              value={userInfo.userPhone}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <div className="emailContainer">
          <label>이메일 *</label>
          <input
            type="text"
            name="userEmail"
            value={userInfo.userEmail}
            onChange={handleChange}
            placeholder="이메일"
          />
        </div>

        <div className="birthdayContainer">
          <label>생년월일 *</label>
          <input
            type="date"
            name="userBirth"
            value={userInfo.userBirth}
            onChange={handleChange}
          />
        </div>

        <div className="genderContainer">
          <div className="genderLabelContainer">
            <label>성별 *</label>
          </div>
          <div className="genderCheckBox">
            <div>
              <label>남</label>
            </div>
            <div>
              <input
                type="radio"
                name="userGender"
                checked={userInfo.userGender === "M"}
                onChange={() => handleGenderChange("M")}
              />
            </div>
            <div>
              <label>여</label>
            </div>
            <div>
              <input
                type="radio"
                name="userGender"
                checked={userInfo.userGender === "F"}
                onChange={() => handleGenderChange("F")}
              />
            </div>
          </div>
        </div>

        <div className="modifyButton">
          <button onClick={handleSubmit}>수정</button>
          <button onClick={handleCancel}>취소</button>
        </div>
      </div>

      <div className="addressSectionContainer">
        <div className="addressSectionHeader">
          <h3>배송지 관리</h3>
          <button
            className="addressAddBtn"
            onClick={() => setAddressModalOpen(true)}
          >
            배송지 추가
          </button>
        </div>
        {addressList.length > 0 ? (
          <ul className="addressListUl">
            {addressList.map((addr) => (
              <li key={addr.deliverAddressId} className="addressListItem">
                <div className="addressInfo">
                  {addr.default && (
                    <span className="defaultBadge">기본</span>
                  )}
                  <span className="addressPostNum">[{addr.postNum}]</span>
                  <span>{addr.address} {addr.addressDetail}</span>
                </div>
                <div className="addressActions">
                  {!addr.default && (
                    <button onClick={() => handleSetDefault(addr.deliverAddressId)}>
                      기본배송지 설정
                    </button>
                  )}
                  <button onClick={() => handleDeleteAddress(addr.deliverAddressId)}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="noAddressText">등록된 배송지가 없습니다.</p>
        )}
      </div>

      <div className="deleteUserSection">
        <button
          className="deleteUserBtn"
          onClick={() => setDeleteModalOpen(true)}
        >
          회원 탈퇴
        </button>
      </div>

      {passwordModalOpen && (
        <ChangePassword onClose={() => setPasswordModalOpen(false)} />
      )}

      {deleteModalOpen && (
        <div
          className="passwordModalOverlay"
          onClick={() => {
            setDeleteModalOpen(false);
            setDeletePassword("");
            setDeleteConfirmPassword("");
          }}
        >
          <div
            className="passwordModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>회원 탈퇴</h3>
            <p style={{ fontSize: "12px", color: "#e74c3c", textAlign: "center" }}>
              탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
            </p>
            <div className="passwordModalField">
              <label>비밀번호</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="현재 비밀번호"
              />
            </div>
            <div className="passwordModalField">
              <label>비밀번호 확인</label>
              <input
                type="password"
                value={deleteConfirmPassword}
                onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
              />
            </div>
            <div className="passwordModalButtons">
              <button
                style={{ backgroundColor: "#e74c3c" }}
                onClick={handleDeleteUser}
              >
                탈퇴
              </button>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletePassword("");
                  setDeleteConfirmPassword("");
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      <DeliverAddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onOpen={() => setAddressModalOpen(true)}
        AddressFetchData={fetchAddressList}
        onSelectAddress={() => setAddressModalOpen(false)}
      />
    </div>
  );
}

export default Userinformation;
