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
    ERROR_DELETE_STAGE,
    REACTIVATE_STAGE,
    ERROR_REACTIVATE_STAGE,
    DELETE_TASK_ACTIVITY,
    ERROR_DELETE_TASK_ACTIVITY,
    REACTIVATE_TASK,
    ERROR_REACTIVATE_TASK,
    TERMINATE_TASK,
    ERROR_TERMINATE_TASK,
} from './types';
import { getAllActivity } from './activity';
import { getAllTask } from './task';

//Insertar una nueva etapa
export const registerStage = ({projectId, name, description, startDateProvide, endDateProvide,idUserCreate}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId, name, description, startDateProvide, endDateProvide, idUserCreate});

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
export const reactiveStageById = (id,idUserCreate,date) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id,idUserCreate,date});

    try {

        const res = await axios.post('/api/stage/reactivate', body, config);

        dispatch({
            type: REACTIVATE_STAGE,
            payload: res.data
        });

        dispatch(getAllStage());

        dispatch(setAlert('La etapa fue reactivada correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_REACTIVATE_STAGE
        })
        
    }

}


//Suspende la etapa según el id
export const suspenseStagetById = (id, idUserCreate,reason,date) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log(id, idUserCreate,reason)
    const body = JSON.stringify({id,idUserCreate,reason,date});

    try {

        const res = await axios.post('/api/stage/suspense', body, config);

        dispatch({
            type: DELETE_STAGE,
            payload: res.data
        });

        dispatch(getAllStage()); 

        dispatch(setAlert('La Etapa fué suspendida correctamente', 'success'));
        
        
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


//Insertar una nueva actividad
export const registerActivity = ({projectId, stageId, name, description, startDateProvide, endDateProvide,idUserCreate}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId, stageId, name, description, startDateProvide, endDateProvide,idUserCreate});

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

//Insertar una nueva tarea segun una actividad
export const registerTask = ({projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask, idUserCreate}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({projectId, stageId, activityId, taskId, name, description, startDateProvideTask, endDateProvideTask, idUserCreate});

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


//Reactiva la tarea de una actividad segun un id tarea, idUsuario que reactiva y la fecha en que se reactiva
export const reactiveTaskById = (id,idUserCreate,date) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id,idUserCreate,date});

    try {

        const res = await axios.post('/api/stage/task/reactivate', body, config);

        dispatch({
            type: REACTIVATE_TASK,
            payload: res.data
        });

        dispatch(getAllTask());

        dispatch(setAlert('La tarea fue reactivada correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_REACTIVATE_TASK
        })
        
    }

}


//Suspende la tarea de una actividad según el id de la tarea, el id del usuario que suspende, la razon y la fecha de suspencion
export const suspenseTaskById = (id, idUserCreate,reason,date) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log(id, idUserCreate,reason)
    const body = JSON.stringify({id,idUserCreate,reason,date});

    try {

        const res = await axios.post('/api/stage/task/suspense', body, config);

        dispatch({
            type: DELETE_TASK_ACTIVITY,
            payload: res.data
        });

        dispatch(getAllTask()); 

        dispatch(setAlert('La Tarea fué suspendida correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_TASK_ACTIVITY
        })
        
    }

}

//Termina la tarea de una actividad según el id de la tarea, el id del usuario que termina y la fecha en que se termina
export const terminateTaskById = (id,idUserCreate,date) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    const body = JSON.stringify({id,idUserCreate,date});

    try {

        const res = await axios.post('/api/stage/task/terminate', body, config);

        dispatch({
            type: TERMINATE_TASK,
            payload: res.data
        });

        dispatch(getAllTask()); 

        dispatch(setAlert('El Tarea se indicó como terminada exitosamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_TERMINATE_TASK
        })
        
    }

}
