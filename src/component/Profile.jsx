import React from "react";
import { useAuth } from "../authContext/authContext";
import {Link} from 'react-router-dom';
import {useRequestFirebase} from '../util/hook'

const Profile = () => {
  const { nom, avatar, email} = useAuth()

  // hook pour récupérer les infos du user
  useRequestFirebase()

  return(
    <div className="bg-gray-200 border border-2 rounded-lg p-2 my-5 mx-auto  top-12 relative max-w-max sm:w-1/2 ">
      <h3 className="font-bold text-purple-900 mx-auto text-2xl text-center p-2 my-2 ">Your Profile</h3>
      <p className="my-2 p-2 "> <strong>Email:</strong> {email} </p>
      {/* nom ? */}
      <div className="" > {nom?(<p className="my-2 p-2"> <strong>Nom: </strong>{nom}  </p> ) : (<div className="hidden"></div>)} </div>

      {/* avatar?  */}
      <div className=""> {avatar?
        (<p className="flex flex-row my-2 p-2">
          <span className="font-bold self-center">Avatar: </span> 
          <span> 
            <img src= {avatar} className="w-12 self-center rounded-full h-12 ml-2  " alt="avatar " /> 
          </span>
        </p> ) 
        : 
        (<div className="hidden"></div>)} 
      </div>
      
      <div className="my-2 p-2 ">
        {/* button modifier le profile */}
        <Link to="/update-profile" aria-label="Link to onglet Update Profile" className="text-center mx-auto p-2  ">
          <button aria-label="button update Profile" className="p-2 bg-blue-500 rounded-md w-32 my-2 md:mr-2 hover:opacity-80 focus:opacity-80 hover:text-white focus:text-white shadow    " >Update Profile</button>
        </Link>

        {/* button supprimer le compte */}
        <Link to = "/delete-user" aria-label="Link to onglet Delete User" className="text-center mx-auto p-2">
          <button className="p-2 bg-red-500 rounded-md w-32 my-2 hover:opacity-80 focus:opacity-80 hover:text-white focus:text-white shadow ">Delete user </button>
        </Link>
      </div>
      
    </div>
  )
}

export default Profile