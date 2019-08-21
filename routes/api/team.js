const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Team = require('../../models/Team');
const UserByTeam = require('../../models/UserByTeam');

// @route Post api/team
// @desc  Crea un nuevo
// @access Private
router.post('/',[
    check('name', 'El nombre del riesgo es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('users', 'La lista de usuarios es obligatoria').isArray().not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, users} = req.body;

    try {

        let team = new Team({
            name, description 
        });

        await team.save();

        var idTeam = team._id;

        if(idTeam != null){
            for (let index = 0; index < users.length; index++) {
                const usr = users[index];
                var userbyTeam = new UserByTeam({
                    idUser: usr, 
                    idTeam
                });
                await userbyTeam.save();
            }
        }else{
            return res.status(404).json({msg: 'ocurrió un error en la insercion.'});
        }


        return res.status(200).json({msg: 'El equipo fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/team/getAll
// @desc  Obtiene todas los equipos
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let team = await Team.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/team/getUserByTeamAll
// @desc  Obtiene todas los integrante de un equipo
// @access Private
router.get('/getUserByTeamAll', async (req, res) => {

    try {

        let userByTeam = await UserByTeam.find();
        
        res.json(userByTeam);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;