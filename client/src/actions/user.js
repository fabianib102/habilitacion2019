import axios from 'axios';
import {setAlert} from './alert';
import {logout} from './auth';
import {
    GET_USERS,
    USERS_ERROR,
    USERS_REGISTER,
    USERS_REGISTER_ERROR,
    USERS_DELETE,
    USERS_DELETE_ERROR,
    GET_DETAIL_USER,
    ERROR_GET_DETAIL_USER,
    EDIT_USER,
    ERROR_EDIT_USER,
    GET_USER_ACTIVE,
    ERROR_GET_USER_ACTIVE,
    GET_USER_TASK,
    ERROR_GET_USER_TASK,
    RESET_SUCCESS,
    RESET_FAIL
} from './types';

export const getAllUsers = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/users/getAll');
        dispatch({
            type: GET_USERS,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: USERS_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//Registro usuario
export const registerUser = ({name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, pass, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, pass});

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
export const deleteUserByEmail = (email,reason) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email,reason});

    try {

        const res = await axios.post('/api/users/delete', body, config);

        dispatch({
            type: USERS_DELETE,
            payload: res.data
        });

        dispatch(getAllUsers());

        dispatch(setAlert('El usuario fue dado de baja correctamente', 'success'));
        
        
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

// Obtiene los datos de un usuario según un id
export const getDetailUser = id => async dispatch => {

    try {
        
        const res = await axios.get(`/api/users/getUserById/${id}`);
        dispatch({
            type: GET_DETAIL_USER,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_DETAIL_USER,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//edita un Usuario
export const editUser = ({name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, idUser, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, idUser});

    try {

        const res = await axios.post('/api/users/edit', body, config);

        dispatch({
            type: EDIT_USER,
            payload: res.data
        });

        dispatch(setAlert('El usuario fue modificado correctamente', 'success'));

        history.push('/admin-user');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_USER
        })
    }

}

//reactiva el usuario según ell email
export const reactiveUserByEmail = (email) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email});

    try {

        const res = await axios.post('/api/users/reactive', body, config);

        dispatch({
            type: USERS_DELETE,
            payload: res.data
        });

        dispatch(getAllUsers());

        dispatch(setAlert('El usuario fue activado exitosamente', 'success'));
        
        
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

// obtiene usuarios activos
export const getAllUsersActive = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/users/getAllActive');
        dispatch({
            type: GET_USER_ACTIVE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_USER_ACTIVE,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}


// obtiene usuarios activos
export const getTaskByUser = (idUser) => async dispatch => {

    try {
        
        const res = await axios.get(`/api/users/relationTask/${idUser}`);
        dispatch({
            type: GET_USER_TASK,
            payload: res.data
        });
    } catch (err) {

        dispatch({

            type: ERROR_GET_USER_TASK,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//RESETEAR LA CONTRASELA DE UN usuario
export const changePass = ({ idUser, pass,passAct,firstConection,history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idUser, pass,passAct,firstConection});

    try {

        const res = await axios.post('/api/users/resetPass', body, config);

        dispatch({
            type: RESET_SUCCESS,
            payload: res.data
        });

        dispatch(logout());

        dispatch(setAlert('La contraseña fué cambiada exitodamente, vuelva a iniciar sesión con sus nuevas credenciales.', 'success'));
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: RESET_FAIL
        })
    }

}