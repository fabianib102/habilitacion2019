import {
    GET_PROJECT,
    PROJECT_ERROR,
    DETAIL_PROJECT,
    ERROR_DETAIL_PROJECT,
    GET_RELATION,
    ERROR_GET_RELATION,
    GET_PROJECT_SIMPLE,
    ERROR_GET_PROJECT_SIMPLE,
    GET_PROJECTS_LIDER,
    ERROR_GET_PROJECTS_LIDER,
    GET_PROJECT_REDUCED,
    ERROR_GET_PROJECT_REDUCED,
    GET_PROJECT_ALLINFO,
    ERROR_GET_PROJECT_ALLINFO

} from '../actions/types';

const initialState = {
    project: null,
    projects: [],
    projectDetail: null,
    relationsTask: null,
    projectSimple: null,
    projectLider: null,
    projectReduced: null,
    projectItem: null,
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
        case GET_PROJECTS_LIDER:
            return {
                ...state,
                projectLider: payload,
                loading: false
            }
        case GET_PROJECT_SIMPLE:
            return {
                ...state,
                projectSimple: payload,
                loading: false
            }
        case GET_PROJECT_ALLINFO:
            return {
                ...state,
                projectItem: payload,
                loading: false
            }
        case GET_PROJECT_REDUCED:
            return {
                ...state,
                projectReduced: payload,
                loading: false
            }
        case PROJECT_ERROR, ERROR_GET_PROJECT_REDUCED, ERROR_DETAIL_PROJECT, ERROR_GET_RELATION, ERROR_GET_PROJECT_SIMPLE,ERROR_GET_PROJECTS_LIDER,ERROR_GET_PROJECT_ALLINFO:
            return {
                ...state,
                error: payload,
                loading: false
            }
        
        default:
            return state;
    }

}
