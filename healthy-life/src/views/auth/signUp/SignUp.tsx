import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeliveryAddress, User } from "../../../types";
import axios from "axios";
import {
  AUTH_PATH,
  DUPLICATE_NICKNAME,
  DUPLICATE_USERNAME,
  MAIN_APT_PATH,
  SIGN_UP,
} from "../../../constants";
import Term from "./Term";
import "../../../style/auth/signUp/signUp.css";
import AddressSearch from "./AddressSearch";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Height } from "@mui/icons-material";

const idRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
const nameRegex = /^[가-힣a-zA-Z]{2,10}$/;
const birthDateRegex = /^\d{8}$/;
const nickNameRegex = /^[가-힣a-zA-Z\d]{3,10}$/;
const phoneRegex = /^01[016789]\d{7,8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function SignUp() {
  const navigate = useNavigate();
  const [duplicateNickName, setDuplicateNickName] = useState<boolean>(false);
  const [duplicateUsername, setDuplicateUsername] = useState<boolean>(false);
  const [duplicateUsernameMg, setDuplicateUsernameMg] = useState<string>("");
  const [duplicateNickNameMg, setDuplicateNickNameMg] = useState<string>("");
  const [validUsername, setValidUsername] = useState<string>("");
  const [validPassword, setValidPassword] = useState<string>("");
  const [validBirth, setValidBirth] = useState<string>("");
  const [validName, setValidName] = useState<string>("");
  const [validNickName, setValidNickName] = useState<string>("");
  const [validGender, setValidGender] = useState<string>("");
  const [validEmail, setValidEmail] = useState<string>("");
  const [validPhone, setValidPhone] = useState<string>("");
  const [validAddress, setValidAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAllTermsChecked, setIsAllTermsChecked] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState<User>({
    userId: 0,
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    userNickName: "",
    userGender: "F",
    userBirth: new Date(),
    userEmail: "",
    userPhone: "",
    userMemberGrade: "병아리",
    joinPath: "home",
    snsId: null,
  });
  const [birth, setBirth] = useState<Dayjs | null>(null);
  const [addressData, setAddressData] = useState<DeliveryAddress>({
    deliverAddressId: 0,
    address: "",
    addressDetail: "",
    postNum: 0,
    userId: 0,
    default: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit 실행됨");

    if (!isAllTermsChecked) {
      alert("모든 약관에 동의해야 회원가입이 가능합니다.");
      return;
    }

    let valid = true;

    if (!idRegex.test(signUpData.username) || !signUpData.username) {
      valid = false;
      setValidUsername("❌ 아이디 8~15자의 영문, 숫자 포함 입력.");
    } else {
      setValidUsername("");
    }

    if (!nameRegex.test(signUpData.name) || !signUpData.name) {
      valid = false;
      setValidName("❌ 이름 2~10자의 한글, 영문 포함 입력.");
    } else {
      setValidName("");
    }

    if (!signUpData.password || !passwordRegex.test(signUpData.password)) {
      valid = false;
      setValidPassword("❌ 비밀번호 8~16자의 영문, 숫자, 특수기호 포함 입력.");
    } else {
      setValidPassword("");
    }

    if (signUpData.confirmPassword !== signUpData.password) {
      valid = false;
      setValidPassword("❌ 입력한 비밀번호가 일치하지 않습니다.");
    }

    if (!phoneRegex.test(signUpData.userPhone) || !signUpData.userPhone) {
      valid = false;
      setValidPhone('❌ 핸드포번호를 입력해주세요. ("-"제외)');
    } else {
      setValidPhone("");
    }

    if (
      !nickNameRegex.test(signUpData.userNickName) ||
      !signUpData.userNickName
    ) {
      valid = false;
      setValidNickName("❌ 닉네임 3~10자의 한글, 영문 포함 입력.");
    } else {
      setValidNickName("");
    }

    if (!emailRegex.test(signUpData.userEmail) || !signUpData.userEmail) {
      valid = false;
      setValidEmail("❌ 이메일을 입력해주세요.");
    } else {
      setValidEmail("");
    }

    if (
      !signUpData.userBirth
    ) {
      valid = false;
      setValidBirth("❌ 생년월일을 입력해주세요.");
    } else {
      setValidBirth("");
    }

    if (
      !addressData.address ||
      !addressData.addressDetail ||
      !addressData.postNum
    ) {
      valid = false;
      setValidAddress("❌ 주소를 입력해주세요.");
    } else {
      setValidAddress("");
    }

    if (!valid) {
      console.log("유효성 검사 실패, fetchData 실행 안 함");
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    if (loading) {
      console.log("❌ 로딩 중이므로 fetchData 실행 안됨");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${MAIN_APT_PATH}${AUTH_PATH}${SIGN_UP}`,
        {
          ...signUpData,
          userBirth: birth?.format("YYYY-MM-DD"),
          userGender: signUpData.userGender === "M" ? "M" : "F",
          address: addressData.address,
          addressDetail: addressData.addressDetail,
          postNum: Number(addressData.postNum),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      alert("회원가입 완료");
      navigate("/login");
    } catch (error) {
      console.error("❌ 회원가입 실패:", error);
      alert("회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  const userdataForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "username") {
      setDuplicateUsernameMg("");
    } else if (name === "userNickName") {
      setDuplicateNickNameMg("");
    }
  };

  const handelDulicateUsername = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${DUPLICATE_USERNAME}${signUpData.username}`,
      );
      if (response.data.data) {
        setDuplicateUsernameMg("❌ 아이디가 중복되었습니다.");
        setDuplicateUsername(false);
      } else {
        setDuplicateUsernameMg("✅ 아이디 중복확인 완료");
        setDuplicateUsername(true);
      }
      setValidUsername("");
    } catch (error) {
      console.error(error);
    }
  };
  const handleDuplicateNickName = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${MAIN_APT_PATH}${AUTH_PATH}${DUPLICATE_NICKNAME}${signUpData.userNickName}`,
      );
      if (response.data.data === true) {
        setDuplicateNickNameMg("❌ 닉네임 중복되었습니다.");
        setDuplicateNickName(false);
      } else {
        setDuplicateNickNameMg("✅ 닉네임 중복확인 완료");
        setDuplicateNickName(true);
      }
      setValidNickName("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, [duplicateUsernameMg, duplicateNickNameMg]);

  return (
    <div className="joinContainer">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="joinContain">
          <ul className="joinUl">
            <li className="li01">
              <label htmlFor="username">아이디</label>
              <div className="checkBtn">
                <input
                  type="text"
                  name="username"
                  className="userId inputclass"
                  placeholder="아이디를 입력해주세요."
                  minLength={5}
                  maxLength={15}
                  onChange={userdataForm}
                  value={signUpData.username}
                />
                <button
                  type="button"
                  className="joinBtn"
                  onClick={handelDulicateUsername}
                >
                  중복확인
                </button>
              </div>
            </li>
            <li className="signUpMessage">
              <p style={{ color: "red" }}>{validUsername}</p>
              <p>{duplicateUsernameMg}</p>
            </li>
            <li></li>
            <li className="li02">
              <label htmlFor="userNickName">닉네임</label>
              <div className="checkBtn">
                <input
                  type="text"
                  name="userNickName"
                  className="userNickName inputclass"
                  placeholder="닉네임을 입력해주세요."
                  value={signUpData.userNickName}
                  onChange={userdataForm}
                />
                <button
                  type="button"
                  className="joinBtn"
                  onClick={handleDuplicateNickName}
                >
                  중복확인
                </button>
              </div>
            </li>
            <li className="signUpMessage">
              <p style={{ color: "red" }}>{validNickName}</p>
              <p>{duplicateNickNameMg}</p>
            </li>
            <li></li>
            <li className="li03">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                name="password"
                className="password inputclass"
                placeholder="비밀번호를 입력해주세요."
                minLength={8}
                maxLength={16}
                value={signUpData.password}
                onChange={userdataForm}
              />
            </li>
            <li className="signUpMessage">
              <p style={{ color: "red" }}>{validPassword}</p>
            </li>
            <li className="li03">
              <label htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                className="userRePasswordCheck inputclass"
                placeholder="비밀번호를 확인해주세요."
                minLength={8}
                maxLength={16}
                value={signUpData.confirmPassword}
                onChange={userdataForm}
              />
            </li>
            <li className="signUpMessage">
              <p style={{ color: "red" }}>{validPassword}</p>
            </li>
            <li className="li04">
              <label htmlFor="name">이름</label>
              <input
                className="inputName inputclass"
                type="text"
                id="name"
                name="name"
                placeholder="이름을 입력해주세요."
                value={signUpData.name}
                onChange={userdataForm}
              />
            </li>
            <li className="signUpMessage">
              <p style={{ color: "red" }}>{validName}</p>
            </li>
            <li className="li06">
              <label htmlFor="userPhone">휴대전화번호</label>
              <input
                type="tel"
                id="userPhone"
                name="userPhone"
                placeholder="전화번호를 입력하세요."
                className="inputclass"
                maxLength={11}
                value={signUpData.userPhone}
                onChange={userdataForm}
              />
            </li>
            <li className="signUpMessage">
              <p style={{ color: "red" }}>{validPhone}</p>
            </li>
            <li className="li07">
              <label htmlFor="userBirth">생년월일</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{
                    textField: {
                      sx: {
                        "& .MuiInputBase-root": {
                          height: 32,
                          fontSize: 13,
                          width: 264,
                          borderColor: "#c4c4c4"
                        },
                      },
                    },
                  }}
                  value={birth}
                  onChange={(newValue) => setBirth(newValue)}
                />
              </LocalizationProvider>
            </li>
            <li className="signUpMessage">
              <p>{validBirth}</p>
            </li>
            <li>
              <label htmlFor="userEmail">이메일</label>
              <input
                type="email"
                name="userEmail"
                className="inputclass"
                placeholder="이메일을 입력해주세요."
                value={signUpData.userEmail}
                onChange={userdataForm}
              />
            </li>
            <li className="signUpMessage">
              <p style={{ color: "red" }}>{validEmail}</p>
            </li>
            <AddressSearch
              addressData={addressData}
              setAddressData={setAddressData}
              validMessage={validAddress}
            />
          </ul>
          <div className="li08">
            <label className="gender" htmlFor="userGender">
              성별
            </label>
            <div className="genderDiv">
              <label htmlFor="male" className="userGender">
                남
              </label>
              <input
                type="radio"
                id="male"
                name="userGender"
                value="M"
                checked={signUpData.userGender === "M"}
                onChange={userdataForm}
              />
              <label htmlFor="female" className="userGender">
                여
              </label>
              <input
                type="radio"
                id="female"
                name="userGender"
                value="F"
                checked={signUpData.userGender === "F"}
                onChange={userdataForm}
              />
            </div>
            <p className="signUpMessage" style={{ color: "red" }}>
              {validGender}
            </p>
          </div>
          <Term setIsAllTermsChecked={setIsAllTermsChecked} />
        </div>
        <button type="submit" className="joinButton" disabled={loading}>
          {loading ? "회원가입중...." : "회원가입"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
