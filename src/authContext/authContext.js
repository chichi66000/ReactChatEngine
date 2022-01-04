import React from 'react';
import { useEffect, useContext, useState, useRef } from 'react';
import { auth } from '../firesbase.js';
import { onAuthStateChanged } from 'firebase/auth';
import AbortController from "abort-controller"

//declarer context
const AuthContext = React.createContext()
export function useAuth () { return useContext(AuthContext)}

export function AuthProvider ({children}) {
  // loading pour observer état chargement
  const [loading, setLoading] = useState(true)
  // utiliser useState pour initialiser le state du user
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [uid, setUid] = useState('')
  const [idChat, setIdChat] = useState('')
  const [idDocFirebase, setIdDocFirebase] = useState('')
  const didMountRef = useRef(false)

  // utiliser useEffect pour update les changements d state user
  useEffect (() => {
    didMountRef.current = true
    let controller = new AbortController();
    // utiliser fonction onAuthStateChanged de firebase pour observer user sur object Auth
    onAuthStateChanged(auth, (user) => {
      if (didMountRef) {
        setUser(user)
        setLoading(false)
      }
    });
    
    //clean up
    return ( () => { 
      didMountRef.current = false;
      controller.abort()
    })
  }, [user])
  
  // récupérer les infos de user
  const updateEmail = (newEmail) => {setEmail(newEmail)}
  const updateUid = (newUid) => {setUid(newUid)}
  const updateAvatar = (newAvatar) => {setAvatar(newAvatar)}
  const updateNom = (newNom) => {setNom(newNom)}
  const updateIdChat = (newIdChat) => {setIdChat(newIdChat)}
  const updateIdDocFirebase = (newIdDocFirebase) => {setIdDocFirebase(newIdDocFirebase)}
  const updateUser = (newUser) => {setUser(newUser)}

  const value = {user, nom, avatar, idChat, idDocFirebase, email, uid, updateEmail, updateAvatar, updateNom, updateIdDocFirebase, updateIdChat, updateUid, updateUser }

  return <AuthContext.Provider value={value}>
      {/* s'il not loading then => afficher les children */}
      {!loading && children }
    </AuthContext.Provider>
  
}

