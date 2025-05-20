import { Box, Button, InputAdornment } from '@mui/material';
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import "../../style/login/login.css"
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
interface findIdData{
  name: string;
  phone: number | string
}



function FindId() {

  const [modalIsOpen, setModalIsOpen] = useState(false);

  let initialValue: findIdData = {
    name: '',
    phone: ''
  };

  const [findId, setFindId] = useState<findIdData>(initialValue);


  const {name, phone} = findId;

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    setFindId({
      ...findId,

      [name]: value
    })
  }


  const findIdModalHandler = (e: React.FormEvent) => {
    e.preventDefault();

    setModalIsOpen(true);

  
  };


  const closeModal = () => {
    setModalIsOpen(false);
    setFindId({
      name: '',
      phone: ''
    });
  }
  return (
    <div className='findIdContainer'>

      <h1>아이디 찾기</h1>
      <br />
      
      <Box>

      
      <form className='findIdForm'>
      
      <TextField
        label="이름"
        id='userName'
        sx={{ m: 1, width: '25ch'}}
        inputProps={{
        startAdornment: <InputAdornment position='start'>이름</InputAdornment>
        }}
        value={name}
        name='name'
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
      <button className='loginButton' onClick={findIdModalHandler}>아이디 찾기</button>
      </form>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modalContent"
        overlayClassName="modalOverlay"
      >

      {!name || !phone ? 
      <div>이름 혹은 전화번호를 잘 못 입력하셨습니다
        <br />
        <button className='closeModalButton' onClick={closeModal}>닫힘</button>
      </div>
      :
      <div>당신의 아이디는 healthy-life 입니다
        <br />
        <Link to={'/login'}  onClick={closeModal}><button className='closeModalButton'>닫힘</button></Link>
        </div>}
      

      </ReactModal>

      </Box>
      <br />
      <br />
    </div>
    
  )
}

export default FindId