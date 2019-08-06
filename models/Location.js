const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const LocationSchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    idProvince:{
        type: String,
        required: true,
    }

});

module.exports = LocationEntity = mongoose.model('location', LocationSchema);