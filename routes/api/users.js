const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');
const Project = require('../../models/Project');
const TaskByUser = require('../../models/TaskByUser');
const ActivityByTask = require('../../models/ActivityByTask');
const Stage = require('../../models/Stage');
const Activity = require('../../models/Activity');

// @route get api/users
// @desc  Verifica obtenga correctamente los usuarios
// @access Public
router.get('/', (req, res) => {
    res.send('Use this route');
})

// @route POST api/users
// @desc  Verifica que se ingrese correctamente un nuevo usuario
// @access Public
router.post('/', [
    check('name', 'Nombre es requerido').not().isEmpty(),
    check('surname', 'Apellido es requerido').not().isEmpty(),
    check('cuil', 'CUIL es requerido').not().isEmpty(),
    check('birth', 'Fecha de nacimiento es requerido').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('rol', 'Rol es requerido.').not().isEmpty(),
    check('provinceId', 'La provincia es requerida').not().isEmpty(),
    check('locationId', 'La localidad es requerida').not().isEmpty(),    
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('identifier', 'Identificacdor es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('pass', 'La contraseña debe ser como minimo de 6 caracteres.').isLength({min: 6}),
], async(req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, pass, history} = req.body;

    try {

        let userIdentifier = await User.findOne({identifier});
        if(userIdentifier){
            return res.status(404).json({errors: [{msg: "El usuario ya exíste con el identificador ingresado."}]});
        }

        let userCuil = await User.findOne({cuil});
        if(userCuil){
            return res.status(404).json({errors: [{msg: "El usuario ya exíste con el CUIL ingresado."}]});
        }

        let user = await User.findOne({email});
        if(user){
            return res.status(404).json({errors: [{msg: "El usuario ya exíste con el email ingresado."}]});
        }

        let status = "ACTIVO";
        var today = new Date();
        
        user = new User({
            name,
            surname,
            cuil,
            birth,
            address,
            rol,
            provinceId, 
            locationId,
            phone,
            identifier,
            email,
            pass,
            status,
            history:{dateUp:today}
        });
        const salt = await bcrypt.genSalt(10);
        user.pass = await bcrypt.hash(pass, salt);

        await user.save();        
        const payload = {
            user:{
                id: user
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            {expiresIn: 360000}, 
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            }
        );
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route POST api/users/delete
// @desc  delete a user by email
// @access Public
router.post('/delete', [
    check('email', 'Email es requerido').isEmail()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const reason = req.body.reason;
    try {

        let user = await User.findOne({email});
      
        if(!user){
            res.status(404).json({errors: [{msg: "El usuario no existe."}]});
        }else{
            //validar que el usuario no se encuentre en un equipo que se encuentre con proyecto activo O tenga asignado tareas
            //faltaaa

            //controles de no dar de baja un lider de proyecto activo         
            let project = await Project.findOne({historyLiderProject:{ $gt:{liderProject:user._id,starus:"ACTIVO"}}});            
            if(project){
                return res.status(404).json({errors: [{msg: "El RRHH se encuentra en un Proyecto asignado como Lider. Antes de eliminarlo, cambie su situación en el proyecto"}]});
            }

            //proceso de deshabilitación del usuario
            let posLastHistory = user.history.length - 1;
            
            let idLastHistory = user.history[posLastHistory]._id  
            //elimina el usuario fisicamente
            //await User.findOneAndRemove({email: email});
            var today = new Date();

            let reasonAdd = "-";
            if (reason !== ""){
                reasonAdd = reason;
            };

            await User.findOneAndUpdate({email: email,"history._id":idLastHistory}, {$set:{status:"INACTIVO", "history.$.dateDown":today,"history.$.reason":reasonAdd}
            });
            
            res.json({msg: 'Usuario eliminado'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/users/edit
// @desc  edit a user
// @access Public
router.post('/edit',[
    check('idUser', 'id del usuario es requerido').not().isEmpty(),
], async(req, res) => {

    const {name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, idUser} = req.body;

    try {

        //controla el identificador si es que no hay mas de un usuario con el mismo id
        let userIdentifier = await User.findOne({identifier});
        if(userIdentifier){
            if(userIdentifier._id != idUser){
                return res.status(404).json({errors: [{msg: "El usuario ya exíste con el identificador ingresado."}]});
            }
        }

        //control a que no haya mas de un usuario con el mismo email 
        let userEmail = await User.findOne({email});
        if(userEmail){
            if(userEmail._id != idUser){
                return res.status(404).json({errors: [{msg: "Ya existe el email ingresado en otro usuario."}]});
            }
        }

        let user = await User.findByIdAndUpdate(
            idUser,
            {$set:{name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email}},
            {new: true}
        );

        res.json({msg: 'Usuario modificado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/users/getAll
// @desc  Obtiene todos los usuarios
// @access Public
router.get('/getAll', async (req, res) => {

    try {
        //let users = await User.findOne({status: "ACTIVE"}).sort({'surname': 1});
        //let users = await User.find({status: "ACTIVE"}).sort({'surname': 1});
        let users = await User.find().collation({'locale':'en'}).sort({'surname': 1});

        for (let index = 0; index < users.length; index++) {
            users[index].addList = false;
        }

        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/users/getAllActive
// @desc  Obtiene todos los usuarios
// @access Public
router.get('/getAllActive', async (req, res) => {

    try {
        //let users = await User.findOne({status: "ACTIVE"}).sort({'surname': 1});
        //let users = await User.find({status: "ACTIVE"}).sort({'surname': 1});
        let users = await User.find({status: "ACTIVO"}).collation({'locale':'en'}).sort({'surname': 1});

        for (let index = 0; index < users.length; index++) {
            users[index].addList = false;
        }

        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



// @route GET api/users/getUserById
// @desc  Obtiene un usuario según un id
// @access Public
router.get('/getUserById/:idUser', async (req, res) => {
    //Verificar si vale la pena obtener todos los datos del proyecto
    try {

        const id = req.params.idUser;
        let user = await User.findById(id);
        if(!user){
            res.status(404).json({errors: [{msg: "El usuario no existe."}]});
        }
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/users/reactive
// @desc  reactive a user by email
// @access Public
router.post('/reactive', [
    check('email', 'Email es requerido').isEmail()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;

    try {

        let user = await User.findOne({email});

        if(!user){
            res.status(404).json({errors: [{msg: "El usuario no existe."}]});
        }

        //elimina el usuario fisicamente
        //await User.findOneAndRemove({email: email});

        //proceso de reactivación del usuario
        var today = new Date();
        await User.findOneAndUpdate({email: email}, 
            {$set:{status:"ACTIVO"},$push: { history: {dateUp:today} }
        });
        
        res.json({msg: 'Usuario volvió a ser activado exitosamente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



// @route GET api/users/relationTask/:idUser
// @desc  Obtiene un usuario según un id
// @access Public
router.get('/relationTask/:idUser', async (req, res) => {
    //Verificar si vale la pena obtener todos los datos del proyecto
    try {

        const id = req.params.idUser;

        let taskUsers = await TaskByUser.find({userId: id});

        if(!taskUsers){
            res.status(404).json({errors: [{msg: "No hay tareas asociadas a tu usuario"}]});
        }

        for (let index = 0; index < taskUsers.length; index++) {
            const element = taskUsers[index];

            //obtencion del nombre de la tarea y desc
            let activityByTask = await ActivityByTask.findOne({taskId: element.taskId});
            taskUsers[index].name = activityByTask.name;
            taskUsers[index].description = activityByTask.description;
            taskUsers[index].startProvider = activityByTask.startDateProvideTask;
            taskUsers[index].endProvider = activityByTask.endDateProvideTask

            //obtencion del nombre del proyecto
            let proj = await Project.findOne({_id: element.projectId});
            taskUsers[index].nameProject = proj.name;

            //Obtencion de etapas
            let sta = await Stage.findOne({_id: element.stageId});
            taskUsers[index].nameStage = sta.name;

            //obtencion de actividades
            let act = await Activity.findOne({_id: element.activityId});
            taskUsers[index].nameActivity = act.name;

        }

        res.json(taskUsers);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});




module.exports = router;