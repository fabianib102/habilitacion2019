import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_STAGE,
    ERROR_STAGE,
    INSERT_STAGE,
    ERROR_INSERT_STAGE,
    EDIT_STAGE,
    ERROR_EDIT_STAGE,
    DELETE_STAGE,
    ERROR_DELETE_STAGE
} from './types';
import { getAllActivity } from './activity';
import { getAllTask } from './task';

//Insertar una nueva etapa
export const registerStage = ({projectId, name, description, startDateProvide, endDateProvide}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId, name, description, startDateProvide, endDateProvide});

    try {

        const res = await axios.post('/api/stage', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });
        
        dispatch(getFilterStage(projectId));

        //dispatch(getAllStage());

        dispatch(setAlert('Etapa creada correctamente', 'success'));
        
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


// Obtiene los datos de una etapa según un id
export const getFilterStage = idProject => async dispatch => {

    try {
        
        const res = await axios.get(`/api/stage/getFilter/${idProject}`);
        dispatch({
            type: GET_STAGE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_STAGE,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}


//edita una etapa
export const editStage = ({projectId, idStage, name, description, startDateProvide, endDateProvide}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idStage, name, description, startDateProvide, endDateProvide});

    try {

        const res = await axios.post('/api/stage/edit', body, config);

        dispatch({
            type: EDIT_STAGE,
            payload: res.data
        });

        dispatch(getFilterStage(projectId));

        dispatch(setAlert('La etapa fue modificada correctamente', 'success'));

    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_STAGE
        })
    }

}



//Insertar una nueva actividad
export const registerActivity = ({projectId, stageId, name, description, startDateProvide, endDateProvide}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId, stageId, name, description, startDateProvide, endDateProvide});

    try {

        const res = await axios.post('/api/activity', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });
        
        dispatch(getFilterStage(projectId));

        //dispatch(getAllStage());

        dispatch(setAlert('Actividad creada correctamente', 'success'));
        
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


//Insertar una nueva tarea segun una actividad
export const registerTask = ({projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask});

    try {

        const res = await axios.post('/api/stage/task', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });
        
        //dispatch(getFilterStage(projectId));
        //dispatch(getAllStage());
        dispatch(getFilterStage(projectId));
        dispatch(setAlert('Tarea creada correctamente', 'success'));
        
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



//Borra una tarea segun una actividad
export const deleteTaskById = ({projectId, idTask}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idTask});

    try {

        const res = await axios.post('/api/stage/task/delete', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });

        dispatch(getFilterStage(projectId));
        dispatch(setAlert('Tarea eliminada correctamente', 'success'));
        
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



//Edita una nueva tarea segun una actividad
export const editTaskById = ({projectId, idTask, description, startDateProvideTask, endDateProvideTask}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idTask, description, startDateProvideTask, endDateProvideTask});


    try {

        const res = await axios.post('/api/stage/task/edit', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });

        dispatch(getFilterStage(projectId));
        dispatch(setAlert('Tarea modificada correctamente', 'success'));
        
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




//Edita actividad
export const editActivityById = ({projectId, idActivity, description, startDateProvide, endDateProvide}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idActivity, description, startDateProvide, endDateProvide});


    try {

        const res = await axios.post('/api/activity/edit', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });

        dispatch(getFilterStage(projectId));
        dispatch(setAlert('Actividad modificada correctamente', 'success'));
        
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

//obtiene todas las etapas
export const getAllStage = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/stage/getAll');
        dispatch({
            type: GET_STAGE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_STAGE,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}


//Borra la etapa segun un id
export const deleteStageById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/stage/delete', body, config);

        dispatch({
            type: DELETE_STAGE,
            payload: res.data
        });

        dispatch(getAllStage());
        dispatch(getAllActivity());
        dispatch(getAllTask());

        dispatch(setAlert('La etapa fue dado de baja correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_STAGE
        })
        
    }

}


//Reactiva la etapa segun un id
export const reactiveStageById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/stage/reactive', body, config);

        dispatch({
            type: DELETE_STAGE,
            payload: res.data
        });

        dispatch(getAllStage());

        dispatch(setAlert('La etapa fue re activada correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_STAGE
        })
        
    }

}
