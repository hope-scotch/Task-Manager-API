// CRUD Operations

/** import mongodb from 'mongodb'

// Init connection
const MongoClient = mongodb.MongoClient
// To grab ObjectIDs
// The server does NOT need to generate IDs. The mongodb lib allows us to generate IDs of our own
const ObjectID = mongodb.ObjectId 
**/

// Destructure instead
import mongodb from 'mongodb' // Does not support named exports -> Destructure after import

const { MongoClient, ObjectID } = mongodb

// Connection URL and database we are trying to connect to
const connectionURL = 'mongodb://127.0.0.1:27017' // local host server running the database
// using 'localhost' instead of the IP Address causes some unknown problems
const dbName = 'task-manager' // database name

/* const id = new ObjectID() // Constructor -> generate new ID for us
console.log(id)
console.log(id.getTimestamp())
console.log(id.id) // Binary data instead of a string as seen in ObjectID("STRING")
console.log(id.id.length) // 12 bytes in Binary Rep
console.log(id.toHexString().length) // 24 bytes in String Rep */
// In most cases, we don't need the ObjectID before inserting Documents

MongoClient.connect(connectionURL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {

    if (error) 
        return console.log('Unable to connect to database')

    // Referencing the required database
    // Simply picking up a name and accessing a database -> MongoDB creates the database automatically
    const db = client.db(dbName) // param1: name of db, gives back a db ref
    // Referencing the Collection

    // Async 'INSERT' op
    /* db.collection('users').insertOne({
        // Data Object
        // _id: id,
        name: 'Shawn',
        age: 24
        // Again, not previously created
    }, (error, result) => { // Callback when op is completed
        if (error) 
            return console.log('Unable to insert user')

        console.log(result.ops) // Array of Documents (individual entities)
    }) */

    /* db.collection('users').insertMany([
        {
            name: 'Jen',
            age: 28
        }, {
            name: 'Gunther',
            age: 27
        }
    ], (error, result) => {
        if (error)
            return console.log('Unable to insert users')

        console.log(result.ops)
    }) */

    /* db.collection('tasks').insertMany([
        {
            description: 'Node.js Course',
            completed: false
        }, {
            description: 'JavaScript Beginners',
            completed: true
        }
    ], (error, result) => {
        if (error)
            return console.log('Unable to insert task')

        console.log(result.ops)
    }) */

    /* db.collection('tasks').insertOne({
        'description': 'Profit with JavaScript',
        'completed': false
    }).then( (result) => {

    }).catch( (error) => {
        console.log(error)
    }) */

    // R for Read
    // _id: "5eff19b267a26256108a8ee6" is a wrong query. We have to wrap this in the ObjectID constructor using the NATIVE DRIVER
    // {name: 'Jen', age: 1}, // Query object // Returns the first occurence in case of similar query conditions
    db.collection('users').findOne( { _id: new ObjectID("5eff19b267a26256108a8ee6") },
                                (error, user) => {
        if (error)
            return console.log('Unable to fetch')

        console.log(user) // Prints the document
        // Searching for a document and NOT FINDING one is NOT an ERROR
    })

    // 'find' does NOT take callback as the second arg -> We receive a CURSOR
    // Cursor is a pointer to the data
    // Cursor has a toArray method, which takes the callback function
    db.collection('users').find( { age: 21 }).toArray( (error, users) => {
        console.log(users) // Array of documents
    })

    db.collection('users').find( { age: 21 }).count( (error, count) => {
        console.log(count)
    })

    db.collection('tasks').findOne( { _id: new ObjectID("5eff15035b98ae09a0951e28") }, (error, lastTask) => {
        console.log(lastTask)
    })

    db.collection('tasks').find( {completed: false} ).toArray( (error, incompleteTasks) => {
        console.log(incompleteTasks)
    })

    // U for Update
    /* const updatePromise = db.collection('users').updateOne({
        _id : new ObjectID("5eff11f9dbfc8a75b0e646eb")
    }, {
        // update operators
        $set: {
            name: 'Mike'
            // No changes to the age field
        }
        // if callback is not passed, Promise is returned
    })

    updatePromise.then( (result) => {
        console.log(result) // result object
    }).catch( (error) => {
        console.log(error)
    }) */

    /* db.collection('users').updateOne({
        _id : new ObjectID("5eff11f9dbfc8a75b0e646eb")
    }, {
        // update operators
         $set: {
            name: 'Mike'
            // No changes to the age field
        } ,
        $inc: {
            age: 1
        }
        // if callback is not passed, Promise is returned
    }).then( (result) => {
        console.log(result) // result object
    }).catch( (error) => {
        console.log(error)
    }) */

    // No filter would change all the documents
    /* db.collection('tasks').updateMany({
        // completed: false // Find tasks where completed: false
    }, {
        $set: {
            completed: true
        }
    }).then( (result) => {
        console.log(result)
    }).catch( (error) => {
        console.log(error)
    }) */

    // D for Delete
    /* db.collection('users').deleteMany({
        age: 24
    }).then( (result) => {
        // console.log(result)
        console.log(result.deletedCount)
    }).catch( (error) => {
        console.log(error)
    }) */

    /* db.collection('tasks').deleteOne({
        description: 'Profit with JavaScript'
    }).then( (result) => {

    }).catch( (error) => {
        console.log(error)
    }) */

}) // Async operation to connect to database