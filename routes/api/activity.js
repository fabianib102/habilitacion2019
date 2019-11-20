const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Activity = require('../../models/Activity');
const Stage = require('../../models/Stage');
const ActivityByTask = require('../../models/ActivityByTask');
const Project = require('../../models/Project');


// @route Post api/activity
// @desc  Crea una nueva actividad
// @access Private
router.post('/', [
    check('projectId', 'El Id del proyecto').not().isEmpty(),
    check('stageId', 'El Id de la etapa').not().isEmpty(),
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

    const {projectId, stageId, name, description, startDateProvide, endDateProvide,idUserCreate} = req.body;

    try {


        // var dateOneStart = new Date(startDateProvide);
        // dateOneStart.setDate(dateOneStart.getDate() + 1);

        // var dateOneEnd = new Date(endDateProvide);
        // dateOneEnd.setDate(dateOneEnd.getDate() + 1);

        // console.log("Fecha de actividad: ", dateOneStart)

        let status = "CREADA";
    
        var today = new Date();

        let activity = new Activity({
            // projectId, stageId, name, description, startDateProvide: dateOneStart, endDateProvide: dateOneEnd
            projectId, stageId, name, description, startDateProvide, endDateProvide, status, history:{dateUp:today,status, idUserChanged:idUserCreate}
        });

        await activity.save();

        return res.status(200).json({msg: 'La actividad fue insertada correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route GET api/activity/getAll
// @desc  Obtiene todas las actividades
// @access Private
router.get('/getAll', async (req, res) => {

    try {
        let activity = await Activity.find().collation({'locale':'en'}).sort({'name': 1});
        res.json(activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



// @route Post api/activity/edit
// @desc  Edita una actividad
// @access Private
router.post('/edit', [
    check('idActivity', 'El Id de la actividad es obligatorio').not().isEmpty(),
    check('description', 'El Id de la tarea').not().isEmpty(),
    check('startDateProvide', 'Fecha de inicio prevista').not().isEmpty(),
    check('endDateProvide', 'Fecha de fin prevista').not().isEmpty(),
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {idActivity, description, startDateProvide, endDateProvide} = req.body;

    try {

        var dateOneStart = new Date(startDateProvide);
        dateOneStart.setDate(dateOneStart.getDate() + 1);

        var dateOneEnd = new Date(endDateProvide);
        dateOneEnd.setDate(dateOneEnd.getDate() + 1);


        let task = await Activity.findByIdAndUpdate(
            idActivity,
            {$set:{description, startDateProvide: dateOneStart, endDateProvide: dateOneEnd }},
            {new: true}
        );
        
        return res.status(200).json({msg: 'La actividad ha sido modificada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/activity/delete
// @desc  Elimina una actividad con sus tareas
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

        let activity = await Activity.findById(id);
        // let idProject = stage.projectId
        if(!activity){
            res.status(404).json({errors: [{msg: "La actividad a eliminar no existe."}]});
        };
        //validación de que solo se puedan eliminar actividades creadas
        if(!(activity.status=="CREADA")){
            return res.status(404).json({errors: [{msg: "La Actividad se encuentra asociada a tareas activas"}]});
        }
        //eliminación de la actividad
        await Activity.findOneAndRemove({_id: id});
        
        // obtener tareas a eliminar
        let tasks = await ActivityByTask.find({'projectId':activity.projectId,'stageId':activity.stageId,'activityId':activity._id})
        
        //eliminacion de tareas
        for (let i = 0; i < tasks.length; i++) {
            await ActivityByTask.findOneAndRemove({_id: tasks[i]._id});
        }
   

        res.json({msg: 'Etapa eliminada'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/activity/suspense
// @desc  suspende una actividad segun id
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
    const date = req.body.date;
    
    try {
        let activity = await Activity.findById(id);
        if(!activity){
            return res.status(404).json({errors: [{msg: "La Actividad no existe."}]});
        }else{ //actividad existente.           
            if(!(activity.status=="ACTIVA")){
                return res.status(404).json({errors: [{msg: "La Actividad no se encuentra activa para suspenderla"}]});
            }
            // iterar por tareas de la actividad y a las "ACTIVA", cambiar por "SUSPENDIDA"
            let dateToday = date 
            if (date === "" | date === undefined){
                dateToday = Date.now(); 
            }
            
            let reasonAdd = "SUSPENDIDA";
            if (reason !== ""){
                reasonAdd = reason;
            };

           let tasks = await ActivityByTask.find({projectId:activity.projectId,activity:activity.stageId,activityId:id});
            console.log("encontre estas tareas:",tasks)
            for (let i = 0; i < tasks.length; i++) {
                console.log("analizo tarea:",tasks[i]._id, tasks[i].name, tasks[i].status )
                //verifico estado este ACTIVA
                if (tasks[i].status === "ACTIVA"){ //suspendo tarea
                    let posLastHistoryActivityByTask = tasks[i].history.length - 1;        

                    let idLastHistoryActivityByTask = tasks[i].history[posLastHistoryActivityByTask]._id
        
                    await ActivityByTask.findOneAndUpdate({_id: tasks[i]._id,"history._id":idLastHistoryActivityByTask}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await ActivityByTask.findOneAndUpdate({_id: tasks[i]._id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
                }
            }

            //Cambiar estado de la actividad  a "SUSPENDIDA" y generar historial. Agendar "quien" lo suspende
            
            let posLastHistoryActivity = activity.history.length - 1;        
        
            let idLastHistoryActivity = activity.history[posLastHistoryActivity]._id

            await Activity.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
            
            await Activity.findOneAndUpdate({_id: id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            //Verificar si es la ultima actividad SUSPENDIDA de la etapa
            let activitys_stage = await Activity.find({projectId:activity.projectId,stageId:activity.stageId});
            console.log("encontre estas actividades:",activitys_stage)
            for (let index = 0; index < activitys_stage.length; index++) {
                console.log("analizo actividad:",activitys_stage[index]._id, id)
                if (activitys_stage[index].status !== "SUSPENDIDA" & activitys_stage[index]._id !== id){ /// no es la última actividad SUSPENDIDA
                   return res.json({msg: 'Actividad Susuprendida'});
                }                
            }
            console.log("debo actualizar etapa a SUSPENDIDA...")
            //es la ultima ACTIVIDAD, actualizo estado de ETAPA a ACTIVA 
            let stage = await Stage.findById(activity.stageId);
            console.log("etapa a actualizar->",stage)
            let posLastHistoryStage = stage.history.length - 1;        
        
            let idLastHistoryStage = stage.history[posLastHistoryStage]._id

            await Stage.findOneAndUpdate({_id: activity.stageId,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
            
            await Stage.findOneAndUpdate({_id: activity.stageId}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

           //Verificar si es la ultima etapa suspendida del proyecto
           let stages_proyect = await Stage.find({projectId:activity.projectId});
           console.log("encontre estas etapas:",stages_proyect)
           for (let index = 0; index < stages_proyect.length; index++) {
               console.log("analizo etapa:",stages_proyect[index]._id, activity.stageId)
               if (stages_proyect[index].status !== "SUSPENDIDA" & stages_proyect[index]._id !== activity.stageId){ /// no es la última etapa suspendida
                  return res.json({msg: 'Tareas y Actividades de la Etapa suspendida'});
               }                
           }
           console.log("debo actualizar proyecto a SUSPENDIDO...")
            //es la ultima ETAPA, actualizo estado del PROYECTO a SUSPENDIDA 
           let project = await Project.findById(activity.projectId);
           
           let posLastHistoryProject = project.history.length - 1;        
   
           let idLastHistoryProject = project.history[posLastHistoryProject]._id

           await Project.findOneAndUpdate({_id: activity.projectId,"history._id":idLastHistoryProject}, {$set:{"history.$.dateDown":dateToday}});
           
           await Project.findOneAndUpdate({_id: activity.projectId}, {$set:{status:"SUSPENDIDO", endDate:dateToday},$push: { history: {status:"SUSPENDIDO",dateUp:dateToday,dateDown:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
           res.json({msg: 'Tareas, Actividades Y Etapas suspendidas del Proyecto'});

        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/activity/reactivate
// @desc  REACTIVA una actividad segun id
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
    const date = req.body.date;
    
    try {
        let activity = await Activity.findById(id);
        if(!activity){
            return res.status(404).json({errors: [{msg: "La Actividad no existe."}]});
        }else{ //etapa existente.
            if(!(activity.status=="SUSPENDIDA")){
                return res.status(404).json({errors: [{msg: "La Actividad no se encuentra suspendida para reactivarla"}]});
            }
            let project = await Project.findById(activity.projectId);

            if(!(project.status === "ACTIVO")){// SOLO REACTIVO SI EL PROYECTO ESTÁ ACTIVO
                return res.status(404).json({errors: [{msg: "El proyecto no es encuentra Activo para poder reactivar una Actividad"}]});
            }

            let dateToday = date 
            if (date === "" | date === undefined){
                dateToday = Date.now(); 
            }

            let reasonAdd = "REACTIVADA";
           
            // iterar por cada tareas de la actividad y a las "SUSPENDIDA", cambiar por "ACTIVA"
            let tasks = await ActivityByTask.find({projectId:activity.projectId,stageId:activity.stageId,activityId:id});
            console.log("encontre estas tareas:",tasks)
            for (let i = 0; i < tasks.length; i++) {
                console.log("analizo tarea:",tasks[i]._id, tasks[i].name, tasks[i].status )
                //verifico estado este suspendida
                if (tasks[i].status === "SUSPENDIDA"){ //activo tarea
                    let posLastHistoryActivityByTask = tasks[i].history.length - 1;        

                    let idLastHistoryActivityByTask = tasks[i].history[posLastHistoryActivityByTask]._id
        
                    await ActivityByTask.findOneAndUpdate({_id: tasks[i]._id,"history._id":idLastHistoryActivityByTask}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await ActivityByTask.findOneAndUpdate({_id: tasks[i]._id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
                }
            }

            //Cambiar estado de la estapa a "ACTIVA" y generar historial. Agendar "quien" lo activa
            
            let posLastHistoryActivity = activity.history.length - 1;        
        
            let idLastHistoryActivity = activity.history[posLastHistoryActivity]._id 

            await Activity.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
            
            await Activity.findOneAndUpdate({_id: id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,idUserChanged:idUserCreate}}});

            //verificamos si es la ultima actividad a suspendida, por lo que activamos la etapa
            let activitys_stage = await Activity.find({projectId:activity.projectId,stageId:activity.stageId});
            console.log("encontre estas actividades:",activitys_stage)
            for (let index = 0; index < activitys_stage.length; index++) {
                console.log("analizo actividad:",activitys_stage[index]._id, id)
                if (activitys_stage[index].status !== "ACTIVA" & activitys_stage[index]._id !== id){ /// no es la última actividad terminada
                   return res.json({msg: 'Tareas de la Actividad activas'});
                }                
            }
            console.log("debo actualizar etapa a ACTIVA...")
            //es la ultima ACTIVIDAD, actualizo estado de ETAPA a ACTIVA 
            let stage = await Stage.findById(activity.stageId);
            console.log("etapa a actualizar->",stage)
            let posLastHistoryStage = stage.history.length - 1;        
        
            let idLastHistoryStage = stage.history[posLastHistoryStage]._id

            await Stage.findOneAndUpdate({_id: activity.stageId,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
            
            await Stage.findOneAndUpdate({_id: activity.stageId}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});


            //no verificamos si el proyecto está activo, para reactivar tiene que estar activo el proyecto

            res.json({msg: 'Actividades de las Etapas activadas'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



module.exports = router;