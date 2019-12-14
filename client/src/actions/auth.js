import axios from 'axios';
import {setAlert} from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    RESET_SUCCESS,
    RESET_FAIL
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Cargar usuario
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try {

        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data 
        });
        
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }

}

//registrar usuario
export const register = ({ name, surname, rol, identifier, email, pass,isUserRoot }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, surname, rol,identifier, email, pass,isUserRoot});

    try {

        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
        
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }

}

//Login Usuario
export const login = (email, pass) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, pass});

    try {

        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
        
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }

}

// Logout 
export const logout = () => dispatch => {
    dispatch({ type: LOGOUT })
}


//RESETEAR LA CONTRASELA DE UN usuario
export const resetPass = ({ idUser, pass,passAct,firstConection,history}) => async dispatch => {
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

        history.push('/admin-user');

        dispatch(setAlert('la contraseña fué cambiada exitodamente', 'success'));
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