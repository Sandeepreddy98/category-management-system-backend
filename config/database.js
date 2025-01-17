const mongoose = require('mongoose');

const mongodb = async () => {
    try{
        await mongoose.connect("mongodb+srv://gsandeepreddy98:qYUOt91qlTprfvfo@namastedev.eo9vs.mongodb.net/category-management-system");
    }catch(err){
        throw new Error("Connecting to database failed! : ",err);
    }
}

module.exports = mongodb