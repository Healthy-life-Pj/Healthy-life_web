import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import {
  AUTH_PATH,
  MAIN_APT_PATH,
  PRODUCT_PATH,
  PRODUCT_SEARCH,
} from "../constants";
import axios from "axios";
import { AccountCircle } from "@mui/icons-material";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import "../style/search.css";

function HeaderSearchBar() {
  const [pName, setPName] = useState<string>("");
  const [datas, setDatas] = useState<Product[]>([]);
  const navigator = useNavigate();

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        
        const datas: Product[] = response.data.data

        const uniqueDatSlice = datas.slice(0, 5);

        setDatas(uniqueDatSlice);
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
    <div className="headerSearchContainer">
      <div className="button2">
        <div className="headerSearchBar">
          <input
            className={`searchBarInput ${datas.length > 0 ? "active" : ""}`}
            type="text"
            placeholder="검색어를 입력해주세요."
            value={pName}
            onKeyDown={handleSearch}
            onChange={handleChangePName}
          />
          <ul
            className={`headerSearchList ${
              datas.length > 0 ? "show" : "empty"
            }`}
          >
            {datas.map((data, index) => (
              <li key={index} className="headerSearchLi">
                <button
                  className="searchListBtn"
                  value={data.pId}
                  onClick={handleClickSandValue}
                >
                  {data.pName}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Link className="button2Link" to={"/my-page"}>
          <AccountCircle style={{ fontSize: "26px" }} />
        </Link>
        <Link className="button2Link" to={"/cart"}>
          <LocalGroceryStoreIcon style={{ fontSize: "26px" }} />
        </Link>
      </div>
    </div>
  );
}

export default HeaderSearchBar;
