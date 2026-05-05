import { Box, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import "../../../style/auth/login/login.css";
import ReactModal from "react-modal";
import axios from "axios";
import {
  MAIL_PATH,
  MAIN_APT_PATH,
  RECOVERY_EMAIL,
} from "../../../constants/api";

interface FindPasswordData {
  username: string;
  email: string;
}

function FindPassword() {
  const [formData, setFormData] = useState<FindPasswordData>({
    username: "",
    email: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim()) {
      alert("아이디와 이메일을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${MAIN_APT_PATH}${MAIL_PATH}${RECOVERY_EMAIL}`,
        formData,
      );
      setModalMessage(
        "비밀번호 재설정 링크를 이메일로 발송했습니다.\n메일함을 확인해주세요.",
      );
    } catch (error) {
      setModalMessage(
        "이메일 발송에 실패했습니다.\n아이디와 이메일을 다시 확인해주세요.",
      );
    } finally {
      setLoading(false);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({ username: "", email: "" });
  };

  return (
    <div className="findPasswordContainer">
      <h1>비밀번호 찾기</h1>
      <Box>
        <form className="findPasswordForm">
          <TextField
            label="아이디"
            id="username"
            sx={{ m: 1, width: "25ch" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            value={formData.username}
            name="username"
            onChange={inputHandler}
          />
          <TextField
            label="이메일"
            id="email"
            sx={{ m: 1, width: "25ch" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            value={formData.email}
            name="email"
            onChange={inputHandler}
          />
          <button
            className="loginButton"
            onClick={handleSendMail}
            disabled={loading}
          >
            {loading ? "전송중..." : "이메일로 재설정 링크 받기"}
          </button>
        </form>

        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modalContent"
          overlayClassName="modalOverlay"
        >
          <h2>알림</h2>
          <div>
            <p style={{ whiteSpace: "pre-line" }}>{modalMessage}</p>
            <button onClick={closeModal} className="closeModalButton">
              닫기
            </button>
          </div>
        </ReactModal>
      </Box>
      <br />
      <br />
    </div>
  );
}

export default FindPassword;
