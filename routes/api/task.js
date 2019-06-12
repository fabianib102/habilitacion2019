const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Task = require('../../models/Task');


// @route Post api/task
// @desc  Crea una nueva tarea
// @access Private
router.post('/', [auth, [
    check('name', 'El nombre del riesgo es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('startDate', 'Fecha de inicio es obligatorio').not().isEmpty(),
    check('endDate', 'Fecha de fin es obligatorio').not().isEmpty()
] ], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, startDate, endDate} = req.body;

    try {

        let task = new Task({
            name, description, startDate, endDate 
        });

        await task.save();

        return res.status(200).json({msg: 'La tarea fue insertada correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



// @route GET api/task/getAll
// @desc  Obtiene todas las tareas
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let task = await Task.find();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;