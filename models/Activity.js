const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    
    projectId:{
        type: String,
        required: true,
    },
    stageId:{
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
    },
    endDate:{
        type: Date,
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
        default: "CREADA",
    },
    // arrayTask:[{
    //     _id: String,
    //     taskId: String,
    //     name:String,
    //     description: String,
    //     startDateProvideTask: String,
    //     endDateProvideTask: String
    // }],
    estimated_duration:{
        type:Number,
        default: 0,
    }

});

module.exports = Activity = mongoose.model('activities', ActivitySchema);
