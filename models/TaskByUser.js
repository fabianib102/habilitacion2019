const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const TaskByUserSchema = new Schema({

    projectId:{
        type: String,
        required: true,
    },
    stageId:{
        type: String,
        required: true,
    },
    activityId:{
        type: String,
        required: true,
    },
    taskId:{
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true,
    },
    dateUpAssigned:{
        type:Date
    // dateRegister:{
    //     type:Date,
    //     required: true,
    // },
    },
    dateDownAssigned:{
        type:Date
    },

    dedications:[{
        idDedication:{
            type: String
        },
        date:{
            type: String
        },
        hsJob:{
            type: Number
        },
        observation:{
            type: String
        }

    }],

    name:{
        type: String,
    }, 
    description:{
        type: String,
    },
    nameProject:{
        type: String
    },
    nameStage:{
        type: String
    },
    nameActivity:{
    type: String
    },
    startProvider:{
        type: Date
    },
    endProvider:{
        type: Date
    }
});

module.exports = TaskByUser = mongoose.model('taskByUser', TaskByUserSchema);