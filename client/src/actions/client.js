import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_CLIENT,
    ERROR_GET_CLIENT,
    INSERT_CLIENT,
    ERROR_INSERT_CLIENT,
    DELETE_CLIENT,
    ERROR_DELETE_CLIENT
} from './types';

export const getAllClient = () => async dispatch => {

    try {
        
        const res = await axios.get('api/client/getAll');
        dispatch({
            type: GET_CLIENT,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_CLIENT,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}


//Register client
export const registerClient = ({ name, cuil, condition, address, email, phone, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, cuil, condition, address, email, phone});

    try {

        const res = await axios.post('/api/client', body, config);

        dispatch({
            type: INSERT_CLIENT,
            payload: res.data
        });

        dispatch(setAlert('El cliente fue creado correctamente', 'success'));

        history.push('/admin-client');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_CLIENT
        })
    }

}


//Borra el usuario según ell email
export const deleteClientById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/client/delete', body, config);

        dispatch({
            type: DELETE_CLIENT,
            payload: res.data
        });

        dispatch(getAllClient());

        dispatch(setAlert('El cliente fue dado de baja correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_CLIENT
        })
        
    }

}


//reactiva el cliente según el id
export const reactiveClientById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/client/reactive', body, config);

        dispatch({
            type: DELETE_CLIENT,
            payload: res.data
        });

        dispatch(getAllClient());

        dispatch(setAlert('El cliente fue re activado exitosamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_CLIENT
        })
        
    }

}

