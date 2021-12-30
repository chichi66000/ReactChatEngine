import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firesbase";
import { useAuth } from "../authContext/authContext";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "@firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import axios from "axios";
import Swal from "sweetalert"
import {Link } from "react-router-dom";
import { useRequestFirebase } from "../util/hook";

export default function DeleteUser () {
  const { user, idChat, idDocFirebase, email, updateEmail, updateAvatar, updateNom, updateUid, updateIdDocFirebase, updateIdChat } = useAuth()
  const [emailConfirm, setEmailConfirm] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [err, setErr] = useState('')
  let navigate = useNavigate()

  // hook personalisé pour récupérer les infos du user, pour bien naviguer en tapant sur barre URL
  useRequestFirebase()

  // handleDeleteUser
  const handleDleteUser = async (event) => {
    event.preventDefault()
    // reauthenticated avec email et password (demande de firebase pour les actions sensibles) avant de delete user 
    let credentials = EmailAuthProvider.credential(emailConfirm, passwordConfirm)
    await reauthenticateWithCredential( user, credentials)
    .then ( (res) => {
      // log
      console.log("reauthenitaced ok ");
      //set token dans localstorage
      res.user.getIdToken()
      .then (token => {
        localStorage.setItem('token', token)
      })
      .then( () => {
        // delete ce user dans chatengine
        axios.delete(`https://api.chatengine.io/users/${idChat}/`, 
        {headers: {"private-key": process.env.REACT_APP_CHAT_PRIVATE_KEY}})
        .then( () => {
          //delete document de ce user dans firestore
          deleteDoc(doc(db, "users", idDocFirebase))
          // delete user dans firebase
          deleteUser(user)
            .then( () => {
              console.log("user delete");
              //effacer le token
              localStorage.removeItem('token')
              // supprimer les infos dans le state
              updateAvatar('');
              updateEmail('')
              updateIdChat('')
              updateIdDocFirebase('');
              updateNom('');
              updateUid('');
              Swal({
                icon:"success",
                text: "User deleted"
              })

              //revenir à login
              navigate('/login')
            })
            .catch(err => {console.log(err); setErr('Failed, please try later')})
        })
        .catch (err => {console.log(err); setErr('Failed, please try later')})
      })
      
    })
    .catch (err => {
      console.log(err);
      setErr("Failed! Email, password incorrect")
    })
  }


  return( 
    <div className="">
      <form className="bg-gray-200 border border-2 rounded-lg p-2 my-5 mx-auto max-w-max relative top-28 " onSubmit = {handleDleteUser}>
        <h2 className="font-bold text-purple-900 mx-auto text-2xl text-center">DeleteUser</h2>

        {/* input email */}
        <div className="grid grid-cols-4 my-1 p-1">
          <label htmlFor="email" className="col-span-1 px-2 mr-1 font-bold text-yellow-500 self-center " >Email</label>
          <input id="email" value= {emailConfirm} required className="col-span-3 border border-2 rounded-md p-2 ml-2 " onChange = { (event) => setEmailConfirm(event.target.value)} />
        </div>

        {/* input password */}
        <div className="grid grid-cols-4 my-1 p-1" >
          <label htmlFor="password" className="col-span-1 px-2 mr-1 font-bold text-yellow-500 self-center" >Password</label>
          <input id="password" type="password" value= {passwordConfirm} required className="col-span-3 border border-2 rounded-md p-2 ml-2 " onChange = { (event) => setPasswordConfirm(event.target.value)} />
        </div>

        {/* button delete user */}
        <div className="text-center mx-auto flex flex-row flex-wrap justify-around my-2 ">
          <button aria-label="button confirm Delete User" className="w-28 p-2 bg-purple-900 text-white rounded-2xl hover:bg-yellow-900 focus:bg-yellow-900 hover:opacity-80 focus:opacity-80 my-2 " type="submit" >Delete User</button>

          {/* button cancel */}
          <Link aria-label="Cancel and Link to Home" to="/" className="w-28 p-2 bg-red-700 text-white rounded-2xl hover:bg-yellow-500 focus:bg-yellow-400 hover:opacity-80 focus:opacity-80 my-2 ">
            <button className="">Cancel</button>
          </Link>
        </div>

        {/* error */}
        <p className="mx-auto text-red-500 font-bold my-2 "> {err} </p>
      </form>
      
    </div>
  )
}