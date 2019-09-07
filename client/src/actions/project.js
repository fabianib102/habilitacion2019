import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_PROJECT,
    PROJECT_ERROR
} from './types';


//obtiene todos los proyectos
export const getAllProject = () => async dispatch => {

    try {
        
        const res = await axios.get('api/project/getAll');
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