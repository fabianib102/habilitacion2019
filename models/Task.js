const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TaskSchema = new Schema({

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
    state:{
        type: String,
        required: false,
        default: "Inicio"
    },
    observation:{
        type: String,
        required: false,
    }

});

module.exports = Task = mongoose.model('task', TaskSchema);