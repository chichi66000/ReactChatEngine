
require('firebase/auth')
const admin = require('firebase-admin')

admin.initializeApp({
  credential:  admin.credential.cert({
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, 
    clientEmail: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL, 
    privateKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    project_id: process.env.REACT_APP_FIREBASE_PROJECT_ID 

}),
  databaseURL: "https://chat-app-react-bd548.firebaseio.com",
})

module.exports = { admin }


