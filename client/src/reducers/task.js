import {
    GET_TASK,
    ERROR_TASK
} from '../actions/types';

const initialState = {
    tasks: null,
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
        case ERROR_TASK:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}