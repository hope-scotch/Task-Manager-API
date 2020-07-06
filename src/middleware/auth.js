// Single file for each piece of middleware
import jwt from 'jsonwebtoken'
import { User } from '../models/user.js'

// Authentication Middleware
const auth = async (req, res, next) => {
    //console.log('auth middleware')

    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        // Validate token -> created by our server, and hasn't expired 
        const decoded = jwt.verify(token, 'AuthTokenSignature')

        // 1. The token has to be part of the tokens array (If the user logs out, token will be deleted)
        // 2. The token has to contain the embed _id
        const user = await User.findOne( {_id: decoded._id, 'tokens.token': token} )

        if (!user) {
            throw new Error()
        }

        // JS Object Properties can be set using dot and assign
        // We attach -> token prop to req, user prop to req -> and this can be retreived from the request object any time auth is called
        req.token = token
        
        // In the middle of the call, set the request to contain the user
        req.user = user
        next()
        // console.log(token)
    } catch (e) {
        return res.status(401).send({ error: 'Please authenticate' })
    }
}

export { auth }