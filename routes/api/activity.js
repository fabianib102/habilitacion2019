const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const Activity = require('../../models/Activity');


// @route Post api/activity
// @desc  Crea una nueva actividad
// @access Private
router.post('/', [
    check('name', 'El nombre de la etapa es obligatoria').not().isEmpty(),
    check('description', 'La descripción de la etapa es obligatoria').not().isEmpty(),
    check('providedStartDate', 'La descripción de la etapa es obligatoria').not().isEmpty(),
    check('providedEndtDate', 'La descripción de la etapa es obligatoria').not().isEmpty(),
    check('duration', 'La descripción de la etapa es obligatoria').not().isEmpty()
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, providedStartDate, providedEndtDate, duration} = req.body;

    try {

        let activity = new Activity({
            name, description, providedStartDate, providedEndtDate, duration
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



module.exports = router;