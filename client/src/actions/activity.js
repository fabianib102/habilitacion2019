import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_ACTIVITY,
    ERROR_ACTIVITY,
    DELETE_ACTIVITY,
    ERROR_DELETE_ACTIVITY
} from './types';
import { getAllStage } from './stage';
import { getAllTask } from './task';



//obtiene todas las etapas
export const getAllActivity = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/activity/getAll');
        dispatch({
            type: GET_ACTIVITY,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_ACTIVITY,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//Borra la actividad segun un id
export const deleteActivityById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/activity/delete', body, config);

        dispatch({
            type: DELETE_ACTIVITY,
            payload: res.data
        });

        dispatch(getAllStage());
        dispatch(getAllActivity());
        dispatch(getAllTask());

        dispatch(setAlert('La actividad fue dado de baja correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_ACTIVITY
        })
        
    }

}


