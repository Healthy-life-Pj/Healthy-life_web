import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import { MAIN_APT_PATH, PHYSIQUE_DELTE, PHYSIQUE_GET, PHYSIQUE_PUT, USER_PATH } from '../../../constants';
import axios from 'axios';

function PhysiquePage() {
  const [cookies] = useCookies(["token"]);
  const [tags, setTags] = useState<string[]>([]);

  const handleTags = (tag: string) => {
  setTags((prev) => {
    const isSelected = prev.includes(tag);

    if (!isSelected && prev.length >= 20) {
      alert("태그는 20개 까지 선택가능합니다.");
      return prev;
    }

    return isSelected ? prev.filter((t) => t !== tag) : [...prev, tag];
  });
};

  const createPhysique = async () => {
    try {
      await axios.put(
        `${MAIN_APT_PATH}${USER_PATH}${PHYSIQUE_PUT}`,
        { tagTypeNames: tags },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
          withCredentials: true,
        },
      );
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
    setTags(savedTags);
  } catch (error) {
    console.error(error);
  }
  };

  const physiqueBtnStyle = (tag: string) => ({
  color: tags.includes(tag) ? "blue" : "black",
  });

    const PHYSIQUE_TAGS = [
    { value: "저당", label: "저당" },
    { value: "저탄수", label: "저탄수" },
    { value: "고단백", label: "고단백" },
    { value: "저지방", label: "저지방" },
    { value: "저염", label: "저염" },
    { value: "비건", label: "비건" },
    { value: "채식", label: "채식" },
    { value: "무카페인", label: "무카페인" },
    { value: "다이어트", label: "다이어트" },
    { value: "벌크업", label: "벌크업" },
    { value: "체중유지", label: "체중유지" },
    { value: "식단관리", label: "식단관리" },
    { value: "간편식", label: "간편식" },
    { value: "식사대용", label: "식사대용" },
    { value: "운동후식사", label: "운동후식사" },
    { value: "저칼로리", label: "저칼로리" },
    { value: "포만감", label: "포만감" },
    { value: "견과류제외", label: "NO_견과류" },
    { value: "해산물제외", label: "NO_해산물" },
    { value: "유제품제외", label: "NO_유제품" },
    { value: "글루텐제외", label: "NO_글루텐" },
    { value: "새우제외", label: "NO_새우" },
    { value: "계란제외", label: "NO_계란" },
  ];

  const delelteData = async () => {
    try {
      await axios.delete(`${MAIN_APT_PATH}${USER_PATH}${PHYSIQUE_DELTE}`, {
        headers: {Authorization: `Bearer ${cookies.token}`},
        withCredentials: false,
      });
      getMyPhysique();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMyPhysique();
  }, [])

  return (
    <div>
      <div className="physiqueBtnDiv">
        {PHYSIQUE_TAGS.map(({ value, label }) => (
          <button
            key={value}
            className="physiqueBtn"
            name="physiqueTagName"
            style={physiqueBtnStyle(value)}
            onClick={() => handleTags(value)}
            value={value}
          >
            # {label}
          </button>
        ))}
      </div>
      <div>
        <button className="physiqueSearchBtn" onClick={createPhysique}>
          선택
        </button>
        <button onClick={delelteData}>
          초기화
        </button>
      </div>
    </div>
  )
}

export default PhysiquePage