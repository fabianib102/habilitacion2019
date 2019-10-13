const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Client = require('../../models/Client');
//const agentByClient = require('../../models/AgentByClient');
const Agent = require('../../models/Agent');


// @route Post api/client
// @desc  Crea un nuevo cliente
// @access Private
router.post('/', [
    check('name', 'El nombre del cliente es obligatoria').not().isEmpty(),
    check('cuil', 'El cuil es obligatoria').not().isEmpty(),
    check('condition', 'La condición es obligatoria').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('provinceId', 'La provincia es requerida').not().isEmpty(),
    check('locationId', 'La localidad es requerida').not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, cuil, condition, address, email, phone, provinceId, locationId} = req.body;

    let status = "ACTIVO";
    var today = new Date();

    try {

        let clientCuil = await Client.findOne({cuil});
        if(clientCuil){
            return res.status(404).json({errors: [{msg: "El cliente ya exíste con el cuil ingresado."}]});
        }


        let client = new Client({
            name, cuil, condition, address, email, phone, status, provinceId, locationId, history:{dateUp:today}
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
// @access Public
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
            return res.status(404).json({errors: [{msg: "El cliente no existe."}]});
        }else{
            let posLastHistory = client.history.length - 1;
        
            let idLastHistory = client.history[posLastHistory]._id
            
            let dateToday = Date.now();  
            //validar que el cliente no se encuentre en un proyecto activo            
            //  if(esta en proyecto activo){
            //     res.status(404).json({errors: [{msg: "El Cliente se encuentra en un Proyecto ACTIVO"}]});
            // }else{camino feliz}
            // si no está-> deshabilitar a sus referentes
        
            // traigo referentes y los inactivo
            let clients = await Client.findOne({_id:id});

             for (let index = 0; index < clients.customerReferences.length; index++) {
                let agent = await Agent.findById(clients.customerReferences[index].idAgent);
                
                let posLastHistoryAgent = agent.history.length - 1;        
                
                let idLastHistoryAgent = agent.history[posLastHistoryAgent]._id

                await Agent.findOneAndUpdate({_id: clients.customerReferences[index].idAgent, "history._id":idLastHistoryAgent}, {$set:{status:"INACTIVO", "history.$.dateDown":dateToday,"history.$.reason":"-"}});
      
             }
              
            await Client.findOneAndUpdate({_id: id,"history._id":idLastHistory}, {$set:{status:"INACTIVO", "history.$.dateDown":dateToday,"history.$.reason":"-"}});


            res.json({msg: 'Cliente eliminado'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/client/edit
// @desc  edit a client
// @access Public
router.post('/edit',[
    check('name', 'El nombre del cliente es obligatoria').not().isEmpty(),
    check('cuil', 'El cuil es obligatoria').not().isEmpty(),
    check('condition', 'La condición es obligatoria').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('provinceId', 'La provincia es requerida').not().isEmpty(),
    check('locationId', 'La localidad es requerida').not().isEmpty(),
    check('idClient', 'id del cliente es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, cuil, condition, address, email, phone, provinceId, locationId, idClient} = req.body;

    try {

        //controla el cuil si es que no hay mas de un cliente con el mismo id
        let clientCuil = await Client.findOne({cuil});
        if(clientCuil){
            if(clientCuil._id != idClient){
                return res.status(404).json({errors: [{msg: "El cliente ya exíste con el cuil ingresado."}]});
            }
        }

        let client = await Client.findByIdAndUpdate(
            idClient,
            {$set:{name, cuil, condition, address, email, phone, provinceId, locationId}},
            {new: true}
        );

        return res.json({msg: 'Cliente modificado'});
        
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

        //elimina el CLIENTE fisicamente
        //await User.findOneAndRemove({email: email});
        var today = new Date();
        await Client.findByIdAndUpdate(id, {$set:{status:"ACTIVO"},$push: { history: {dateUp:today}}});

        res.json({msg: 'El cliente volvió a ser activado exitosamente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route GET api/client/getAgentByClientAll
// @desc  Obtiene todas los referentes de un cliente
// @access Private
// router.get('/getAgentByClientAll', async (req, res) => {

//     try {

//         let agentByClient = await AgentByClient.find();
//         //console.log("TENGOOO:",agentByClient)
//         res.json(agentByClient);

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error: ' + err.message);
//     }

// });

// @route POST api/client/addAgentClient
// @desc  agrega un referente a un cliente
// @access Public
router.post('/addAgentClient', [
    check('idClient', 'El id del cliente es requerido').not().isEmpty(),
    check('idAgent', 'El id del referente es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {idClient, idAgent} = req.body;

    try {

        var today = new Date();
        
        // var agentbyClient = new AgentByClient({
        //     idAgent, 
        //     idClient,
        //     dateStart: today
        // });
        // //console.log("AÑADO->>",agentbyClient)
        // await agentbyClient.save();
        
        res.json({msg: 'El referente ha sido agregado al cliente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/client/deleteAgentClient
// @desc  elimina un referente del cliente
// @access Public
// router.post('/deleteAgentClient', [
//     check('idClient', 'El id del cliente es requerido').not().isEmpty(),
//     check('idAgent', 'El id del agente es requerido').not().isEmpty(),
// ], async(req, res) => {

//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const {idClient, idAgent} = req.body;

//     try {
            
//         var today = new Date();

//         let agent = await Client.findOne({_id:idClient,customerReferences:{idAgent:idAgent,status:"ACTIVO"}});
//         console.log("encontrerel:",agent)

//         if(!agent){
//             return res.status(404).json({errors: [{msg: "El referente no existe para ese cliente."}]});
//         }
//         let posLastHistory = agent.customerReferences.length - 1;
//         console.log("posHist",posLastHistory)
//         let posCustomerReferenceLastHistory = agent.customerReferences[posLastHistory].history.length - 1;
//         console.log("posHistCust")
//         let idLastHistory = agent.customerReferences[posLastHistory].history[posCustomerReferenceLastHistory]._id
//         console.log("id",idLastHistory)
//         //await Client.findOneAndUpdate({_id: agent._id}, {$set:{status:"INACTIVO", dateDown: today}});
//         //await AgentByClient.findOneAndUpdate({_id: agent._id}, {$set:{status:"INACTIVO", dateDown: today}});

//         res.json({msg: 'Referente eliminado del cliente'});
        
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error: ' + err.message);
//     }

// });


// @route POST api/team/reactiveAgentClient
// @desc  reactive a user by email
// @access Public
// router.post('/reactiveAgentClient', [
//     check('idClient', 'El id del cliente es requerido').not().isEmpty(),
//     check('idAgent', 'El id del referente es requerido').not().isEmpty(),
// ], async(req, res) => {

//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const {idClient, idAgent} = req.body;

//     try {
        
//         //validacion que el referente a activar, su cliente esté activo.
//         let clientInactive = await Client.findOne({_id:idClient, status:"INACTIVO"});
//         if(clientInactive){
//             return res.status(404).json({errors: [{msg: "El Cliente no se encuentra activo, para activar un referente active el mismo."}]});
//         }

//         var today = new Date();
        
//         var agentbyClient = new AgentByClient({
//             idAgent, 
//             idClient,
//             status:"ACTIVO",
//             dateStart: today
//         });

//         await agentbyClient.save();
        
//         res.json({msg: 'Referente ha sido agregado al Cliente'});
        
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error: ' + err.message);
//     }

// });

// @route Post api/client/addClientReferent
// @desc  Crea un nuevo cliente y su referente
// @access Private
router.post('/addClientReferent', [
    check('name', 'El nombre del cliente es obligatoria').not().isEmpty(),
    check('cuil', 'El cuil es obligatoria').not().isEmpty(),
    check('condition', 'La condición es obligatoria').not().isEmpty(),
    check('address', 'Dirección es requerido').not().isEmpty(),
    check('email', 'Email es requerido').isEmail(),
    check('phone', 'Teléfono es requerido').not().isEmpty(),
    check('provinceId', 'La provincia es requerida').not().isEmpty(),
    check('locationId', 'La localidad es requerida').not().isEmpty(),

    check('nameRef', 'El nombre del Referente es obligatorio').not().isEmpty(),
    check('surnameRef', 'El apellido del Referente es obligatorio').not().isEmpty(),
    check('cuilRef', 'El cuil del Referente es obligatoria').not().isEmpty(),
    check('addressRef', 'Dirección del Referente es requerido').not().isEmpty(),
    check('emailRef', 'Email del Referente es requerido').isEmail(),
    check('phoneRef', 'Teléfono del Referente es requerido').not().isEmpty(),
    check('provinceIdRef', 'La provincia del Referente es requerida').not().isEmpty(),
    check('locationIdRef', 'La localidad del Referente es requerida').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, cuil, condition, address, email, phone, provinceId, locationId, nameRef, surnameRef, cuilRef, addressRef, emailRef, phoneRef, provinceIdRef, locationIdRef} = req.body;

    let status = "ACTIVO";
    var today = new Date();

    try {
        //alta referente
        let agentCuil = await Agent.findOne({cuil:cuilRef});
        if(agentCuil){
            return res.status(404).json({errors: [{msg: "El referente ya exíste con el cuil ingresado."}]});
        }

        let agent = new Agent({
            name:nameRef, surname:surnameRef, cuil:cuilRef, address:addressRef, email:emailRef, phone:phoneRef, status, provinceId:provinceIdRef, locationId:locationIdRef, history:{dateUp:today} 
        });

        await agent.save();

        //busco referente dado de alta
        let agentNew = await Agent.findOne({cuil:cuilRef});

        let agentId = agentNew._id;

        //alta cliente

        let clientCuil = await Client.findOne({cuil});
        if(clientCuil){
            return res.status(404).json({errors: [{msg: "El cliente ya exíste con el cuil ingresado."}]});
        }


        let client = new Client({
            name, cuil, condition, address, email, phone, status, provinceId, locationId, history:{dateUp:today},
            customerReferences:{idAgent:agentId,status}
        });

        await client.save();

        return res.status(200).json({msg: 'El cliente fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



module.exports = router;