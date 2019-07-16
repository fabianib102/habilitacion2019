import {
    GET_CLIENT,
    ERROR_GET_CLIENT
} from '../actions/types';


const initialState = {
    client: null,
    loading: true,
    error: {}
}


export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_CLIENT:
            return {
                ...state,
                client: payload,
                loading: false,
            }
        case ERROR_GET_CLIENT:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}