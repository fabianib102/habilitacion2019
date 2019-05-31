import {
    GET_RISKS,
    ERROR_GET_RISK
} from '../actions/types';

const initialState = {
    risks: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_RISKS:
            return {
                ...state,
                risks: payload,
                loading: false,
            }
        case ERROR_GET_RISK:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}