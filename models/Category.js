const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    parent_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        default : null
    }
},{timestamps : true})

module.exports = mongoose.model('Category',categorySchema)