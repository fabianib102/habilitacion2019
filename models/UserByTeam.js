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
    }

});

module.exports = UserByTeam = mongoose.model('userByTeam', UserByTeamSchema);