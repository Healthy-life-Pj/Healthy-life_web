import React, { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { MAIN_APT_PATH, UPDATE_PASSWORD } from "../../../constants";
import "../../../style/userInformation/userInformation.css";

interface ChangePasswordProps {
  onClose: () => void;
}

function ChangePassword({ onClose }: ChangePasswordProps) {
  const [cookies] = useCookies(["token"]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmUserPassword, setConfirmUserPassword] = useState("");

  const handleSubmit = async () => {
    if (!currentPassword || !userPassword || !confirmUserPassword) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (userPassword !== confirmUserPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    if (!passwordRegex.test(userPassword)) {
      alert("비밀번호는 8-20자, 영문+숫자+특수문자(@$!%*#?&)를 모두 포함해야 합니다.");
      return;
    }
    try {
      await axios.put(
        `${MAIN_APT_PATH}${UPDATE_PASSWORD}`,
        {
          currentPassword,
          userPassword,
          confirmUserPassword,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        }
      );
      alert("비밀번호가 변경되었습니다.");
      onClose();
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      alert(msg);
    }
  };

  return (
    <div className="passwordModalOverlay" onClick={onClose}>
      <div
        className="passwordModalContent"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>비밀번호 변경</h3>

        <div className="passwordModalField">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호"
          />
        </div>

        <div className="passwordModalField">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="8-20자, 영문+숫자+특수문자(@$!%*#?&)"
          />
        </div>

        <div className="passwordModalField">
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmUserPassword}
            onChange={(e) => setConfirmUserPassword(e.target.value)}
            placeholder="새 비밀번호 확인"
          />
        </div>

        <div className="passwordModalButtons">
          <button onClick={handleSubmit}>변경</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
