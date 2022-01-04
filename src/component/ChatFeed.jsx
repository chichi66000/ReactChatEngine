import React, {useEffect, useState, useRef, useContext, useLayoutEffect} from 'react';
import Swal from 'sweetalert2'
import axios from 'axios';
import NewMessageForm  from "./NewMessageForm";
import MyMessage from "./MyMessage";
import TheirMessage from "./TheirMessage";
import { useAuth } from '../authContext/authContext';
import { ChatAlt2Icon, CheckCircleIcon, CogIcon, TrashIcon } from '@heroicons/react/solid';
import { ChatEngineContext } from 'react-chat-engine'
// import AbortController from "abort-controller"


const ChatFeed = (props) => {
  let { chats, userName, activeChat, messages } = props
  const {user} = useAuth()
  const {setActiveChat, setMessages} = useContext(ChatEngineContext)
  let chat = chats && chats[activeChat];
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenSetting, setIsOpenSetting] = useState(false)
  const [isOpenListPeople, setIsOpenListPeople] = useState(false)
  const [isAdmin, setIsAdmin] = useState('')
  let [chatRooms, setChatRooms] =useState([])
  let [otherPeople, setOtherPeople] = useState([])
  const didMountRef = useRef(false)
  
  // récupérer admin de chat room si activeChat change
  useEffect ( () => {
    let isCancel = false

    // function pour récupérer admin du active chat
    const getAdminOfActiveChat = async() => {
      axios.get(`https://api.chatengine.io/chats/${activeChat}/`, {
        headers: {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "user-name": user.email,
        "user-secret": user.uid
        }
      } 
      )
      .then ( (res) => {
        if ( !isCancel ) {
          if (user.email === res.data.admin.username) {
            setIsAdmin(true)
          }
          else {setIsAdmin(false)}
        }
        
      })
      .catch (err => {
        if (err.name === "AbortError") { console.log("abort erreur");}
        console.log(err);
      })
    }
    getAdminOfActiveChat()
    
    return ( () => {
      isCancel = true
    })
  }, [activeChat])


  // useEffect pour récupérer les messages si activeChat change
  useEffect ( () => {
    let isCancel = false

    // getMessagesOfActiveChat()
    const getMessagesOfActiveChat = async() => {
      axios.get(`https://api.chatengine.io/chats/${activeChat}/messages/latest/45/`, {
        headers: {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "user-name": user.email,
        "user-secret": user.uid
        }
      }
      )
      .then ( (res) => {
        if( !isCancel) {
          setMessages(res.data)
        }
      })
      .catch (err => {
        if (err.name === "AbortError") { console.log("abort erreur");}
        console.log(err);
      })
    }

    getMessagesOfActiveChat()

    return ( () => {
      // controller.abort()
      isCancel = true
    } )
  }, [activeChat, chats])

  // renderMyMessages
  const renderMyMessages = () => {
    const keys = Object.keys(messages)  // récupérer le tableau des messages
    return keys.map( (key, index) => {
      // console.log("key ", key);
      const message = messages[key]     // le message à la position de key
      // console.log("message jey ", message.id );
      // récupérer la position du dernier message 
      const lastMessageKey = index === 0? null : keys[index-1] 
      // myMessage: username === à la person qui envoie 
      const isMyMessage = userName === message.sender.username 

      // render afficher les messsages
      return (
        <div>
          {/* partie chatFeed avec message */}
          <div key= {`index_${message.id }`} className="p-2 mb-2 ">
            <div className="grid grid-cols-5 ">
              {/* render selon si le message est isMyMessage ou pas?  */}
              {isMyMessage? 
                <MyMessage message= {message} userName={userName}  />
                : 
                <TheirMessage message = {message} lastMessage = {messages[lastMessageKey]} />}
            </div>

            {/* render avatar */}
            <div className = "" >
                {renderReadReceipts(message, isMyMessage, userName)} 
            </div>

          </div>

        </div>
      )

    })

  };
  
  // render avatar du sender pour les messages
  const renderReadReceipts = (message, isMyMessage, userName) => {
    return chat.people.map( (person, index) => person.last_read === message.id && (
      <div key = {`read_${person.person.username}`}
        className="mb-2 w-12 relative " style= {{ float: isMyMessage ? 'right' : 'left'}}>
          {/* avatar ou non? */}
        {(person.person.avatar) ? 
        ( // avec avatar => afficher avatar
          <img className="w-10 h-10 rounded-full p-1 " src={`${person.person.avatar}`} alt = "avatar" /> 
        ) 
        : 
        (// avatar = null => afficher les 2 charactères du username
          <div className="w-10 h-10 rounded-full p-1 bg-red-500 border-2 text-center uppercase" alt="avatar-default" > {`${person.person.username}`.slice(0,2)} </div>
        )}
      </div>
    ))
  }

  // button toggle menu chatlist
  const handleToggle1 = async() => {
    setIsOpen(!isOpen)
    
    // console.log("isOpen ", isOpen);
  };

  // ajouter des classe pour ouvrir ou fermer le ChatList au click
  const addClassName = () => {
    let classes = "";
    classes += isOpen ? "block" : "hidden md:block"
    
    return classes
  }

  // button toggle menu chatsetting
  const handleToggle2 = () => {
    setIsOpenSetting(!isOpenSetting)
  }

  // ajouter des classe pour ouvrir ou fermer le ChatSetting au click
  const addClasseChatSetting = () => {
    let classes = "";
    classes += isOpenSetting ? "block" : "hidden md:block"
    return classes
  };

  // add classe opacity au div messsages de chatFeed quand on ouvre le chatList au petit écran
  const addOpacity = () => {
    let opacity = " row-span-5 block row-start-2 row-end-6 sm:row-start-1 ";
    opacity += isOpen || isOpenSetting ? "hidden" : "block"
    
    
    return opacity
  };

  // useEffect pour activer scroll to bottom sur message 
  useLayoutEffect ( () => {
    // s'il y a des messages => scroll to the end of messages
    if (chat) {
      // add scrollToBottom to element div
      let bottom = document.getElementById('scrollToBottom')
        function scrollToBottom (bottom) {
          bottom.scrollTop = bottom.scrollHeight;
        }
      scrollToBottom(bottom)
    }
  }) 

  // add new chat room
  const handleAddChat = async () => {
    const {value: text} = await Swal.fire({
      title: 'Chat room ',
      input: 'text',
      inputLabel: 'Chat room ',
      inputPlaceholder: 'Chat room'
    })
    if (text) {
      //appel API pour creer new chat room
      axios.post('https://api.chatengine.io/chats/', { "title": text},
      {headers: {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "user-name": user.email,
        "user-secret": user.uid
        }}
      )
      .then ( (res) => {
        setActiveChat(res.data.id)
      })
      .catch ( (err) => {console.log(err);})
    }
  }

  
  // récupérer la list des chat room
  // useEffect quand les chats changent
  useEffect ( () => {
    let isCancel = false

    const getChatRoomList = async () => {
      axios.get('https://api.chatengine.io/chats/', {
        headers: {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "user-name": user.email,
        "user-secret": user.uid
        }
      })
      .then( (res) => {
        if ( ! isCancel) {
          setChatRooms(res.data)
        }
        
      })
      .catch ( err => {
        if (err.name === "AbortError") { console.log("abort erreur");}
        console.log(err);
      })
    }

    getChatRoomList()
    
    return ( () => {
      isCancel = true
    } )
  }, [chats, activeChat])
  
  // setActiveChat au click
  const thisActiveChat = (e, id) => {
    // setActive chat avec id du noveau chat room
    setActiveChat(id)
    // appel chatEngine pour récupérer les messages de ce chat room
    axios.get(`https://api.chatengine.io/chats/${id}/messages/latest/45/`, 
    {headers: {
      "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
      "user-name": user.email,
      "user-secret": user.uid
      }
    })
    .then ( (res) => {
      // update les messages pour afficher dans écran
      setMessages(res.data)
      // fermer le menu
      setIsOpen(!isOpen)
    })
    .catch ( err => {console.log(err);})
  };
 
  // handleDeleteChat
  const handleDeleteChat = async () => {
    // vérifier si user est admin de chat chat avant de delete chat  
    // si user est admin, il peut supprimer son chat room ; 
    if (isAdmin) {
      axios.delete(`https://api.chatengine.io/chats/${activeChat}/`, 
      {headers: {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "user-name": user.email,
        "user-secret": user.uid
        }
      })
      .then( () => {
        // fermer le menu
        setIsOpenSetting(!isOpenSetting)
      })
      .catch (err => {console.log(err);})
    }
  };

  // show / hide liste people dans chat setting
  const showListPeople = () => {
    setIsOpenListPeople(!isOpenListPeople)
  };

  // classeName toggleListPeople
  const toggleListPeople = () => {
    let classes = "font-bold "
    classes += isOpenListPeople ? "block" : "hidden"
    return classes
  };

  //input searchePeople automatique avec le clic on input 
  const searchePeople = async (event) => {
    let searchUser = event.target.value;

    // apel chatEngine pour récupérer liste des persons
    axios.get(`https://api.chatengine.io/chats/${activeChat}/others/`,
    {headers: {
      "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
      "user-name": user.email,
      "user-secret": user.uid
      }
    })
    .then( (res) => {
      setOtherPeople(res.data)
      let divResult = document.getElementById("listRecherche")
      // chercher si searcheUser est dans la list des users dans base de donnée?
      // si le champs de recherche n'est pas vide
      divResult.classList.remove('hidden')

      
      //tester si searchUser est includes dans liste des otherPeople?
      let comparerSearchUserWithOtherPeople = otherPeople.some( (element) => {return element.username.includes(searchUser)} )
      // s'il n'y a pas le user recherché, => add class hidden dans le div de resultat
      if (comparerSearchUserWithOtherPeople === false) {divResult.classList.add('hidden')}
      
    })
    .catch (err => {console.log(err)})
  };

  // button hideListResearchPeople
  const hideListResearchPeople = () => {
    // add class hidden au div resultat avec event onClick
    let div = document.getElementById('listRecherche')
    div.classList.add('hidden')
  };

  // addUserToChatRoom
  const addUserToChatRoom = async (e, username) => {
    
    // demande api à chatEngine pour add ce user dans le chat room active
    axios.post( `https://api.chatengine.io/chats/${activeChat}/people/`,{"username": username},
    {headers: {
      "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
      "user-name": user.email,
      "user-secret": user.uid
      }
    }
    )
    .then( (res) => {
      console.log("new user add to chat room ");
      
    })
    .catch (err => {console.log(err);})
  };

  // removeUserFromChatRoom
  const removeUserFromChatRoom = async (username) => {
    // si ce username == admin
    if (username === user.email) {
      // delete chat room
      Swal.fire({
        title: 'Do you want to delete your chat room ?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      .then ( (result) => {
        // si confirmer => delete ce chat room
        if (result.value) { 
          handleDeleteChat()
        }
      })

    }
    else {
      axios.put(`https://api.chatengine.io/chats/${activeChat}/people/`, 
      {"username": username},
      {headers: {
        "project-id": process.env.REACT_APP_CHAT_PROJECT_ID,
        "user-name": user.email,
        "user-secret": user.uid
        }
      })
      .then ( () => {console.log("user remove from  chat room");})
      .catch ( err => {console.log(err);})

    }
  };
  
  // si pas de chat => button pour cliquer pour add new chat
  if (!chat) return (
    // button pour ajouter un chat
    <div title="clic image to add a chat room" className="mx-auto text-center top-1/4 relative"> 
      <button aria-label="clic image to add a chat room" className="animate-pulse " onClick={handleAddChat }>
        <img src="https://res.cloudinary.com/dtu1ahoyv/image/upload/v1637788556/1058px-Chat_bubbles.svg_zeabzt.png" alt="bubble chat" className="w-52 " />
        <h2 className="text-red-500 text-lg font-bold " > Enter a chat room</h2>
      </button>
    </div>)

  return (
    
    <div className="h-screen grid grid-rows-6">

      {/* les buttons toggle pour afficher les chats rooms en écran petit */}
      <div id="hide" className=" hide ">
        <div className=" flex flex-row justify-between " >
          {/* button toggle chat room pour écran telephone, taille < sm */}
          <button aria-label="button to open/ close list of chat room"  className="" onClick= {handleToggle1}>
            <ChatAlt2Icon  className="w-12 text-green-500 p-2"  />
          </button>

          {/* button pour toggle chat setting à droite de écran petit */}
          <button aria-label="button to open/ close chat setting" className="" onClick= {handleToggle2}>
            <CogIcon  className="w-12 text-yellow-500 p-2"  />
          </button>
            
        </div>

          {/* Chat List pour taille écran <sm; et toggle button */}
          <div className= {addClassName()}>
            <h1 className="font-bold text-purple-700 text-center p-2 text-3xl ">
              Chat Room
            </h1>

            {/* button pour add new chat */}
            <div className="text-center ">
              <button aria-label="button to add new chat room" className="p-2 rounded bg-yellow-500 text-white min-w-max " onClick={handleAddChat}> + New Chat</button>
            </div>

            {/* Liste des chats rooms  */}
            <ul className="my-2 p-1 text-center " >
              {chatRooms.map( (room) => (
                <li key = {`list_${room.id}`} className="mx-auto w-1/2 bg-purple-200 p-2 text-center  my-1 hover:opacity-80 hover:bg-purle-500 focus:opacity-80 focus:bg-purle-500" >
                  <p  className="flex flex-row items-center justify-center " 
                  
                  onClick={(e) => thisActiveChat(e, room.id)}
                  >
                    <span className="" > {room.id === activeChat ? (<span className="p-2 rounded-full text-yellow-500 mr-2 "> <CheckCircleIcon className="w-4 "/></span>) : (<span></span>)} </span>
                    <span> {`${room.title}`} </span>   
                  </p>
                </li>
              ))}
            </ul>

          </div>
          
          {/* Chat setting tour taille écran <sm */}
          <div className={addClasseChatSetting()} >
            <h1 className="font-bold text-purple-700 text-center p-2 text-3xl ">
              Chat Setting
            </h1>
            <h2 className="text-center font-bold uppercase font-lg text-green-500 ">Room: {chat?.title} </h2>

            {/* button pour delete/quit chat */}
            <div className="text-center ">
              {/* button delete chat */}
              {isAdmin ? 
                // si user est admin => delete chat room 
                (<button aria-label="button to delete/ quit chat room" className="p-2 rounded bg-yellow-500 text-white w-3/4 my-2 hover:bg-yellow-400 hover:opacity-80 focus:bg-yellow-400 focus:opacity-80 hover:text-black " onClick={handleDeleteChat}> Delete chat
                </button>)
               : 
                // user n'est pas admin => rien afficher
                (<div className="hidden"></div>)}
              
                {/* button toggle list des persons dans chat room  */}
                <button aria-label="button to open/ close list of chat members" className="p-2 rounded bg-yellow-500 text-white w-3/4 my-2 hover:bg-yellow-400 hover:opacity-80 focus:bg-yellow-400 focus:opacity-80 hover:text-black " onClick={showListPeople}> Chat members 
                </button>

                {/* input de recherche les users quand user est admin */}
                { isAdmin ? 
                  (<div>
                    {/* input de recherche */}
                    <input aria-label="enter username to search your friends" className="border border-2 w-3/4 my-2 rounded bg-gray-200 p-2 " id="searchPeople" placeholder="type a username" 
                    onClick= {(event) => searchePeople(event)} 
                    onChange = {(event) => searchePeople(event)} />

                    {/* résultat de recherche les autres users */}
                    <div id="listRecherche" className="border-black border-2 rounded flex flex-row flew-wrap justify-between my-2 p-2 w-3/4 mx-auto overflow-auto h-40 hidden " >
                      {/* list les autres users: resultat de recherche */}
                      <div  className="">
                        {otherPeople.map( (person) => (
                          <div key={`${person.username}`}>
                            <button aria-label="clic to add this friend to your chat room" className="flex flex-row flex-wrap my-1 mx-auto p-2 hover:opacity-80 hover:bg-yellow-400 rounded-lg align-center w-full " 
                            onClick={(e) => addUserToChatRoom(e, person.username)}> 
                              {/* avatar ou pas ? */}
                              {(person.avatar) ? 
                              (
                                <img className="w-10 h-10 rounded-full p-1 " src={`${person.avatar}`} alt = "avatar" /> 
                              ) 
                              : 
                              (
                                <div className="w-10 h-10 rounded-full p-1 bg-red-500 border-2 text-center uppercase" alt="avatar-default" > {person.username.slice(0,2)} 
                                </div>
                              )}
                              <span className="ml-1 p-2 " >{person.username} </span>
                            </button>

                          </div>
                          ))
                        }
                      </div>
                      
                      {/* un x pour quitter/effacer le resultat  */}
                      <button aria-label="close the list of chat members" aria-controls="listRecherche" className="self-start " onClick={hideListResearchPeople} >X</button>
                    </div>
                  </div> )
                  :
                  // user n'est pas admin, il n'a pas le droit de chercher + ajouter d'autre user dans chat room
                  (<div className="hidden"></div>)}
               
                
                {/* list des person dans le chatroom */}
                
                <div className= {toggleListPeople()}> { chat.people.map( (person) =>
                  (<div className="px-2 flex flex-row flex-wrap mx-auto w-3/4 my-1 " key = {`chat_person_${person.person.username}`}> 
                  {/*affichage selon avatar ou pas  */}
                  {(person.person.avatar) ? 
                    (
                      <img className="w-10 h-10 rounded-full p-1 " src={`${person.person.avatar}`} alt = "avatar" /> 
                    ) 
                    : 
                    (
                      <div className="w-10 h-10 rounded-full p-1 bg-red-500 border-2 text-center uppercase" alt="avatar-default" > {person.person.username.slice(0,2)} </div>
                    )}
                    <p className="ml-1 "> {person.person.username} </p>
                    
                    {isAdmin ? // isadmin ou pas
                    // si admin => on peut remove d'autre user du chat room
                      (<div className="ml-2 ">
                        {/* icon delete user */}
                        <button aria-label="button to remove this user from your chat room" className="" onClick={(event) => removeUserFromChatRoom(person.person.username)}>
                          <TrashIcon className="w-8 text-red-500 hover:text-red-700 hover:opacity-80 hover:bg-gray-200 focus:text-red-700 focus:opacity-80 focus:bg-gray-200" />
                        </button>
                      </div>) 
                      : 
                      // pas admin => rien afficher
                      (<div className="hidden"></div>)
                    }
                      
                  </div>))}

                </div>
           
              
            </div>
          </div>
        
      </div>

      {/* ChatFeed & messages */}
      <div className= {addOpacity()}>
        <div id="scrollToBottom" className="h-4/5  overflow-y-auto ">
            {/* header en haut pour le nom de room + les persons activé */}
          <div className="text-center ">

            <h2 className="mx-auto text-red-500 font-bold text-3xl">{chat?.title} </h2>
            
            {/* les person connectés */}
            <div className="text-gray-700 uppercase p-2 flex flex-row flex-wrap text-center justify-center text-sm text-purple-500">
              { chat.people.map( (person) => (<p className="px-2" key = {`person_${person.person.username}`}> {`${person.person.username}`}</p>))}
            </div>

          </div>

          <div className="my-2 ">
            {/* render les messages */}
            {renderMyMessages()}
          </div>
        </div>
        

        {/* input pour taper nouvelle message */}
        <div className="my-5 p-2 " >
          <hr className = "border-red-500 border-2 w-1/2 my-2 "/>
          <NewMessageForm {...props} chatId={activeChat} />
        </div>
      </div>
      

    </div>
  )
}

export default ChatFeed
