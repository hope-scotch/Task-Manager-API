const app = require('./app')

// const express = require('express')
// require ('./db/mongoose.js')
// const { userRouter } = require('./routers/user.js')
// const { taskRouter } = require('./routers/task.js')

// const app = express()
const port = process.env.PORT


 // Without middleware: new req -> run route handler
 // With middleware: new req -> do something -> run route handler
 // Sign-Up and Login -> Create Auth Token
 // All other route handlers -> Require Auth Token

 // To register middleware
 /* app.use( (req, res, next) => {
     // 'do something' function
     // console.log(req.method, req.path)

     // Just a switch function as to what ROUTES to enable/disable under certain conditions
      if (req.method === 'GET') {
        res.send('GET requests are disabled')
     } else {
         next()
     } 
     // If the next() isn't called, the function doesn't stop executing (async function)
     // next()
 }) */

// Register a MAINTENENCE mode middleware function
/* app.use( (req, res, next) => {
    res.status(503).send('Site is under maintenence! Please try back soon')
}) */

// File Upload
/* const multer = require('multer'

// Create instances of multer for various files
const upload = multer({ // new instance of multer
    // options object
    dest: 'images',
    limits: { // limit object
        fileSize: 1000000, // size in bytes -> 1 MB
    },
    // To filter file types
    fileFilter(req, file, cb) {
        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)

        // file obj has all the info about the uploaded file
        // if (!file.originalname.endsWith('.pdf')) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {// match allows us to use reg expr within '//'
            // return cb(new Error('Please upload a PDF'))
            return cb(new Error('Please upload a doc'))
        }

        cb(undefined, true)
    }
})

const errorMiddleware = (req, res, next) => {
    throw new Error('= require(my middleware')
}

// We get access to middleware = require(multer library
app.post('/upload', upload.single('upload_name'), (req, res) => {
    res.send()
}, // Register a function to handle errors when the errorMiddleware returns an error
    (error, req, res, next) => {
        res.status(400).send( {error: error.message} )
    })
*/

// Configure Express to parse the incoming JSON for us
// app.use(express.json())

// We need to register the router with our app
// app.use(userRouter)
// app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ', port)
})

/* const bcrypt = require('bcryptjs'

 const hashFunc = async () => {

    // BCrypt works with Promises

    const plainTextPass = 'Red12345!'

    try {
        const hashedPass = await bcrypt.hash(plainTextPass, 8) // param1: plain text pass, param2: number of rounds -> compromise between speed and security 
        // returns a Promise

        console.log(plainTextPass)
        console.log(hashedPass)

        // BCrypt provides us a method to compare hashed passes
        const isMatch = await bcrypt.compare('Red12345!', hashedPass)
        console.log(isMatch)
        
    } catch (e) {
        console.log(e)
    }

} hashFunc() */

// Encryption Algo -> We can get BACK the value (reversible)
// Hashing Algo -> We cannot get BACK the value -> One-Way Algo (irreversible)

// Auth Tokens
/* const jwt = require('jsonwebtoken'

const jwtFunc = () => {
    const token = jwt.sign({ _id: '13456' }, 'thisisanauthtoken', { expiresIn: '7 days' }) // return value will be the auth token
    console.log(token)

    const payload = jwt.verify(token, 'thisisanauthtoken')
    console.log(payload)
}

// Header: {"alg":"HS256","typ":"JWT"}
// Payload: {"_id":"5f00b49874330d21a0c87867","iat":1593890172} 

jwtFunc() */

// toJSON
/*
const pet = {
    name: 'Hal'
}

pet.toJSON = function () {
    // console.log(this)
    // This helps us manipulate what we want to return = require(an Object
    return {} // Implies the object will return nothing when stringified
    // returning specific properties will hide other properties, and that is used to hide password and tokens = require(creating a dummy user var
}

console.log(JSON.stringify(pet)) */

/* 
const { Task } = require('./models/task.js'
const { User } = require('./models/user.js'

const main = async () => {
    // const task = await Task.findById('5f01bd60416a6759985bd0ed')

    // populate helps us populate data = require(a RELATIONSHIP
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('5f01bbffa15a1147b89ff844')

    await user.populate('tasks').execPopulate()
    // This will find all tasks created specifically by this user, and add it to a real user.tasks array = require(the virtual relationship
    console.log(user.tasks)

}

main() */

