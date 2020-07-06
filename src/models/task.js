import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Model Name -> reference fromt this field to another model
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

/*
const task = new Task({
    description: 'Profit with JavaScript',
    // completed: false
})

task.save().then( () => {
    console.log(task)
}).catch( (error) => {
    console.log(error)
}) */

export { Task }