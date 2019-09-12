const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const StageSchema = new Schema({

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

module.exports = Stage = mongoose.model('stage', StageSchema);