const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "ACTIVO",
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
            default: "-"
        }
    }]

});

module.exports = Team = mongoose.model('team', TeamSchema);