const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const ProjectType = require('../../models/ProjectType');


// @route Post api/project-type
// @desc  Crea un nuevo tipo de proyecto
// @access Private
router.post('/', [auth, [
    check('name', 'El nombre del tipo de proyecto es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty()
] ], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description} = req.body;

    try {

        let proyectType = new ProjectType({
            name, description 
        });

        await proyectType.save();

        return res.status(200).json({msg: 'El tipo de proyecto fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route GET api/project-type/getAll
// @desc  Obtiene los tipos de proyecto
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let proyectType = await ProjectType.find();
        res.json(proyectType);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});



module.exports = router;