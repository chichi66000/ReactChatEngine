import React from "react";
import { useState } from "react";
import Swal from "sweetalert"
import { sendPasswordResetEmail } from "firebase/auth";
import {auth } from "../firesbase"
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  let navigate = useNavigate()

  // handleSubmit
  const handleSubmit = async (event) => {
    event.preventDefault()
    // envoyer au server de firebase 
    sendPasswordResetEmail( auth, email)
    .then ( () => {
      Swal({
        icon: "success",
        text: "Please check your email then reset password"
      })
      navigate('/login')
    })
    .catch (err => setErr(err.message))
  }

  return (
    <div>
      <form className="bg-gray-200 border border-2 rounded-lg p-2 my-5 mx-auto max-w-max relative top-28 " onSubmit = {handleSubmit} >
        <h2 className="font-bold text-purple-900 mx-auto text-2xl text-center ">Reset Password </h2>
        {/* input email */}
        <div className="grid grid-cols-4 my-1 p-1" >
           <label htmlFor="email" className="col-span-1 px-2 mr-1 font-bold text-yellow-500 self-center  ">Email</label>
          <input type="email" id="email" required className="col-span-3 border border-2 rounded-md p-2 ml-2" value={email} onChange = { (event) => setEmail(event.target.value)} />
        </div>
       
        {/* button reset password pour envoyer email */}
        <div className="mx-auto text-center ">
          <button aria-label="button reset password" className="p-2 bg-purple-900 text-white rounded-2xl hover:bg-yellow-900 focus:bg-yellow-900 hover:opacity-80 focus:opacity-80 ">
            Reset Password
          </button>
        </div>

        {/* message error */}
        <p className="p-2 text-center text-red-500 text-lg "> {err} </p>

      </form>
    </div>
  )
}

export default ResetPassword