const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const Project = require('../../models/Project');
const Client = require('../../models/Client');
const Stage = require('../../models/Stage');
const User = require('../../models/User');
const Risk = require('../../models/Risk');
const ProjectType = require('../../models/ProjectType');
const ProjectSubType = require('../../models/ProjectSubType');
const Team = require('../../models/Team');
const UserByTeam = require('../../models/UserByTeam');
const Activity = require('../../models/Activity');
const ActivityByTask = require('../../models/ActivityByTask');

// @route Post api/project
// @desc  Crea un nuevo proyecto
// @access Private
router.post('/', [
    
    check('name', 'El nombre del proyecto es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('clientId', 'El cliente es requerido').not().isEmpty(),
    check('listRisk', 'El riesgo es requerido').not().isEmpty(),
    check('startDateExpected', 'La fecha de inicio previsto es obligatoria').not().isEmpty(),
    check('endDateExpected', 'La fecha de fin prevista es obligatoria').not().isEmpty(),
    check('typeProjectId', 'El tipo de proyecto es requerido').not().isEmpty(),
    //check('subTypeProjectId', 'El subtipo de proyecto es requerido').not().isEmpty(),
    check('teamId', 'El equipo es requerido').not().isEmpty(),
    check('agentId', 'El referente del cliente es requerido').not().isEmpty(),
    check('liderProject', 'El representante del proyecto es requerido').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty(),
    
    
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, clientId, listRisk,startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, teamId, agentId,liderProject,idUserCreate} = req.body;
    
    let status = "FORMULANDO";
    
    var today = new Date();

    try {
        let project = new Project({
            name, description, clientId, listRisk, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId,teamId, agentId, status, history:{dateUp:today,status, idUserChanged:idUserCreate},historyLiderProject:{liderProject,dateUp:today}

        });

        await project.save();

        return res.status(200).json({msg: 'El proyecto fue insertado correctamente.'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route GET   
// @desc  Obtiene todas los proyectos con DATOS IMPORTANTES

// @access Private
router.get('/getAll', async (req, res) => {
    try {
            
        let project = await Project.find().collation({'locale':'en'}).sort({'name': 1});
        let listProjects = []
        for (let index = 0; index < project.length; index++) {
            let pro = {}
            //traigo datos del proyecto
            pro._id =  project[index]._id;
            pro.name =  project[index].name
            pro.description =  project[index].description;
            pro.startDateExpected =  project[index].startDateExpected;
            pro.endDateExpected =  project[index].endDateExpected;
            //pro.history =  project[index].history;
            pro.status = project[index].status;
            
            //trato historial
            var history = [];
            for (let i = 0; i < project[index].history.length; i++) {
                //busco usuario que cambio estado
                let per = await User.findById(project[index].history[i].idUserChanged);
                if(per === null){
                    history.push({dateUp:project[index].history[i].dateUp,dateDown:project[index].history[i].dateDown,
                        status:project[index].history[i].status,reason:project[index].history[i].reason,
                        idUserChanged:"0",
                        nameUserchanged:"",
                        surnameUserchanged:"",
                    })
                }else{
                    history.push({dateUp:project[index].history[i].dateUp,dateDown:project[index].history[i].dateDown,
                        status:project[index].history[i].status,reason:project[index].history[i].reason,
                        idUserChanged:project[index].history[i].idUserChanged,
                        nameUserchanged:per.name,
                        surnameUserchanged:per.surname,
                    })
                }
            }
            pro.history = history;
            
           //traigo cliente
            if(project[index].clientId === "0"){
                //console.log("CERO, no encuentro cliente")
                pro.client = {clientId:project[index].clientId,nameClient:"SIN NOMBRE"}
            } else{
                let client = await Client.findById(project[index].clientId);
                pro.client = {clientId:project[index].clientId,nameClient:client.name}            
            }
            //traigo referente
            if(project[index].agentId === undefined){
                pro.agent = {agentId:"0",nameAgent:"SIN NOMBRE", surnameAgent:"SIN APELLIDO"}
            }else{
                let agent = await Agent.findById(project[index].agentId);
                pro.agent = {agentId:project[index].agentId,nameAgent:agent.name, surnameAgent:agent.surname}
            } 
            //traigo tipo de proyecto
                let projectType = await ProjectType.findById(project[index].typeProjectId);
                pro.projectType = {typeProjectId:project[index].typeProjectId,nameProjectType:projectType.name}
            //traigo subtipo de proyecto            
            if(project[index].subTypeProjectId !== ""){
                let subTypeProject = await ProjectSubType.findById(project[index].subTypeProjectId);
                pro.subTypeProject = {subTypeProjectId:project[index].subTypeProjectId,nameProjectSubType:subTypeProject.name}
            }else{
                pro.subTypeProject = {subTypeProjectId:"-",nameProjectSubType:"-"}
            }
            //traigo equipo
            if(project[index].teamId === undefined){
                pro.team = {teamId:"0",nameTeam:"SIN NOMBRE"}
                pro.membersTeam = [];
            }else{
                let team = await Team.findById(project[index].teamId);
                pro.team = {teamId:project[index].teamId,nameTeam:team.name}
            
                //traigo integrantes
                let filterIntegrants = await UserByTeam.find({idTeam:project[index].teamId, status:"ACTIVO"});                
                let membersTeam = [];
                for (let index = 0; index < filterIntegrants.length; index++) {
                    let mem = await User.findById(filterIntegrants[index].idUser);
                    membersTeam.push({userId:filterIntegrants[index].idUser,name:mem.name,surname:mem.surname});
                }
                pro.membersTeam = membersTeam;
            }
            //traigo representante
            
            if(project[index].historyLiderProject.length === 0){                
                pro.historyLiderProject = [{liderProject:"0",
                    dateUp:"-",
                    dateDown:"-",
                    status:"-",
                    reason:"-",
                    name:"SIN NOMBRE",
                    surname:"SIN APELLIDO"
                }];
            }else{
                let historyLiderProject = [];
                for (let i = 0; i < project[index].historyLiderProject.length; i++) {
                    let lid = await User.findById(project[index].historyLiderProject[i].liderProject);
                    historyLiderProject.push({liderProject:project[index].historyLiderProject[i].liderProject,
                        dateUp:project[index].historyLiderProject[i].dateUp,
                        dateDown:project[index].historyLiderProject[i].dateDown,
                        status:project[index].historyLiderProject[i].status,
                        reason:project[index].historyLiderProject[i].reason,
                        name:lid.name,
                        surname:lid.surname
                    });
                }
                pro.historyLiderProject = historyLiderProject;
            }
            //traigo reisgos
            if(project[index].listRisk === undefined){
                pro.listRisk = [];
            }else{
                let listRisk = [];
                for (let i = 0; i < project[index].listRisk.length; i++) {
                    let risk = await Risk.findById(project[index].listRisk[i]._id);
                    listRisk.push({riskId:project[index].listRisk[i]._id,nameRisk:risk.name,percentage:project[index].listRisk[i].percentage,
                        impact:project[index].listRisk[i].impact})
                }
                pro.listRisk = listRisk;
            }
            //traigo etapas
            let stage = await Stage.find({"projectId": project[index]._id});
            project[index].listStage = stage;            
            
            listProjects.push(pro)

        }
        //console.log(listProjects)
        res.json(listProjects);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route GET api/project/getAll
// @desc  Obtiene todas los proyectos SIMPLIFICADO
// @access Private
router.get('/getAllProject', async (req, res) => {
    try {
        
        let project = await Project.find().collation({'locale':'en'}).sort({'name': 1});       
        
        res.json(project);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// @route POST api/project/edit
// @desc  edita pryecto de los datos basicos
// @access Public
router.post('/edit',[
    check('name', 'El nombre del proyecto es obligatoria').not().isEmpty(),
    check('description', 'La descripción es obligatoria').not().isEmpty(),
    check('clientId', 'El cliente es requerido').not().isEmpty(),
    check('startDateExpected', 'La fecha de inicio previsto es obligatoria').not().isEmpty(),
    check('endDateExpected', 'La fecha de fin prevista es obligatoria').not().isEmpty(),
    check('typeProjectId', 'El tipo de proyecto es requerido').not().isEmpty(),
    check('teamId', 'El equipo es requerido').not().isEmpty(),
    check('agentId', 'El referente del cliente es requerido').not().isEmpty(),
    check('liderProject', 'El representante del proyecto es requerido').not().isEmpty(),
    check('idProject', 'id del projecto es requerido').not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {name, description, clientId, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, teamId, agentId,liderProject,idProject} = req.body;

    try {
        let project = await Project.findById(idProject);
                
        let posLastHistoryProject = project.historyLiderProject.length - 1;        
        
        let idLastHistoryProject = project.historyLiderProject[posLastHistoryProject]._id

        await Project.findOneAndUpdate({_id: idProject, "historyLiderProject._id":idLastHistoryProject}, {$set:{"historyLiderProject.$.liderProject":liderProject}});

        project = await Project.findByIdAndUpdate(
            idProject,
            {$set:{name, description,clientId, startDateExpected, endDateExpected,typeProjectId,subTypeProjectId, teamId, agentId}},
            {new: true}
        );

        return res.json({msg: 'Proyecto modificado'});
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/project/delete
// @desc  elimina un proyecto fisicamente segun id
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

        let project = await Project.findById(id);
        if(!project){
            return res.status(404).json({errors: [{msg: "El Proyecto no existe."}]});
        }else{
            await Project.findOneAndRemove({_id: id});
            //ELIMINAR ETAPAS ACT Y TAREAS
            // await Stage.find({projectId:id}).remove().exec();
            // await Activity.fin.find({projectId:id}).remove().exec();
            // await ActivityByTask.find({projectId:id}).remove().exec(); 
            await Stage.deleteMany({projectId:id})
            await Activity.fin.deleteMany({projectId:id})
            await ActivityByTask.deleteMany({projectId:id}) 

            res.json({msg: 'Proyecto eliminado'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/project/cancel
// @desc  cancela un proyecto segun id
// @access Public
router.post('/cancel', [
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
        let project = await Project.findById(id);
        if(!project){
            return res.status(404).json({errors: [{msg: "El Proyecto no existe."}]});
        }else{ //proyecto existente.            
            let dateToday = date 
            if (date === "" | date === undefined){
                dateToday = Date.now(); 
            }
            
            let reasonAdd = "CANCELADA";
            if (reason !== ""){
                reasonAdd = reason;
            };
            // iterar por cada estapa, actividades y tareas asignadas y a las "ACTIVA", "SUSPENDIDA" cambiar por "CANCELADA"
            stages =await Activity.find({projectId:id});
            console.log("encontre estas etapas:",stages)
            for (let index = 0; index < stages.length; index++) {
                console.log("analizo actividad:",stages[index]._id )                
                activitys = await Activity.find({projectId:id,stageId:stages[index]._id});
                console.log("encontre estas actividades:",activitys)
                for (let index = 0; index < activitys.length; index++) {
                    console.log("analizo actividad:",activitys[index]._id )                                      
                    tasks = await ActivityByTask.find({projectId:id.projectId,stageId:stages[index]._id,activityId:activitys[index]._id});
                    console.log("encontre estas tareas:",tasks)
                    for (let i = 0; i < tasks.length; i++) {
                        console.log("analizo tarea:",tasks[i]._id, tasks[i].name, tasks[i].status )                       
                       //actualizo estado a CANCELADA la tarea
                        let posLastHistoryActivityByTask = tasks[i].history.length - 1;        
    
                        let idLastHistoryActivityByTask = tasks[i].history[posLastHistoryActivityByTask]._id
            
                        await ActivityByTask.findOneAndUpdate({_id: tasks[i]._id,"history._id":idLastHistoryActivityByTask}, {$set:{"history.$.dateDown":dateToday}});
                        
                        await ActivityByTask.findOneAndUpdate({_id: tasks[i]._id}, {$set:{status:"CANCELADA"},$push: { history: {status:"CANCELADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
                    }
                    //actualizo estado a CANCELADA de la actividad
                    let posLastHistoryActivity = activitys[index].history.length - 1;        
    
                    let idLastHistoryActivity = activitys[index].history[posLastHistoryActivity]._id
        
                    await Activity.findOneAndUpdate({_id: activitys[index]._id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await Activity.findOneAndUpdate({_id: activitys[index]._id}, {$set:{status:"CANCELADA"},$push: { history: {status:"CANCELADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});       
                   
                }
                //actualizo estado a CANCELADA de la etapa
                let posLastHistoryStage = stages[index].history.length - 1;        
    
                let idLastHistoryStage = stages[index].history[posLastHistoryStage]._id;        
    
                await Stage.findOneAndUpdate({_id: stages[index]._id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
                
                await Stage.findOneAndUpdate({_id: stages[index]._id}, {$set:{status:"CANCELADA"},$push: { history: {status:"CANCELADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
            }
            //Cambiar estado del proyecto a "CANCELADO" y generar historial. Agendar "quien" lo cancela
            
            let posLastHistoryProject = project.history.length - 1;        
        
            let idLastHistoryProject = project.history[posLastHistoryProject]._id

            await Project.findOneAndUpdate({_id: id,"history._id":idLastHistoryProject}, {$set:{"history.$.dateDown":dateToday}});
            
            await Project.findOneAndUpdate({_id: id}, {$set:{status:"CANCELADO"},$push: { history: {status:"CANCELADO",dateUp:dateToday,dateDown:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            res.json({msg: 'Proyecto cancelado'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/project/suspense
// @desc  suspende un proyecto segun id
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

        let project = await Project.findById(id);
        if(!project){
            return res.status(404).json({errors: [{msg: "El Proyecto no existe."}]});
        }else{ //proyecto existente.
            let dateToday = date 
            if (date === "" | date === undefined){
                dateToday = Date.now(); 
            }
            
            let reasonAdd = "SUSPENDIDA";
            if (reason !== ""){
                reasonAdd = reason;
            };
            
            // iterar por cada estapa, actividades y tareas asignadas y a las "ACTIVA", cambiar por "SUSPENDIDA"
            stages =await Activity.find({projectId:id});
            console.log("encontre estas etapas:",stages)
            for (let index = 0; index < stages.length; index++) {
                console.log("analizo actividad:",stages[index]._id )
                //verifico estado este activa
                if (stages[index].status === "ACTIVA"){//busco sus actividades
                    activitys = await Activity.find({projectId:id,stageId:stages[index]._id});
                    console.log("encontre estas actividades:",activitys)
                    for (let index = 0; index < activitys.length; index++) {
                        console.log("analizo actividad:",activitys[index]._id )
                        //verifico estado este ACTIVA
                        if (activitys[index].status === "ACTIVA"){//busco sus tareas 
                            tasks = await ActivityByTask.find({projectId:id.projectId,stageId:stages[index]._id,activityId:activitys[index]._id});
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

                            //actualizo estado a SUSPENDIDA de la actividad
                            let posLastHistoryActivity = activitys[index].history.length - 1;        
            
                            let idLastHistoryActivity = activitys[index].history[posLastHistoryActivity]._id
                
                            await Activity.findOneAndUpdate({_id: activitys[index]._id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
                            
                            await Activity.findOneAndUpdate({_id: activitys[index]._id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});       
    
                        }
                    }
                    //actualizo estado a SUSPENDIDA de la etapa
                    let posLastHistoryStage = stages[index].history.length - 1;        
        
                    let idLastHistoryStage = stages[index].history[posLastHistoryStage]._id;        
        
                    await Stage.findOneAndUpdate({_id: stages[index]._id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await Stage.findOneAndUpdate({_id: stages[index]._id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
        
                }                
            }

            //Cambiar estado del proyecto a "SUSPENDIDO" y generar historial. Agendar "quien" lo suspende
            
            let posLastHistoryProject = project.history.length - 1;        
        
            let idLastHistoryProject = project.history[posLastHistoryProject]._id

            await Project.findOneAndUpdate({_id: id,"history._id":idLastHistoryProject}, {$set:{"history.$.dateDown":dateToday}});
            
            await Project.findOneAndUpdate({_id: id}, {$set:{status:"SUSPENDIDO"},$push: { history: {status:"SUSPENDIDO",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            res.json({msg: 'Proyecto suspendido'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});

// @route POST api/project/reactivate
// @desc  REACTIVA un proyecto segun id
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
        let project = await Project.findById(id);
        if(!project){
            return res.status(404).json({errors: [{msg: "El Proyecto no existe."}]});
        }else{ //proyecto existente.
            if(!(project.status === "ACTIVO")){// SOLO REACTIVO SI EL PROYECTO ESTÁ ACTIVO
                return res.status(404).json({errors: [{msg: "El proyecto no es encuentra Suspendido para poder reactivarlo"}]});
            }
            
            // iterar por cada estapa, actividades y tareas asignadas y a las "SUSPENDIDA", cambiar por "ACTIVA"
            let dateToday = date 
            if (date === "" | date === undefined){
                dateToday = Date.now(); 
            }

            let reasonAdd = "REACTIVADA";
            stages =await Activity.find({projectId:id});
            console.log("encontre estas etapas:",stages)
            for (let index = 0; index < stages.length; index++) {
                console.log("analizo actividad:",stages[index]._id )
                //verifico estado este suspendida
                if (stages[index].status === "SUSPENDIDA"){//busco sus actividades
                    activitys = await Activity.find({projectId:id,stageId:stages[index]._id});
                    console.log("encontre estas actividades:",activitys)
                    for (let index = 0; index < activitys.length; index++) {
                        console.log("analizo actividad:",activitys[index]._id )
                        //verifico estado este suspendida
                        if (activitys[index].status === "SUSPENDIDA"){//busco sus tareas 
                            tasks = await ActivityByTask.find({projectId:id.projectId,stageId:stages[index]._id,activityId:activitys[index]._id});
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

                            //actualizo estado a activo de la actividad
                            let posLastHistoryActivity = activitys[index].history.length - 1;        
            
                            let idLastHistoryActivity = activitys[index].history[posLastHistoryActivity]._id
                
                            await Activity.findOneAndUpdate({_id: activitys[index]._id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
                            
                            await Activity.findOneAndUpdate({_id: activitys[index]._id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});       
    
                        }
                    }
                    //actualizo estado a activo de la etapa
                    let posLastHistoryStage = stages[index].history.length - 1;        
        
                    let idLastHistoryStage = stages[index].history[posLastHistoryStage]._id;        
        
                    await Stage.findOneAndUpdate({_id: stages[index]._id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await Stage.findOneAndUpdate({_id: stages[index]._id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
        
                }                
            }

            //Cambiar estado del proyecto a "ACTIVA" y generar historial. Agendar "quien" lo activa
            
            let posLastHistoryProject = project.history.length - 1;        
        
            let idLastHistoryProject = project.history[posLastHistoryProject]._id

            await Project.findOneAndUpdate({_id: id,"history._id":idLastHistoryProject}, {$set:{"history.$.dateDown":dateToday}});
            
            await Project.findOneAndUpdate({_id: id}, {$set:{status:"ACTIVO"},$push: { history: {status:"ACTIVO",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

            res.json({msg: 'Proyecto activado'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route POST api/project/changeLider
// @desc  Cambia lider de un proyecto 
// @access Public
router.post('/changeLider', [
    check('id', 'Id es requerido').not().isEmpty(),
    check('idLider', 'El id del Lider es requerido').not().isEmpty(),
    check('reason',"La razón es necesario").not().isEmpty(),
], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.body.id;
    const idLider = req.body.idLider;
    const reason = req.body.reason;
    try {

        let project = await Project.findById(id);
        if(!project){
            return res.status(404).json({errors: [{msg: "El Proyecto no existe."}]});
        }else{ //proyecto existente.
            
            let posLastHistoryLiderProject = project.historyLiderProject.length - 1;        
        
            let idLastHistoryLiderProject = project.historyLiderProject[posLastHistoryLiderProject]._id

            let dateToday = Date.now();  
            
            let reasonAdd = "-";
            if (reason !== ""){
                reasonAdd = reason;
            };

            await Project.findOneAndUpdate({_id: id,"historyLiderProject._id":idLastHistoryLiderProject}, {$set:{"historyLiderProject.$.dateDown":dateToday,"historyLiderProject.$.status":"INACTIVO", "historyLiderProject.$.reason":reasonAdd}});
            
            await Project.findOneAndUpdate({_id: id}, {$set:{},$push: { historyLiderProject: {status:"ACTIVO",dateUp:dateToday,liderProject:idLider}}});

            res.json({msg: 'Lider de proyecto cambiado'});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});
module.exports = router;