const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectString = process.env.DBConnectString
mongoose.connect(connectString,
{useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(()=>{
    console.log("successfully connected to MongoDB")
}).catch((e)=>{
    console.log("error connecting to MongoDB "+ e)
})