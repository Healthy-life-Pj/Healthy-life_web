import { Box, Button, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react'
import "../../style/login/login.css"
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';

interface findPasswordData{
  id: string | string;
  phone: number | string
}


function FindPassword() {

  const [modalIsOpen, setModalIsOpen] = useState(false)

  let initialValue: findPasswordData = {
    id: '',
    phone: ''
  };

  const [findPassword, setFindPassword] = useState<findPasswordData>(initialValue);


  const {id, phone} = findPassword;

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setFindPassword({
      ...findPassword,

      [name]: value
    })
  }


  const findPasswordModalHandler = (e: React.FormEvent) => {
    e.preventDefault();

    setModalIsOpen(true);

    
  }


  const closeModal = () => {

    setModalIsOpen(false);
    setFindPassword({
      id: '',
      phone: ''
    });
  }
  return (
    <div className='findPasswordContainer'>
      <h1>비밀번호 발급</h1>
      <br />
      <Box>

      <form className='findPasswordForm'>

      <TextField 
      label="아이디"
      id='userId'
      sx={{ m: 1, width: '25ch'}}
      inputProps={{
      startAdornment: <InputAdornment position='start'>아이디</InputAdornment>
      }}
      value={id}
      name='id'
      onChange={inputHandler}
      />

      <TextField 
      label="전화번호"
      id='userPhone'
      sx={{ m: 1, width: '25ch'}}
      inputProps={{
      startAdornment: <InputAdornment position='start'>전화번호</InputAdornment>
      }}
      value={phone}
      name='phone'
      onChange={inputHandler}
      />
      <button className='loginButton' onClick={findPasswordModalHandler}>발급받기</button>

      </form>

      <ReactModal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className= "modalContent"
      overlayClassName= "modalOverlay"
      >

      {!id || !phone ?
      <div>아이디 혹은 비밀번호를 잘 못 입력하셨습니다
        <br />
        <button onClick={closeModal} className='closeModalButton'>닫힘</button>
      </div> 
      : 
      <div>재발급된 비밀번호는 1234입니다
        <br />
        <Link to={'/login'} onClick={closeModal}><button className='closeModalButton'>닫힘</button></Link>
        </div>}
      
      </ReactModal>

      </Box>
      <br />
      <br />
    </div>
  )
}

export default FindPassword