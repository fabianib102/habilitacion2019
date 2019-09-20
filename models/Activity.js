const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    //fechas reales
    realStartDate:{
        type: String,
        required: false,
    },
    realEndDate:{
        type: Date,
        required: false,
    },
    // fehcas previstas
    providedStartDate:{
        type: String,
        required: true,
    },
    providedEndtDate:{
        type: String,
        required: true,
    },
    // duración del proyecto (preguntar en dias u horas)
    duration:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "ACTIVO",
    }

});

module.exports = Activity = mongoose.model('activities', ActivitySchema);
