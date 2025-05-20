import React, { useState } from 'react'
import '../../../style/home/Search.css'
import { Searchs } from './SearchApp';
import CloseIcon from '@mui/icons-material/Close';

interface SearchProps {
  search: Searchs;
  toggleSearch: (id: number) => void;
  deleteSearch: (id: number) => void;
}

export default function Search({search, toggleSearch, deleteSearch}: SearchProps) {

  const [searchWord, setSearchWord] = useState<string | null>();

  const printWord = () => {
    
  }

  return (
      <div className='currentsearchList'>
      <span 
      onChange={()=> toggleSearch(search.id)}>
        {search.text}
      </span>
      <button className='searchDeleteBtn' onClick={() => deleteSearch(search.id)}><CloseIcon style={{fontSize:'14'}} /></button>
      </div>
  )
}