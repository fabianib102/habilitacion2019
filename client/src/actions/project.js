import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROJECT,
    PROJECT_ERROR,
    USERS_REGISTER,
    USERS_REGISTER_ERROR,
    INSERT_STAGE,
    ERROR_INSERT_STAGE,
    EDIT_PROJECT,
    ERROR_EDIT_PROJECT,
    DELETE_PROJECT,
    ERROR_DELETE_PROJECT,
    REACTIVATE_PROJECT,
    ERROR_REACTIVATE_PROJECT,
    DETAIL_PROJECT,
    ERROR_DETAIL_PROJECT,
    GET_RELATION,
    ERROR_GET_RELATION,    
    INSERT_DEDICATION,
    ERROR_INSERT_DEDICATION,
    DELETE_RELATION_TASK,
    ERROR_DELETE_RELATION_TASK,
    GET_PROJECT_SIMPLE,
    ERROR_GET_PROJECT_SIMPLE,
    GET_PROJECTS_LIDER,
    ERROR_GET_PROJECTS_LIDER,
    GET_PROJECT_REDUCED,
    ERROR_GET_PROJECT_REDUCED,
    GET_PROJECT_ALLINFO,
    ERROR_GET_PROJECT_ALLINFO,
    GET_CLIENT_REDUCED,
    ERROR_GET_CLIENT_REDUCED
} from './types';
import { getTaskByUser } from './user';
import { terminateTaskById } from './stage';


//obtiene todos los proyectos CON DATOS EXTRAS
export const getAllProject = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/project/getAll');
        dispatch({
            type: GET_PROJECT,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: PROJECT_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//obtiene todos los proyectos SIMPLIFICADO
export const getAllProjectSimple = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/project/getAllProject');
        dispatch({
            type: GET_PROJECT_SIMPLE,
            payload: res.data
        });


    } catch (err) {

        dispatch({
            type: ERROR_GET_PROJECT_SIMPLE,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}


//Registro un proyecto
export const registerProject = ({name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, riskId, teamId, clientId, agentId,liderProject, idUserCreate, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
                   
    const body = JSON.stringify({name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, listRisk:riskId, teamId, clientId, agentId,liderProject,idUserCreate});

    try {

        const res = await axios.post('/api/project', body, config);

        dispatch({
            type: USERS_REGISTER,
            payload: res.data
        });

        dispatch(setAlert('El proyecto fue creado correctamente', 'success'));        
        // history.push('/admin-project');
        dispatch(getAllProject());
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: USERS_REGISTER_ERROR
        })
    }

}

//edita un proyecto (Datos básicos sin riesgos asociados)
export const editProject = ({ name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, teamId, clientId, agentId,liderProject, idProject, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, teamId, clientId, agentId,liderProject,idProject, history});

    try {

        const res = await axios.post('/api/project/edit', body, config);

        dispatch({
            type: EDIT_PROJECT,
            payload: res.data
        });

        dispatch(setAlert('El proyecto fue modificado correctamente', 'success'));

        history.push('/admin-project');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_PROJECT
        })
    }

}


//Borra el proyecto físicamente según el id
export const deleteProjectById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/project/delete', body, config);

        dispatch({
            type: DELETE_PROJECT,
            payload: res.data
        });

        dispatch(getAllProject()); 

        dispatch(setAlert('El projecto fue dado de baja correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_PROJECT
        })
        
    }

}

//Cancela el proyecto según el id
export const cancelProjectById = (id, idUserCreate,reason) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({id,idUserCreate,reason});

    try {

        const res = await axios.post('/api/project/cancel', body, config);

        dispatch({
            type: DELETE_PROJECT,
            payload: res.data
        });

        // dispatch(getAllProject()); 
        dispatch(getProjectByLider(idUserCreate));

        dispatch(setAlert('El projecto fue cancelado correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_PROJECT
        })
        
    }

}

//Reactiva el proyecto según el id
export const reactivateProjectById = (id, idUserCreate) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({id, idUserCreate});

    try {

        const res = await axios.post('/api/project/reactivate', body, config);

        dispatch({
            type: REACTIVATE_PROJECT,
            payload: res.data
        });

        // dispatch(getAllProject()); 
        dispatch(getProjectByLider(idUserCreate));

        dispatch(setAlert('El projecto fue reactivado correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_REACTIVATE_PROJECT
        })
        
    }

}

//sUSPENDE el proyecto según el id
export const suspenseProjectById = (id, idUserCreate,reason) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id,idUserCreate,reason});

    try {

        const res = await axios.post('/api/project/suspense', body, config);

        dispatch({
            type: DELETE_PROJECT,
            payload: res.data
        });

        // dispatch(getAllProject()); 
        dispatch(getProjectByLider(idUserCreate));

        dispatch(setAlert('El projecto fue suspendido correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_PROJECT
        })
        
    }

}


//Cambia el lider de proyecto
export const liderProjectById = (id, idLider, reason) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id, idLider, reason});

    try {

        const res = await axios.post('/api/project/changeLider', body, config);

        dispatch({
            type: EDIT_PROJECT,
            payload: res.data
        });

        dispatch(getAllProject()); 

        dispatch(setAlert('El Lider de Proyecto se cambió correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_PROJECT
        })
        
    }

}

//Insertar una nueva etapa
export const registerStage = ({projectId, name, description, startDateProvide, endDateProvide, startDate, endDate}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId, name, description, startDateProvide, endDateProvide, startDate, endDate});

    try {

        const res = await axios.post('/api/stage', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });

        dispatch(setAlert('Etapa creada correctamente', 'success'));
        getAllProject();
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_STAGE
        })
    }

}


///--------

//Obtiene los datos de un proyecto determinado
export const detailProjectById = (idProject) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({idProject});

    try {
        
        const res = await axios.get(`/api/project/detailProject/${idProject}`, body, config);

        dispatch({
            type: DETAIL_PROJECT,
            payload: res.data
        });

        //dispatch(setAlert('Relación agregada correctamente', 'success'));
        //getAllProject();
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DETAIL_PROJECT
        })
        
    }

}


//Realiza la relacion entre las tareas y los usuarios

export const relationUserTask = ({projectId, stageId, activityId, taskId, assignedMembers, idResponsable, duration, date,idUserCreate,history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }    

    const body = JSON.stringify({projectId, stageId, activityId, taskId, assignedMembers, idResponsable, duration, date,idUserCreate});

    try {        
        const res = await axios.post('/api/project/relationTask', body, config);

        dispatch({
            type: GET_RELATION,
            payload: res.data
        });

        dispatch(setAlert('Asignación realizada correctamente', 'success'));
        // history.push({pathname:"/admin-project/project-activity/"+projectId.toString(),  state: { projectId: projectId }})
        dispatch(relationTaskById(projectId));
                
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_GET_RELATION
        })
        
    }

}



//Obtiene las relaciones entre las tareas y los usuarios
export const relationTaskById = (idProject) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({idProject});

    try {
        
        const res = await axios.get(`/api/project/getRelationTask/${idProject}`, body, config);

        dispatch({
            type: GET_RELATION,
            payload: res.data
        });
        
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_GET_RELATION
        })
        
    }

}


//Insertar una nueva dedicación de una tarea de un RRHH 
export const registerDedication = ({relationTaskId, date, hsJob,observation,idUserCreate}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({relationTaskId,date, hsJob,observation,idUserCreate});

    try {

        const res = await axios.post('/api/project/dedicationRelationTask', body, config);
        
        dispatch({
            type: INSERT_DEDICATION,
            payload: res.data
        });
        
        dispatch(getTaskByUser(idUserCreate));

        dispatch(setAlert('La dedicación fué añadida correctamente', 'success'));
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_DEDICATION
        })
    }

}


//Elimina una relacion de una tarea de un RRHH y su asignación
export const deleteRelationTask = ({projectId,taskId,relationId,date,reason,idUserCreate}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId,taskId,relationId,date,reason,idUserCreate});

    try {

        const res = await axios.post('/api/project/deleteRelationTask', body, config);               
        
        dispatch({
            type: DELETE_RELATION_TASK,
            payload: res.data
        });
        
        // dispatch(getAllTask());
        dispatch(relationTaskById(projectId));

        dispatch(setAlert('Se quitó la asignación de la tarea al RRHH exitosamente. La misma fué informada por email', 'success'));
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_RELATION_TASK
        })
    }

}

//Insertar una nueva dedicación de una tarea de un RRHH y finaliza la tarea
export const registerDedicationAndTerminate = ({relationTaskId,taskId, date, hsJob,observation,idUserCreate}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({relationTaskId,date, hsJob,observation,idUserCreate});

    try {

        const res = await axios.post('/api/project/dedicationRelationTask', body, config);
        
        dispatch({
            type: INSERT_DEDICATION,
            payload: res.data
        });
        dispatch(terminateTaskById({id:taskId,idUserCreate,date}))
        dispatch(getTaskByUser(idUserCreate));

        dispatch(setAlert('La dedicación fué añadida correctamente', 'success'));
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_DEDICATION
        })
    }

}


// obtiene usuarios activos
export const getProjectByLider = (idUser) => async dispatch => {

    try {
        
        const res = await axios.get(`/api/project/getRelationProject/${idUser}`);
        dispatch({
            type: GET_PROJECTS_LIDER,
            payload: res.data
        });
    } catch (err) {

        dispatch({

            type: ERROR_GET_PROJECTS_LIDER,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}


//obtiene la info de los proyectos reducido
// export const getAllProjectReduced = (idLeader) => async dispatch => {

//     try {
        
//         const res = await axios.get(`/api/project/getListProjectReduced/${idLeader}`);
//         dispatch({
//             type: GET_PROJECT_REDUCED,
//             payload: res.data
//         });


//     } catch (err) {

//         dispatch({
//             type: ERROR_GET_PROJECT_REDUCED,
//             payload: {msg: err.response.statusText, status: err.response.status}
//         })
//     }

// }

//obtiene la info de los proyectos reducido por cliente
export const getAllClientReduced = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/project/getListClient');

        dispatch({
            type: GET_CLIENT_REDUCED,
            payload: res.data
        });


    } catch (err) {

        dispatch({
            type: ERROR_GET_CLIENT_REDUCED,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//obtiene la info de los proyectos reducido por tipo de proyecto
export const getAllTypeProjectReduced = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/project/getListClient');

        dispatch({
            type: GET_CLIENT_REDUCED,
            payload: res.data
        });


    } catch (err) {

        dispatch({
            type: ERROR_GET_CLIENT_REDUCED,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//obtiene la info de un proyecto en particular completa
export const getAllDatasProject= (idProject) => async dispatch => {

    try {
        
        const res = await axios.get(`/api/project/getAllDatasProject/${idProject}`);
        dispatch({
            type: GET_PROJECT_ALLINFO,
            payload: res.data
        });


    } catch (err) {

        dispatch({
            type: ERROR_GET_PROJECT_ALLINFO,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//obtiene la info de los proyectos reducido por tipo de proyecto
export const getAllTeamReduced = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/project/getListTeam');

        dispatch({
            type: GET_CLIENT_REDUCED,
            payload: res.data
        });


    } catch (err) {
        dispatch({
            type: ERROR_GET_CLIENT_REDUCED,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}