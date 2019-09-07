const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    provinceId:{
        type:String,
        required: true,
    },
    locationId:{
        type:String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    identifier:{
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
    },
    status:{
        type:String,
        required: true,
    },
    addList:{
        type:Boolean,
        required: false,
    }

});

module.exports = User = mongoose.model('users', UserSchema);