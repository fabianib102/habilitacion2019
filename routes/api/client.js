const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Client = require('../../models/Client');
const Project = require('../../models/Project');
const Agent = require('../../models/Agent');
const Province = require('../../models/Province');
const Location = require('../../models/Location');


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
        let clients = await Client.find().collation({'locale':'en'}).sort({'name': 1});
        
        let listClients = []
        
        // busco nombre provincia y localidad por cada dliente
        for (let index = 0; index < clients.length; index++) {
            let item ={};
            item._id = clients[index]._id;
            item.name = clients[index].name;
            item.cuil = clients[index].cuil;
            item.condition = clients[index].condition;
            item.address = clients[index].address;
            item.email = clients[index].email;
            item.phone = clients[index].phone;
            item.status = clients[index].status;
            item.provinceId = clients[index].provinceId;
            item.locationId = clients[index].locationId;
            item.history = clients[index].history;
            item.customerReferences = clients[index].customerReferences;

            let province = await Province.findById(clients[index].provinceId);
            item.nameProvince = province.name;
            let location = await Location.findById(clients[index].locationId);
            item.nameLocation = location.name;

            listClients.push(item)
        }
        
        return res.json(listClients);
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
    const reason = req.body.reason;
    try {

        let client = await Client.findById(id);
        if(!client){
            return res.status(404).json({errors: [{msg: "El cliente no existe."}]});
        }else{
            //validar que el cliente no este en un proyecto asignado
            let project = await Project.findOne({clientId:id});
            if(project){
                return res.status(404).json({errors: [{msg: "El Cliente se encuentra en un Proyecto asignado. Antes de eliminarlo, cambie su situación en el proyecto"}]});
            }
            let posLastHistory = client.history.length - 1;
        
            let idLastHistory = client.history[posLastHistory]._id
            
            let dateToday = Date.now();  

            // traigo referentes y los inactivo
            let clients = await Client.findOne({_id:id});
            
            let reasonAdd = "-";
            if (reason !== ""){
                reasonAdd = reason;
            };

             for (let index = 0; index < clients.customerReferences.length; index++) {
                let agent = await Agent.findById(clients.customerReferences[index].idAgent);
                
                let posLastHistoryAgent = agent.history.length - 1;        
                
                let idLastHistoryAgent = agent.history[posLastHistoryAgent]._id

                await Agent.findOneAndUpdate({_id: clients.customerReferences[index].idAgent, "history._id":idLastHistoryAgent}, {$set:{status:"INACTIVO", "history.$.dateDown":dateToday,"history.$.reason":reasonAdd}});
      
             }

            await Client.findOneAndUpdate({_id: id,"history._id":idLastHistory}, {$set:{status:"INACTIVO", "history.$.dateDown":dateToday,"history.$.reason":reasonAdd}});


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
            //elimino el referente dado de alta, por no tener cliente.
            await Agent.findOneAndRemove({_id:agentId})
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