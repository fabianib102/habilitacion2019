import {
    GET_USERS,
    USERS_ERROR,
    //USERS_REGISTER,
    USERS_REGISTER_ERROR
} from '../actions/types';

const initialState = {
    users: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_USERS:
        //case USERS_REGISTER:
            return {
                ...state,
                users: payload,
                loading: false,
            }
        case USERS_ERROR:
        case USERS_REGISTER_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}