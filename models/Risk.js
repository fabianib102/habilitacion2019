const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const RiskSchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }

});

module.exports = Risk = mongoose.model('risks', RiskSchema);