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
    }

});

module.exports = Team = mongoose.model('team', TeamSchema);