import {
    GET_PROVINCE,
    ERROR_GET_PROVINCE
} from '../actions/types';

const initialState = {
    province: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_PROVINCE:
            return {
                ...state,
                province: payload,
                loading: false,
            }
        case ERROR_GET_PROVINCE:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}