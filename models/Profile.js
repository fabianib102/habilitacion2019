const moongose = require('mongoose');

const ProfileSchema = new moongose.Schema({
    
    user: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'user'
    },

    //proyectos que tengo asociado
    // actividades asociadas ??? para qu ver actividades
    //tareas asociadas
    //horas que tenga que cargar

    description:{
        type: String,
        required: false,
    },

    //este atributo no se si va andar
    date:{
        type: Date,
        default: Date.now,
    }
    
});

module.exports = Profile = moongose.model('profile', ProfileSchema);