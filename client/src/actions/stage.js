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

//obtiene todas las etapas
export const getAllStage = () => async dispatch => {

    try {
        
        const res = await axios.get('api/stage/getAll');
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

//Insertar una nueva etapa
export const registerStage = ({ name, description, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description});

    try {

        const res = await axios.post('/api/stage', body, config);

        dispatch({
            type: INSERT_STAGE,
            payload: res.data
        });

        dispatch(setAlert('Etapa creada correctamente', 'success'));

        history.push('/admin-stage');
        
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

//edita una etapa
export const editStage = ({idStage, name, description, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idStage, name, description});

    try {

        const res = await axios.post('/api/stage/edit', body, config);

        dispatch({
            type: EDIT_STAGE,
            payload: res.data
        });

        dispatch(setAlert('La etapa fue modificada correctamente', 'success'));

        history.push('/admin-stage');
        
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


//Borra la etapa segun un id
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
