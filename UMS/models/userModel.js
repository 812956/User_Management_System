const mongoose = require("mongoose");

// admin and user will store in db like this
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        // required: true
    },
    email: {
         type:String,
         required: true
    },
    mobile:{
        type:Number,
        required: true
    },
    image:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    }

})

// creating model(collection) in mongodb

module.exports = mongoose.model('User',userSchema)

