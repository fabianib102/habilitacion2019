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



module.exports = router;