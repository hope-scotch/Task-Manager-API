import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Task } from './task.js'

// To use middleware, use mongoose.Schema(Object Definition)
const userSchema = new mongoose.Schema({ //an Object containing all the required fields
    
    // BTS, Mongoose converts this into what's called a Schema
    // In order to use the middleware funcitonality, we need to create the Schema first and pass that in
    name: {
        type: String, // Validation
        required: true,
        trim: true // trim trailing and leading spaces
    },
    age: {
        type: Number,
        // Custom validator func provided by mongoose
        validate(value) { // we get the value inside 'value', and run our custom validator on it
            if (value < 0)
                throw new Error('Age must be a positive number')
        },
        default: 0
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true, // Email is also going to be unique similar to our IDs
        validate(value) {
            if ( !validator.isEmail(value) ) 
                throw new Error('Email is invalid')
        },
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7, // Validator on String provided by mongoose
        validate(value) {
            if( validator.contains(value, "password", { ignoreCase: true} ))
                throw new Error('Password cannot contain \"password\"')
        }
    },
    // Tracking tokens is necessary to manage log-in and log-outs from multiple devices
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    // When the code is pushed onto the repository, the file-system is wiped out every time the app is deployed, and instead the images need to pushed into the repo as well
    avatar: {
        type: Buffer // Buffered binary image data
        // Not compulsory -> required: false
        // Validation performed by multer -> NO validator
    }
}, { // Schema Options Object
    // Enable timestamps
    timestamps: true
})

// Virtual Property -> Doesn't actually exist as data in a database
// It's a relationship between two entities -> does NOT change any data etc.
// 'owner' is a related field, 'this' is a virtual field that mongoose uses to figure out relationship between various entities
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // What are we connecting in 'User'
    foreignField: 'owner' // What to connect to on 'Task'
    // Both are IDs
    // user.tasks will have an array of instances of Task
})

// Custom made function, can be called on the model
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user)
        throw new Error('Email does not exist!')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
        throw new Error('Password is incorrect!')
    
    return user
}

// AuthToken // methods are available on the instances
userSchema.methods.generateAuthToken = async function() {
    const user = this
    
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    
    // Save tokens to the database
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

// using explicit method to leave out password and tokens
/* 
userSchema.methods.getPublicProfile = function() {
    const user = this

    const userObject = user.toObject() // Now we can manipulate userObject to control what we expose

    delete userObject.password
    delete userObject.tokens

    return userObject
} */

// using toJSON
userSchema.methods.toJSON = function() {
    const user = this

    const userObject = user.toObject() // Now we can manipulate userObject to control what we expose

    delete userObject.password
    delete userObject.tokens

    // Delete binary data since we have served up the image, and this is no longer necessary
    // We have only removed it from the profile response, because we don't need the server to send back binary image data
    delete userObject.avatar

    return userObject
} 

// statics are available on the models
// Hash Password
// To do something BEFORE an operation
// We need to use a standard function because the 'this' binding plays an import role
userSchema.pre('save', async function (next) {

    // We need to use the save() whenever we want to use the middleware and accordingly change the code

    // this -> Document that we are going to save
    const user = this

    // console.log('Just Before Saving')

    if (user.isModified('password')) { // If the password field was modified
        user.password = await bcrypt.hash(user.password, 8)
    }

    // next is provided to mark the end of the func execution
    // When the func finishes, it still might be executing some async task bts, so 'next' is provided
    next()
})

// Delete tasks when user is removed -> Using middleware -> pre,post
// We can achieve the same task by configuring the delete user endpoint
userSchema.pre('remove', async function (next) {
    const user = this
    
    await Task.deleteMany({ owner: user._id })
    next()
})

// In mongoDB, we did all the operations inside the connect method
// Here, we define a model to serve as a prototype for our Documents

const User = mongoose.model('User', userSchema)


/*

const me = new User({
    name: 'Sayantan',
    email: 'sayantan.biswas432@gmail.com',
    password: 'biswas7653'
})

// Use methods on the instance to perform operations
// .save() returns a Promise -> saves to a database
me.save().then( (result) => {
    console.log(result)
}).catch( (error) => {
     console.log(error)
}) */

export { User }