const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectSchema = new Schema({
    
    name:{
        type: String,
        required: true,
    },
    clientId:{
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
    clientId:{
        type: String,
        required: true,
    },
    riskId:{
        type: String,
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
    typeProjectId:{
        type: String,
        required: true,
    },
    subTypeProjectId:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "ACTIVO",
    },
    nombreCliente:{
        type: String
    },
    listStage: [{
        idStage: String,
        name: String
    }]

});


module.exports = User = mongoose.model('projects', ProjectSchema);