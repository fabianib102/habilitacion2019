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
    history:[
    {
        dateUp:{
            type:Date
        },
        dateDown:{
            type:Date
        },
        reason:{
            type:String,
            default:"-"
        }
    }],
    customerReferences:[{
        idAgent:{
            type: String,
            required: true,
        },
        status:{ 
            type: String,
            default: "ACTIVO",
        }
        
    }]

});


module.exports = Client = mongoose.model('client', ClientSchema);
