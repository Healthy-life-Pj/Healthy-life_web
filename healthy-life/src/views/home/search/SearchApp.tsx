import React, { useEffect, useRef, useState } from 'react'
import '../../../style/home/Search.css'
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import SearchList from './SearchList';
import '../../../style/home/Search.css'


export interface Searchs {
  id: number;
  text: string;
  completed: boolean;
}

const laodSearchs = (): Searchs[] => {
  const stroedSearchs = localStorage.getItem('searchs');
  return stroedSearchs ? JSON.parse(stroedSearchs) : [];
}

export default function SearchApp() {
  const [searchs, setSearchs] = useState<Searchs[]>([]);
  const [inputValue, setInputValue] = useState<string>('')

  // 검색창 입력시 id value 값 할당 
    let nexIdInitialValue = searchs.length > 0 
    ? Math.max(...searchs.map(search => search.id)) + 1
    : 1;

    const nextId = useRef(nexIdInitialValue);

    // 검색어 추가
    const addSearch = () => {
      if (inputValue.trim() === '') return; 

      setSearchs([...searchs, {
        id: nextId.current,
        text: inputValue,
        completed: false
      }]);

      setInputValue('');
      nextId.current += 1;
    } 

    // 최근 검색어에 검색어 추가 명령어
    const toggleSearch = (id: number) => {
      setSearchs(
        searchs.map(search => 
          search.id === id 
          ? { ...search, completed: !search.completed}
          : search
        )
      )
    }
    // 최근 검색어 삭제 명령어 
    const delelteSearch =(id: number) => {
      setSearchs(searchs.filter(search => search.id !== id));
    } 

    useEffect(() => {
      localStorage.setItem('searchs', JSON.stringify(searchs));
    }, [searchs]);

  return (
    <div>
    <div className='SearchAppInputDiv'>
      <input 
      className='SearchAppInput' 
      type="search" 
      value={inputValue}
      placeholder='검색어를 입력해주세요.'
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => (e.key === "Enter" ? addSearch() : null)}
      />
    <button className='searchButton' onClick={addSearch}><SearchTwoToneIcon/></button>
    </div>
    <div>
    <SearchList searchs={searchs} toggleSearch={toggleSearch} deleteSearch={delelteSearch}/>
    </div>
    </div> 
  )
}
