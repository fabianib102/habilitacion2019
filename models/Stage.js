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
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
    sec:{
        type: Number
    }

});

module.exports = Stage = mongoose.model('stage', StageSchema);