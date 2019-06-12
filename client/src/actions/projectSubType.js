import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_PROJECT_SUBTYPE,
    ERROR_PROJECT_SUBTYPE,
    INSERT_PROJECT_SUBTYPE,
    ERROR_INSERT_PROJECT_SUBTYPE,
    DELETE_PROJECT_SUBTYPE,
    ERROR_DELETE_PROJECT_SUBTYPE
} from './types';


export const getAllProjectSubType = () => async dispatch => {

    try {
        
        const res = await axios.get('api/proyect-subtype/getAll');
        dispatch({
            type: GET_PROJECT_SUBTYPE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_PROJECT_SUBTYPE,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}


//Register project type
export const registerProjectSubType = ({ name, type, description, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, type, description});

    try {

        const res = await axios.post('/api/proyect-subtype', body, config);

        dispatch({
            type: INSERT_PROJECT_SUBTYPE,
            payload: res.data
        });

        dispatch(setAlert('El Subtipo de proyecto fue creado correctamente', 'success'));

        history.push('/admin-project-subtype');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_PROJECT_SUBTYPE
        })
    }

}


//Borra el subtipo de proyecto según el id
export const deleteProjectSubTypeById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/proyect-subtype/delete', body, config);

        dispatch({
            type: DELETE_PROJECT_SUBTYPE,
            payload: res.data
        });

        dispatch(getAllProjectSubType());

        dispatch(setAlert('El subtipo de proyecto fue eliminado correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_PROJECT_SUBTYPE
        })
        
    }

}