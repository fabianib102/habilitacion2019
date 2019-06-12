const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    surname:{
        type: String,
        required: true,
    },
    cuil:{
        type: String,
        required: true,
    },
    birth:{
        type: Date,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    rol:{
        type: String,
        required: true,
    },
    province:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    pass:{
        type:String,
        required: true,
    }

});

module.exports = User = mongoose.model('users', UserSchema);