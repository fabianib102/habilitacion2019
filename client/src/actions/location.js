import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_LOCATION,
    ERROR_GET_LOCATION,
    INSERT_LOCATION,
    ERROR_INSERT_LOCATION,
    DELETE_LOCATION,
    ERROR_DELETE_LOCATION,
    EDIT_LOCATION,
    ERROR_EDIT_LOCATION
} from './types';

import {getAllProvince} from './province';

//obtiene todas las localidades
export const getAllLocation = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/location/getAll');
        dispatch({
            type: GET_LOCATION,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_LOCATION,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//registra una localidad
export const registerLocation = ({ name, idProvince}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, idProvince});

    try {

        const res = await axios.post('/api/location', body, config);

        dispatch({
            type: INSERT_LOCATION,
            payload: res.data
        });

        dispatch(getAllLocation());

        dispatch(setAlert('La localidad fue creada correctamente', 'success'));

        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_LOCATION
        })
    }

}

//Borra la localidad según el id
export const deleteLocationById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/location/delete', body, config);

        dispatch({
            type: DELETE_LOCATION,
            payload: res.data
        });

        dispatch(getAllLocation());
        dispatch(getAllProvince());


        dispatch(setAlert('La localidad fue eliminado correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_LOCATION
        })
        
    }

}


//edita una localidad
export const editLocationById = ({name, idLocation}) => async dispatch => {
    
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, idLocation});

    try {

        const res = await axios.post('/api/location/edit', body, config);

        dispatch({
            type: EDIT_LOCATION,
            payload: res.data
        });

        dispatch(getAllLocation());

        dispatch(setAlert('La localidad fue modificada correctamente', 'success'));
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_LOCATION
        })
    }

}