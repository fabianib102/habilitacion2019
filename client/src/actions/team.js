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
    ERROR_USER_TEAM_DELETE
} from './types';

export const getAllTeam = () => async dispatch => {

    try {
        
        const res = await axios.get('api/team/getAll');
        dispatch({
            type: GET_TEAM,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_TEAM,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}

//Register team
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

        dispatch(setAlert('El equipo fue creadocorrectamente', 'success'));

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
            payload: {msg: err.response.statusText, status: err.repsonse.status}
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
