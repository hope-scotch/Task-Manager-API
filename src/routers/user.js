import express from 'express'
import multer from 'multer'
import { User } from '../models/user.js'
import { auth } from '../middleware/auth.js'
import sharp from 'sharp'
import { welcomeEmail, goodbyeEmail } from '../emails/account.js'

const router = new express.Router()

/* router.get('/test', (req, res) => {
    res.send('From a new file')
}) */

// Post -> HTTP Method to be used
// Express provides us methods on the server for the same
// This is only a part of the server(also called an endpoint) which is exposed via the /resources URL (resource: user)
// We can communicate with this exposed part using a fixed set of protocols -> REST API
router.post('/users', async (req, res) => {
    // console.log(req.body)
    // res.send(req.body)

    // Whenever POST is used, we get our data onto request -> because it is BEING REQUESTED from our server
    // Whatever is being sent from the server -> response
    // POSTMAN works as a dummy client

    // 'User Creation' process is defined by mongoose
    /* const user = new User(req.body)

    user.save().then( () => {
        res.status(201).send(user)
    }).catch( (error) => {
        res.status(400).send(error) //  Status Code 400 Bad Request
        // chaining
    }) */
    
    const user = new User(req.body)

    try {
        await user.save() // If promise was fulfilled

        // sgMail.send() returns a promise but we don't need the task to wait unless an email is sent
        // The task app can carry on while send-grid sends its email
        welcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken() // On the User instance => There's only 1 ID attached, so no need to pass it to the function
        
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

    // Express anyway doesn't care what is returned from the callback func
    // It uses req and res to carry out the necessary tasks => We can convert this onto an async func
    // because it doesn't matter if the reuturn value is a Promise or anything
})

// Loggin In
router.post('/users/login', async (req, res) => {
    
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password) // Not built-in
        const token = await user.generateAuthToken() // The method lives on the individual user, and not the collection

        // 'user' has already been checked for errors
        res.send({
            user,
            token // auth token
        })
    } catch(e) {
        res.status(400).send()
    }
})

// Loggin Out
router.post('/users/logout', auth, async (req, res) => {
    
    try {
        // Removing the requested token
        req.user.tokens = req.user.tokens.filter( (token) => token.token !== req.token)
        await req.user.save()

         res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Log out of all sessions
router.post('/users/logoutAll', auth, async(req, res) => {
    
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// Reading endpoints // Put the middleware as an argument to the route handler
// And callback func will not run unless next() is called in 'auth' middleware

// /users has no use since we don't want any user to access info of all the users on the database
// So we use users/me to get our own profile instead
/* router.get('/users', auth, async (req, res) => {

    // The method on 'app' is defined by REST protocols
    // But the actual working inside of the call is defined by mongoose

    /* User.find({}).then( (users) => {
        res.send(users)
    }).catch( (e) => {
        res.status(500).send()
    }) */

    // Use await
    /* try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
}) */

// Read Profile
router.get('/users/me', auth, (req, res) => {
    res.send(req.user) // Send back the user if they are authenticated
})

// Any user should not be able to access any of the other user by ID -> They should only be able to access their own profile
// Express provides us with Route Parameters
/* router.get('/users/:id', async (req, res) => { // We'll be able to access the dynamic value of 'id'

    // console.log(req.params) // object contains all the route params
    const _id = req.params.id

    // mongoose converts string ids onto object ids
    /* User.findById(_id).then( (user) => {
        if (!user)
            return res.status(404).send()

        res.send(user)
    }).catch( (e) => {
        res.status(500).send()
    }) */

    // Using await
    /* try {
        const user = await User.findById(_id)

        if (!user)
            return res.status(404).send()
            
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
}) */

// Update endpoint
/* router.patch('/users/:id', async (req, res) => {
    
    const updates = Object.keys(req.body) // Take the JSON data, and return an array of string, where each value is more like a property on that object
    const allowedUpdates = ['name', 'email', 'password', 'age']

    // 'every' will check for each array object, where ALL array elements have to pass the test to return true, otherwise false
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update)) // Short-hadn Arrow func

    if (!isValidOperation) {
        return res.status(400).send( {error: 'Invalid Updates!'} )
    }

    // If (req.body) has any attribute which doesn't match, it will be ignored
    try {
        
        const user = await User.findById(req.params.id)
        updates.forEach( (update) => {
            // Since update property on user is dynamic, we need to use bracket notation (or indexing) and not the (.) operator
            user[update] = req.body[update]
        })

        await user.save() // This is where our middleware will get executed


        // findByIdAndUpdate() bypasses mongoose -> Schema.pre() etc. will not work with this update style
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) // User not found
            res.status(404).send()

        res.status(200).send(user) // Update User with unupdated values // Use 'new':true to actually return the new Updated User
    } catch (e) {
        res.status(400).send()
        // res.status(500).send()
    }
}) */

// User Updation Endpoint without ID
// We don't need ID as a part of the URL, because we are using auth
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowed = ['name', 'password', 'email', 'age']
    const isValid = updates.every( (update) => allowed.includes(update)) // If any of the params fail, update won't be valid

    if (!isValid)
        return res.status(400).send('Invalid updates!')

    try {
        updates.forEach( (update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


// User Deletion Endpoint
/* router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user)
            return res.status(404).send()
        
        res.status(200).send('Deleted')
    } catch (e) {
        res.status(500).send()
    }

}) */

// Deletion should also not take place by ID -> A user should be able to delete only his/her own profile
router.delete('/users/me', auth, async (req, res) => {

    try {
        goodbyeEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// File Uploads -> Express by default does not support file uploads, we use an npm lib by the same team which maintains express
// multipart/form-data -> We take the file, grab its binary data, and send that to the server instead of JSON
// Profile Pic
const upload = multer({
    // dest: 'avatars',
    limtis: {
        fileSize: 1000000 // 1 MB file size
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return callback(new Error('Please upload an image'))
        
        callback(undefined, true) // Error or Success value
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    // If the 'dest' is not provided, multer will no longer save the image onto the dest folder
    // instead it passes on the buffered AND VALIDATED data through to be accessed in the callback

    // npm Sharp -> Convert large images in common formats to smaller, web-friendly JPEG, PNG and WebP images of varying dimensions.
    // Resizing an image

    
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    // req.user.avatar = req.file.buffer // All the binary data on the file
    // Stored in the avatar field of userSchema
    req.user.avatar = buffer
    
    await req.user.save()

    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    
    req.user.avatar = undefined
    await req.user.save()
    
    res.send()
})

// To fetch profile picture
// Method 1: <img src="data:image/jpg;base64,'binary data'>
// Method 2: Use another route
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar)
            return res.status(404).send()

        // We need to tell the getter what type of data they are getting
        res.set('Content-Type', 'image/png') // Express sets the header for us automatically -> application/json
        res.send(user.avatar)
    } catch (e) {
        res.status(500).send()
    }
})

export { router as userRouter }

