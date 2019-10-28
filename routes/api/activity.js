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
    check('endDateProvide', 'La fecha de fin prevista').not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {projectId, stageId, name, description, startDateProvide, endDateProvide} = req.body;

    try {


        var dateOneStart = new Date(startDateProvide);
        dateOneStart.setDate(dateOneStart.getDate() + 1);

        var dateOneEnd = new Date(endDateProvide);
        dateOneEnd.setDate(dateOneEnd.getDate() + 1);

        console.log("Fecha de actividad: ", dateOneStart)

        // let activity = new Activity({
        //     projectId, stageId, name, description, startDateProvide: dateOneStart, endDateProvide: dateOneEnd
        // });

        // await activity.save();

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



module.exports = router;