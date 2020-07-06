import('../src/db/mongoose.js')
import { User } from '../src/models/user.js'

// 

/* User.findByIdAndUpdate('5eff9ea764b2463508d139a5', { age: 1 }).then( (user) => {
    console.log(user) // unupdated user

    return User.countDocuments( { age: 1} ) // to fire the second 'then' call
}).then( (result) => {
    console.log(result)
}).catch( (e) => {
    console.log(e)
}) */

// To use async-await, we have to use an async func
const updateAgeAndCount = async (id, age) => {

    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments( {age} )
    return({
        user,
        count
    })
}

updateAgeAndCount('5eff9ea764b2463508d139a5', 3).then( (data) => 
    console.log(data) ).catch( (e) => 
        console.log(e))