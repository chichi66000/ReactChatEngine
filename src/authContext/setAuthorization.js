import axios from "axios";

export default function setAuthorisation (token) {
  if(token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
  else {
    delete axios.defaults.common['Authoriration']
  }
}