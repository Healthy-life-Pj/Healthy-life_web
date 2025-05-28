import { Box, Button, InputAdornment } from '@mui/material';
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import "../../../../style/auth/login/login.css"
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FIND_ID_BY_TOKEN, MAIL_PATH, MAIN_APT_PATH } from '../../../../constants';

function FindId() {
  const [formData, setFormData] = useState({
    name: "",
    userEmail: "",
  });
  const [modal, setModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = e.target;
    setFormData({ ...formData, [element.name]: element.value });
  };

  const handleSendMail = async (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    if ("key" in e && e.key !== "Enter") return;
    if (!formData.name || !formData.userEmail) {
      alert("이름, 이메일을 입력해주세요");
    }
    setLoading(true);
    try {
      const response = await axios.post(`${MAIN_APT_PATH}${MAIL_PATH}${FIND_ID_BY_TOKEN}`, formData);
      const userData = response.data.data;
      if (userData) {
        setModalMessage("이메일 전송이 완료됐습니다.");
      }
      setModal(true);
    } catch (error) {
      console.error(error);
        setModalMessage(`이메일 전송에에 실패했습니다. 다시 시도해주세요.`);
        setModal(true);
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => {
    setModal(false);
  }

  return (
    <div className='findIdContainer'>
      <h1>아이디 찾기</h1>
      <Box>
      <form className='findIdForm'>
      <TextField
        label="이름"
        id='userName'
        sx={{ m: 1, width: '25ch'}}
        inputProps={{
        startAdornment: <InputAdornment position='start'>이름</InputAdornment>
        }}
        value={formData.name}
        name='name'
        onChange={handleChange}
      />
      <TextField
      label="email"
      id='userPhone'
      sx={{ m: 1, width: '25ch'}}
      inputProps={{
      startAdornment: <InputAdornment position='start'>이메일일</InputAdornment>
      }}
      value={formData.userEmail}
      name='userEmail'
      onChange={handleChange}
      />
      <button className='loginButton' onClick={handleSendMail}>
        {loading ? <p>전송중...</p>: <p>아이디 찾기</p> }
      </button>
      </form>
      <ReactModal
        isOpen={modal}
        onRequestClose={closeModal}
        className="modalContent"
        overlayClassName="modalOverlay"
      >
      <h2>알림</h2>
        <div className="findUserIdModal">
        <p>{modalMessage}</p>
        <button onClick={closeModal} className="closeModalBtn">닫기</button>
        </div>
      </ReactModal>
      </Box>
    </div>
    
  )
}

export default FindId