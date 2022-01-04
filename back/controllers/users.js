
const {admin} = require('../firebase/auth')
const passwordValidator = require('password-validator')
const validator = require('validator')

// schema validation password
var schema = new passwordValidator(); 
schema.is().min(6)
      .is().max(20)
      .has().uppercase()
      .has().lowercase()
      .has().digits(1)
      .is().not().oneOf(['Passw0rd', 'Password123'])
      .has(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{6,}$/)

// route signup
exports.signup = async (req, res) => {
      // validate email
    if( !validator.isEmail(req.body.userName)) {return res.status(400).json("Email invalid")}

    //validate password avec schema
    if(!schema.validate(req.body.password)) {
      return res.status(400).json("password error")
    }
    // si pas erreur
    else {
      // si validation ok; appel firebase pour creer ce user
      // créer user avec email + pw dans firebase
      admin.auth().createUser({
        email: req.body.userName,
        password: req.body.password,
      })
      .then( (userRecord) => {
        // succès 
        return res.status(201).json({
          userName: req.body.userName,
          message: "user créé avec succès"
        })
      })
      // error
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        return res.status(400).json({
          errorCode: errorCode,
          message: errorMessage
        })
      })
    
    }
}
