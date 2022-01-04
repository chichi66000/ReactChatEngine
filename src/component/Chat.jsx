import React, {useState, useEffect} from 'react'
import {ChatEngine} from 'react-chat-engine'
import ChatFeed from './ChatFeed'
import { db } from '../firesbase'
import { useAuth } from '../authContext/authContext'
import axios from 'axios'
import { doc, setDoc } from "firebase/firestore"; 
import AbortController from "abort-controller"
import { useRequestFirebase } from '../util/hook'


const Chat = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true)

  useEffect ( () => {
    let controller = new AbortController();
    // async function api call, auto 
    ( async () => {
      await axios.get('https://api.chatengine.io/users/me/', {
      headers: {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "user-name": user.email,
        "user-secret": user.uid
      }},
      {signal: controller.signal}
       )
    // si succès => login chat engine avec ce user 
    .then (() => {
      setLoading(false)
    })

    // en cas d'erreur => pas trouvé user => créer nouvel user avec email + pw
    .catch ( (err) => {

      if (err.name === "AbortError") {
        console.log("successfully aborted");
      } 
      else {
          // créer object FormData et insérer les informations dedans
        let formdata = new FormData()
        formdata.append('username', user.email)
        formdata.append('email', user.email)
        formdata.append('secret', user.uid)

        // apel API de ChatEngine
        axios.post( 'https://api.chatengine.io/users/', formdata, {
          headers: { "private-key": process.env.REACT_APP_CHAT_PRIVATE_KEY },
          signal: controller.signal
        })
          .then( (res) => {
            try {
              setDoc(doc(db, "users", user.email), {
                userId: res.data.id,
                username: user.email,
                avatar: "", 
                nom: '',
              })
            } catch (e) {
              console.error("Error adding document: ", e);
            }
            setLoading(false)
          })
          .catch(e => {console.log("error ", e.response);})
          }
    })
  })();

    // clean up
    return ( () => {
      controller.abort();
    })  
  }, [user])

  // hook pour récupérer les infos de user dans firestore
  
  useRequestFirebase()
    
  //si loading = true => rien affciher
  if (loading) return <div>Loading</div>

  // si non afficher chatengine
  return (
    <div>
      {/* <Navbar /> */}
      <ChatEngine className="h-screen "
      height ='100vh'
      userName = {user.email}
      userSecret= {user.uid}
      projectID= {process.env.REACT_APP_CHAT_PROJECT_ID}
      renderChatFeed = { (chatAppProps) => <ChatFeed {...chatAppProps} />}
      />
    </div>
    
  )
}

export default Chat