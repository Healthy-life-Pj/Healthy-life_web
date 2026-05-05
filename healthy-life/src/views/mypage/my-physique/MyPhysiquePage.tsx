import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { MAIN_APT_PATH, PHYSIQUE_DELETE, PHYSIQUE_GET, PHYSIQUE_GET_NAME, PHYSIQUE_PUT, USER_PATH } from '../../../constants/api';
import axios from 'axios';

function MyPhysiquePage() {
  const [cookies] = useCookies(["token"]);
  const [mytags, setMyTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const handleTags = (tag: string) => {
  setMyTags((prev) => {
    const isSelected = prev.includes(tag);

    if (!isSelected && prev.length >= 20) {
      alert("태그는 20개 까지 선택가능합니다.");
      return prev;
    }

    return isSelected ? prev.filter((t) => t !== tag) : [...prev, tag];
  });
};

  const updatePhysique = async () => {
    try {
      await axios.put(
        `${MAIN_APT_PATH}${USER_PATH}${PHYSIQUE_PUT}`,
        { tagTypeNames: mytags },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        },
      );
      alert("태그 수정 완료")
      getMyPhysique();
    } catch (error) {
      console.error(error);
    }
  };

  const getMyPhysique = async () => {
  try {
    const response = await axios.get(
      `${MAIN_APT_PATH}${USER_PATH}${PHYSIQUE_GET}`,
      {
        headers: { Authorization: `Bearer ${cookies.token}` },
        withCredentials: true,
      },
    );
    const savedTags = response.data.data.physiqueNames;
    setMyTags(savedTags);
  } catch (error) {
    console.error(error);
  }
  };

  const getPhysique = async () => {
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${USER_PATH}${PHYSIQUE_GET_NAME}`, 
        {
          headers: { Authorization: `Bearer ${cookies.token}`},
          withCredentials: true,
        }
      )
      const tags = response.data.data.physiqueNames;
      setAllTags(tags);
    } catch (error) {
      console.error(error);
    }
  }

  const physiqueBtnStyle = (tag: string) => ({
  color: mytags.includes(tag) ? "blue" : "black",
  });

  const deleteData = async () => {
    try {
      await axios.delete(`${MAIN_APT_PATH}${USER_PATH}${PHYSIQUE_DELETE}`, {
        headers: {Authorization: `Bearer ${cookies.token}`},
        withCredentials: false,
      });
      getMyPhysique();
    } catch (error) {
      console.error(error);
    }
  }

useEffect(() => {
  if (cookies.token) {
    getMyPhysique();
    getPhysique();
  }
}, [cookies.token]);

  return (
    <div className='physiqueContainer'>
      <h3>체질/기호 태그 관리</h3>
      <div className="physiqueBtnDiv">
        {allTags.map((tag) => (
          <button
            key={tag}
            className="physiqueBtn"
            name="physiqueTagName"
            style={physiqueBtnStyle(tag)}
            onClick={() => handleTags(tag)}
            value={tag}
          >
            # {tag}
          </button>
        ))}
      </div>
      <div className='searchBtnPostion'>
        <button className="physiqueSearchBtn physiqueSearchBtn2" onClick={updatePhysique}>
          선택
        </button>
        <button className='physiqueResetBtn' onClick={deleteData}>
          초기화
        </button>
      </div>
    </div>
  )
}

export default MyPhysiquePage