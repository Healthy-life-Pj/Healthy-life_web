import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import "../../../style/auth/login/login.css";
import ReactModal from "react-modal";
import axios from "axios";
import { AUTH_PATH, LOGIN, MAIN_APT_PATH } from "../../../constants";
import { useCookies } from "react-cookie";
import { LoginInResponseDto } from "../../../types";

const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [, setCookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNaverLogin = () => {
    window.location.href = "http://localhost:4040/oauth2/authorization/naver";
  };

  const fetchData = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (e instanceof KeyboardEvent && e.key !== "Enter") return;
    e.preventDefault();
    if (!formData.username.trim() || !idRegex.test(formData.username)) {
      setErrorMessage("❌아이디 8~15자의 영문, 숫자 포함 입력");
      return;
    }
    if (!formData.password.trim() || !passwordRegex.test(formData.password)) {
      setErrorMessage("❌비밀번호 8~16자의 영문, 숫자,특수기호 포함 입력");
      return;
    }
    try {
      const response = await axios.post(
        `${MAIN_APT_PATH}${AUTH_PATH}${LOGIN}`,
        formData,
      );
      logInSuccessResponse(response.data.data);
      setErrorMessage(null);
      setModalIsOpen(true);
      navigate("/");
    } catch (error) {
      setErrorMessage("❌ 아이디 혹은 비밀번호가 잘못되었습니다.");
      setModalIsOpen(true);
      console.error(error);
    }
  };

  const setToken = (token: string, exprTime: number) => {
    const expires = new Date(Date.now() + exprTime);
    setCookies("token", token, {
      path: "/",
      expires,
    });
  };

  const logInSuccessResponse = (data: LoginInResponseDto) => {
    if (data) {
      const { token, exprTime } = data;
      setToken(token, exprTime);
    }
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
    setFormData({
      username: "",
      password: "",
    });
  };
  return (
    <div className="loginContainer">
      <h1>로그인</h1>
      <Box>
        <form className="loginForm">
          <TextField
            className="loginBox"
            id="outlined-basic"
            label="아이디"
            variant="outlined"
            value={formData.username}
            onChange={inputHandler}
            name="username"
          />

          <FormControl sx={{ m: 1, width: "220px" }} variant="outlined">
            <InputLabel htmlFor="outline-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
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
              value={formData.password}
              onChange={inputHandler}
              label="password"
              name="password"
            />
          </FormControl>
          <p className="loginErrorMg">{errorMessage}</p>
          <button type="submit" className="loginButton" onClick={fetchData}>
            로그인
          </button>
        </form>
        <div className="findDiv">
          <Link to={"/login/find-id"}>아이디 찾기</Link>
          <span>|</span>
          <Link to={"/login/FindPassword"}>비밀번호 찾기</Link>
        </div>
      </Box>
      <div className="snsLoginContainer">
        <button
          type="button"
          className="naverLoginButton"
          onClick={handleNaverLogin}
        >
          <img
            className="logoImg"
            src="/NAVER_login_Dark_KR_green_wide_H56.png"
            alt="네이버로고"
          />
        </button>
      </div>

      <div className="modalContainer">
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="modalContent"
          overlayClassName="modalOverlay"
        >
          {errorMessage ? (
            <div>
              {errorMessage}
              <button onClick={closeModal} className="closeModalButton">
                닫기
              </button>
            </div>
          ) : (
            <div>
              로그인 되셨습니다
              <Link to={"/"} onClick={closeModal}>
                <button className="closeModalButton">닫기</button>
              </Link>
            </div>
          )}
        </ReactModal>
      </div>
    </div>
  );
}

export default Login;
