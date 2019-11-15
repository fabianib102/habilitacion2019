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
    dateRegister:{
        type:Date,
        required: true,
    },
    name:{
        type: String,
    },
    description:{
        type: String,
    }

});

module.exports = TaskByUser = mongoose.model('taskByUser', TaskByUserSchema);