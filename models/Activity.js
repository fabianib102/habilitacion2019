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
    arrayTask:[{
        _id: String,
        taskId: String,
        name:String,
        description: String,
        startDateProvideTask: String,
        endDateProvideTask: String
    }]

});

module.exports = Activity = mongoose.model('activities', ActivitySchema);
