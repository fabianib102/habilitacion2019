import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROVINCE,
    ERROR_GET_PROVINCE,
    INSERT_PROVINCE,
    ERROR_INSERT_PROVINCE,
    DELETE_PROVINCE,
    ERROR_DELETE_PROVINCE,
    EDIT_PROVINCE,
    ERROR_EDIT_PROVINCE
} from './types';

//obtiene todas las provincias
export const getAllProvince = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/province/getAll');
        dispatch({
            type: GET_PROVINCE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_PROVINCE,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}


//registra una provincia
export const registerProvince = ({ name, location, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, location});

    try {

        const res = await axios.post('/api/province', body, config);

        dispatch({
            type: INSERT_PROVINCE,
            payload: res.data
        });

        dispatch(setAlert('La provincia y la localidad fueron creados correctamente', 'success'));

        history.push('/admin-province');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_PROVINCE
        })
    }

}


//Borra la provincia según el id
export const deleteProvinceById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/province/delete', body, config);

        dispatch({
            type: DELETE_PROVINCE,
            payload: res.data
        });

        dispatch(getAllProvince());

        dispatch(setAlert('La provincia y sus localidades fueron eliminadas correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_PROVINCE
        })
        
    }

}


//edita una provincia
export const editProvinceById = ({name, idProvince, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, idProvince});

    try {

        const res = await axios.post('/api/province/edit', body, config);

        dispatch({
            type: EDIT_PROVINCE,
            payload: res.data
        });

        dispatch(setAlert('La provincia fue modificada correctamente', 'success'));

        history.push('/admin-province');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_PROVINCE
        })
    }

}