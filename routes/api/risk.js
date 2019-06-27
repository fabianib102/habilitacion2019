const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Risk = require('../../models/Risk');

// @route Post api/risk
// @desc  Crea un nuevo riesgo
// @access Private
router.post('/', [auth, [
    check('name', 'El nombre del riesgo es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty()
] ], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description} = req.body;

    try {

        let risk = new Risk({
            name, description 
        });

        await risk.save();

        return res.status(200).json({msg: 'El riesgo fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/risk/getAll
// @desc  Obtiene los riesgos
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let risks = await Risk.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(risks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route POST api/risk/delete
// @desc  delete a risk by id
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

        let risk = await Risk.findById(id);

        if(!risk){
            res.status(404).json({errors: [{msg: "El riesgo a eliminar no existe."}]});
        }

        await Risk.findOneAndRemove({_id: id});

        res.json({msg: 'Riesgo eliminado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/risk/edit
// @desc  edit risk
// @access Public
router.post('/edit',[
    check('idRisk', 'id del riesgo es requerido').not().isEmpty(),
], async(req, res) => {

    const {name, description, idRisk} = req.body;

    try {

        let risk = await Risk.findByIdAndUpdate(
            idRisk,
            {$set:{name, description}},
            {new: true}
        );

        res.json({msg: 'Riesgo modificado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;