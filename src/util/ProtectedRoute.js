import React from 'react';
import { isLogin } from './authenticate';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { auth, useAuth } from '../authContext/authContext'

const ProtectedRoute = ( {children}) => {
  const {user } = useAuth()
  return (
    // <Route {...rest} render={ props => 
    //   // Show the component only when the user is logged in
    //   // Otherwise, redirect the user to /login page
    //   isLogin() ? 
    //     <Component />
    //     :
    //     <Navigate to="/login" />
    // }
      
    // />
    // isLogin ? children : <Navigate to = "/login" />
    user ? children : <Navigate to = "/login" />
  )
}



export default ProtectedRoute