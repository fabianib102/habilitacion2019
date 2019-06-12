import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_TASK,
    ERROR_TASK
} from './types';

export const getAllTask = () => async dispatch => {

    try {
        
        const res = await axios.get('api/task/getAll');
        dispatch({
            type: GET_TASK,
            payload: res.data
        });

    } catch (err) {

        dispatch({
            type: ERROR_TASK,
            payload: {msg: err.response.statusText, status: err.repsonse.status}
        })
    }

}