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
    check('description', 'La descripción es obligatoria').not().isEmpty()
] ], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description} = req.body;

    try {

        let task = new Task({
            name, description 
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
        let task = await Task.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/task/delete
// @desc  delete a task by id
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
            //validar que la tarea no se encuentre en un proyecto             
            //  if(esta en proyecto){
            //     res.status(404).json({errors: [{msg: "la tarea se encuentra asociada a un proyecto"}]});
            // }else{camino feliz}

        let task = await Task.findById(id);

        if(!task){
            res.status(404).json({errors: [{msg: "La tarea a eliminar no existe."}]});
        }

        await Task.findOneAndRemove({_id: id});

        res.json({msg: 'Tarea eliminada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/task/edit
// @desc  edit a task
// @access Public
router.post('/edit',[
    check('idTask', 'id de la tarea es requerido').not().isEmpty(),
], async(req, res) => {

    const {name, description, startDate, endDate, idTask} = req.body;

    try {

        let task = await Task.findByIdAndUpdate(
            idTask,
            {$set:{name, description, startDate, endDate}},
            {new: true}
        );

        res.json({msg: 'Tarea modificada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;