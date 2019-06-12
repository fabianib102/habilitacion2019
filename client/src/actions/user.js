import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_USERS,
    USERS_ERROR,
    USERS_REGISTER,
    USERS_REGISTER_ERROR,
    USERS_DELETE,
    USERS_DELETE_ERROR
} from './types';

export const getAllUsers = () => async dispatch => {

    try {
        
        const res = await axios.get('api/users/getAll');
        dispatch({
            type: GET_USERS,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: USERS_ERROR,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}

//Register User
export const registerUser = ({name, surname, cuil, birth, address, rol, province, phone, email, pass, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, surname, cuil, birth, address, rol, province, phone, email, pass});

    try {

        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: USERS_REGISTER,
            payload: res.data
        });

        dispatch(setAlert('El usuario fue creado correctamente', 'success'));

        history.push('/admin-user');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: USERS_REGISTER_ERROR
        })
    }

}

//Borra el usuario según ell email
export const deleteUserByEmail = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email});

    try {

        const res = await axios.post('/api/users/delete', body, config);

        dispatch({
            type: USERS_DELETE,
            payload: res.data
        });

        dispatch(getAllUsers());

        dispatch(setAlert('El usuario fue eliminado correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: USERS_DELETE_ERROR
        })
        
    }

}
