const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const ProjectSubType = require('../../models/ProjectSubType');
const Project = require('../../models/Project');


// @route Post api/project-subtype
// @desc  Crea un nuevo subtipo de proyecto
// @access Private
router.post('/', [
    check('name', 'El nombre del subtipo de proyecto es obligatoria').not().isEmpty(),
    check('type', 'El nombre del tipo de proyecto es obligatoria').not().isEmpty(),
    check('description', 'La descripción del subtipo de proyecto es obligatoria').not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }
    const {name, type, description} = req.body;

    try {
        let proyectSubType = new ProjectSubType({
            name, type, description 
        });

        await proyectSubType.save();

        return res.status(200).json({msg: 'El Subtipo de proyecto fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route GET api/proyect-subtype/getAll
// @desc  Obtiene los subtipos de proyecto
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let proyectSubType = await ProjectSubType.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(proyectSubType);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route POST api/proyect-subtype/delete
// @desc  delete a project-subtype by id
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

        let proyectSubType = await ProjectSubType.findById(id);

        if(!proyectSubType){
            res.status(404).json({errors: [{msg: "El subtipo de proyecto a eliminar no existe"}]});
        }

        // validar que no se encuentre asignado a un proyecto
        let project = await Project.findOne({subTypeProjectId:id});
        if(project){
            return res.status(404).json({errors: [{msg: "El subtipo de proyecto se encuentra en un Proyecto asignado. Antes de eliminarlo, cambie su situación en el proyecto"}]});
        }

        await ProjectSubType.findOneAndRemove({_id: id});

        res.json({msg: 'Subtipo de proyecto eliminado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/proyect-subtype/edit
// @desc  edit a proyect-subtype
// @access Public
router.post('/edit',[
    check('idProjectSubType', 'id del subtipo de proyecto es requerido').not().isEmpty(),
    check('name', 'El nombre del subtipo de proyecto es requerido').not().isEmpty(),
    check('description', 'La descripción del subtipo de proyecto es requerido').not().isEmpty()
], async(req, res) => {

    const {name, description, idProjectSubType} = req.body;

    try {

        let proyectSubType = await ProjectSubType.findByIdAndUpdate(
            idProjectSubType,
            {$set:{name, description}},
            {new: true}
        );

        res.json({msg: 'Subtipo de proyecto modificado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;