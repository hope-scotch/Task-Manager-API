const express = require('express')
const auth = require('../middleware/auth.js')
const Task = require('../models/task.js')

const router = new express.Router()


// Task creation endpoint
router.post('/tasks', auth, async (req, res) => {
    
    /* const task = new Task(req.body)

    task.save().then( () => {
        res.status(201).send(task)
    }).catch( (e) => {
        res.status(400).send()
    }) */

    try { // ... -> spread operator -> To copy all values of req.body
        res.status(201).send(await new Task({ ...req.body, owner: req.user._id }).save())
        // res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }

})


// Reading Task endpoint
// This is the only endpoint where we GET an array of data 
// -> we need to add filtering options for the client to get back only necessary data
// -> make our app faster
// GET /tasks?completed=completed_val_bool
// GET /tasks?limit=10&skip=10 -> for pagination => 'skip' helps us iterate over 'skip' number of result, 'limit' is what decides the number of results per page
// GET /tasks?sortBy=createdAt(field):asc(/desc) -> split up the string at ':'
// 'sort' -> asc/desc/null -> handle it similar to match
router.get('/tasks', auth, async (req, res) => {

    // mongoose methods can be used directly on the model
    /* Task.find({}).then( (task) => {
        res.send(task)
    }).catch( () => {
        res.status(500).send()
    }) */

    // Searching Algorithm
    const match = {} // empty match object -> if no query is provided
    const sort = {}

    // Completed will be available on the query string
    if (req.query.completed) { // if query is provided
        match.completed = req.query.completed === 'true' // if query string is true -> match.completed set to true otherwise false
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':') // split at ':'
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1// Since it cannot be hard-coded, we need to use indexing to name the property on sort
        // The first part of parts: parts[0] ->sortBy => sort.sortBy which is indeed what we want to access
    }
    try {
        // Method 1:
        // res.send(await Task.find({ owner: req.user._id }))

        // Method 2:
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                // Used for pagination and sorting
                limit: parseInt(req.query.limit), // Since again query is a string
                skip: parseInt(req.query.skip),
                sort /*: { // sort object
                    // createdAt: 1 // descending
                    // completed: 1
                }*/
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }

})

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id

    /* Task.findById(_id).then( (task) => {
        if (!task)
            return res.status(404).send()
        
        res.send(task)
    }).catch( (e) => {
        res.status(500).send()
    }) */

    try {
        
        // const task = await Task.findById(_id)

        // Take owner_iD into consideration
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task)
            return res.status(404).send()
            
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }

})

// Task Update Endpoint
router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body) // Keys = require(key-value pairs -> An array of Keys Only
    const allowed = ['description', 'completed']
    const isValid = updates.every( (update) =>  // => For Every Update
        allowed.includes(update)
    )

    if (!isValid)
        return res.status(400).send( {error: 'Invalid update'} )

    try {
        const task = await Task.findOne( { _id: req.params.id, owner: req.user._id} )
        
        if (!task)
            return res.status(404).send()

        // const task = await Task.findById(req.params.id)
        updates.forEach( (update) => task[update] = req.body[update])
        await task.save()
        
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send()
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        // const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task)
            return res.status(404).send()

        res.status(200).send('Deleted')
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router