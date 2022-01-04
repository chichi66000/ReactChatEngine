import { useEffect } from "react";
import { collection, getDocs, query, where, } from "firebase/firestore"; 
import { db} from "../firesbase";
import { useAuth } from "../authContext/authContext";
import axios from "axios";
import AbortController from "abort-controller"

export const useRequestFirebase = () => {
  const {user,  updateEmail, updateAvatar, updateNom, updateIdDocFirebase, updateIdChat, updateUid} = useAuth()

  // récupérer les infos de firebase et stocker
  useEffect ( () => {
    let controller = new AbortController();
    // si user => récupérer les infos de firestore
    if (user) {
      (async () => {
        const q = query(collection(db, "users"), where("username", "==", user.email));
        try{
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach( doc => {
            let data = doc.data()
            updateIdChat(data.userId)
            updateIdDocFirebase(doc.id)
            updateEmail(user.email)
            updateUid(user.uid)
            updateNom(data.nom)
          })
        } 
        catch (err) {console.log(err);}
      })()
    }

    return ( () => {
      controller?.abort();
    })
  }, [user])

  // récupérer avatar sépéramenet depuis chatEngine car src change tous les jours
  useEffect ( () => {
    let controller = new AbortController()
    if (user) {
        ( async() => {
        await axios.get('https://api.chatengine.io/users/me/', {
          headers: {
            "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
            "user-name": user.email,
            "user-secret": user.uid
          },
          signal: controller.signal
        })
        // si succès => login chat engine avec ce user 
        .then (res => {
          updateAvatar(res.data.avatar)
        })
        .catch ( (err) => {
          if (err.name === "AbortError") {
            console.log("successfully aborted");
          } 
          else {console.log(err);} 
        })
      })()
    }
    
    return ( () => {
      controller.abort()
    })
  }, [user])
  
}