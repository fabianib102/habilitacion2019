import {
    GET_LOCATION,
    ERROR_GET_LOCATION
} from '../actions/types';

const initialState = {
    location: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_LOCATION:
            return {
                ...state,
                location: payload,
                loading: false,
            }
        case ERROR_GET_LOCATION:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}