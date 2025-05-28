import React, { useEffect, useState } from "react";
import { User } from "../../../../types/index";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {  } from "../../../../apis";
import { FIND_ID_BY_TOKEN, MAIL_PATH, MAIN_APT_PATH } from "../../../../constants";

function FindUserIdResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [isData, setIsData] = useState<boolean>(false);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  
  useEffect(() => {

    if (!token || token.trim() === "") {
      console.error("유효하지 않은 토큰입니다.");
      alert("유효하지 않은 요청입니다.");
      return;
    }

    fetchData(token);
  }, [location]);

  const fetchData = async (token: string | null) => {
    setLoading(true);
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${MAIL_PATH}${FIND_ID_BY_TOKEN}`, {params: {token}});
      const userIdData = response.data.data;
      if (userIdData) {
        setResult(userIdData);
        setIsData(true);
      } else {
        setIsData(false);
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="findUserIdContainer">
      <h4 className='findUserIdTitle'>아이디 찾기</h4>
      <div className='findUserIdResultBox'>
        {loading ? (
          <p>로딩중....</p>
        ) : isData ? (
          <>
            <ul className="findUserIdResultUl">
              <li className="findUserIdResultLi">{result?.name} 님의 아이디는</li>
              <li className="findUserIdResultLi">
                <p>{result?.username} 입니다.</p>
              </li>
            </ul>
            <div className='findUserIdResultline'></div>
            <button
              className='findUserIdResultBtn'
              onClick={() => navigate("/signIn")}
            >
              로그인하기기
            </button>
          </>
        ) : (
          <p>죄송합니다. 아이디를 찾을 수 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default FindUserIdResult;
