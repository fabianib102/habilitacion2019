const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectSubTypeSchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }

});

module.exports = ProjectSubType = mongoose.model('proyectSubType', ProjectSubTypeSchema);