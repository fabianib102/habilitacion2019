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
    startDate:{
        type: Date,
    },
    endDate:{
        type: Date,
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
        default: "FORMULANDO",
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
        percentage:{
            type:String,
            default:"50"
        },
        impact:{
            type:String,
            default:"MEDIO"
        }
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
        },
        idUserChanged:{
            type:String
        }
    }],
    teamMember:[{
        name:{
            type:String
        },
        surname:{
            type:String
        },
        idUser:{
            type:String
        }
    }],
    estimated_duration:{
        type:Number,
    }


});


module.exports = User = mongoose.model('projects', ProjectSchema);