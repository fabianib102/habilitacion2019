const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Stage = require('../../models/Stage');
const Activity = require('../../models/Activity');
const ActivityByTask = require('../../models/ActivityByTask');

// @route Post api/stage
// @desc  Crea una nueva etapa
// @access Private
router.post('/', [
    check('projectId', 'El Id del proyecto es requerido').not().isEmpty(),
    check('name', 'El nombre de la etapa es obligatoria').not().isEmpty(),
    check('description', 'La descripción de la etapa es obligatoria').not().isEmpty(),
    check('startDateProvide', 'La fecha de inicio prevista').not().isEmpty(),
    check('endDateProvide', 'La fecha de fin prevista').not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {projectId, name, description, startDateProvide, endDateProvide, startDate, endDate} = req.body;

    try {

        //buscar etapas del proyecto y validar fechas previstas de la etapa para que no se superpongan
        let listStage = await Stage.find({projectId})
        // console.log(listStage)
        let overlap = false
        for (let index = 0; index < listStage.length; index++) {
            // console.log(startDateProvide,listStage[index].startDateProvide,"and",startDateProvide,listStage[index].endDateProvide)
            // console.log(new Date(startDateProvide) >= new Date(listStage[index].startDateProvide),"and",new Date(startDateProvide) <= new Date(listStage[index].endDateProvide))
            // console.log(endDateProvide,listStage[index].startDateProvide,"and",endDateProvide,listStage[index].endDateProvide)
            // console.log(new Date(endDateProvide) >= new Date(listStage[index].startDateProvide),"and",new Date(endDateProvide) <= new Date(listStage[index].endDateProvide))
            if ((new Date(startDateProvide) >= new Date(listStage[index].startDateProvide) && new Date(startDateProvide) <= new Date(listStage[index].endDateProvide)) || new Date(endDateProvide) >= new Date(listStage[index].startDateProvide) && new Date(endDateProvide) <= new Date(listStage[index].endDateProvide)){
                overlap = true
            }
        }
        if(overlap){
           return res.status(404).json({errors: [{msg: "La etapa se superpone con otra existente."}]});
        };

        let stage = new Stage({
            projectId, name, description, startDateProvide, endDateProvide, startDate, endDate 
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
// @desc  Elimina una etapa con sus actividades y tareas
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
        let idProject = stage.projectId
        if(!stage){
           return res.status(404).json({errors: [{msg: "La etapa a eliminar no existe."}]});
        };

        //eliminación de etapa
        await Stage.findOneAndRemove({_id: id});
        
        let activities = await Activity.find({'projectId':idProject,'stageId':id})
        //console.log("ACTIVIDADES:",activities)
        
        //por cada actividad, obtener tareas a eliminar
        list_task = []
        for (let index = 0; index < activities.length; index++) {
            //console.log("busco",activities[index].projectId,activities[index].stageId,activities[index].activityId)
            let tasks = await ActivityByTask.find({'projectId':activities[index].projectId,'stageId':activities[index].stageId,'activityId':activities[index]._id})
            list_task.push(tasks)
        }
        //console.log("TAREAS",list_task)

        //eliminacion de actividades
        for (let i = 0; i < activities.length; i++) {
            await Activity.findOneAndRemove({_id: activities[i]._id});
        }

        //eliminacion de tareas
        for (let i = 0; i < list_task.length; i++) {
            for (let j = 0; j < list_task[i].length; j++) {
                await ActivityByTask.findOneAndRemove({_id: list_task[i]._id});
            }
        }

        res.json({msg: 'Etapa eliminada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/stage/getFilter
// @desc  Obtiene todas las etapas con actividades y tareas ordenadas por fecha de un proyecto
// @access Private
router.get('/getFilter/:idProject', async (req, res) => {

    const idPro = req.params.idProject;

    let stage = await Stage.find({"projectId": idPro}).sort({"startDateProvide": 1});

    for (let index = 0; index < stage.length; index++) {
        const element = stage[index];
        let act = await Activity.find({"stageId": element._id}).sort({"startDateProvide": 1}); 

        for (let i = 0; i < act.length; i++) {
            const elme = act[i];

            let taskAct = await ActivityByTask.find({"projectId": elme.projectId, "stageId": elme.stageId, "activityId": elme._id});
            
            if(taskAct.length > 0){
                act[i].arrayTask = taskAct;
            }
            
        }

        stage[index].arrayActivity = act;

    }

    //console.log("StageFilter->",stage)
    res.json(stage);

});

// @route POST api/stage/edit
// @desc  edita una etapa
// @access Public
router.post('/edit',[
    check('idStage', 'El Id del proyecto').not().isEmpty(),
    check('name', 'El nombre de la etapa es obligatoria').not().isEmpty(),
    check('description', 'La descripción de la etapa es obligatoria').not().isEmpty(),
    check('startDateProvide', 'La fecha de inicio prevista').not().isEmpty(),
    check('endDateProvide', 'La fecha de fin prevista').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {idStage, name, description, startDateProvide, endDateProvide} = req.body;

    try {

        var dateOneStart = new Date(startDateProvide);
        dateOneStart.setDate(dateOneStart.getDate() + 1);

        var dateOneEnd = new Date(endDateProvide);
        dateOneEnd.setDate(dateOneEnd.getDate() + 1);

        await Stage.findByIdAndUpdate(
            {_id: idStage},
            {$set:{name, description, startDateProvide: dateOneStart, endDateProvide: dateOneEnd}},
            {new: true}
        );

        res.json({msg: 'Etapa modificada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route Post api/stage/task
// @desc  Crea una relacion etapa-actividad-tarea
// @access Private
router.post('/task', [
    check('projectId', 'El Id del proyecto').not().isEmpty(),
    check('stageId', 'El Id de la etapa').not().isEmpty(),
    check('activityId', 'El Id de la actividad').not().isEmpty(),
    check('taskId', 'El Id de la tarea').not().isEmpty(),
    check('name', 'Nombre de la tarea').not().isEmpty(),
    check('description', 'El Id de la tarea').not().isEmpty(),
    check('startDateProvideTask', 'Fecha de inicio prevista').not().isEmpty(),
    check('endDateProvideTask', 'Fecha de fin prevista').not().isEmpty(),
    
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask} = req.body;

    try {

        let actByTask = new ActivityByTask({
            projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask
        });

        await actByTask.save();

        return res.status(200).json({msg: 'La tarea según en la actividad.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route Post api/stage/task/delete
// @desc  Elimina una relacion etapa-actividad-tarea
// @access Private
router.post('/task/delete', [
    check('idTask', 'El Id de la tarea es obligatorio').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const idTask = req.body.idTask;

    try {

        await ActivityByTask.findOneAndDelete({_id: idTask});

        return res.status(200).json({msg: 'La tarea ha sido eliminada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route Post api/stage/task/edit
// @desc  Edita una relacion etapa-actividad-tarea
// @access Private
router.post('/task/edit', [
    check('idTask', 'El Id de la tarea es obligatorio').not().isEmpty(),
    check('description', 'El Id de la tarea').not().isEmpty(),
    check('startDateProvideTask', 'Fecha de inicio prevista').not().isEmpty(),
    check('endDateProvideTask', 'Fecha de fin prevista').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {idTask, description, startDateProvideTask, endDateProvideTask} = req.body;

    try {

        console.log("la fecha startDateProvideTask: ", startDateProvideTask);
        console.log("la fecha endDateProvideTask: ", endDateProvideTask);

        var dateOneStart = new Date(startDateProvideTask);
        dateOneStart.setDate(dateOneStart.getDate() + 1);

        var dateOneEnd = new Date(endDateProvideTask);
        dateOneEnd.setDate(dateOneEnd.getDate() + 1);


        let task = await ActivityByTask.findByIdAndUpdate(
            idTask,
            {$set:{description, startDateProvideTask: dateOneStart, endDateProvideTask: dateOneEnd }},
            {new: true}
        );
        
        return res.status(200).json({msg: 'La tarea ha sido modificada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


module.exports = router;