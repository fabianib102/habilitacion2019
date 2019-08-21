import {
    GET_TEAM_USERS,
    ERROR_GET_TEAM_USERS
} from '../actions/types';

const initialState = {
    userTeam: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_TEAM_USERS:
            return {
                ...state,
                userTeam: payload,
                loading: false,
            }

        case ERROR_GET_TEAM_USERS:
            return {
                ...state,
                error: payload,
                loading: false
            }
        default:
            return state;
    }

}