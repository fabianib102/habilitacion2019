import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_TEAM,
    ERROR_GET_TEAM,
    INSERT_TEAM,
    ERROR_INSERT_TEAM,
    GET_TEAM_USERS,
    ERROR_GET_TEAM_USERS,
    USER_TEAM_DELETE,
    ERROR_USER_TEAM_DELETE,
    EDIT_TEAM,
    ERROR_EDIT_TEAM
} from './types';

//obtiene todos los equipos
export const getAllTeam = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/team/getAll');
        dispatch({
            type: GET_TEAM,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: ERROR_GET_TEAM,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//registra un nuevo equpo
export const registerTeam = ({ name, description, users, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description, users});

    try {

        const res = await axios.post('/api/team', body, config);

        dispatch({
            type: INSERT_TEAM,
            payload: res.data
        });

        dispatch(setAlert('El equipo fue creado correctamente', 'success'));

        history.push('/admin-team');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_TEAM
        })
    }

}

// Obtiene el listado de usuarios de un equipo
export const getTeamUser = () => async dispatch => {

    try {
        
        const res = await axios.get(`/api/team/getUserByTeamAll`);
        dispatch({
            type: GET_TEAM_USERS,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_TEAM_USERS,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

//Borra el usuario de un equipo
export const deleteUserTeam = (idTeam, idUser) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idTeam, idUser});

    try {

        const res = await axios.post('/api/team/deleteUserTeam', body, config);

        dispatch({
            type: USER_TEAM_DELETE,
            payload: res.data
        });

        dispatch(getAllTeam());

        dispatch(getTeamUser());

        dispatch(setAlert('El usuario fue dado de baja del equipo correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_USER_TEAM_DELETE
        })
        
    }

}

//reactiva un integrante de un equipo
export const reactiveUserTeam = (idTeam, idUser) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idTeam, idUser});

    try {

        const res = await axios.post('/api/team/reactiveUserTeam', body, config);

        dispatch({
            type: USER_TEAM_DELETE,
            payload: res.data
        });

        dispatch(getAllTeam());

        dispatch(getTeamUser());

        dispatch(setAlert('El usuario se reactivó correctamente al equipo', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_USER_TEAM_DELETE
        })
        
    }

}

//edita un equipo
export const editTeam = ({name, description, idTeam, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description, idTeam});

    try {

        const res = await axios.post('/api/team/edit', body, config);

        dispatch({
            type: EDIT_TEAM,
            payload: res.data
        });

        dispatch(setAlert('El equipo fue modificado correctamente', 'success'));

        history.push('/admin-team');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_TEAM
        })
    }

}


//agrega un rrhh a un equipo 
export const addUserTeam = (idTeam, idUser) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idTeam, idUser});

    try {

        const res = await axios.post('/api/team/addUserTeam', body, config);

        dispatch({
            type: USER_TEAM_DELETE,
            payload: res.data
        });

        dispatch(getAllTeam());

        dispatch(getTeamUser());

        dispatch(setAlert('El usuario se agregó correctamente al equipo', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_USER_TEAM_DELETE
        })
        
    }

}


//borra un equipo
export const deleteTeam = (idTeam) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idTeam});

    try {

        const res = await axios.post('/api/team/deleteTeam', body, config);

        dispatch({
            type: USER_TEAM_DELETE,
            payload: res.data
        });

        dispatch(getAllTeam());

        dispatch(getTeamUser());

        dispatch(setAlert('El equipo se dió de baja correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_USER_TEAM_DELETE
        })
        
    }

}


//borra un equipo
export const reactiveTeam = (idTeam) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idTeam});

    try {

        const res = await axios.post('/api/team/reactiveTeam', body, config);

        dispatch({
            type: USER_TEAM_DELETE,
            payload: res.data
        });

        dispatch(getAllTeam());

        dispatch(getTeamUser());

        dispatch(setAlert('El equipo se reactivó correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_USER_TEAM_DELETE
        })
        
    }

}



