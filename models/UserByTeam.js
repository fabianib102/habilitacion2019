const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserByTeamSchema = new Schema({

    idUser:{
        type: String,
        required: true,
    },
    idTeam:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: "ACTIVO",
    },
    dateStart:{
        type: Date,
        default: Date.now,
    },
    dateDown:{
        type: Date,
        default: "",
    },
    reason:{
        type:String,
        default: "-"
    }


});

module.exports = UserByTeam = mongoose.model('userByTeam', UserByTeamSchema);