const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

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
    check('province', 'Provincia es requerido').not().isEmpty(),
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('identifier', 'Identificacdor es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('pass', 'La contraseña debe ser como minimo de 6 caracteres.').isLength({min: 6}),
], async(req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {name, surname, cuil, birth, address, rol, province, phone, identifier, email, pass} = req.body;

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

        let status = "ACTIVE";
        
        user = new User({
            name,
            surname,
            cuil,
            birth,
            address,
            rol,
            province,
            phone,
            identifier,
            email,
            pass,
            status
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

    try {

        let user = await User.findOne({email});

        if(!user){
            res.status(404).json({errors: [{msg: "El usuario no existe."}]});
        }

        //elimina el usuario fisicamente
        //await User.findOneAndRemove({email: email});

        await User.findOneAndUpdate({email: email}, {$set:{status:"INACTIVO"}});

        res.json({msg: 'Usuario eliminado'});
        
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

    const {name, surname, cuil, birth, address, rol, province, phone, identifier, email, idUser} = req.body;

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
            {$set:{name, surname, cuil, birth, address, rol, province, phone, identifier, email}},
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

        await User.findOneAndUpdate({email: email}, {$set:{status:"ACTIVO"}});

        res.json({msg: 'Usuario volvió a ser activado exitosamente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;