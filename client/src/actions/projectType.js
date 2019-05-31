import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_PROJECT_TYPE,
    ERROR_PROJECT_TYPE,
    INSERT_PROJECT_TYPE,
    ERROR_INSERT_PROJECT_TYPE
} from './types';

export const getAllProjectType = () => async dispatch => {

    try {
        
        const res = await axios.get('api/proyect-type/getAll');
        dispatch({
            type: GET_PROJECT_TYPE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_PROJECT_TYPE,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}


//Register project type
export const registerProjectType = ({ name, description, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description});

    try {

        const res = await axios.post('/api/proyect-type', body, config);

        dispatch({
            type: INSERT_PROJECT_TYPE,
            payload: res.data
        });

        dispatch(setAlert('El tipo de proyecto fue creado correctamente', 'success'));

        history.push('/admin-project-type');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_PROJECT_TYPE
        })
    }

}



