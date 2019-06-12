import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ListProyect from './ListProjects';
import { getCurrentProject } from '../../actions/project';

const Dashboard = ({getCurrentProject, project: {project}, auth: {user}}) => {

  useEffect(() => {
    getCurrentProject();
  }, [getCurrentProject]);

  //console.log(user);
  //arreglar despues
  if(user !== null){
    if(user.rol === "Admin"){
      return <Redirect to="/admin" />
    }
    
  }

  return (
    <Fragment>
      <p className="lead">
        <i className="fas fa-user"/> Bienvenido { user && user.name} {user && user.surname}
      </p>

      <Link to="/create-proyect" className="btn btn-primary my-1">
        Nuevo proyecto
      </Link>

      <Fragment>
        <ListProyect project={project}/>          
      </Fragment>

    </Fragment>
  );
}

Dashboard.propTypes = {
  getCurrentProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  project: state.project,
  auth: state.auth
})

export default connect(mapStateToProps, {getCurrentProject})(Dashboard);
