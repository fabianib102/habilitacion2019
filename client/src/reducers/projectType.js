import {
    GET_PROJECT_TYPE,
    ERROR_PROJECT_TYPE
} from '../actions/types';

const initialState = {
    projectTypes: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_PROJECT_TYPE:
            return {
                ...state,
                projectTypes: payload,
                loading: false,
            }
        case ERROR_PROJECT_TYPE:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}