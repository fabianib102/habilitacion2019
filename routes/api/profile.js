const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @desc  no se que hace
// @access Private
router.get('/me', auth, async(req, res) => {
    try {

        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name', 'surname']);

        if(!profile){
            return res.status(400).json({msg: 'Este perfil no corresponde a este usuario'})
        }

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error' + err.message);
    }
});


// @route GET api/profile
// @desc  Crea el perfil del usuario
// @access Private
router.post('/', [auth, [
    check('description', 'La descripción es obligatoria').not().isEmpty()
] ], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

});

module.exports = router;