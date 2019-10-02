import {
    GET_AGENT,
    ERROR_GET_AGENT,
    GET_AGENT_ACTIVE,
    ERROR_GET_AGENT_ACTIVE,
} from '../actions/types';

const initialState = {
    agent: null,
    agentActive: null,
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
        case GET_AGENT_ACTIVE:
            return{
                ...state,
                agentActive: payload,
                loading: false,
            }
        case ERROR_GET_AGENT_ACTIVE:
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