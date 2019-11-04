const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ActivityByTaskSchema = new Schema({

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
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    startDateProvideTask:{
        type: Date,
        required: true,
    },
    endDateProvideTask:{
        type: Date,
        required: true,
    }

});

module.exports = ActivityByTask = mongoose.model('activityByTask', ActivityByTaskSchema);