import {
    GET_STAGE,
    ERROR_STAGE
} from '../actions/types';

const initialState = {
    stage: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_STAGE:
            return {
                ...state,
                stage: payload,
                loading: false,
            }
        case ERROR_STAGE:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}