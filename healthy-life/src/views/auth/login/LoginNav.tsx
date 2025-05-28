import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import FindId from './find-id/FindId'
import FindPassword from './FindPassword'
import "../../style/auth/login/login.css"

function LoginNav() {
  return (
    <div>
      <Login/>
    </div>
  )
}

export default LoginNav