import {
    GET_AGENT,
    ERROR_GET_AGENT
} from '../actions/types';

const initialState = {
    agent: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_AGENT:
            return {
                ...state,
                agent: payload,
                loading: false,
            }
        case ERROR_GET_AGENT:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}