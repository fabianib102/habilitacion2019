const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Activity = require('../../models/Activity');


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

        let status = "CREADO";
    
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
    
    try {

        let activity = await Activity.findById(id);
        if(!activity){
            return res.status(404).json({errors: [{msg: "La Actividad no existe."}]});
        }else{ //actividad existente.           
            if(!(activity.status=="ACTIVA")){
                return res.status(404).json({errors: [{msg: "La Actividad no se encuentra activa para suspenderla"}]});
            }
            // iterar por tareas asignadas y a las "ACTIVA", cambiar por "SUSPENDIDA"
            //
            //
            //-------------FALTA!!!
            //
            //
            //Cambiar estado de la actividad  a "SUSPENDIDA" y generar historial. Agendar "quien" lo suspende
            
            let posLastHistoryActivity = activity.history.length - 1;        
        
            let idLastHistoryActivity = activity.history[posLastHistoryActivity]._id

            let dateToday = Date.now();  

            let reasonAdd = "-";
            if (reason !== ""){
                reasonAdd = reason;
            };

            await Activity.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
            
            await Activity.findOneAndUpdate({_id: id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            res.json({msg: 'Actividad suspendida'});
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
    
    try {

        let activity = await Activity.findById(id);
        if(!activity){
            return res.status(404).json({errors: [{msg: "La Actividad no existe."}]});
        }else{ //etapa existente.
            if(!(activity.status=="SUSPENDIDA")){
                return res.status(404).json({errors: [{msg: "La Actividad no se encuentra suspendida para reactivarla"}]});
            }
            // iterar por cada tareas asignadas y a las "SUSPENDIDA", cambiar por "ACTIVA"
            //
            //
            //-------------FALTA!!!
            //
            //
            //Cambiar estado de la estapa a "ACTIVA" y generar historial. Agendar "quien" lo activa
            
            let posLastHistoryActivity = activity.history.length - 1;        
        
            let idLastHistoryActivity = activity.history[posLastHistoryActivity]._id

            let dateToday = Date.now();  

            await Activity.findOneAndUpdate({_id: id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
            
            await Activity.findOneAndUpdate({_id: id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,idUserChanged:idUserCreate}}});

            res.json({msg: 'Actividad activada'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



module.exports = router;