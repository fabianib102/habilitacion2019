import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import project from './project';
import users from './user';

import userDetail from './user';

import risk from './risk';
import projectType from './projectType';
import projectSubType from './projectSubType';
import task from './task';
import client from './client';
import province from './province'
import location from './location'

export default combineReducers({
    alert,
    auth,
    project,
    users,
    userDetail,
    risk,
    projectType,
    projectSubType,
    task,
    client,
    province,
    location
});