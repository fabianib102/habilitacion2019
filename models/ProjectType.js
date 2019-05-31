const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectTypeSchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }

});

module.exports = ProjectType = mongoose.model('proyectType', ProjectTypeSchema);