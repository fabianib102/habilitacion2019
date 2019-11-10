import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_ACTIVITY,
    ERROR_ACTIVITY,
    DELETE_ACTIVITY,
    ERROR_DELETE_ACTIVITY,
    REACTIVATE_ACTIVITY,
    ERROR_REACTIVATE_ACTIVITY
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

//Reactiva la actividad segun un id
export const reactiveActivityById = (id,idUserCreate) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id,idUserCreate});

    try {

        const res = await axios.post('/api/activity/reactivate', body, config);

        dispatch({
            type: REACTIVATE_ACTIVITY,
            payload: res.data
        });

        dispatch(getAllActivity());

        dispatch(setAlert('La etapa fue reactivada correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_REACTIVATE_ACTIVITY
        })
        
    }

}


//Suspende la actividad según el id
export const suspenseStagetById = (id, idUserCreate,reason) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log(id, idUserCreate,reason)
    const body = JSON.stringify({id,idUserCreate,reason});

    try {

        const res = await axios.post('/api/activity/suspense', body, config);

        dispatch({
            type: DELETE_ACTIVITY,
            payload: res.data
        });

        dispatch(getAllActivity()); 

        dispatch(setAlert('La Actividad fué suspendida correctamente', 'success'));
        
        
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
