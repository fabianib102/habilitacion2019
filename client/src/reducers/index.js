import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import project from './project';
import users from './user';
import risk from './risk';
import projectType from './projectType';

export default combineReducers({
    alert,
    auth,
    project,
    users,
    risk,
    projectType
});