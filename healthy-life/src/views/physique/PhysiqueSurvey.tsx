import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  MAIN_APT_PATH,
  PHYSIQUE_GET,
  PHYSIQUE_GET_NAME,
  PHYSIQUE_PUT,
  USER_PATH,
} from "../../constants";
import "./physiqueStyle.css";

interface PhysiqueSurveyProps {
  onSearch: () => Promise<void>;
}

function PhysiqueSurvey({ onSearch }: PhysiqueSurveyProps) {
  const [cookies] = useCookies(["token"]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagNames, setTagNames] = useState<string[]>([]);
  
  const getTagName = async() => {
    try {
      const response = await axios.get(`${MAIN_APT_PATH}${USER_PATH}${PHYSIQUE_GET_NAME}`, {
      headers: { Authorization : `Bearer ${cookies.token}`},
      withCredentials: true
      })
      setTagNames(response.data.data.physiqueNames);
    } catch (error) {
      console.error(error);
    }
  }

useEffect(()=> {
  getTagName()
}, []);

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
      onSearch();
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

const TAG_LABEL_MAP: Record<string, string> = {
  "견과류제외": "NO_견과류",
  "해산물제외": "NO_해산물",
  "유제품제외": "NO_유제품",
  "글루텐제외": "글루텐프리",
  "새우제외": "NO_새우",
  "계란제외": "NO_계란",
};

  useEffect(() => {
    getMyPhysique();
  }, []);

  return (
    <div className="physiqueContainer">
      <div className="physiqueBtnDiv">
        {tagNames.map(tag => (
          <button
            key={tag}
            className="physiqueBtn"
            name="physiqueTagName"
            style={physiqueBtnStyle(tag)}
            onClick={() => handleTags(tag)}
            value={tag}
          >
            # {TAG_LABEL_MAP[tag] || tag}
          </button>
        ))}
      </div>
      <button className="physiqueSearchBtn" onClick={createPhysique}>
        조회
      </button>
    </div>
  );
}

export default PhysiqueSurvey;
