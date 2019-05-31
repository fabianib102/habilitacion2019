import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROJECT,
    PROJECT_ERROR
} from './types';

export const getCurrentProject = () => async dispatch => {

    try {
        const res = await axios.get('api/project/getAll/5cc0f7b8f4db581aecb0b61d');
        dispatch({
            type: GET_PROJECT,
            payload: res.data
        });
    } catch (err) {

        dispatch({
            type: PROJECT_ERROR,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}

// Crear o editar un proyecto
export const createProject = (formData, history, edit = false) => async dispatch => {

    try {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/project', formData, config);

        dispatch({
            type: GET_PROJECT,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Proyecto Editado' : 'Proyecto Creado', 'success'));

        if(!edit){
            history.push('/dashboard');
        }
        
    } catch (err) {

        //const errors = err.message;

        dispatch(setAlert(err.message, 'danger'));

        dispatch({
            type: PROJECT_ERROR,
            //payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}
