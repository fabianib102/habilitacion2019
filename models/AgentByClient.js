const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const AgentByClientSchema = new Schema({

    idClient:{
        type: String,
        required: true,
    },
    idAgent:{
        type: String,
        required: true,
    },
    // status:{ //queda en Agent
    //     type: String,
    //     default: "ACTIVO",
    // },
    dateStart:{
        type: Date,
        default: Date.now,
    },
    dateDown:{
        type: Date,
        default: "",
    },
    reason:{ // razon
        type: String,
        default: "",
    },

});

module.exports = AgentByClient = mongoose.model('agentByClient', AgentByClientSchema);