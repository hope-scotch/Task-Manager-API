import '../src/db/mongoose.js'
import { Task } from '../src/models/task.js'

/* Task.findByIdAndDelete('5f002ad66d5c8376dc895919').then( (task) => {
    console.log(task) // undeleted task

    return Task.countDocuments( { completed: false} )
}).then( (result) => {
    console.log(result)
}).catch( (e) => {
    console.log(e)
}) */

const findTaskAndDelete = async (id) => {

    // If we want, we can NOT STORE the value return by 'await <function>'
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments( {completed: false} )
    return({ task, count })
}

// Since async functions always return a Promise with the { data object }
findTaskAndDelete('5eff54d541669e6994214ebe').then( (data) =>
    console.log(data)).catch( (e) =>
        console.log(e))