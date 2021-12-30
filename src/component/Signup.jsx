import React from "react";
import { useState } from "react";
// import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { userSchema } from "../validation/userSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Signup = () => {
  let navigate = useNavigate();
  const [userName, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  //utiliser yup pour valider userSchema 
  const { register, handleSubmit, formState :{ errors }, reset } = useForm ({
    resolver: yupResolver(userSchema),
  });


  // handleSubmit Signup
  const handleSubmitSingup = async (data) => {
    // event.preventDefault();

    // formdata.append('avatar', data.avatar)
    await axios.post('https://react-app-chatengine.herokuapp.com/user/signup', {
      userName: data.userName,
      password: data.password,
      
    })
    // succès
    .then( (response) => {
      setUsername(data.userName)
      setPassword(data.password)
      
      // redirect à login
      Swal({
        icon: "success",
        text: "You can Login now"
      });
      navigate('/login')
      
    })
    // error
    .catch ( (error) => {setErr("The email address is already in use by another account"); })
    // reset les inputs
    reset()
  };


  return (
    <div className="h-screen">
      <h1 className=" text-3xl font-bold mx-auto my-5 text-center "  >Welcome to Chat App</h1>

        {/* // formulaire pour login */}
      <form className="bg-gray-200 border border-2 rounded-lg p-2 my-5 mx-auto w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 relative top-12 p-2 " onSubmit={handleSubmit(handleSubmitSingup)} >
        <h3 className="font-bold text-purple-900 mx-auto text-2xl text-center"> Signup </h3>

        {/* input username */}
        <div className="flex flex-row justify-between flex-wrap my-2">
          <label htmlFor="userName" className="w-28 px-2 mr-1 font-bold text-yellow-500 self-center text-left ">Email</label>
          <input type="text" id="userName" className="  border border-2 rounded-md p-2 md:ml-2 mx-1 w-full" placeholder="email" 
          required
          {...register("userName")}
          />
          
        </div>
        {/*email error message  */}
        <p className= "text-red-500 mx-auto text-center text-sm pb-2">{errors.userName?.message}</p>

        {/* input password */}
        <div className="flex flex-row justify-between flex-wrap text-center">
          <label htmlFor="password" className="w-28 px-2 mr-1 font-bold text-yellow-500 self-center text-left ">Password</label>
          <input type="password" id="password" className="border border-2 rounded-md p-2 md:ml-2 mx-1 w-full" placeholder="password" 
          required
          {...register('password')}
          />
        </div>

        {/*email error message  */}
        <p className= "text-red-500 mx-auto text-center text-sm pb-2">{errors.password?.message}</p>

        {/* button submit */}
        <div className="text-center mx-auto my-2 ">
          <button aria-label="button Signup" className="p-2 bg-purple-900 text-white rounded-2xl hover:bg-yellow-900 focus:bg-yellow-900 hover:opacity-80 focus:opacity-80 hover:text-black focus:text-black ">Signup</button>
        </div>
        
        {/* error */}
        <p className="mx-auto text-red-500 font-bold "> {err} </p>

        {/* link to login */}
        <Link to = "/login" aria-label="Link to Login" className="text-blue-500 hover:text-red-500 hover:opacity-80 focus:text-red-500 focus:opacity-80 my-2 text-lg ">Login </Link>
      </form>
    </div>
  )
}

export default Signup;