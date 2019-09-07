const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Project = require('../../models/Project');

// @route Post api/project
// @desc  Crea un nuevo proyecto
// @access Private
router.post('/', [
    check('idClient', 'El id del cliente es requerido').not().isEmpty(),
    check('name', 'El nombre del proyecto es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('startDate', 'La fecha de inicio es obligatoria').not().isEmpty(),
    check('endDate', 'La fecha de fin es obligatoria').not().isEmpty(),
    check('startDateExpected', 'La fecha de inicio previsto es obligatoria').not().isEmpty(),
    check('endDateExpected', 'La fecha de fin prevista es obligatoria').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {idClient, name, description, startDate, endDate, startDateExpected, endDateExpected} = req.body;

    try {

        let project = new Project({
            idClient, name, description, startDate, endDate, startDateExpected, endDateExpected 
        });

        await project.save();

        return res.status(200).json({msg: 'El proyecto fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route GET api/project/getAll
// @desc  Obtiene todas las tareas
// @access Private
router.get('/getAll', async (req, res) => {
    try {
        let project = await Project.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


module.exports = router;