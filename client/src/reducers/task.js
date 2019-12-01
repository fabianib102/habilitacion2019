import {
    GET_TASK,
    ERROR_TASK,
    GET_TASK_LIDER,
    ERROR_GET_TASK_LIDER
} from '../actions/types';

const initialState = {
    tasks: null,
    tasksLider: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_TASK:
            return {
                ...state,
                tasks: payload,
                loading: false,
            }
        case GET_TASK_LIDER:
            return{
                ...state,
                tasksLider: payload,
                loading: false
            }
        case ERROR_TASK, ERROR_GET_TASK_LIDER:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}