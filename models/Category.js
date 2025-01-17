const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        minLength : 2,
        maxLength : 150,
        trim : true,
        unique : true
    },
    parent_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        default : null,
        index : 1,
        validate: {
            validator: mongoose.Types.ObjectId.isValid,
        }
    }
},{timestamps : true})

module.exports = mongoose.model('Category',categorySchema)