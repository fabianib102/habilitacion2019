const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StageSchema = new Schema({

    projectId:{
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
    startDateProvide:{
        type: Date,
        required: true,
    },
    endDateProvide:{
        type: Date,
        required: true,
    },
    startDate:{
        type: Date,
        required: false,
    },
    endDate:{
        type: Date,
        required: false,
    },
    sec:{
        type: Number
    },
    arrayActivity:[{
        projectId:String,
        name:String,
        stageId:String,
        description:String,
        arrayTask:[{
            projectId: String,
            stageId: String,
            activityId: String,
            taskId: String,
            name:String,
            description: String,
            startDateProvideTask: String,
            endDateProvideTask: String
        }]
    }]

});

module.exports = Stage = mongoose.model('stage', StageSchema);