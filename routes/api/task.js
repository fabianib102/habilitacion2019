const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Task = require('../../models/Task');
const Project = require('../../models/Project');
const Stage = require('../../models/Stage');
const TaskByUser = require('../../models/TaskByUser');
const ActivityByTask = require('../../models/ActivityByTask');
const Activity = require('../../models/Activity');
const User = require('../../models/User');

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
// @desc  elimina una tarea segun id
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
        //validar que la tarea no se encuentre en un proyecto (emparentado a una tarea por actividad)             
        let tasks = await ActivityByTask.findOne({taskId:id});       
        if(tasks){
            return res.status(404).json({errors: [{msg: "El riesgo se encuentra en un Proyecto asignado. Antes de eliminarlo, cambie su situación en el proyecto"}]});
        } 

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
// @desc  edita una tarea
// @access Public
router.post('/edit',[
    check('idTask', 'id de la tarea es requerido').not().isEmpty(),
], async(req, res) => {

    const {name, description, startDate, endDate, idTask} = req.body;

    try {

        await Task.findByIdAndUpdate(
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



// @route GET api/task/getAllByLeader/:idLeader
// @desc  Obtiene todas las tareas según el lider
// @access Private
router.get('/getAllByLeader/:idLeader', async (req, res) => {
    try {

        const idLeader = req.params.idLeader;

        // User

        let userGet = await User.findOne({_id:idLeader});

        var objSend = {
            nameLeader : userGet.name + ", " + userGet.surname,
            arrayTask : []
        }
        
        let project = [];

        let projectbyLeader = await Project.find().sort({startDateExpected: -1})

        for (let index = 0; index < projectbyLeader.length; index++) {
            const element = projectbyLeader[index].historyLiderProject;
            element.forEach(pro => {
                if(pro.liderProject === idLeader && pro.status === "ACTIVO"){
                    project.push(projectbyLeader[index]._id);
                }
            });
        }
        
        for (let x = 0; x < project.length; x++) {
            let task = await TaskByUser.find({projectId:project[x]});

            for (let j = 0; j < task.length; j++) {
                const taskElem = task[j];
                let actByTask = await ActivityByTask.findOne({_id:taskElem.taskId});

                let projectTest = await Project.findOne({_id:taskElem.projectId});
                taskElem.projectName = projectTest.name;

                let stageTest = await Stage.findOne({_id:taskElem.stageId});
                taskElem.stageName = stageTest.name;

                let actTest = await Activity.findOne({_id:taskElem.activityId});
                taskElem.activityName = actTest.name

                let userTest = await User.findOne({_id:taskElem.userId});
                taskElem.userName = userTest.name + " " + userTest.surname;

                taskElem.taskName = actByTask.name;
                taskElem.startDateProvide = actByTask.startDateProvideTask;
                taskElem.endDateProvide = actByTask.endDateProvideTask;
                objSend.arrayTask.push(taskElem);
            }
            
        }

        res.json(objSend);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});



module.exports = router;