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
    },
    dateDownAssigned:{
        type:Date
    },
    idUserChanged:{
        type:String
    },
    status:{
        type: String,
        default: "ASIGNADO",
    },
    reason:{
        type:String
    },
    startDateProvide:{
        type: Date,
    },
    endDateProvide:{
        type: Date,
    },
    taskName:{
        type:String
    },
    projectName:{
        type:String
    },
    stageName:{
        type:String
    },
    activityName:{
        type:String
    },
    userName:{
        type:String
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

});

module.exports = TaskByUser = mongoose.model('taskByUser', TaskByUserSchema);