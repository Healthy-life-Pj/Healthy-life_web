import React, { useEffect, useState } from "react";
import "../../../style/home/Search.css";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import axios from "axios";
import {
  AUTH_PATH,
  MAIN_APT_PATH,
  PRODUCT_PATH,
  PRODUCT_SEARCH,
} from "../../../constants/api";
import { Product } from "../../../types";
import { useNavigate } from "react-router-dom";

export default function SearchApp() {
  const [pName, setPName] = useState<string>("");
  const [datas, setDatas] = useState<Product[]>([]);
  const navigator = useNavigate();

  const handleSearch = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ("key" in e && e.key !== "Enter") {
      return;
    }
    if (pName.trim()) {
      navigator("/search", { replace: true });
      setTimeout(() => {
        navigator(`/search/${pName}`);
        setPName("")
      }, 0);
    }
  };

  const fetchData = async (pName: string) => {
    if (pName.trim()) {
      try {
        const response = await axios.get(
          `${MAIN_APT_PATH}${AUTH_PATH}${PRODUCT_PATH}${PRODUCT_SEARCH}`,
          { params: { pName } }
        );

        setDatas(response.data.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setDatas([]);
    }
  };

  const handleChangePName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPName(e.target.value);
  };

  const handleClickSandValue = (e: React.MouseEvent<HTMLButtonElement>) => {
    const selectedValue = e.currentTarget.value;
    setPName("");
    navigator(`/product/productDetail/${selectedValue}`);
  };

  useEffect(() => {
    fetchData(pName);
  }, [pName]);

  return (
    <div>
      <div className="SearchAppInputDiv">
        <input
          className="SearchAppInput"
          type="search"
          value={pName}
          placeholder="검색어를 입력해주세요."
          onChange={handleChangePName}
          onKeyDown={handleSearch}
        />
        <button className="searchButton" value={pName} onClick={handleSearch}>
          <SearchTwoToneIcon />
        </button>
      </div>
      <ul className="searchList">
        {datas.map((data, index) => (
          <li key={index} className="searchLi">
            <button
              className="searchListBtn"
              onClick={handleClickSandValue}
              value={data.pId}
            >
              {data.pName}
            </button>
            <div className="borderLine"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
