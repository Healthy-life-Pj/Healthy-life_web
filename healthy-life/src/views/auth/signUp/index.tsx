import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUpStart from './SignUpStart'
import SignUp from './SignUp'

function index() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<SignUpStart/>}/>
        <Route path='/healthylife' element={<SignUp/>}/>
      </Routes>
    </div>
  )
}

export default index