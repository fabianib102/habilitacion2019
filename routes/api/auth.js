const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');

// @route GET api/auth
// @desc  Obtiene la descripcion del usuario autenticado
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-pass');
        res.json(user);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route POST api/auth
// @desc  Verifica si esta autenticado
// @access Public
router.post('/', [
    check('email', 'Email es requerido').isEmail(),
    check('pass', 'Debe ingresar la contraseña').exists(),
], async(req, res) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, pass} = req.body;

    try {

        let user = await User.findOne({email});

        //console.log(user);

        if(!user){
            res.status(404).json({errors: [{msg: "Credenciales inválidas (No existe el email)."}]});
        }

        const isMatch = await bcrypt.compare(pass, user.pass);

        if(!isMatch){
            res.status(404).json({errors: [{msg: "Contraseña no válida"}]});
        }

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
        user.last_connection = new Date()
        user.save()
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});


module.exports = router;