const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Province = require('../../models/Province');
const Location = require('../../models/Location');

// @route Post api/province
// @desc  Crea una nueva provincia
// @access Private
router.post('/',[
    check('name', 'El nombre de la provincia es obligatoria').not().isEmpty(),
    check('location', 'La lista de localidades es obligatoria').isArray().not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, location} = req.body;

    try {

        let provinFind = await Province.findOne({name});

        if(provinFind){
            return res.status(404).json({errors: [{msg: "El provincia ya existe."}]});
        }

        let province = new Province({name});

        await province.save();

        var idProvince = province._id;

        if(idProvince != null){
            for (let index = 0; index < location.length; index++) {
                const loc = location[index];
                var locationEnti = new Location({name: loc, idProvince});
                await locationEnti.save();
            }
        }else{
            return res.status(404).json({msg: 'ocurrió un error en la insercion.'});
        }

        return res.status(200).json({msg: 'La provincia y las localidades fueron insertadas correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/province/getAll
// @desc  Obtiene las provincias
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let province = await Province.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(province);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// @route GET api/province/getProvince/:id
// @desc  Obtiene una provincia segun id
// @access Private
router.get('/getProvince/:idProvince', async (req, res) => {
    try {
        const idProvince = req.params.idProvince;
        let province = await Province.findById(idProvince);
        res.json(province);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route POST api/province/delete
// @desc  elimina una provincia segun id
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
        var allLocations = await Location.find({idProvince: id});
        for (let index = 0; index < allLocations.length; index++) {
            let locationId = allLocations[index]._id;
            //valido que no se use en RRHH
            var locationUser = await User.findOne({locationId});
            if (locationUser !== null){
                return res.status(404).json({errors: [{msg: "La Provincia a eliminar, posee alguna Localidad localidad asignado a un RRHH."}]});
            }

            //valido que no se use en Cliente
            var locationClient = await Client.findOne({locationId});
            if (locationClient !== null){
                return res.status(404).json({errors: [{msg: "La Provincia a eliminar, posee alguna Localidad asignado a un un Cliente."}]});
            }

            //valido que no se use en Referente
            var locationAgent = await Agent.findOne({locationId});
            if (locationAgent !== null){
                return res.status(404).json({errors: [{msg: "La Provincia a eliminar, posee alguna Localidad localidad asignado a un Referente de un Cliente."}]});
            }

        }
        
        await Location.find({idProvince: id}).remove();

        await Province.findOneAndRemove({_id: id});

        return res.status(200).json({msg: 'La provincia fue eliminada correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/province/edit
// @desc  editar una provincia
// @access Public
router.post('/edit',[
    check('name', 'El nombre de la provincia es requerida').not().isEmpty(),
    check('idProvince', 'id de la provincia es requerido').not().isEmpty(),
], async(req, res) => {

    const {name, idProvince} = req.body;

    try {

        await Province.findByIdAndUpdate(
            idProvince,
            {$set:{name}},
            {new: true}
        );

        res.json({msg: 'Provincia modificada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;