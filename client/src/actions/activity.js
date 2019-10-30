import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_ACTIVITY,
    ERROR_ACTIVITY,
} from './types';


//obtiene todas las etapas
export const getAllActivity = () => async dispatch => {

    try {
        
        const res = await axios.get('/api/activity/getAll');
        dispatch({
            type: GET_ACTIVITY,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_ACTIVITY,
            payload: {msg: err.response.statusText, status: err.response.status}
        })
    }

}



