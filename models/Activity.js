const moongose = require('mongoose');

const ActivitySchema = new Schema({
    
    name:{
        type: String,
        required: true,
    },
    idUser:{
        type: String,
        required: true,
    },
    idProject:{
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
        required: true,
    },
    realEndDate:{
        type: Date,
        required: true,
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
    }

});

module.exports = Activity = mongoose.model('activities', ActivitySchema);
