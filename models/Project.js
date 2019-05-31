const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectSchema = new Schema({
    
    name:{
        type: String,
        required: true,
    },
    idUser:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    startDate:{
        type: String,
        required: true,
    },
    endDate:{
        type: Date,
        default: Date.now,
    },
    providedDate:{
        type: String,
        required: true,
    },

});


module.exports = User = mongoose.model('projects', ProjectSchema);