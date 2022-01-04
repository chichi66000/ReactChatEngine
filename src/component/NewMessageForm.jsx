import { useState } from "react"
import { sendMessage } from "react-chat-engine"
import {PhotographIcon} from '@heroicons/react/solid'


const NewMessageForm = (props) => {
  // setState
  const [value, setValue] = useState('')
  const {chatId, creds} = props

  // handleSubmit Form pour entre nouvelle message
  const handleSubmit = (event) => {
    event.preventDefault();
    // récupérer la value text dans input
    const text = value.trim()
    // send avec method sendMessage
    sendMessage(creds, chatId, {text})
    // initialiser input
    setValue('');
  }

  // handlehange pour récupérer valeur input text
  const handleChange = (event) => {
    setValue(event.target.value)
  } 

  // handleUpload pour récupérer image
  const handleUpload = (event) => {
    // send avec method sendMessage
    sendMessage(creds, chatId, {files: event.target.files, text: ''})
  }

  return(
    <form className="mt-5 p-2 flex flex-row flex-wrap items-center " onSubmit={handleSubmit} encrypted="multipart/form-data">
      {/* input text */}
      <input type="text"  placeholder="Your message..." className="p-2 border border-2 bg-gray-200 w-3/4"
      value = {value}
      onChange = {handleChange} onSubmit={handleSubmit}
      />
      {/* input file pour envoyer image */}
      <div className="p-2 ">
        <input id="upload" multiple={false}  type="file" className="hidden" onChange= {handleUpload.bind(this)}  />
        <label htmlFor="upload" className="cursor-pointer">
          <PhotographIcon className="w-10 text-green-500 p-2 border-2 border-black rounded hover:opacity-80 focus:opacity-80 hover:text-black focus:text-black  " />
        </label>
      </div>
      {/* button send */}
      <button aria-label="button send message" type="submit" className="bg-blue-500 text-white p-2 border rounded-lg hover:opacity-80 focus:opacity-80 hover:text-black focus:text-black text-lg fon-bold " >Send</button>
    </form>
  )
}

export default NewMessageForm