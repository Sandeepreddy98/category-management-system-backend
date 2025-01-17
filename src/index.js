const mongodb = require('../config/database');
const appRouter = require('../routes/app');
const app = require('express')();
const PORT = 3000;
const SERVER_ADDRESS = "http://localhost";

app.use('/api',appRouter)

const connectMongo = async () => {
    try{
        await mongodb()
        console.log("Database connected")
        app.listen(PORT,() => {
            console.log(`Server started at - ${SERVER_ADDRESS}:${PORT}`)
        })
    }catch(err){
        console.log(err)
    }
}
connectMongo()