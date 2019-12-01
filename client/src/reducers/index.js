import {combineReducers} from 'redux';
import alert from './alert';
import auth from './auth';
import project from './project';

import projectDetail from './project';
import relationsTask from './project';

import users from './user';
import userDetail from './user';
import userActive from './user';

import userTask from './user';

import risk from './risk';
import projectType from './projectType';
import projectSubType from './projectSubType';
import task from './task';
import tasksLider from './task';
import client from './client';
import agent from './agent';
import agentActive from './agent';
import province from './province';
import location from './location';
import team from './team';
import stage from './stage';
import userTeam from './userTeam';
import activity from './activity';
import projectSimple from './project';
import projectLider from './project';

export default combineReducers({
    alert,
    auth,
    project,
    users,
    userDetail,
    userActive,
    userTask,
    risk,
    projectType,
    projectSubType,
    task,
    tasksLider,
    client,
    agent,
    agentActive,
    province,
    location,
    team,
    userTeam,
    stage,
    activity,
    projectDetail,
    relationsTask,
    projectSimple,
    projectLider
});