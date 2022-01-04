
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const helmet = require('helmet')
const expressSanitizer = require("express-sanitizer")
const cors = require('cors')
const port = process.env.PORT || "5000"
const app = express()
app.use(express.json())

// cors pour API entre les sites 
var whitelist = ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3001', 'https://react-app-chatengine.herokuapp.com', 'https://api.chatengine.io', 'https://identitytoolkit.googleapis.com', 'https://chat-app-react-example-app.ml', 'https://anewchatapp.herokuapp.com']
app.use(cors())
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(expressSanitizer())

// set Header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTION');
 
  next();
})

// helmet pour contentSecurityPolicy
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    "default-src": ["'self'" ,"*", "https://res.cloudinary.com", "'unsafe-inline'", "'unsafe-eval'", "https://react-app-chatengine.herokuapp.com", "https://react-app-chatengine.herokuapp.com/favicon.ico", 'https://identitytoolkit.googleapis.com', 'https://chat-app-react-example-app.ml', 'https://anewchatapp.herokuapp.com'],
    "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    "style-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", ],
    "font-src": [],
    "script-src-attr": ["'self'","'unsafe-inline'", "'unsafe-eval'"],
    "img-src": ["'self'", "*", "data:", "https://res.cloudinary.com", 'https://react-app-chatengine.herokuapp.com', 'https://anewchatapp.herokuapp.com']
  },
}));

// route user
const userRoute = require('./routes/users')
app.use('/user', cors(corsOptions) ,userRoute )

//point d'entrée build de react frontend
app.use('/', express.static(__dirname + '/build'))
app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname + '/build', 'index.html'))
})

app.listen(port, () => { console.log(`Listening on port ${port}`);})

 module.exports = app

