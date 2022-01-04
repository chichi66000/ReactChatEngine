import { useState } from "react";
import {auth}   from "../firesbase";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth"
import { Link } from 'react-router-dom'

const Login = () => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('')
  let navigate = useNavigate()

  // funtion handleSubmit form
  const handleSubmit = async (event) => {
    event.preventDefault()
    // login avec email + pw avec firebase
    await signInWithEmailAndPassword(auth, userName, password)

    // si succès => aller au chat
    .then( (result) => {
      result.user.getIdToken().then((token) => {
        
      localStorage.setItem('token', token)
      // aller au chat
      navigate('/')
      })
    })
    // si error => envoyer erreur
    .catch(error => {
      console.log(error)
      setErr('Email, password incorrect')
    } ) 
  }


  return (

    <div className="h-screen">
      <h1 className="text-3xl font-bold mx-auto my-5 text-center "  >Welcome to Chat App</h1>

        {/* // formulaire pour login */}
      <form className="bg-gray-200 border border-2 rounded-lg p-2 my-5 mx-auto w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 relative top-12 p-2 " onSubmit={handleSubmit}>
        <h3 className="font-bold text-purple-900 mx-auto text-2xl text-center"> Login </h3>
        {/* input username */}
        <div className="flex flex-row justify-between flex-wrap ">
          <label htmlFor="userName" className="w-28 px-2 mr-1 font-bold text-yellow-500 self-center text-left  ">Email</label>
          <input type="text" id="userName" className=" border border-2 rounded-md p-2 md:ml-2 mx-1 w-full" placeholder="email" value={userName} 
          onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        {/* input password */}
        <div className="flex flex-row justify-between flex-wrap ">
          <label htmlFor="password" className="w-28 px-2 mr-1 font-bold text-yellow-500 self-center text-left  ">Password</label>
          <input type="password" id="password" className=" border border-2 rounded-md p-2 md:ml-2 mx-1 w-full" placeholder="password" value={password} 
          onChange={(event) => setPassword(event.target.value)} 
          />
        </div>

        {/* button submit */}
        <div className="text-center mx-auto my-2 ">
          <button aria-label="button Login" type="submit" className="p-2 bg-purple-900 text-white rounded-2xl hover:bg-yellow-900 focus:bg-yellow-900 hover:opacity-80 focus:opacity-80 hover:text-black focus:text-black ">Start chatting...</button>
        </div>

        {/* error */}
        <p className="mx-auto text-red-500 font-bold my-2 "> {err} </p>

        {/* zone pour les links */}
        <div className="flex flex-col my-1 p-1">
          {/* reset password */}
          <Link to ="/reset-password" aria-label="Link to go onglet Reset Password" className="text-blue-500 hover:text-red-500 hover:opacity-80 focus:text-red-500 focus:opacity-80  my-2 " > 
              Forgot Password?
          </Link>
            
          {/* Link to signup */}
          <Link to = "/signup" aria-label="Link to Signup" className="text-blue-500 hover:text-red-500 hover:opacity-80 focus:text-red-500 focus:opacity-80 my-2 ">Don't have account? </Link>
        </div>
          
      </form>
    </div>
    
  )
}

export default Login;