import React from 'react'
import MainApp from './banner/MainApp'
import Main2 from './main2/Main2'
import NewItem from './newItem/NewItem'
import SearchApp from './search/SearchApp'

export default function Home() {
  return (
    <div>
        <MainApp />
        <SearchApp />
        <NewItem />
        <Main2/>
    </div>
  )
}
