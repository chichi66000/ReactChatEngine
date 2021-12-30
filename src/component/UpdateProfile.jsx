import React, { useState } from "react";
import { useAuth } from "../authContext/authContext";
import { db} from "../firesbase";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert'
import { updateDoc, doc } from "firebase/firestore"; 
import {useRequestFirebase} from '../util/hook'


export default function UpdateProfile () {

  let navigate = useNavigate()
  const {user, idDocFirebase, idChat, updateAvatar, updateNom} = useAuth()
  const [newNom, setNewNom] = useState('')
  const [img, setImg] = useState('')
  const [preview, setPreviewAvatar] = useState(null)
  const [err, setErr] = useState('')

  // hook pour récupérer info du user
  useRequestFirebase()
  // console.log("idChat ", idChat);
  // console.log("idDocFirebase ", idDocFirebase);

  //read file avec readURI puis enregistrer dans setPreviewAvatar pour preview avatar
  const readURI = async(e) => {
    if( e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (event) {
        setPreviewAvatar(event.target.result)
      }
      reader.readAsDataURL(e.target.files[0])
    }
    
  }

  //loadFile et preview avatar
  const loadFile = async (e) => {
    await setImg(e.target.files[0])
    // preview avatar
    readURI(e)
  };

  // handleSubmit form 
  const handleSubmit = async(event) => {
    event.preventDefault();
    
    let formdata = new FormData()
    if (newNom !== "") {
      formdata.append("first_name", newNom)
    }

    if ( img !== "") {
      formdata.append("avatar", img)
    }
    // post tous les informations au chatEngine
    await axios.patch(`https://api.chatengine.io/users/${idChat}/`, 
      formdata, 
      {headers : {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "private-key": process.env.REACT_APP_CHAT_PRIVATE_KEY,
        "user-name": user.email,
        "user-secret": user.uid}
      })
      .then ((res) => {
      // attendre les responses puis, update le document de firestore: avatar, email...
      const updateUsername = doc(db, "users", `${idDocFirebase}`)
        updateDoc( updateUsername , {
          username: res.data.email,
          avatar: res.data.avatar, 
          nom: res.data.first_name
        })
      // update le state de user
      updateAvatar(res.data.avatar)
      updateNom(res.data.first_name)
      Swal({
          icon: "success",
          });
          navigate('/')
    })
    .catch (err => {console.log(err); setErr("Sommething wrong. Please try later")})

  }

  return( 
    <div className=" h-screen">

      {/* form pour update profile */}
      <form className= "bg-gray-200 border border-2 rounded-lg p-2 my-5 mx-auto max-w-max relative top-12 p-2  "
      onSubmit={handleSubmit} encType="multipart/form-data" >
        
        <h2 className="font-bold text-purple-900 mx-auto text-2xl text-center">Update Profile</h2>

             {/* Name */}
        <div className="flex flex-row justify-between flex-wrap my-2 ">
          <label htmlFor="name" className= "w-28 px-2 mr-1 font-bold text-yellow-500 self-center text-left " >Name</label>
          <input id="name" type="text" className=" border border-2 rounded-md p-2 md:ml-2 mx-1 w-full" placeholder= "Your Name" value={newNom} onChange={ (e) =>setNewNom(e.target.value)} />
        </div>

        {/* Avatar */}
        <div className="flex flex-row  flex-wrap my-2">
          <input id="avatar" type="file" className="hidden p-2 border rounded-md bg-gray-200 " onChange = {(e) => {loadFile(e)}} />
          <label htmlFor="avatar" className="p-2 ml-2 cursor-pointer w-28 mr-1 font-bold text-yellow-500 self-center text-left rounded-md hover:opacity-80 focus:hopacity-80 hover:text-white focus:text-white " style = {{background : "#0c0c0b"}} >Avatar...</label>
          {/* preview avatar */}
          {preview  ? (<img src={`${preview}`} alt="preview avatar" className="w-12  ml-2 rounded " />) : (<div className="hidden" ></div>)}
        </div>

        <div className="flex flex-row justyfy-between flex-wrap ">
          {/* button submit */}
          <div className="mx-auto text-center my-2 ">
            <button aria-label="button update profile" className="p-2 bg-yellow-500 rounded-md hover:opacity-80 focus:opacity-80 hover:text-white focus:text-white">Update</button>
          </div>

          {/* button cancel */}
          <Link aria-label="Button cancel, Link to Home" to="/" className="mx-auto text-center my-2 ">
            <button aria-label="Cancel and Link to Home" className="p-2 bg-red-500 rounded-md hover:opacity-80 focus:opacity-80 hover:text-white focus:text-white">Cancel</button>
          </Link>

        </div>
        
        <p className="p-2 text-center text-red-500 text-lg "> {err} </p>
      </form>
    </div>
  )
}