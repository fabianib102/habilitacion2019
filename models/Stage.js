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
    history:[{
        dateUp:{
            type:Date
        },
        dateDown:{
            type:Date
        },
        status:{
            type:String
        },
        reason:{
            type:String
        },
        idUserChanged:{
            type:String
        }
    }],
    status:{
        type: String,
        default: "CREADO",
    },
    arrayActivity:[{
        projectId:String,
        name:String,
        stageId:String,
        description:String,
        startDateProvide: String,
        endDateProvide: String,
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
    }],
    estimated_duration:{
        type:Number,
    }

});

module.exports = Stage = mongoose.model('stage', StageSchema);