import {
    GET_ACTIVITY,
    ERROR_ACTIVITY
} from '../actions/types';

const initialState = {
    activity: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_ACTIVITY:
            return {
                ...state,
                activity: payload,
                loading: false,
            }
        case ERROR_ACTIVITY:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}