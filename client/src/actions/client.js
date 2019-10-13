import axios from 'axios';
import {setAlert} from './alert';

import {
    GET_CLIENT,
    ERROR_GET_CLIENT,
    INSERT_CLIENT,
    ERROR_INSERT_CLIENT,
    DELETE_CLIENT,
    ERROR_DELETE_CLIENT,
    EDIT_CLIENT,
    ERROR_EDIT_CLIENT,
    GET_CLIENT_AGENTS,
    ERROR_GET_CLIENT_AGENTS,
    INSERT_AGENT_CLIENT,
    ERROR_INSERT_AGENT_CLIENT,
    AGENT_CLIENT_DELETE,
    ERROR_AGENT_CLIENT_DELETE
} from './types';

//obtiene todos los clientes
export const getAllClient = () => async dispatch => {
    
    try {
        
        const res = await axios.get('/api/client/getAll');
        dispatch({
            type: GET_CLIENT,
            payload: res.data
        });
    } catch (err) {

        dispatch({
            type: ERROR_GET_CLIENT,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}


//registra un cliente
export const registerClient = ({ name, cuil, condition, address, email, phone, provinceId, locationId, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, cuil, condition, address, email, phone, provinceId, locationId});

    try {

        const res = await axios.post('/api/client', body, config);

        dispatch({
            type: INSERT_CLIENT,
            payload: res.data
        });

        dispatch(setAlert('El cliente fue creado correctamente', 'success'));

        history.push('/admin-client');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_CLIENT
        })
    }

}


//Borra el cliente según el id
export const deleteClientById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/client/delete', body, config);

        dispatch({
            type: DELETE_CLIENT,
            payload: res.data
        });

        dispatch(getAllClient());

        //dispatch(getClientAgent());

        dispatch(setAlert('El cliente fue dado de baja correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_CLIENT
        })
        
    }

}


//reactiva el cliente según el id
export const reactiveClientById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/client/reactive', body, config);

        dispatch({
            type: DELETE_CLIENT,
            payload: res.data
        });

        dispatch(getAllClient());

        //dispatch(getClientAgent());

        dispatch(setAlert('El cliente fue re activado exitosamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_CLIENT
        })
        
    }

}


//edita un cliente
export const editClient = ({ name, cuil, condition, address, email, phone, provinceId, locationId, idClient, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, cuil, condition, address, email, phone, provinceId, locationId, idClient, history});

    try {

        const res = await axios.post('/api/client/edit', body, config);

        dispatch({
            type: EDIT_CLIENT,
            payload: res.data
        });

        dispatch(setAlert('El cliente fue modificado correctamente', 'success'));

        history.push('/admin-client');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_CLIENT
        })
    }

}


// Obtiene el listado de representantes de un cliente
// export const getClientAgent = () => async dispatch => {

//     try {
        
//         const res = await axios.get(`/api/client/getAgentByClientAll`);
//         dispatch({
//             type: GET_CLIENT_AGENTS,
//             payload: res.data
//         });

//     } catch (err) {

//         dispatch({
//             type: ERROR_GET_CLIENT_AGENTS,
//             payload: {msg: err.response.statusText, status: err.response.status}
//         })
//     }
// }

//agrega un representante al cliente 
export const addAgentClient = (idClient, idAgent) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({idClient, idAgent});

    try {

        const res = await axios.post('/api/client/addAgentClient', body, config);

        dispatch({
            type: INSERT_AGENT_CLIENT,
            payload: res.data
        });

        dispatch(getAllClient());

        //dispatch(getClientAgent());

        dispatch(setAlert('El representante se agregó correctamente al cliente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_AGENT_CLIENT
        })
        
    }

}

//Borra el representante de un cliente NEW
// export const deleteAgentClient = (idClient, idAgent) => async dispatch => {
//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }

//     const body = JSON.stringify({idClient, idAgent});

//     try {

//         const res = await axios.post('/api/client/deleteAgentClient', body, config);

//         dispatch({
//             type: AGENT_CLIENT_DELETE,
//             payload: res.data
//         });

//         dispatch(getAllClient());

//         dispatch(getClientAgent());

//         dispatch(setAlert('El representante fue dado de baja del cliente correctamente', 'success'));
        
        
//     } catch (err) {

//         const errors = err.response.data.errors;
//         if(errors){
//             errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//         }

//         dispatch({
//             type: ERROR_AGENT_CLIENT_DELETE
//         })
        
//     }

// }


//reactiva un representante de un cliente NEW
// export const reactiveAgentClient = (idClient, idAgent) => async dispatch => {
//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     }

//     const body = JSON.stringify({idClient, idAgent});

//     try {

//         const res = await axios.post('/api/client/reactiveAgentClient', body, config);

//         dispatch({
//             type: AGENT_CLIENT_DELETE,
//             payload: res.data
//         });

//         dispatch(getAllClient());

//         dispatch(getClientAgent());

//         dispatch(setAlert('El representante se reactivó correctamente al cliente', 'success'));
        
        
//     } catch (err) {

//         const errors = err.response.data.errors;
//         if(errors){
//             errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//         }

//         dispatch({
//             type: ERROR_AGENT_CLIENT_DELETE
//         })
        
//     }

// }

//registra un cliente y referente
export const registerClientAgent = ({name, cuil, condition, address, email, phone, provinceId, locationId, nameRef, surnameRef, cuilRef, addressRef, emailRef, phoneRef, provinceIdRef, locationIdRef, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({name, cuil, condition, address, email, phone, provinceId, locationId, nameRef, surnameRef, cuilRef, addressRef, emailRef, phoneRef, provinceIdRef, locationIdRef});

    try {

        const res = await axios.post('/api/client/addClientReferent', body, config);

        dispatch({
            type: INSERT_CLIENT,
            payload: res.data
        });

        dispatch(setAlert('El cliente fue creado correctamente', 'success'));

        history.push('/admin-client');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_INSERT_CLIENT
        })
    }

}