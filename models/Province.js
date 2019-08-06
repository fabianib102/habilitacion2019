const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProvinceSchema = new Schema({

    name:{
        type: String,
        required: true,
    }

});

module.exports = Province = mongoose.model('province', ProvinceSchema);