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

const TaskByUser = require('../../models/TaskByUser');


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
            pro.startDate =  project[index].startDate;
            pro.endDate=  project[index].endDate;
            pro.status = project[index].status;
            pro.estimated_duration = project[index].estimated_duration;
            
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
            await Stage.deleteMany({projectId:id}, function (err) {
                if(err) console.log(err);
                console.log("Eliminada etapas exitosamente");
              });
            await Activity.deleteMany({projectId:id}, function (err) {
                if(err) console.log(err);
                console.log("Eliminada actividades exitosamente");
              });
            await ActivityByTask.deleteMany({projectId:id}, function (err) {
                if(err) console.log(err);
                console.log("Eliminada tereas exitosamente");
              });

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

            // iterar por cada estapa, actividades y tareas asignadas y cambiar por "CANCELADA"
            stages =await Stage.find({projectId:id});
            console.log("encontre estas etapas:",stages)
            for (let indexs = 0; indexs < stages.length; indexs++) {
                console.log("analizo actividad:",stages[indexs]._id )                
                activitys = await Activity.find({projectId:id,stageId:stages[indexs]._id});
                console.log("encontre estas actividades:",activitys)
                for (let indexa = 0; indexa < activitys.length; indexa++) {
                    console.log("analizo actividad:",activitys[indexa]._id )                                      
                    tasks = await ActivityByTask.find({projectId:id,stageId:stages[indexs]._id,activityId:activitys[indexa]._id});
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
                    let posLastHistoryActivity = activitys[indexa].history.length - 1;        
    
                    let idLastHistoryActivity = activitys[indexa].history[posLastHistoryActivity]._id
        
                    await Activity.findOneAndUpdate({_id: activitys[indexa]._id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await Activity.findOneAndUpdate({_id: activitys[indexa]._id}, {$set:{status:"CANCELADA"},$push: { history: {status:"CANCELADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});       
                   
                }
                //actualizo estado a CANCELADA de la etapa
                let posLastHistoryStage = stages[indexs].history.length - 1;        
    
                let idLastHistoryStage = stages[indexs].history[posLastHistoryStage]._id;        
    
                await Stage.findOneAndUpdate({_id: stages[indexs]._id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
                
                await Stage.findOneAndUpdate({_id: stages[indexs]._id}, {$set:{status:"CANCELADA"},$push: { history: {status:"CANCELADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
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
            stages =await Stage.find({projectId:id});
            console.log("encontre estas etapas:",stages)
            for (let indexs = 0; indexs < stages.length; indexs++) {
                console.log("analizo actividad:",stages[indexs]._id )
                //verifico estado este activa
                if (stages[indexs].status === "ACTIVA"){//busco sus actividades
                    activitys = await Activity.find({projectId:id,stageId:stages[indexs]._id});
                    console.log("encontre estas actividades:",activitys)
                    for (let indexa = 0; indexa < activitys.length; indexa++) {
                        console.log("analizo actividad:",activitys[indexa]._id )
                        //verifico estado este ACTIVA
                        if (activitys[indexa].status === "ACTIVA"){//busco sus tareas 
                            tasks = await ActivityByTask.find({projectId:id,stageId:stages[indexs]._id,activityId:activitys[indexa]._id});
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
                            let posLastHistoryActivity = activitys[indexa].history.length - 1;        
            
                            let idLastHistoryActivity = activitys[indexa].history[posLastHistoryActivity]._id
                
                            await Activity.findOneAndUpdate({_id: activitys[indexa]._id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
                            
                            await Activity.findOneAndUpdate({_id: activitys[indexa]._id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});       
    
                        }
                    }
                    //actualizo estado a SUSPENDIDA de la etapa
                    let posLastHistoryStage = stages[indexs].history.length - 1;        
        
                    let idLastHistoryStage = stages[indexs].history[posLastHistoryStage]._id;        
        
                    await Stage.findOneAndUpdate({_id: stages[indexs]._id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await Stage.findOneAndUpdate({_id: stages[indexs]._id}, {$set:{status:"SUSPENDIDA"},$push: { history: {status:"SUSPENDIDA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
        
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
            if(!(project.status === "SUSPENDIDO")){// SOLO REACTIVO SI EL PROYECTO ESTÁ ACTIVO
                return res.status(404).json({errors: [{msg: "El proyecto no es encuentra Suspendido para poder reactivarlo"}]});
            }
            
            // iterar por cada estapa, actividades y tareas asignadas y a las "SUSPENDIDA", cambiar por "ACTIVA"
            let dateToday = date 
            if (date === "" | date === undefined){
                dateToday = Date.now(); 
            }

            let reasonAdd = "REACTIVADA";
            stages =await Stage.find({projectId:id});
            console.log("encontre estas etapas:",stages)
            for (let indexs = 0; indexs < stages.length; indexs++) {
                console.log("analizo actividad:",stages[indexs]._id )
                //verifico estado este suspendida
                if (stages[indexs].status === "SUSPENDIDA"){//busco sus actividades
                    activitys = await Activity.find({projectId:id,stageId:stages[indexs]._id});
                    console.log("encontre estas actividades:",activitys)
                    for (let indexa = 0; indexa < activitys.length; indexa++) {
                        console.log("analizo actividad:",activitys[indexa]._id )
                        //verifico estado este suspendida
                        if (activitys[indexa].status === "SUSPENDIDA"){//busco sus tareas 
                            tasks = await ActivityByTask.find({projectId:id,stageId:stages[indexs]._id,activityId:activitys[indexa]._id});
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
                            let posLastHistoryActivity = activitys[indexa].history.length - 1;        
            
                            let idLastHistoryActivity = activitys[indexa].history[posLastHistoryActivity]._id
                
                            await Activity.findOneAndUpdate({_id: activitys[indexa]._id,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
                            
                            await Activity.findOneAndUpdate({_id: activitys[indexa]._id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});       
    
                        }
                    }
                    //actualizo estado a activo de la etapa
                    let posLastHistoryStage = stages[indexs].history.length - 1;        
        
                    let idLastHistoryStage = stages[indexs].history[posLastHistoryStage]._id;        
        
                    await Stage.findOneAndUpdate({_id: stages[indexs]._id,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await Stage.findOneAndUpdate({_id: stages[indexs]._id}, {$set:{status:"ACTIVA"},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
        
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



// @route GET api/project/detailProject
// @desc  obtiene detalles del proyecto segun id
// @access Public
router.get('/detailProject/:idProject' , async (req, res) => {
    try {        
        const idProject = req.params.idProject;
        let project = await Project.findById(idProject);
        
        //traigo integrantes
        let filterIntegrants = await UserByTeam.find({idTeam: project.teamId, status:"ACTIVO"});
                       
        let membersTeam = [];
        for (let index = 0; index < filterIntegrants.length; index++) {
            let mem = await User.findById(filterIntegrants[index].idUser);
            membersTeam.push({userId:filterIntegrants[index].idUser,name:mem.name,surname:mem.surname,idUser:mem._id, "assignated":null});
        }
        project.teamMember = membersTeam;
        
        res.json(project);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});




// @route POST api/project/relationTask
// @desc  Relaciona la tarea con el usuario (integrante del equipo que realiza tarea) 
// @access Public
router.post('/relationTask', [
    check('projectId', 'Id del proyecto es requerido').not().isEmpty(),
    check('stageId', 'Id de etapa es requerido').not().isEmpty(),
    check('activityId', 'Id de la actividad es requerido').not().isEmpty(),
    check('taskId', 'Id de la tarea es requerido').not().isEmpty(),
    check('idResponsable','Id del responsable de la Tarea').not().isEmpty(),
    check('duration', 'Duracion de la tarea es obligatoria').not().isEmpty(),
    check('assignedMembers', 'Debe seleccionar un RRHH para el equipo').isArray().not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty()

], async(req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {projectId, stageId, activityId, taskId, assignedMembers, idResponsable, duration, date,idUserCreate} = req.body;

    try {
        for (let index = 0; index < assignedMembers.length; index++) {
            let taskByUser = await TaskByUser.findOne({projectId, stageId, activityId, taskId, userId:assignedMembers[index][0]});
            if(taskByUser){
                return res.status(404).json({msg: "Existe un RRHH asignado a una Tarea."});
            }
        }
        // creamos relacion. Actualizamos estado de la tarea.
        let task = await ActivityByTask.findById(taskId);
        let dateToday = date 
        if (date === "" | date === undefined){
            dateToday = Date.now(); 
        }
        //actualizo historial de la tarea a asignada
        let reasonAdd = "ASIGNADA";   

        let posLastHistoryTask = task.history.length - 1;        
        
        let idLastHistoryTask = task.history[posLastHistoryTask]._id

        await ActivityByTask.findOneAndUpdate({_id: taskId,"history._id":idLastHistoryTask}, {$set:{"history.$.dateDown":dateToday}});
        await ActivityByTask.findOneAndUpdate({_id: taskId},{$set:{status:"ASIGNADA",duration:duration,idResponsable:idResponsable},$push: { history: {status:"ASIGNADA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
        
        //itero por cada RRHH y creo relacion a la tarea tarea
        //del item del arreglo-> [[id,fecha asignado]]
        for (let index = 0; index < assignedMembers.length; index++) {
            taskByUser = new TaskByUser({projectId, stageId, activityId, taskId, userId:assignedMembers[index][0], dateUpAssigned:assignedMembers[index][1]});
            await taskByUser.save();
            await ActivityByTask.findOneAndUpdate({_id: taskId},{$set:{},$push: { assigned_people: {userId:taskByUser._id}}});
        }
        
        //actualizo duracion de la actividad que compete la tarea
        let cantA = 0
        let activity = await Activity.findById(activityId);
        
        if (activity.estimated_duration === undefined | activity.estimated_duration === null){
            cantA = parseFloat(cantA) + parseFloat(duration)
        }else{
            cantA = parseFloat(activity.estimated_duration) + parseFloat(duration)
        }
        
        await Activity.findOneAndUpdate({_id: activityId}, {$set:{estimated_duration:cantA}});
        
        //actualizo duracin de la etapa que compete la tarea
        let cantS = 0
        let stage = await Stage.findById(stageId);
        
        if (stage.estimated_duration === undefined | stage.estimated_duration === null){
            cantS = parseFloat(cantS) + parseFloat(duration)
        }else{
            cantS = parseFloat(stage.estimated_duration) + parseFloat(duration)
        }
        
        await Stage.findOneAndUpdate({_id: stageId}, {$set:{estimated_duration:cantS}});

        //actualizo duracin deL PROYECTO que compete la tarea
        let cantP = 0
        let project = await Project.findById(projectId);
        
        if (project.estimated_duration === undefined | project.estimated_duration === null){
            cantP = parseFloat(cantP) + parseFloat(duration)
        }else{
            cantP = parseFloat(project.estimated_duration) + parseFloat(duration)
        }
        
        await Project.findOneAndUpdate({_id: project}, {$set:{estimated_duration:cantP}});

        return res.status(200).json({msg: 'El RRHH fué asignado correctamente.'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});



// @route GET api/project/getRelationTask
// @desc  obtiene detalles del proyecto segun id del proyecto
// @access Public
router.get('/getRelationTask/:idProject' , async (req, res) => {
    try {

        const idProject = req.params.idProject;

        let taskByUser = await TaskByUser.find({projectId: idProject});

        res.json(taskByUser);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});


// @route Post api/project/dedicationRelationTask
// @desc  Crea una dedicacion de un RRHH para una tarea de una actividad
// @access Private
router.post('/dedicationRelationTask', [
    // check('activityTaskId', 'El Id de la tarea de la actividad').not().isEmpty(),
    check('relationTaskId', 'El Id de la asignacion del RRHH a la tarea es requerido').not().isEmpty(),
    check('date', 'Fecha que se registra la dedicación es requerida').not().isEmpty(),
    check('hsJob', 'Hs dedicadas a la tarea es requerida').not().isEmpty(),
    // check('observation', 'Observación de la dedicación').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty()
    
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {relationTaskId, date, hsJob, observation, idUserCreate} = req.body;

    try {
        console.log("tengo->",relationTaskId, date, hsJob, observation, idUserCreate)
        let taskByUser = await TaskByUser.findById(relationTaskId);
        if(!taskByUser){
            return res.status(404).json({msg: "No Existe un RRHH asignado a la Tarea."});
        }
        let dateToday = date 
        if (date === "" | date === undefined){
            dateToday = Date.now(); 
        }
        //añado dedicacion
        let a =await TaskByUser.findOneAndUpdate({_id: relationTaskId}, {$set:{},$push: {dedications:{date:date,hsJob:hsJob,observation:observation}}});
        console.log("dedic",a)
        //cambiar estado de la tarea a ACTIVA
        let task = await ActivityByTask.findById(taskByUser.taskId);
        console.log("tarea:",task)
        let reasonAdd = "ACTIVA"; 
        if(task.status !== "ACTIVA"){// no estaba activa la tarea-> se cargan las primeras dedicaciones
            console.log("PRIMERA TAREA")
            let posLastHistoryTask = task.history.length - 1;        

            let idLastHistoryTask = task.history[posLastHistoryTask]._id

            await ActivityByTask.findOneAndUpdate({_id: taskByUser.taskId,"history._id":idLastHistoryTask}, {$set:{"history.$.dateDown":dateToday}});        
            if (task.startDate === undefined){
                await ActivityByTask.findOneAndUpdate({_id: taskByUser.taskId},{$set:{status:"ACTIVA",startDate:dateToday},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
            }          
        
            //realizar hacia arriba la activacion en cadena. Verificar de que si no está activa la actividad, ponerla activa y así sucesibvamente hasta proyecto
            //Verificar si es la primer tarea iniciada de la actividad
            tasks_activity = await ActivityByTask.find({projectId:task.projectId,stageId:task.stageId,activityId:task.activityId, status:"ACTIVA"});
            console.log("encontre estas tareas:",tasks_activity)
            if (tasks_activity.length > 1 ){ /// no es la primera tarea activa
                return res.json({msg: 'Dedicación cargada y cambiado estado de Tarea a ACTIVA'});
            }                

            console.log("debo actualizar actividad a ACTIVADA...")
            //es la primer tarea activa, actualizo estado de actividad a ACTIVA 
            let activity = await Activity.findById(task.activityId);            
            console.log("actividad a actualizar->",activity)

            if(activity.status !== "ACTIVA"){//es la primera actividad que se le cargan dedicacion a una de sus tareas
                console.log("PRIMERA ACTIVIDAD")
                let posLastHistoryActivity = activity.history.length - 1;        

                let idLastHistoryActivity = activity.history[posLastHistoryActivity]._id

                await Activity.findOneAndUpdate({_id: task.activityId,"history._id":idLastHistoryActivity}, {$set:{"history.$.dateDown":dateToday}});
                
                await Activity.findOneAndUpdate({_id: task.activityId}, {$set:{status:"ACTIVA", startDate:dateToday},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

                //Verificar si es la primera actividad activa de la etapa
                activitys_stage = await Activity.find({projectId:task.projectId,stageId:task.stageId, status:"ACTIVA"});
                console.log("encontre estas actividades:",activitys_stage)
                if (activitys_stage.length > 1){ /// no es la primera actividad activa
                    return res.json({msg: 'Dedicación cargada y cambiado estado de Tarea y Actividad a ACTIVA'});
                }                
            
                console.log("debo actualizar etapa a ACTIVA...")
                //es la primera ACTIVIDAD, actualizo estado de ETAPA a ACTIVA 
                let stage = await Stage.findById(task.stageId);
                console.log("etapa a actualizar->",stage)
                if(stage.status !== "ACTIVA"){//es la primera ETAPA que se le cargan dedicacion a una de sus tareas de una de sus actividades
                    console.log("PRIMERA ETAPA")
                    let posLastHistoryStage = stage.history.length - 1;        
                
                    let idLastHistoryStage = stage.history[posLastHistoryStage]._id

                    await Stage.findOneAndUpdate({_id: task.stageId,"history._id":idLastHistoryStage}, {$set:{"history.$.dateDown":dateToday}});
                    
                    await Stage.findOneAndUpdate({_id: task.stageId}, {$set:{status:"ACTIVA", startDate:dateToday},$push: { history: {status:"ACTIVA",dateUp:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});
                        
                    //Verificar si es la primer etapa activa del proyecto
                    stages_proyect = await Stage.find({projectId:task.projectId, status:"ACTIVA"});
                    console.log("encontre estas etapas:",stages_proyect)
                    if (stages_proyect.length > 1){ /// no es la primera etapa activa
                        return res.json({msg: 'Dedicación cargada y cambiado estado de Tarea y Actividades de la Etapa a ACTIVA'});
                    }                
                    console.log("debo actualizar proyecto a activo...")
                    //es la primer ETAPA, actualizo estado del PROYECTO a ACTIVO 
                    let project = await Project.findById(task.projectId);
                    console.log("PROYECTO a actualizar->",project)
                    if(project.status !== "ACTIVO"){//es la primera tarea con dedicaciones de un proyecto
                        console.log("SE ACTIVA PROYECTO")
                        let posLastHistoryProject = project.history.length - 1;        

                        let idLastHistoryProject = project.history[posLastHistoryProject]._id

                        await Project.findOneAndUpdate({_id: task.projectId,"history._id":idLastHistoryProject}, {$set:{"history.$.dateDown":dateToday}});
                        
                        await Project.findOneAndUpdate({_id: task.projectId}, {$set:{status:"ACTIVO", startDate:dateToday},$push: { history: {status:"ACTIVO",dateUp:dateToday,dateDown:dateToday,reason:reasonAdd,idUserChanged:idUserCreate}}});

                        return res.status(200).json({msg: 'Dedicación cargada exitosamente y cambiado el estado del proyecto a ACTIVO'});
                    }
                }
            }
        }
        return res.status(200).json({msg: 'Dedicación cargada a la tarea exitosamente'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});




// @route Post api/project/deleteRelationTask
// @desc  Elimina una relacion de una tarea con un RRHH (logicamente)
// @access Private
router.post('/deleteRelationTask', [
    check('relationId', 'El Id de la asignacion del RRHH a la tarea es requerido').not().isEmpty(),
    check('date', 'Fecha que se registra la dedicación').not().isEmpty(),
    check('idUserCreate', 'El Usuario no está autenticado').not().isEmpty()    
], 
async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({ errors: errors.array() });
    }

    const {relationId,date,reason,idUserCreate} = req.body;

    try { 
        relationTask = await TaskByUser.findById(relationId);
        console.log("busco relacion",relationTask)
        if(!relationTask){
            return res.status(404).json({msg: "No Existe larelación de la tarea con el RRHH."});
        }//existe relacion y la trato

        let dateToday = date 
        if (date === "" | date === undefined){
            dateToday = Date.now(); 
        }
        let reasonAdd = "-";
        if (reason !== ""){
            reasonAdd = reason;
        };

        await TaskByUser.findOneAndUpdate({_id: relationId}, {$set:{dateDownAssigned:dateToday,reason:reasonAdd,status:"DESASIGNADO",idUserChanged:idUserCreate}});

        return res.status(200).json({msg: 'Se quitó la asignación del RRHH a la tarea exitosamente'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});




// @route GET api/project/getRelationProject/:idLeader
// @desc  obtiene los proyecto según el id del lider 
// @access Public
router.get('/getRelationProject/:idLeader' , async (req, res) => {
    try {

        const idLeader = req.params.idLeader;

        let project = [];

        let projectbyLeader = await Project.find().sort({startDateExpected: 1})

        for (let index = 0; index < projectbyLeader.length; index++) {

            const element = projectbyLeader[index].historyLiderProject;
            // console.log(element)
            element.forEach(pro => {
                if(pro.liderProject === idLeader && pro.status === "ACTIVO"){
                    project.push(projectbyLeader[index]);
                }
            });
        }

        let listProjects = []
        for (let index = 0; index < project.length; index++) {
            let pro = {}
            //traigo datos del proyecto
            pro._id =  project[index]._id;
            pro.name =  project[index].name
            pro.description =  project[index].description;
            pro.startDateExpected =  project[index].startDateExpected;
            pro.endDateExpected =  project[index].endDateExpected;
            pro.startDate =  project[index].startDate;
            pro.endDate=  project[index].endDate;
            pro.status = project[index].status;
            pro.estimated_duration = project[index].estimated_duration;
            
            //trato historial
            var history = [];
            for (let i = 0; i < project[index].history.length; i++) {
                //busco usuario que cambio estado
                let per = await User.findById(project[index].history[i].idUserChanged);
                history.push({dateUp:project[index].history[i].dateUp,dateDown:project[index].history[i].dateDown,
                    status:project[index].history[i].status,reason:project[index].history[i].reason,
                    idUserChanged:project[index].history[i].idUserChanged,
                    nameUserchanged:per.name,
                    surnameUserchanged:per.surname,
                })
            }
            pro.history = history;
            
           //traigo cliente
           let client = await Client.findById(project[index].clientId);
           pro.client = {clientId:project[index].clientId,nameClient:client.name}  

            //traigo referente
            let agent = await Agent.findById(project[index].agentId);
            pro.agent = {agentId:project[index].agentId,nameAgent:agent.name, surnameAgent:agent.surname}

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

            //traigo representante            
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

        // console.log(listProjects)
        res.json(listProjects);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: ' + err.message);
    }

});




module.exports = router;