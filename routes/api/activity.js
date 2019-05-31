const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Activity = require('../../models/Activity');


// @route GET api/activity
// @desc  Obtiene los proyectos de acuerdo con un id de un user
// @access Private
router.get('/', async (req, res) => {

    res.json("Estoy en el get");

    // const idUser = req.params.user_id;
    // try {
    //     let projects = await Project.find({idUser: idUser});
    //     res.json(projects);
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).send('Server Error: ' + err.message);
    // }

});


module.exports = router;