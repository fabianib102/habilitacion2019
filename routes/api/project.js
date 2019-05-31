const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Project = require('../../models/Project');

// @route Post api/project
// @desc  Crea un nuevo proyecto
// @access Private
router.post('/', [auth, [
    check('name', 'El nombre del proyecto es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('startDate', 'La fecha de inicio es obligatoria').not().isEmpty(),
    check('providedDate', 'La fecha de fin prevista es obligatoria').not().isEmpty(),
] ], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, startDate, providedDate} = req.body;
    const idUser = req.user.id._id;

    try {

        let project = new Project({
            name, idUser, description, startDate, providedDate 
        });
        await project.save();

        //Obtengo el listado con el nuevo proyecto
        let projects = await Project.find({idUser: idUser});

        return res.status(200).json(projects);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route GET api/project/getAll/:user_id
// @desc  Obtiene los proyectos de acuerdo con un id de un user
// @access Private
router.get('/getAll/:user_id', async (req, res) => {
    const idUser = req.params.user_id;
    try {
        let projects = await Project.find({idUser: idUser});
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});

module.exports = router;