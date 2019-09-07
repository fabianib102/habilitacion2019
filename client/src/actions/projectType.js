import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROJECT_TYPE,
    ERROR_PROJECT_TYPE,
    INSERT_PROJECT_TYPE,
    ERROR_INSERT_PROJECT_TYPE,
    DELETE_PROJECT_TYPE,
    ERROR_DELETE_PROJECT_TYPE,
    EDIT_PROJECT_TYPE,
    ERROR_EDIT_PROJECT_TYPE
} from './types';

//obtiene todos los tipos de proyectos
export const getAllProjectType = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/proyect-type/getAll');
        dispatch({
            type: GET_PROJECT_TYPE,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_PROJECT_TYPE,
            payload: {msg: err.response.statusText}
        })
    }

}


//registra un tipo de proyecto
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


//Borra el tipo de proyecto según el id
export const deleteProjectTypeById = (id) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({id});

    try {

        const res = await axios.post('/api/proyect-type/delete', body, config);

        dispatch({
            type: DELETE_PROJECT_TYPE,
            payload: res.data
        });

        dispatch(getAllProjectType());

        dispatch(setAlert('El tipo de proyecto fue eliminado correctamente', 'success'));
        
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_DELETE_PROJECT_TYPE
        })
        
    }

}


//edita un tipo de proyecto
export const editProjectType = ({name, description, idProjectType, history}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, description, idProjectType});

    try {

        const res = await axios.post('/api/proyect-type/edit', body, config);

        dispatch({
            type: EDIT_PROJECT_TYPE,
            payload: res.data
        });

        dispatch(setAlert('El tipo de proyecto fue modificado correctamente', 'success'));

        history.push('/admin-project-type');
        
    } catch (err) {

        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: ERROR_EDIT_PROJECT_TYPE
        })
    }

}


