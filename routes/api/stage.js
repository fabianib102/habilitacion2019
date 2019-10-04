const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Stage = require('../../models/Stage');

// @route Post api/stage
// @desc  Crea una nueva etapa
// @access Private
router.post('/', [
    check('projectId', 'El Id del proyecto').not().isEmpty(),
    check('name', 'El nombre de la etapa es obligatoria').not().isEmpty(),
    check('description', 'La descripción de la etapa es obligatoria').not().isEmpty(),
    check('startDateProvide', 'La fecha de inicio prevista').not().isEmpty(),
    check('endDateProvide', 'La fecha de fin prevista').not().isEmpty(),
    check('startDate', 'La fecha de inicio prevista').not().isEmpty(),
    check('endDate', 'La fecha de fin prevista').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {projectId, name, description, startDateProvide, endDateProvide, startDate, endDate} = req.body;

    try {

        let listStage = await Stage.find({projectId}).sort( { "sec": -1 } )
        var sec = listStage[0].sec + 1;

        let stage = new Stage({
            projectId, name, description, startDateProvide, endDateProvide, startDate, endDate, sec 
        });

        await stage.save();

        return res.status(200).json({msg: 'La etapa fue insertada correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route GET api/stage/getAll
// @desc  Obtiene todas las etapas
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let stage = await Stage.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(stage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/stage/delete
// @desc  Borra una etapa
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

        let stage = await Stage.findById(id);

        if(!stage){
            res.status(404).json({errors: [{msg: "La etapa a eliminar no existe."}]});
        };

        await Stage.findOneAndUpdate({_id: id}, {$set:{status:"INACTIVO"}});

        res.json({msg: 'Etapa eliminada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/stage/getFilter
// @desc  Obtiene todas las etapas activas
// @access Private
router.get('/getFilter/:idProject', async (req, res) => {

    const idPro = req.params.idProject;
    let stage = await Stage.find({"projectId": idPro});
    res.json(stage);

});

// @route POST api/stage/edit
// @desc  edita una etapa
// @access Public
router.post('/edit',[
    check('idStage', 'id de la etapa es requerido').not().isEmpty(),
    check('name', 'El nombre de la etapa es obligatoria').not().isEmpty(),
    check('description', 'La descripción de la etapa es obligatoria').not().isEmpty()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, idStage} = req.body;

    try {

        await Stage.findByIdAndUpdate(
            idStage,
            {$set:{name, description}},
            {new: true}
        );

        res.json({msg: 'Etapa modificada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

module.exports = router;