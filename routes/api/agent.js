const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Agent = require('../../models/agent');
const AgentByClient = require('../../models/AgentByClient');


// @route Post api/agent
// @desc  Crea un nuevo representante
// @access Private
router.post('/', [
    check('name', 'El nombre del representante es obligatorio').not().isEmpty(),
    check('surname', 'El apellido del representante es obligatorio').not().isEmpty(),
    check('cuil', 'El cuil es obligatoria').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('provinceId', 'La provincia es requerida').not().isEmpty(),
    check('locationId', 'La localidad es requerida').not().isEmpty(),
    check('clientId', 'El cliente es requerido').not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, surname, cuil, address, email, phone, provinceId, locationId, clientId} = req.body;

    let status = "ACTIVO";

    try {

        let agentCuil = await Agent.findOne({cuil});
        if(agentCuil){
            return res.status(404).json({errors: [{msg: "El representante ya exíste con el cuil ingresado."}]});
        }


        let agent = new Agent({
            name, surname, cuil, address, email, phone, status, provinceId, locationId 
        });

        await agent.save();
        
        var today = new Date();
        let agentNew = await Agent.findOne({cuil});
        console.log("nuevo->",agentNew)
        let agentbyClient = new AgentByClient({
            idClient: clientId, idAgent: agentNew._id, dateStart: today 
        });
        console.log("-----")
        await agentbyClient.save();
        console.log("-----listorti", agentbyClient)
        return res.status(200).json({msg: 'El representante fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/agent/getAll
// @desc  Obtiene los representantes
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        
        let agent = await Agent.find().collation({'locale':'en'}).sort({'name': 1});
        return res.json(agent);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/agent/delete
// @desc  elimina un representante por su id
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

        let agent = await Agent.findById(id);

        if(!agent){
            res.status(404).json({errors: [{msg: "El representante no existe."}]});
        }

        //elimina el agente fisicamente
        await Agent.findOneAndRemove({_id: id});
        
        // elimina tmb su relacion con cliente
        await AgentByClient.findOneAndRemove({idAgent: id});
        let agentByClient = await AgentByClient.find();
        console.log("TENGO:",agentByClient)

        //await Agent.findByIdAndUpdate(id, {$set:{status:"INACTIVO"}});

        res.json({msg: 'Representante eliminado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/agent/edit
// @desc  edita representante
// @access Public
router.post('/edit',[
    check('name', 'El nombre del representante es obligatorio').not().isEmpty(),
    check('surname', 'El apellido del representante es obligatorio').not().isEmpty(),
    check('cuil', 'El cuil es obligatorio').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('provinceId', 'La provincia es requerida').not().isEmpty(),
    check('locationId', 'La localidad es requerida').not().isEmpty(),
    check('idAgent', 'id del representante es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, surname, cuil, address, email, phone, provinceId, locationId, idAgent} = req.body;

    try {

        //controla el cuil si es que no hay mas de un representante con el mismo id
        let agentCuil = await Agent.findOne({cuil});
        if(agentCuil){
            if(agentCuil._id != idAgent){
                return res.status(404).json({errors: [{msg: "El representante ya exíste con el cuil ingresado."}]});
            }
        }

        let agent = await Agent.findByIdAndUpdate(
            idAgent,
            {$set:{name, surname, cuil, address, email, phone, provinceId, locationId}},
            {new: true}
        );

        return res.json({msg: 'Representante modificado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/agent/reactive
// @desc  reactiva el representante segun el id
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

        let agent = await Agent.findById(id);

        if(!agent){
            res.status(404).json({errors: [{msg: "El representante no existe."}]});
        }

        //elimina el agente fisicamente
        //await Agent.findOneAndRemove({_id: id});

        await Agent.findByIdAndUpdate(id, {$set:{status:"ACTIVO"}});

        res.json({msg: 'El representante volvió a ser activado exitosamente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;