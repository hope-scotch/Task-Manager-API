import mongoose from 'mongoose'

// Similar to MongoClient.connect -> basically connects us to the db
// mongoose uses mongodb module bts -> dbname goes into connectionURL
mongoose.connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

