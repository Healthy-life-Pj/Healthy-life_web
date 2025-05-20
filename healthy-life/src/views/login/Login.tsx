import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button';
import "../../style/login/login.css"
import ReactModal from 'react-modal';

interface userLogin {
  id: string | number
  password: string | number
}

let  initialValue: userLogin = {
  id: '',
  password: ''
}

ReactModal.setAppElement('#root');

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [login, setLogin] = useState<userLogin>(initialValue);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  
  const {id, password} = login;

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const{name, value} = e.target
    
    setLogin({

      ...login,

      [name]: value
  })
  }

  const loginModalHandler =  (e: React.FormEvent) =>  {
    e.preventDefault();

    setModalIsOpen(true);

  } 

  const closeModal  =  () => {
    setModalIsOpen(false);
    setLogin({
      id: '',
      password: ''
    })
  }
  return (
    <div className='loginContainer'>
      <h1>로그인</h1>
      <br />  
      <br />  
    <Box>
      <form className='loginForm'>
      <TextField
        label="아이디"
        id='userId'
        sx={{ m: 1, width: '25ch'}}
        inputProps={{
          startAdornment: <InputAdornment position='start'>아이디</InputAdornment>
        }}
        value={id}
        onChange={inputHandler}
        name='id'
      />

      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outline-adornment-password">Password</InputLabel>
          <OutlinedInput
            id= "userPassword"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            value={password}
            onChange={inputHandler}
            label="Password"
            name='password'
          />
        </FormControl>
      <button className='loginButton' onClick={loginModalHandler}>로그인</button>
      </form>
    
      <div className='modalContainer'>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className= "modalContent"
        overlayClassName="modalOverlay"
      >
      {!id || !password ?
      <div>
        아이디 혹은 비밀번호를 입력하세요 
        <br />
        <button onClick={closeModal} className='closeModalButton'>닫기</button>
        </div> 
        : 
        <div>로그인되셨습니다<br /> <br />
        <Link to={'/'} onClick={closeModal}><button className='closeModalButton'>닫기</button></Link></div>}
  

      </ReactModal>

      </div>
    
    
      
      <p style={{textAlign: 'center', fontSize: '16px'}}>
      <Link to={'/login/FindId'}>아이디 찾기 | </Link>
      <Link to={'/login/FindPassword'}>비밀번호 찾기</Link>
      <br />
      <br />
      <Link to={'/nonMember'}>비회원 구매</Link>

      </p>


    </Box>
    <br />

    
    </div>
  )
}



export default Login