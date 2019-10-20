const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Team = require('../../models/Team');
const UserByTeam = require('../../models/UserByTeam');


// @route Post api/team
// @desc  Crea un nuevo equipo
// @access Private
router.post('/',[
    check('name', 'El nombre del equipo es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('users', 'Debe seleccionar un RRHH para el equipo').isArray().not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, users} = req.body;

    try {

        var today = new Date();

        let team = new Team({
            name, 
            description,
            history:{dateUp:today} 
        });

        await team.save();

        var idTeam = team._id;

        if(idTeam != null){
            for (let index = 0; index < users.length; index++) {
                const usr = users[index];
                var userbyTeam = new UserByTeam({
                    idUser: usr, 
                    idTeam,
                    dateStart: today
                });
                await userbyTeam.save();
            }
        }else{
            return res.status(404).json({msg: 'ocurrió un error en la inserción.'});
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


// @route POST api/team/deleteUserTeam
// @desc  elimina un usuario de un equipo
// @access Public
router.post('/deleteUserTeam', [
    check('idTeam', 'El id del equipo es requerido').not().isEmpty(),
    check('idUser', 'El id del usuario es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {idTeam, idUser} = req.body;
    const reason = req.body.reason;       

    try {
        	
        var today = new Date();

        let user = await UserByTeam.findOne({idUser, idTeam, status: "ACTIVO"});

        if(!user){
            return res.status(404).json({errors: [{msg: "El usuario no existe en ese equipo."}]});
        }else{
            let userCount = await UserByTeam.find({idTeam, status: "ACTIVO"}).count();
            if(userCount == 1){
                return res.status(404).json({errors: [{msg: "El equipo debe tener por lo menos un integrante"}]});
            }
        }

        let reasonAdd = "-";
        if (reason !== ""){
            reasonAdd = reason;
        };

        await UserByTeam.findOneAndUpdate({_id: user._id}, {$set:{status:"INACTIVO", dateDown: today, reason:reasonAdd}});

        res.json({msg: 'Usuario eliminado del equipo'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/team/reactiveUserTeam
// @desc  reactive a user by email
// @access Public
router.post('/reactiveUserTeam', [
    check('idTeam', 'El id del equipo es requerido').not().isEmpty(),
    check('idUser', 'El id del usuario es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {idTeam, idUser} = req.body;

    try {
        
        //validacion que el integrante a activar, su equipo esté activo.
        let teamInactive = await Team.findOne({_id:idTeam, status:"INACTIVO"});
        if(teamInactive){
            return res.status(404).json({errors: [{msg: "El equipo no se encuentra activo, para activar un integrante active el mismo."}]});
        }

        var today = new Date();
        
        var userbyTeam = new UserByTeam({
            idUser, 
            idTeam,
            status:"ACTIVO",
            dateStart: today
        });

        await userbyTeam.save();
        
        res.json({msg: 'Usuario ha sido agregado al equipo'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/team/edit
// @desc  edit a team
// @access Public
router.post('/edit',[
    check('idTeam', 'id de la tarea es requerido').not().isEmpty(),
], async(req, res) => {

    const {name, description, idTeam} = req.body;

    try {

        let team = await Team.findByIdAndUpdate(
            idTeam,
            {$set:{name, description}},
            {new: true}
        );

        res.json({msg: 'Equipo modificado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/team/addUserTeam
// @desc  add a user by id a team
// @access Public
router.post('/addUserTeam', [
    check('idTeam', 'El id del equipo es requerido').not().isEmpty(),
    check('idUser', 'El id del usuario es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {idTeam, idUser} = req.body;

    try {

        var today = new Date();
        
        var userbyTeam = new UserByTeam({
            idUser, 
            idTeam,
            dateStart: today
        });

        await userbyTeam.save();
        
        res.json({msg: 'El RRHH ha sido agregado al equipo'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route Post api/deleteTeam
// @desc  Borra un equipo
// @access Private
router.post('/deleteTeam',[
    check('idTeam', 'El id del equipo es requerido').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    var today = new Date();

    const {idTeam} = req.body;
    const reason = req.body.reason;       
    try {
            //validar que el equipo no se encuentre en un proyecto activo            
            //  if(esta en proyecto activo){
            //     res.status(404).json({errors: [{msg: "El Equipo se encuentra en un Proyecto ACTIVO"}]});
            // }else{camino feliz}
            

        // traigo integrantes y los inactivo
        let members = await UserByTeam.find({idTeam, status: "ACTIVO"});

        let reasonAdd = "-";
        if (reason !== ""){
            reasonAdd = reason;
        };

         for (let index = 0; index < members.length; index++) {
            await UserByTeam.findOneAndUpdate({_id: members[index]._id}, {$set:{status:"INACTIVO", dateDown: today, reason:reasonAdd}});
  
         }
        let teamfind = await Team.findOne({_id: idTeam});

        let posLastHistory = teamfind.history.length - 1;
        
        let idLastHistory = teamfind.history[posLastHistory]._id 
        
        // inactivo al equipo
        await Team.findOneAndUpdate({_id: idTeam, "history._id":idLastHistory}, {$set:{status:"INACTIVO", "history.$.dateDown":today,"history.$.reason":reasonAdd}});

        return res.status(200).json({msg: 'El equipo fue eliminado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route Post api/reactiveTeam
// @desc  Reactiva un equipo
// @access Private
router.post('/reactiveTeam',[
    check('idTeam', 'El id del equipo es requerido').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {idTeam} = req.body;
    var today = new Date();

    try {
        // trato activacion de los integrantes del equipo
        let members = await UserByTeam.find({idTeam, status: "INACTIVO"}).distinct('idUser');

         for (let index = 0; index < members.length; index++) {

            var userbyTeam = new UserByTeam({
                idUser: members[index], 
                idTeam,
                status:"ACTIVO",
                dateStart: today
            });

            await userbyTeam.save();

         }

        await Team.findOneAndUpdate({_id: idTeam}, {$set:{status:"ACTIVO"},$push: { history: {dateUp:today} }});

        return res.status(200).json({msg: 'El equipo fue reactivado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});




module.exports = router;