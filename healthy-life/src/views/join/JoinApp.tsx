import React, { useEffect, useRef, useState } from 'react';
import '../../style/join/join.css';
import Term from './Term';
import { InFormData } from '../../types';
import axios from 'axios';



function JoinApp() {
  const [userInfo, setUserInfo] = useState<InFormData[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [userNickName, setUserNickName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [userRePassword, setUserRePassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userBirth, setUserBirth] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [userGender, setUserGender] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  //모달창 온/오프
  const openModal = () => {
    setModalOpen(true);
  }
  const closeModal = () => {
    setModalOpen(false);
  }
  
  const nextId = useRef(0);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:3001/userInfo');
    setUserInfo(response.data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async () => {
    const response = await axios.post('http://localhost:3001/userInfo',{
      id: nextId.current,
      userId,
      userNickName,
      userPassword,
      userRePassword,
      userName,
      userEmail,
      userPhone,
      userBirth,
      userAddress,
      userGender,
    });
    setUserInfo([...userInfo, response.data]);

    nextId.current += 1;
  }

  const [errors, setErrors] = useState<InFormData>({
    id: nextId.current,
    userId: '',
    userNickName: '',
    userPassword: '',
    userRePassword: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    userBirth: '',
    userAddress: '',
    userGender: ''
  });

  const handleSingUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let tempErrors = {
      id:nextId.current,
      userId: '',
      userNickName: '',
      userPassword: '',
      userRePassword: '',
      userName: '',
      userEmail: '',
      userPhone: '',
      userBirth: '',
      userAddress: '',
      userGender: ''
    };

    let isValid = true;

    if (!userId) {
      tempErrors.userId = '아이디를 입력하세요.';
      isValid = false;
    }
    if (!userName) {
      tempErrors.userName = '이름을 입력하세요.';
      isValid = false;
    }
    if (!userNickName) {
      tempErrors.userNickName = '닉네임을 입력하세요.';
      isValid = false;
    }
    if (!userPassword) {
      tempErrors.userPassword = '비밀번호를 입력하세요.';
      isValid = false;
    }
    if (userPassword !== userRePassword) {
      tempErrors.userRePassword = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }
    if (!userRePassword) {
      tempErrors.userRePassword = '비밀번호를 확인하세요.';
      isValid = false;
    }
    if (!userEmail) {
      tempErrors.userEmail = '이메일을 입력하세요.';
      isValid = false;
    }
    if (!userPhone) {
      tempErrors.userPhone = '휴대폰번호를 입력하세요.';
      isValid = false;
    }
    if (!userBirth) {
      tempErrors.userBirth = '생년월일을 입력하세요.';
      isValid = false;
    }
    if (!userAddress) {
      tempErrors.userAddress = '주소를 입력하세요.';
      isValid = false;
    }
    if (!userGender) {
      tempErrors.userGender = '성별을 선택해주세요.';
      isValid = false;
    }

    setErrors(tempErrors);

    if (isValid) {
      console.log('회원가입 데이터: ', userInfo);
      alert(`회원가입을 축하합니다. ${userId}님`);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };


  return (
    <div className="joinContainer">
      <h2>회원가입</h2>
      <form onSubmit={handleSingUpSubmit}>
        <div className="joinContain">
          <ul className="joinUl">
            <li className="li01">
              <label htmlFor="userId">아이디</label>
              <div className="checkBtn">
                <input
                  type="text"
                  name="userId"
                  className="userId inputclass"
                  placeholder="아이디를 입력해주세요."
                  minLength={5}
                  maxLength={10}
                  onChange={(e) => setUserId(e.target.value)}
                  value={userId}
                  
                />
                <button className="joinBtn">중복확인</button>
              </div>
            </li>
            <li><p>{errors.userId}</p></li>
            <li className="li02">
              <label htmlFor="userNickName">닉네임</label>
              <div className="checkBtn">
                <input
                  type="text"
                  name="userNickName"
                  className="userNickName inputclass"
                  placeholder="닉네임을 입력해주세요."
                  value={userNickName}
                  onChange={(e) => setUserNickName(e.target.value)}
                />
                <button className="joinBtn">중복확인</button>
              </div>
            </li>
            <li><p>{errors.userNickName}</p></li>
            <li className="li03">
              <label htmlFor="userPassword">비밀번호</label>
              <input
                type="password"
                name="userPassword"
                className="userPassword inputclass"
                placeholder="비밀번호를 입력해주세요."
                minLength={8}
                maxLength={16}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </li>
            <li><p>{errors.userPassword}</p></li>
            <li className="li03">
              <label htmlFor="userRePassword">비밀번호 확인</label>
              <input
                type="password"
                name="userRePassword"
                className="userRePasswordCheck inputclass"
                placeholder="비밀번호를 확인해주세요."
                minLength={8}
                maxLength={16}
                value={userRePassword}
                onChange={(e) => setUserRePassword(e.target.value)}
              />
            </li>
            <li><p>{errors.userRePassword}</p></li>
            <li className="li04">
              <label htmlFor="userName">이름</label>
              <input
                className="inputName inputclass"
                type="text"
                id="userName"
                name="userName"
                placeholder="이름을 입력해주세요."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </li>
            <li><p>{errors.userName}</p></li>
            <li className="li05">
              <label htmlFor="userAddress">주소</label>
              <input
                className="userAddress inputclass"
                name="userAddress"
                placeholder="주소를 입력하세요."
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
              />
              
            </li>
            <li><p>{errors.userAddress}</p></li>
            <li className="li06">
              <label htmlFor="userPhone">휴대전화번호</label>
              <div className="checkBtn">
                <input
                  type="tel"
                  id="userPhone"
                  name="userPhone"
                  placeholder="전화번호를 입력하세요."
                  className="inputclass"
                  maxLength={11}
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />
                <button className="joinBtn" type="button">
                  인증번호 받기
                </button>
              </div>
            </li>
            <li><p>{errors.userPhone}</p></li>
            <li className="li07">
              <label htmlFor="userBirth">생년월일</label>
              <input
                type="text"
                className="birthDiv inputclass"
                name="userBirth"
                placeholder="생년월일: YYMMDD"
                maxLength={6}
                value={userBirth}
                onChange={(e) => setUserBirth(e.target.value)}
              />
            </li>
            <li><p>{errors.userBirth}</p></li>
            <li>
              <label htmlFor="userEmail">이메일</label>
              <input
                type="email"
                name="userEmail"
                className="inputclass"
                placeholder="이메일을 입력해주세요."
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </li>
            <li><p>{errors.userEmail}</p></li>
          </ul>
          <div className="li08">
            <label className="gender" htmlFor="userSex">
              성별
            </label>
            <div className="genderDiv">
              <label className="usergender">남</label>
              <input 
              type="radio" 
              name="usergender" 
              value="남" 
              onChange={(e) => setUserGender(e.target.value)}
              />
              <label>여</label>
              <input 
              type="radio" 
              name="usergender" 
              value="여" 
              onChange={(e) => setUserGender(e.target.value)}
              />
            </div>
            <p>{errors.userGender}</p>
          </div>
          <Term />
        </div>
        <button 
        type="submit" 
        className="joinButton"
        onClick={handleCreate}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default JoinApp;
