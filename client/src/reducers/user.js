import {
    GET_USERS,
    USERS_ERROR,
    //USERS_REGISTER,
    USERS_REGISTER_ERROR,
    GET_DETAIL_USER,
    ERROR_GET_DETAIL_USER
} from '../actions/types';

const initialState = {
    users: null,
    userDetail: null,
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
        
        case GET_DETAIL_USER:
            return{
                ...state,
                userDetail: payload,
                loading: false,
            }

        case USERS_ERROR:
        case ERROR_GET_DETAIL_USER:
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