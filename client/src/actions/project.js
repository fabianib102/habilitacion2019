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
    ERROR_REACTIVATE_PROJECT

} from './types';


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
        history.push('/admin-project');
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

//edita un projecto (Datos básicos sin riesgos asociados)
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


//Borra el projecto físicamente según el id
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

//Cancela el projecto según el id
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

        dispatch(getAllProject()); 

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

//Reactiva el projecto según el id
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

        dispatch(getAllProject()); 

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

//Cancela el projecto según el id
export const suspenseProjectById = (id, idUserCreate,reason) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log(id, idUserCreate,reason)
    const body = JSON.stringify({id,idUserCreate,reason});

    try {

        const res = await axios.post('/api/project/suspense', body, config);

        dispatch({
            type: DELETE_PROJECT,
            payload: res.data
        });

        dispatch(getAllProject()); 

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
    console.log("in",id, idLider)
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