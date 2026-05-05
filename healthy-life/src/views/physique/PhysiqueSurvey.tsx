import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  MAIN_APT_PATH,
  PHYSIQUE_GET,
  PHYSIQUE_GET_NAME,
  PHYSIQUE_PUT,
  USER_PATH,
} from "../../constants/api";
import "./physiqueStyle.css";

interface PhysiqueSurveyProps {
  onSearch: () => Promise<void>;
}

function PhysiqueSurvey({ onSearch }: PhysiqueSurveyProps) {
  const [cookies] = useCookies(["token"]);
  const [allTags, setAllTags] = useState<string[]>([]);
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

  useEffect(()=> {
    if (cookies.token) {
      getTagName();
      getPhysique();
    }
  }, [cookies.token]);

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
      alert("수정 태그 조회")
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


  useEffect(() => {
    getMyPhysique();
  }, []);

  return (
    <div className="physiqueContainer">
      <div className="physiqueBtnDiv">
        {allTags.map(tag => (
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
      <div>
        <button className="physiqueSearchBtn" onClick={createPhysique}>
          조회
        </button>
      </div>
    </div>
  );
}

export default PhysiqueSurvey;
