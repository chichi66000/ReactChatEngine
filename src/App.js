import React from 'react';
import { BrowserRouter, Routes, Route, Link} from "react-router-dom"
import { AuthProvider} from './authContext/authContext';
import Login from './component/Login';
import Signup from './component/Signup';
import Chat from './component/Chat'
import Navbar from './component/Navbar'
import Profile from './component/Profile'
import UpdateProfile from './component/UpdateProfile';
import DeleteUser from './component/DeleteUser';
import ResetPassword from './component/ResetPassword';
import {NotFound} from "./component/NotFound"
import ProtectedRoute from './util/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/signup" element = { <Signup /> } />
          <Route path="/login" element = { <Login /> } />
          <Route path="/reset-password" element = { <ResetPassword /> } />
          <Route path="*" element= {<NotFound /> } />

          {/* ProtectedRoute */}
          <Route exact path="/" element={<ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/update-profile" element={<ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } />
          <Route  path="/profile" element={<ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/delete-user" element={<ProtectedRoute>
              <DeleteUser />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
