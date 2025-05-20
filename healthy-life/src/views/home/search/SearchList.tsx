import React from "react";
import "../../../style/home/SearchList.css";
import Search from "./Search";
import { Searchs } from "./SearchApp";

interface SearchPops {
  searchs: Searchs[];
  toggleSearch: (id: number) => void;
  deleteSearch: (id: number) => void;
}
  
export default function SearchList({
  searchs,
  toggleSearch,
  deleteSearch,
}: SearchPops) {
  return (
    <div className="searchContainer">
      <div className="currentSearch">
        <h5>최근검색어</h5>
        <ul>
          <li>
            {searchs.map((search) => (
              <Search
                key={search.id}
                search={search}
                toggleSearch={toggleSearch}
                deleteSearch={deleteSearch}
              />
            ))}
          </li>
        </ul>
      </div>

      <div className="line"></div>

      <div className="popularSearch">
        <h5>인기키워드</h5>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
}
