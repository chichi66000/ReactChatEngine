
const TheirMessage = ({lastMessage, message}) => {
    // vérifier si c'est le 1er message => pas le dernier message où la dernier person envoyé le message est différent à ce user
    const isFirstMessageUser = !lastMessage || lastMessage.sender.username !== message.sender.username
    return(
      <div className=" col-span-4 col-start-1">
        {/* 1er message */}
        {isFirstMessageUser && (<div className="w-12 bg-green-300 " style = {{background: `url(${message?.sender?.avatar})`}}>
        </div>)}
  
        {/* 2nd message */}
        {message?.attachments?.length > 0 ?
          // image
          (<img className="w-36  " 
          src={message.attachments[0].file} alt="message attachement" 
          />)
          :
          //text
          (<div className="" > 
            <p className="p-1   bg-blue-500 text-white rounded rounded-4 my-2 p-2 break-words whitespace-normal">{message.text}</p>
          </div>)
        }
      </div>
    )
  }
  
  export default TheirMessage