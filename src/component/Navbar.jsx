import React, { useEffect } from "react";
import { auth } from '../firesbase'
import {useNavigate } from 'react-router-dom'
import { useAuth } from "../authContext/authContext";
import { Link } from "react-router-dom";
import {LogoutIcon, UserAddIcon, LoginIcon} from '@heroicons/react/solid'
import { useRequestFirebase } from "../util/hook";

const Navbar = () => {
  const {user, avatar, updateEmail, updateAvatar, updateNom, updateIdDocFirebase, updateIdChat, updateUid } = useAuth();
  let navigate = useNavigate()

  // récupérer les infos du firebase
  useRequestFirebase()

  
  // handleLogout
  const handleLogout = () => {
    
    // logout puis demander login
    auth.signOut()
    // remove token dans localstorage
    localStorage.removeItem('token')
    // remove les infos dans le state
    updateEmail('');
    updateIdChat('');
    updateIdDocFirebase('')
    updateNom('')
    updateAvatar('')
    updateUid('')
    // redirect to login
    navigate('/login')
  }

  return(
    <div className="grid grid-cols-6">
      <Link  to="/" className="cursor-pointer col-span-2" aria-label="Link to Home">
        <img title="Home" src = "https://res.cloudinary.com/dtu1ahoyv/image/upload/v1635797471/logo_lyef0n.jpg" alt="logo chat application" className="w-16  col-span-1 "/>
      </Link>
      {/* logo */}

      {/* si user => afficher button logout + profile; si pas user => afficher login + signup */}
      {user ? 
      // user => afficher logout + avatar profile
      (<div className="col-span-4 flex flex-row justify-end self-center ">

        {/* profile */}
        <div className="mr-2">
          <Link to="/profile" title="Profile" aria-label="Link to onglet Profile" className="" >
            {/* s'il y a avatar ou pas? */}
            { avatar ? 
            // afficher avatar
            (<img src= { `${avatar}`} alt="avatar " className= "rounded-full h-12 w-12 mr-5  " />) 
            :
            // pas avatar => afficher 1 img avec username
            (<div className="w-12 h-12 rounded-full p-2 bg-red-500 border-2 text-center uppercase" alt="avatar-default"> {user.email.slice(0,2)} </div>)}
            
          </Link>
        </div>

        {/* button logout */}
        <button title="Logout" aria-label="Link to Logout" className="w-12 p-1 text-white rounded-2xl hover:opacity-80 focus:opacity-80 mr-2 " style = {{background: 'radial-gradient(#4e1564, #851fad)' }}
        onClick= {handleLogout}  >
          <LogoutIcon className="w-8 "/>
        </button>

      </div>) 

      : 

      // pas user => rien afficher 
      (<div className="col-span-4 flex flex-row justify-end self-center mr-2 ">
        <Link title="Signup" aria-label="Link to Signup" to="/signup" >
          <button className="w-12 p-1 text-white rounded-2xl hover:opacity-80 focus:opacity-80 mr-2 " style = {{background: 'radial-gradient(#4e1564, #851fad)' }} >
            <UserAddIcon className="w-8" />
          </button>
        </Link>

        <Link title="Login" aria-label="Link to Login" to="/login" >
          <button className="w-12 p-1 text-white rounded-2xl hover:opacity-80 focus:opacity-80 mr-2 " style = {{background: 'radial-gradient(#4e1564, #851fad)' }}>
            <LoginIcon className="w-8 " />
          </button>
        </Link>
        
      </div>)}
      
      
    </div>
  )
}

export default Navbar