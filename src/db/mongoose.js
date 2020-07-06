import mongoose from 'mongoose'

// Similar to MongoClient.connect -> basically connects us to the db
// mongoose uses mongodb module bts -> dbname goes into connectionURL
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

