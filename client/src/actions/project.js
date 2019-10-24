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
    ERROR_EDIT_PROJECT
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