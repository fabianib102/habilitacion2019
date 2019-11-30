import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavbarGral from './components/layout/NavbarGral';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';

//Admin
import Admin from './components/admin/Admin';
import AdminUser from './components/admin/AdminUser';
import AdminCreateUser from './components/admin/AdminCreateUser';
import AdminUserDetail from './components/admin/AdminUserDetail';

import AdminRisk from './components/admin/AdminRisk';
import AdminCreateRisk from './components/admin/AdminCreateRisk';

import AdminProjectType from './components/admin/AdminProjectType';
import AdminCreateProjectType from './components/admin/AdminCreateProjectType';

import AdminTask from './components/admin/AdminTask';
import AdminCreateTask from './components/admin/AdminCreateTask';

import AdminClient from './components/admin/AdminClient';
import AdminCreateClient from './components/admin/AdminCreateClient';
import AdminClientDetail from './components/admin/AdminClientDetail';
import AdminClientAgents from './components/admin/AdminClientAgents';

import AdminAgent from './components/admin/AdminAgent';
import AdminCreateAgent from './components/admin/AdminCreateAgent';
import AdminAgentDetail from './components/admin/AdminAgentDetail';

import AdminProvince from './components/admin/AdminProvince';
import AdminCreateProvince from './components/admin/AdminCreateProvince';

import AdminTeam from './components/admin/AdminTeam';
import AdminTeamCreateTeam from './components/admin/AdminCreateTeam';

import AdminStage from './components/admin/AdminStage';
import AdminCreateStage from './components/admin/AdminCreateStage';

import AdminActivity from './components/admin/AdminActivity';

import AdminProject from './components/admin/AdminProject';
import AdminCreateProject from './components/admin/AdminCreateProject';
import AdminProjectActivity from './components/admin/AdminProjectActivity';
import AdminProjectDetail from './components/admin/AdminProjectDetail';

import AdminProjectRelationTask from './components/admin/AdminProjectRelationTask';
import AdminProjectDetailRelationTask from './components/admin/AdminProjectDetailRelationTask';

import Dashboard from './components/dashboard/Dashboard';

import PrivateRoute from './components/routing/PrivateRoute';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';
import TeamMember from './components/teamMember/TeamMember';
import teamMemberDetail from './components/teamMember/teamMemberDetail';
import TeamMemberWorkDone from './components/teamMember/TeamMemberWorkDone';
import TeamMemberReportLayout from './components/teamMember/TeamMemberReportLayout';

import ProjectManager from './components/proyect-manager/ProjectManager';
import ProyectManagerDetail from './components/proyect-manager/ProyectManagerDetail';
import ProyectManagerTaskReport from './components/proyect-manager/ProjectManagerTaskReport';
import ProjectManagerTaskLayout from './components/proyect-manager/ProjectManagerTaskLayout';

import NotFound from './components/dashboard/page404';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => { 
  
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return(
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavbarGral />
          <Route exact path='/' component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />

              <PrivateRoute exact path="/admin" component={Admin} />
              <PrivateRoute exact path="/admin-user" component={AdminUser} />
              <PrivateRoute exact path="/admin-user/create-user" component={AdminCreateUser} />
              <PrivateRoute exact path="/admin-user/user-detail/:idUser" component={AdminUserDetail} />
              <PrivateRoute exact path="/admin-user/edit-user/:idUser" component={AdminCreateUser} />
              
              <PrivateRoute exact path="/admin-risk" component={AdminRisk} />
              <PrivateRoute exact path="/admin-risk/create-risk" component={AdminCreateRisk} />
              <PrivateRoute exact path="/admin-risk/edit-risk/:idRisk" component={AdminCreateRisk} />

              <PrivateRoute exact path="/admin-project-type" component={AdminProjectType} />
              <PrivateRoute exact path="/admin-project-type/create-project-type" component={AdminCreateProjectType} />
              <PrivateRoute exact path="/admin-project-type/edit-project-type/:idProjecType" component={AdminCreateProjectType} />
              
              <PrivateRoute exact path="/admin-task" component={AdminTask} />
              <PrivateRoute exact path="/admin-task/create-task" component={AdminCreateTask} />
              <PrivateRoute exact path="/admin-task/edit-task/:idTask" component={AdminCreateTask} />

              <PrivateRoute exact path="/admin-client" component={AdminClient} />
              <PrivateRoute exact path="/admin-client/create-client" component={AdminCreateClient} />
              <PrivateRoute exact path="/admin-client/edit-client/:idClient" component={AdminCreateClient} />
              <PrivateRoute exact path="/admin-client/client-detail/:idClient" component={AdminClientDetail} />
              <PrivateRoute exact path="/admin-client-agents/:idClient" component={AdminClientAgents} />

              <PrivateRoute exact path="/admin-agent" component={AdminAgent} />
              <PrivateRoute exact path="/admin-agent/create-agent/:idClient" component={AdminCreateAgent} />
              <PrivateRoute exact path="/admin-agent/edit-agent/:idAgent" component={AdminCreateAgent} />
              <PrivateRoute exact path="/admin-agent/agent-detail/:idAgent" component={AdminAgentDetail} />

              <PrivateRoute exact path="/admin-province" component={AdminProvince} />
              <PrivateRoute exact path="/admin-province/create-province" component={AdminCreateProvince} />
              <PrivateRoute exact path="/admin-province/edit-province/:idProvince" component={AdminCreateProvince} />

              <PrivateRoute exact path="/admin-team" component={AdminTeam} />
              <PrivateRoute exact path="/admin-team/create-team" component={AdminTeamCreateTeam} />
              <PrivateRoute exact path="/admin-team/edit-team/:idTeam" component={AdminTeamCreateTeam} />

              <PrivateRoute exact path="/admin-stage" component={AdminStage} />
              <PrivateRoute exact path="/admin-stage/create-stage" component={AdminCreateStage} />
              <PrivateRoute exact path="/admin-stage/edit-stage/:idStage" component={AdminCreateStage} />
              
              
              <PrivateRoute exact path="/admin-activity" component={AdminActivity} />


              <PrivateRoute exact path="/admin-project" component={AdminProject} />
              <PrivateRoute exact path="/admin-project/create-project" component={AdminCreateProject} />
              <PrivateRoute exact path="/admin-project/edit-project/:idProject" component={AdminCreateProject} />
              <PrivateRoute exact path="/admin-project/project-activity/:idProject" component={AdminProjectActivity} />
              <PrivateRoute exact path="/admin-project/project-detail/:idProject" component={AdminProjectDetail} />


              <PrivateRoute exact path="/admin-project/project-relation-task/:idRelationTask" component={AdminProjectRelationTask} />
              <PrivateRoute exact path="/admin-project/project-detail-relation-task/:idRelationTask" component={AdminProjectDetailRelationTask} />

              
              <PrivateRoute exact path="/team-member/:idUser" component={TeamMember} />
              <PrivateRoute exact path="/team-member/team-member-detail/:idUser" component={teamMemberDetail} />
              <PrivateRoute exact path="/team-member/team-member-work-done/:idUser" component={TeamMemberWorkDone} />
              <PrivateRoute exact path="/team-member/team-member-report-layout/:idUser/:startFilter/:endFilter" component={TeamMemberReportLayout} />

              <PrivateRoute exact path="/project-manager/:idUser" component={ProjectManager} />              
              <PrivateRoute exact path="/proyect-manager/proyect-manager-detail/:idUser" component={ProyectManagerDetail} />
              
              <PrivateRoute exact path="/proyect-manager/taskReport" component={ProyectManagerTaskReport} />
              <PrivateRoute exact path="/proyect-manager/proyect-manager-report-layout" component={ProjectManagerTaskLayout} />

              {/* <PrivateRoute exact path="/proyect" component={Project} /> */}

              {/* <PrivateRoute exact path="/create-task" component={CreateTask} /> */}

              {/* <PrivateRoute exact path="/create-proyect" component={CreateProject} /> */}
              <Route path="" component={NotFound} />
              
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>

)};

export default App;