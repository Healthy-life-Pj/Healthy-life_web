import { Box } from "@mui/material";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "../../../../style/auth/login/login.css";
import axios from "axios";
import {
  FIND_ID,
  MAIL_PATH,
  MAIN_APT_PATH,
} from "../../../../constants";

function FindId() {
  const [formData, setFormData] = useState({
    name: "",
    userEmail: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = e.target;
    setFormData({ ...formData, [element.name]: element.value });
  };

  const handleSendMail = async (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    if ("key" in e && e.key !== "Enter") return;
    if (!formData.name || !formData.userEmail) {
      alert("이름, 이메일을 입력해주세요");
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${MAIN_APT_PATH}${MAIL_PATH}${FIND_ID}`,
        formData,
      );
      const userData = response.data.data;
      if (userData) {
        alert("이메일 전송이 완료됐습니다.");
      }
    } catch (error) {
      console.error(error);
      alert(`이메일 전송에에 실패했습니다. 다시 시도해주세요.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findIdContainer">
      <h1>아이디 찾기</h1>
      <Box>
        <form className="findIdForm">
          <TextField
            label="이름"
            id="userName"
            sx={{ m: 1, width: "25ch" }}
            value={formData.name}
            name="name"
            onChange={handleChange}
          />
          <TextField
            label="email"
            id="userPhone"
            sx={{ m: 1, width: "25ch" }}
            value={formData.userEmail}
            name="userEmail"
            onChange={handleChange}
          />
          <button type="button" className="loginButton" onClick={handleSendMail}>
            {loading ? <p>전송중...</p> : <p>아이디 찾기</p>}
          </button>
        </form>
      </Box>
    </div>
  );
}

export default FindId;
