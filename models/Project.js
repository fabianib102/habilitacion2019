const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ProjectSchema = new Schema({      
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    startDateExpected:{
        type: Date,
        required: true,
    },
    endDateExpected:{
        type: Date,
        required: true,
    },
    typeProjectId:{
        type: String,
        required: true,
    },
    subTypeProjectId:{
        type: String,
    },
    status:{
        type: String,
        default: "ACTIVO",
    },
    listStage: [{
        idStage: String,
        name: String
    }],
    clientId:{
        type: String,
        required: true,
    },
    agentId:{
        type: String,
        required: true,
    },
    teamId:{
        type: String,
        required: true,
    },
    historyLiderProject:[{
        liderProject:{
            type: String,
            required: true,
        },
        dateUp:{
            type:Date
        },
        dateDown:{
            type:Date
        },
        status:{
            type:String,
            default:"ACTIVO"
        },
        reason:{
            type:String
        }
    }],   
    listRisk: [{
        riskId:{
            type:String
        },
    }],
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
        }
    }]

});


module.exports = User = mongoose.model('projects', ProjectSchema);