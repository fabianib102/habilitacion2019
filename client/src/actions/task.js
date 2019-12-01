import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_TASK,
    ERROR_TASK,
    INSERT_TASK,
    ERROR_INSERT_TASK,
    DELETE_TASK,
    ERROR_DELETE_TASK,
    EDIT_TASK,
    ERROR_EDIT_TASK,
    GET_TASK_LIDER,
    ERROR_GET_TASK_LIDER
} from './types';

//obtiene todas las tareas
export const getAllTask = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/task/getAll');
        dispatch({
            type: GET_TASK,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_TASK,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//Insertar una nueva tarea
export const registerTask = ({ name, description, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description});

    try {

        const res = await axios.post('/api/task', body, config);

        dispatch({
            type: INSERT_TASK,
            payload: res.data
        });

        dispatch(setAlert('Tarea creada correctamente', 'success'));

        history.push('/admin-task');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_TASK
        })
    }

}

//Borra la tarea según el id
export const deleteTaskById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/task/delete', body, config);

        dispatch({
            type: DELETE_TASK,
            payload: res.data
        });

        dispatch(getAllTask());

        dispatch(setAlert('La tarea fue eliminado correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_TASK
        })
        
    }

}

//edita una tarea
export const editTask = ({name, description, idTask, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description, idTask});

    try {

        const res = await axios.post('/api/task/edit', body, config);

        dispatch({
            type: EDIT_TASK,
            payload: res.data
        });

        dispatch(setAlert('La tarea fue modificada correctamente', 'success'));

        history.push('/admin-task');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_TASK
        })
    }

}

//obtiene todas las tareas
export const getTasksByLeader = (idUser) => async dispatch => {

    try {
        
        const res = await axios.get(`/api/task/getAllByLeader/${idUser}`);
        dispatch({
            type: GET_TASK_LIDER,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_TASK_LIDER,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}