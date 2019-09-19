import {
    GET_CLIENT_AGENTS,
    ERROR_GET_CLIENT_AGENTS
} from '../actions/types';

const initialState = {
    agentClient: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_CLIENT_AGENTS:
            return {
                ...state,
                agentClient: payload,
                loading: false,
            }

        case ERROR_GET_CLIENT_AGENTS:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}