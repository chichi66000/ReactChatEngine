import React from 'react';
import { isLogin } from './authenticate';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { auth, useAuth } from '../authContext/authContext'

const ProtectedRoute = ( {children}) => {
  const {user } = useAuth()
  return (
    user ? children : <Navigate to = "/login" />
  )
}



export default ProtectedRoute