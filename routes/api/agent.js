const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Agent = require('../../models/Agent');
const AgentByClient = require('../../models/AgentByClient');


// @route Post api/agent
// @desc  Crea un nuevo referente
// @access Private
router.post('/', [
    check('name', 'El nombre del referente es obligatorio').not().isEmpty(),
    check('surname', 'El apellido del referente es obligatorio').not().isEmpty(),
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
    var today = new Date();

    try {

        let agentCuil = await Agent.findOne({cuil});
        if(agentCuil){
            return res.status(404).json({errors: [{msg: "El referente ya exíste con el cuil ingresado."}]});
        }


        let agent = new Agent({
            name, surname, cuil, address, email, phone, status, provinceId, locationId, history:{dateUp:today} 
        });

        await agent.save();
        // busco referente cargado y obtengo sus datos para setear en la relacion referente-cliente
        let agentNew = await Agent.findOne({cuil});
        let agentbyClient = new AgentByClient({
            idClient: clientId, idAgent: agentNew._id, dateStart: today 
        });
        
        await agentbyClient.save();
        return res.status(200).json({msg: 'El referente fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/agent/getAll
// @desc  Obtiene los referentes
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
// @desc  elimina un referente por su id
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
        
        let posLastHistory = agent.history.length - 1;
        
        let idLastHistory = agent.history[posLastHistory]._id        
        
        if(!agent){
            res.status(404).json({errors: [{msg: "El referente no existe."}]});
        }else{
            //validar que el rerepsentante no se encuentre en un proyecto activo            
            //  if(esta en proyecto activo){
            //     res.status(404).json({errors: [{msg: "El referente se encuentra en un Proyecto ACTIVO"}]});
            // }else{camino feliz}
            // si no está-> deshabilitar a clientes que referente

            //elimina el agente fisicamente
            //await Agent.findOneAndRemove({_id: id});
            var today = new Date();
            
            await Agent.findOneAndUpdate({_id: id,"history._id":idLastHistory}, {$set:{status:"INACTIVO", "history.$.dateDown":today,"history.$.reason":"-"}
            });

            // elimina tmb su relacion con cliente
            //await AgentByClient.findOneAndRemove({idAgent: id});
            
            await AgentByClient.findOneAndUpdate({idAgent: id}, {$set:{status:"INACTIVO", dateDown: today}});

            let agentByClient = await AgentByClient.find();
            //console.log("TENGO:",agentByClient)

            
            res.json({msg: 'Referente eliminado'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/agent/edit
// @desc  edita referente
// @access Public
router.post('/edit',[
    check('name', 'El nombre del referente es obligatorio').not().isEmpty(),
    check('surname', 'El apellido del referente es obligatorio').not().isEmpty(),
    check('cuil', 'El cuil es obligatorio').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('provinceId', 'La provincia es requerida').not().isEmpty(),
    check('locationId', 'La localidad es requerida').not().isEmpty(),
    check('idAgent', 'id del referente es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, surname, cuil, address, email, phone, provinceId, locationId, idAgent} = req.body;

    try {

        //controla el cuil si es que no hay mas de un referente con el mismo id
        let agentCuil = await Agent.findOne({cuil});
        if(agentCuil){
            if(agentCuil._id != idAgent){
                return res.status(404).json({errors: [{msg: "El referente ya exíste con el cuil ingresado."}]});
            }
        }

        let agent = await Agent.findByIdAndUpdate(
            idAgent,
            {$set:{name, surname, cuil, address, email, phone, provinceId, locationId}},
            {new: true}
        );

        return res.json({msg: 'Referente modificado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/agent/reactive
// @desc  reactiva el referente segun el id
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
            res.status(404).json({errors: [{msg: "El referente no existe."}]});
        }

        //elimina el agente fisicamente
        //await Agent.findOneAndRemove({_id: id});
        var today = new Date();
        await Agent.findByIdAndUpdate(id, {$set:{status:"ACTIVO"},$push: { history: {dateUp:today} }
    });

        res.json({msg: 'El referente volvió a ser activado exitosamente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/agent/getAllActive
// @desc  Obtiene todos los referentes activos
// @access Public
router.get('/getAllActive', async (req, res) => {

    try {
        let agents = await Agent.find({status: "ACTIVO"}).collation({'locale':'en'}).sort({'surname': 1});

        for (let index = 0; index < agents.length; index++) {
            agents[index].addList = false;
        }

        res.json(agents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

module.exports = router;