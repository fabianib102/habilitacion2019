const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AgentSchema = new Schema({

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
    address:{
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
    email:{
        type: String,
        required: true,
    }, 
    status:{
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
            default:'-'
        }
    }]

});

module.exports = Agent = mongoose.model('agents', AgentSchema);