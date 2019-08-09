const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ClientSchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    cuil:{
        type: String,
        required: true,
    },
    condition:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    status:{
        type:String,
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
    dateDischarged:{
        type:Date
    }


});


module.exports = Client = mongoose.model('client', ClientSchema);
