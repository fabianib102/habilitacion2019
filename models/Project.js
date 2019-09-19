const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectSchema = new Schema({
    
    name:{
        type: String,
        required: true,
    },
    idClient:{
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
    startDateExpected:{
        type: Date,
        required: true,
    },
    endDateExpected:{
        type: Date,
        required: true,
    },
    status:{
        type: String,
        default: "ACTIVO",
    },
    nombreCliente:{
        type: String
    }

});


module.exports = User = mongoose.model('projects', ProjectSchema);