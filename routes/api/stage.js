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
    check('endDateProvide', 'La fecha de fin prevista').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {projectId, name, description, startDateProvide, endDateProvide, startDate, endDate, idUserCreate} = req.body;

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
        let status = "CREADA";
    
        var today = new Date();

        let stage = new Stage({
            projectId, name, description, startDateProvide, endDateProvide, startDate, endDate, status, history:{dateUp:today,status, idUserChanged:idUserCreate},
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
        
        //valido de que no elimino una etapa que no esté en creado
        if(!stage.status === "CREADA"){
            return res.status(404).json({errors: [{msg: "La etapa a eliminar a eliminar contiene asignaciones de RRHH a tareas"}]});
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

// @route POST api/stage/suspense
// @desc  suspende una etapa segun id
// @access Public
router.post('/suspense', [
    check('id', 'Id es requerido').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty(),
    check('reason',"La razón es necesario").not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;
    const idUserCreate = req.body.idUserCreate;
    const reason = req.body.reason;
    
    try {

        let stage = await Stage.findById(id);
        if(!stage){
            return res.status(404).json({errors: [{msg: "La Etapa no existe."}]});
        }else{ //etapa existente.           
            if(!(stage.status=="ACTIVA")){
                return res.status(404).json({errors: [{msg: "La Etapa no se encuentra activa para suspenderla"}]});
            }
            // iterar por cadaactividades y tareas asignadas y a las "ACTIVA", cambiar por "SUSPENDIDA"
            //
            //
            //-------------FALTA!!!
            //
            //
            //Cambiar estado de la etapa  a "SUSPENDIDA" y generar historial. Agendar "quien" lo suspende
            
            let posLastHistoryStage = stage.history.length - 1;        
        
            let idLastHistoryStage = stage.history[posLastHistoryStage]._id

            let dateToday = Date.now();  

            let reasonAdd = "-";
            if (reason !== ""){
                reasonAdd = reason;
            };

            await Stage.findOneAndUpdate({_id: id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
            
            await Stage.findOneAndUpdate({_id: id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            res.json({msg: 'Etapa suspendida'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/stage/reactivate
// @desc  REACTIVA una etapa segun id
// @access Public
router.post('/reactivate', [
    check('id', 'Id es requerido').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;
    const idUserCreate = req.body.idUserCreate;
    
    try {

        let stage = await Stage.findById(id);
        if(!stage){
            return res.status(404).json({errors: [{msg: "La Etapa no existe."}]});
        }else{ //etapa existente.
            if(!(stage.status=="SUSPENDIDA")){
                return res.status(404).json({errors: [{msg: "La Etapa no se encuentra suspendida para reactivarla"}]});
            }
            // iterar por cada  actividades y tareas asignadas y a las "SUSPENDIDA", cambiar por "ACTIVA"
            //
            //
            //-------------FALTA!!!
            //
            //
            //Cambiar estado de la estapa a "ACTIVA" y generar historial. Agendar "quien" lo activa
            
            let posLastHistoryStage = stage.history.length - 1;        
        
            let idLastHistoryStage = stage.history[posLastHistoryStage]._id

            let dateToday = Date.now();  

            await Stage.findOneAndUpdate({_id: id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
            
            await Stage.findOneAndUpdate({_id: id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,idUserChanged:idUserCreate}}});

            res.json({msg: 'Etapa activada'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

/*
------------------------------------------------------------------------ Tarea-Actividad ------------------------------------------------------------------------
*/

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
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty(),
    
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask, idUserCreate} = req.body;

    try {
        let status = "CREADO";
    
        var today = new Date();

        let actByTask = new ActivityByTask({
            projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask, status, history:{dateUp:today,status, idUserChanged:idUserCreate}
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
        //CONTROL DE ELIMINAR TAREAS QUE ESTEN CREADAS Y ASIGNADAS(?)

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

        // console.log("la fecha startDateProvideTask: ", startDateProvideTask);
        // console.log("la fecha endDateProvideTask: ", endDateProvideTask);

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


// @route POST api/stage/task/suspense
// @desc  suspende una tarea de una actividad segun id
// @access Public
router.post('/task/suspense', [
    check('id', 'Id es requerido').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty(),
    check('reason',"La razón es necesario").not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;
    const idUserCreate = req.body.idUserCreate;
    const reason = req.body.reason;
    
    try {

        let task = await ActivityByTask.findById(id);
        if(!task){
            return res.status(404).json({errors: [{msg: "La Tarea no existe."}]});
        }else{ //tarea existente.           
            if(!(task.status=="ACTIVA")){
                return res.status(404).json({errors: [{msg: "La tarea no se encuentra activa para suspenderla"}]});
            }

            //Cambiar estado de la tarea  a "SUSPENDIDA" y generar historial. Agendar "quien" lo suspende
            
            let posLastHistoryActivityByTask = task.history.length - 1;        
        
            let idLastHistoryActivityByTask = task.history[posLastHistoryActivityByTask]._id

            let dateToday = Date.now();  

            let reasonAdd = "-";
            if (reason !== ""){
                reasonAdd = reason;
            };

            await ActivityByTask.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivityByTask}, {$set:{"history.$.dateDown":dateToday}});
            
            await ActivityByTask.findOneAndUpdate({_id: id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            //VERIFICAR SI ES LA ULTIMA TAREA SUSPENDIDA -> SUSPENDER ACTIVIDAD, SI ES LA ULTIMA -> SUSPENDER ETAPA, SI ES LA ULTIMA -> PROYECTO
            res.json({msg: 'Tarea suspendida'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/stage/task/reactivate
// @desc  REACTIVA una tarea de una actividad segun id
// @access Public
router.post('/task/reactivate', [
    check('id', 'Id es requerido').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;
    const idUserCreate = req.body.idUserCreate;
    
    try {

        let task = await ActivityByTask.findById(id);
        if(!task){
            return res.status(404).json({errors: [{msg: "La Etapa no existe."}]});
        }else{ //etapa existente.
            if(!(task.status=="SUSPENDIDA")){
                return res.status(404).json({errors: [{msg: "La Etapa no se encuentra suspendida para reactivarla"}]});
            }
            // iterar por cada  actividades y tareas asignadas y a las "SUSPENDIDA", cambiar por "ACTIVA"
            //
            //
            //-------------FALTA!!!
            //
            //
            //Cambiar estado de la estapa a "ACTIVA" y generar historial. Agendar "quien" lo activa
            
            let posLastHistoryActivityByTask = stage.history.length - 1;        
        
            let idLastHistoryActivityByTask = stage.history[posLastHistoryActivityByTask]._id

            let dateToday = Date.now();  

            await ActivityByTask.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivityByTask}, {$set:{"history.$.dateDown":dateToday}});
            
            await ActivityByTask.findOneAndUpdate({_id: id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,idUserChanged:idUserCreate}}});
                        

            res.json({msg: 'Tarea activada'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/stage/task/terminate
// @desc  Termina una tarea segun id
// @access Public
router.post('/task/terminate', [
    check('id', 'Id es requerido').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty()
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;
    const idUserCreate = req.body.idUserCreate;
    
    try {

        let task = await ActivityByTask.findById(id);
        if(!task){
            return res.status(404).json({errors: [{msg: "La Tarea no existe."}]});
        }else{ //tarea existente.

            //Cambiar estado de la tarea  "TERMINADA" ,generar historial y actualizar la fecha fin real. Agendar "quien" lo termina
            
            let posLastHistoryActivityByTask = task.history.length - 1;        
        
            let idLastHistoryActivityByTask = task.history[posLastHistoryActivityByTask]._id

            let dateToday = Date.now();  

            let reasonAdd = "TERMINADA";                    

            await ActivityByTask.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivityByTask}, {$set:{"history.$.dateDown":dateToday}});
            
            await ActivityByTask.findOneAndUpdate({_id: id}, {$set:{status:"TERMINADA", endDate:dateToday},$push: { history: {status:"TERMINADA",dateUp:dateToday,dateDown:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            //Verificar si es la ultima tarea terminada de la actividad
            tasks_activity = await ActivityByTask.find({projectId:posLastHistoryActivityByTask.projectId,stageId:task.stageId,activityId:task.activityId});
            console.log("encontre estas tareas:",tasks_activity)
            for (let index = 0; index < tasks_activity.length; index++) {
                console.log("analizo tarea:",tasks_activity[index]._id)
                if (tasks_activity[index].status !== "TERMINADA" & tasks_activity[index]._id !== task._id){ /// no es la última tarea terminada
                   return res.json({msg: 'Tarea terminada'});
                }                
            }
            console.log("debo actualizar actividad a TERMINADA...")
            //es la ultima tarea, actualizo estado de actividad a TERMINADA 
            let activity = await activity.findById(task.activityId);

            let posLastHistoryActivity = activity.history.length - 1;        
    
            let idLastHistoryActivity = activity.history[posLastHistoryActivity]._id

            await Activity.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
            
            await Activity.findOneAndUpdate({_id: id}, {$set:{status:"TERMINADA"},$push: { history: {status:"TERMINADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            //Verificar si es la ultima actividad terminada de la etapa
            activitys_stage = await Activity.find({projectId:task.projectId,stageId:task.stageId});
            console.log("encontre estas actividades:",activitys_stage)
            for (let index = 0; index < activitys_stage.length; index++) {
                console.log("analizo actividad:",activitys_stage[index]._id)
                if (activitys_stage[index].status !== "TERMINADA" & activitys_stage[index]._id !== task.activityId){ /// no es la última actividad terminada
                   return res.json({msg: 'Tareas de la Actividad terminada'});
                }                
            }
            console.log("debo actualizar etapa a TERMINADA...")
            //es la ultima ACTIVIDAD, actualizo estado de ETAPA a TERMINADA 
            let stage = await Stage.findById(task.stageId);

            let posLastHistoryStage = stage.history.length - 1;        
        
            let idLastHistoryStage = stage.history[posLastHistoryStage]._id

            await Stage.findOneAndUpdate({_id: id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
            
            await Stage.findOneAndUpdate({_id: id}, {$set:{status:"TERMINADA"},$push: { history: {status:"TERMINADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
                   
            //Verificar si es la ultima etapa terminada del proyecto
            stages_proyect = await Stage.find({projectId:task.projectId});
            console.log("encontre estas etapas:",stages_proyect)
            for (let index = 0; index < stages_proyect.length; index++) {
                console.log("analizo etapa:",stages_proyect[index]._id)
                if (stages_proyect[index].status !== "TERMINADA" & stages_proyect[index]._id !== task.stageId){ /// no es la última etapa terminada
                   return res.json({msg: 'Tareas y Actividades de la Etapa terminada'});
                }                
            }
            console.log("debo actualizar proyecto a TERMINADA...")
             //es la ultima ETAPA, actualizo estado del PROYECTO a TERMINADA 
            let project = await Project.findById(task.projectId);
            
            let posLastHistoryProject = project.history.length - 1;        
    
            let idLastHistoryProject = project.history[posLastHistoryProject]._id

            await Project.findOneAndUpdate({_id: id,"history._id":idLastHistoryProject}, {$set:{"history.$.dateDown":dateToday}});
            
            await Project.findOneAndUpdate({_id: id}, {$set:{status:"TERMINADO"},$push: { history: {status:"TERMINADO",dateUp:dateToday,dateDown:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
            res.json({msg: 'Tareas, Actividades Y Etapas terminadas del Proyecto'});
           
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



// @route Post api/stage/task
// @desc  Crea una dedicacion de un RRHH para una tarea de una actividad
// @access Private
router.post('/task/dedication', [
    check('activityTaskId', 'El Id de la tarea de la actividad').not().isEmpty(),
    check('rrhhId', 'El Id del integrante del equipo').not().isEmpty(),
    check('date', 'Fecha que se registra la dedicación').not().isEmpty(),
    check('hsJob', 'Hs dedicadas a la tarea').not().isEmpty(),
    // check('observation', 'Observación de la dedicación').not().isEmpty(),
    
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {activityTaskId, rrhhId, date, hsJob,observation} = req.body;

    try {
        let task = await ActivityByTask.findById(activityTaskId);
        if(!task){
            return res.status(404).json({errors: [{msg: "La Tarea no existe."}]});
        }else{ //tarea existente.
            for (let index = 0; index < task.assigned_people.length; index++) {
                console.log("integrante",task.assigned_people[index].idRRHH)
                if (task.assigned_people[index].idRRHH === rrhhId){ //integrante a agregar dedicacion
                    console.log("agrego dedicacion para: ",rrhhId)

                    await ActivityByTask.findOneAndUpdate({_id: activityTaskId}, {$set:{},$push: { assigned_people: {dedication:{date:date,hsJob:hsJob,observation:observation}}}});
                    return res.status(200).json({msg: 'La dedicación de la tarea fué registrada exitosamente.'});
                }
            }
        }
        console.log("->>>>no pude añadir!!!")
        return res.status(404).json({errors: [{msg: "No se encontró integrante para añadir dedicación."}]});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

module.exports = router;