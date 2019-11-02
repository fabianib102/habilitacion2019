const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Location = require('../../models/Location');
const Province = require('../../models/Province');
const Agent = require('../../models/Agent');
const Client = require('../../models/Client');
const User = require('../../models/User');


// @route GET api/location/getAll
// @desc  Obtiene los riesgos
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let locacion = await Location.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(locacion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route Post api/location
// @desc  Crea una nueva localidad
// @access Private
router.post('/',[
    check('name', 'El nombre de la localidad es obligatoria').not().isEmpty(),
    check('idProvince', 'El id de la provincia es obligatoria').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, idProvince} = req.body;

    try {


        let locFind = await Location.findOne({name});

        if(locFind){
            if(locFind.idProvince == idProvince){
                return res.status(404).json({errors: [{msg: "La localidad existe para la provincia seleccionada"}]});
            }
        }

        let locacion = new Location({name, idProvince});

        await locacion.save();

        return res.status(200).json({msg: 'La localidad fue agregada correctamente'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/location/delete
// @desc  delete a location by id
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

        var location = await Location.findById(id);

        if(!location){ //localidad no existente
            return res.status(404).json({errors: [{msg: "La localidad a eliminar no existe."}]});
        }else{ //localidad existente

            //valido que no se use en RRHH
            var locationUser = await User.findOne({locationId:id});
            //console.log(locationUser)
            if (locationUser !== null){
                return res.status(404).json({errors: [{msg: "La localidad a eliminar se encuentra asignado a un RRHH."}]});
            }

            //valido que no se use en Cliente
            var locationClient = await Client.findOne({locationId:id});
            if (locationClient !== null){
                return res.status(404).json({errors: [{msg: "La localidad a eliminar se encuentra asignado a un Cliente."}]});
            }

            //valido que no se use en Referente
            var locationAgent = await Agent.findOne({locationId:id});
            if (locationAgent !== null){
                return res.status(404).json({errors: [{msg: "La localidad a eliminar se encuentra asignado a un Referente de un Cliente."}]});
            }

            var allLocation = await Location.find({idProvince: location.idProvince});

            if(allLocation.length == 1){
                //eliminacion de la provincia (queda sin localidades, debido a que la ultima a eliminar es única)
                await Province.findOneAndRemove({_id: location.idProvince});                
            }
        }

        await Location.findOneAndRemove({_id: id});

        res.json({msg: 'Localidad eliminada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/location/edit
// @desc  edit location
// @access Public
router.post('/edit',[
    check('name', 'El nombre de la localidade es requerida').not().isEmpty(),
    check('idLocation', 'id de la localidad es requerido').not().isEmpty(),
], async(req, res) => {

    const {name, idLocation} = req.body;

    try {

        let risk = await Location.findByIdAndUpdate(
            idLocation,
            {$set:{name}},
            {new: true}
        );

        res.json({msg: 'Localidad modificada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;