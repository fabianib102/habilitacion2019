import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_AGENT,
    ERROR_GET_AGENT,
    INSERT_AGENT,
    ERROR_INSERT_AGENT,
    DELETE_AGENT,
    ERROR_DELETE_AGENT,
    EDIT_AGENT,
    ERROR_EDIT_AGENT,
    GET_AGENT_ACTIVE,
    ERROR_GET_AGENT_ACTIVE
} from './types';

//obtiene todos los referentes
export const getAllAgent = () => async dispatch => {

    try {
        const res = await axios.get('/api/agent/getAll');
        dispatch({
            type: GET_AGENT,
            payload: res.data
        });

    } catch (err) {
        console.log("->",err)
        dispatch({
            type: ERROR_GET_AGENT,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}


//registra un referente
export const registerAgent = ({ name, surname,  cuil, address, email, phone, provinceId, locationId,clientId, history}) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({name, surname,  cuil, address, email, phone, provinceId, locationId, clientId}); 

    try {

        const res = await axios.post('/api/agent', body, config);

        dispatch({
            type: INSERT_AGENT,
            payload: res.data
        });
        
        dispatch(getAllAgent());

        dispatch(setAlert('El referente fue creado correctamente', 'success'));        
        history.push({pathname:"/admin-client-agents/"+clientId.toString(),  state: { idClient: clientId }})
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_AGENT
        })
    }

}


//Borra el referente según el id
export const deleteAgentById = (id,reason) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id,reason});

    try {

        const res = await axios.post('/api/agent/delete', body, config);

        dispatch({
            type: DELETE_AGENT,
            payload: res.data
        });

        dispatch(getAllAgent());

        dispatch(setAlert('El referente fue dado de baja correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_AGENT
        })
        
    }

}


//reactiva el referente según el id
export const reactiveAgentById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/agent/reactive', body, config);

        dispatch({
            type: DELETE_AGENT,
            payload: res.data
        });

        dispatch(getAllAgent());

        dispatch(setAlert('El referente fue re activado exitosamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_AGENT
        })
        
    }

}


//edita un referente
export const editAgent = ({ name, surname, cuil, address, email, phone, provinceId, locationId, idAgent, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, surname, cuil, address, email, phone, provinceId, locationId, idAgent, history});

    try {

        const res = await axios.post('/api/agent/edit', body, config);

        dispatch({
            type: EDIT_AGENT,
            payload: res.data
        });

        dispatch(setAlert('El referente fue modificado correctamente', 'success'));

        history.push('/admin-agent');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_AGENT
        })
    }

}

// obtiene referentes activos
export const getAllAgentsActive = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/client/getAllActive');
        dispatch({
            type: GET_AGENT_ACTIVE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_GET_AGENT_ACTIVE,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}

