const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Project = require('../../models/Project');
const Client = require('../../models/Client');
const Stage = require('../../models/Stage');
const ProjectType = require('../../models/ProjectType');
const ProjectSubType = require('../../models/ProjectSubType');
const Team = require('../../models/Team');
const UserByTeam = require('../../models/UserByTeam');
const User = require('../../models/User');

// @route Post api/project
// @desc  Crea un nuevo proyecto
// @access Private
router.post('/', [
    
    check('name', 'El nombre del proyecto es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('clientId', 'El id del cliente es requerido').not().isEmpty(),
    check('riskId', 'El id del riesgo es requerido').not().isEmpty(),
    check('teamId', 'El id del equipo es requerido').not().isEmpty(),
    check('startDateExpected', 'La fecha de inicio previsto es obligatoria').not().isEmpty(),
    check('endDateExpected', 'La fecha de fin prevista es obligatoria').not().isEmpty(),
    check('typeProjectId', 'La fecha de fin prevista es obligatoria').not().isEmpty(),
    check('subTypeProjectId', 'La fecha de fin prevista es obligatoria').not().isEmpty(),
    
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, clientId, riskId, teamId, startDate, endDate, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId} = req.body;

    try {

        let project = new Project({
            name, description, clientId, riskId, teamId, startDate, endDate, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId 
        });

        await project.save();

        return res.status(200).json({msg: 'El proyecto fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route GET api/project/getAll
// @desc  Obtiene todos los proyectos
// @access Private
router.get('/getAll', async (req, res) => {
    try {
        
        let project = await Project.find().collation({'locale':'en'}).sort({'name': 1});

        for (let index = 0; index < project.length; index++) {
            console.log("->>>",project[index].clientId)
            if(project[index].clientId === "0"){
                console.log("CERO, no encuentro cliente")
                project[index].nombreCliente= "NO encontrado"
            } else{                
            let client = await Client.findById(project[index].clientId);
            project[index].nombreCliente = client.name;
            
            }
            let stage = await Stage.find({"projectId": project[index]._id});
            project[index].listStage = stage;
            console.log("z<z<z<")

            //obtiene el nombre de tipo y subtipo de proyecto
            let type = await ProjectType.findById(project[index].typeProjectId);
            project[index].nombreTipo = type.name;

            let subType = await ProjectSubType.findById(project[index].subTypeProjectId);
            project[index].nombreSubTipo = subType.name;

            //obtiene los datos del equipo
            let team = await Team.findById(project[index].teamId);
            if(team != null){
                project[index].nombreEquipo = team.name;

                let userTeam = await UserByTeam.find({idTeam: project[index].teamId});

                if(userTeam != null){

                    for (let i = 0; i < userTeam.length; i++) {
                        const idUserTeam = userTeam[i].idUser;
                        let user = await User.findById(idUserTeam);
                        project[index].teamMember[i] = user.name + " " + user.surname;
                    }
                }

                
            }
            

        }
        res.json(project);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


module.exports = router;