const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://zyllcz:WQjlRu5j2jJGPyy@mzcluster.vuopj.mongodb.net/retinder?retryWrites=true&w=majority',
{useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(()=>{
    console.log("successfully connected to MongoDB")
}).catch((e)=>{
    console.log("error connecting to MongoDB "+ e)
})