const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Client = require('../../models/Client');


// @route Post api/client
// @desc  Crea un nuevo cliente
// @access Private
router.post('/', [
    check('name', 'El nombre del riesgo es obligatoria').not().isEmpty(),
    check('cuil', 'El cuil es obligatoria').not().isEmpty(),
    check('condition', 'La condición es obligatoria').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('phone', 'Teléfono es requerido').not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, cuil, condition, address, email, phone} = req.body;

    let status = "ACTIVE";

    try {

        let clientCuil = await Client.findOne({cuil});
        if(clientCuil){
            return res.status(404).json({errors: [{msg: "El cliente ya exíste con el cuil ingresado."}]});
        }


        let client = new Client({
            name, cuil, condition, address, email, phone, status 
        });

        await client.save();

        return res.status(200).json({msg: 'El cliente fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/client/getAll
// @desc  Obtiene los clientes
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let client = await Client.find().collation({'locale':'en'}).sort({'name': 1});
        return res.json(client);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/client/delete
// @desc  delete a client by id
// @access Public
router.post('/delete', [
    check('id', 'Id es requerido').not().isEmpty()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;

    try {

        let client = await Client.findById(id);

        if(!client){
            res.status(404).json({errors: [{msg: "El cliente no existe."}]});
        }

        await Client.findByIdAndUpdate(id, {$set:{status:"INACTIVO"}});

        //await Client.findOneAndUpdate({_id: email}, {$set:{status:"INACTIVO"}});

        res.json({msg: 'Cliente eliminado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/client/reactive
// @desc  reactive a client by id
// @access Public
router.post('/reactive', [
    check('id', 'Id es requerido').not().isEmpty()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;

    try {

        let client = await Client.findById(id);

        if(!client){
            res.status(404).json({errors: [{msg: "El cliente no existe."}]});
        }

        //elimina el usuario fisicamente
        //await User.findOneAndRemove({email: email});

        await Client.findByIdAndUpdate(id, {$set:{status:"ACTIVO"}});

        res.json({msg: 'El cliente volvió a ser activado exitosamente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;