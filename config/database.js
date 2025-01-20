const mongoose = require('mongoose');
require("dotenv").config();

const mongodb = async () => {
    if (process.env.NODE_ENV === "test") {
        console.log("Skipping database connection in test mode.");
        return; // Do nothing in test mode
      }
    try{
        await mongoose.connect(process.env.MONGO_URI);
    }catch(err){
        throw new Error("Connecting to database failed! : ",err);
    }
}

module.exports = mongodb