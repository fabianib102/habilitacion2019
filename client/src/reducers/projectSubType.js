import {
    GET_PROJECT_SUBTYPE,
    ERROR_PROJECT_SUBTYPE
} from '../actions/types';

const initialState = {
    projectTypes: null,
    projectSubTypes: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_PROJECT_SUBTYPE:
            return {
                ...state,
                projectSubTypes: payload,
                loading: false,
            }
        case ERROR_PROJECT_SUBTYPE:
            return {
                ...state,
                error: payload,
                loading: false
            }

        default:
            return state;
    }

}