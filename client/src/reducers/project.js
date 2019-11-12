import {
    GET_PROJECT,
    PROJECT_ERROR,
    DETAIL_PROJECT,
    ERROR_DETAIL_PROJECT,
    GET_RELATION,
    ERROR_GET_RELATION
} from '../actions/types';

const initialState = {
    project: null,
    projects: [],
    projectDetail: null,
    relationsTask: null,
    loading: true,
    error: {}
}

export default function(state = initialState, action){

    const {type, payload} = action;

    switch (type) {
        case GET_PROJECT:
            return {
                ...state,
                project: payload,
                loading: false,
            }
        case PROJECT_ERROR, ERROR_DETAIL_PROJECT, ERROR_GET_RELATION:
            return {
                ...state,
                error: payload,
                loading: false
            }

        case DETAIL_PROJECT:
            return {
                ...state,
                projectDetail: payload,
                loading: false
            }

        case GET_RELATION:
            return {
                ...state,
                relationsTask: payload,
                loading: false
            }

        default:
            return state;
    }

}
