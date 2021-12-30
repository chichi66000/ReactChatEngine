
const MyMessage = ({message, userName}) => {

  
    // si message est image?
    if (message.attachments && message.attachments.length > 0) {
      return (
        <div className="col-end-6 col-span-4 p-1 justify-self-end">
          <img
          src={message.attachments[0].file}
          alt="message-attachment "
          className="w-36 "
        />
        </div>
        
      );
    }
  
    // si c'est pas un image
    return(
      <div className="p-1 col-span-4 col-start-2">
        <p className="bg-gray-200 rounded rounded-4 my-2 p-2 text-blue-500 break-words whitespace-normal">{message.text}</p>
        
      </div>
    )
  }
  
  export default MyMessage