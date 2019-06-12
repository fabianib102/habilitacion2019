import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_TASK,
    ERROR_TASK,
    INSERT_TASK,
    ERROR_INSERT_TASK
} from './types';

export const getAllTask = () => async dispatch => {

    try {
        
        const res = await axios.get('api/task/getAll');
        dispatch({
            type: GET_TASK,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_TASK,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}


//Insertar una nueva tarea
export const registerTask = ({ name, description, startDate, endDate, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description, startDate, endDate});

    try {

        const res = await axios.post('/api/task', body, config);

        dispatch({
            type: INSERT_TASK,
            payload: res.data
        });

        dispatch(setAlert('Tarea creada correctamente', 'success'));

        history.push('/proyect');
        
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