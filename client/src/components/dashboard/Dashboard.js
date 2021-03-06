import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

const Dashboard = ({ project: {project}, auth: {user}}) => {


  console.log(user);

  if(user !== null){

    // var texRedirec = "/team-member/" + user._id;
    if(user.firstConection){
      return <Redirect to={`/firstChangePassword/${user._id}`}/>            
    }  

    if(user.rol === "Integrante de Equipo de Proyecto"){
        return <Redirect to={`/team-member/${user._id}`}/>            
    }      
 
    if(user.rol === "Administrador General de Sistema"){
      return <Redirect to="/admin" />
    }

    if(user.rol === "Responsable de Proyecto"){
      return <Redirect to={`/project-manager/${user._id}`}/>
      
    }

  }

  return (
    <Fragment>
      <p className="lead">
        <i className="fas fa-user"/> Bienvenido { user && user.name} {user && user.surname}
      </p>
{/* 
      <div className="container contCustom">
      
        <div className="row">


          <div className="col-sm-2 divadmin">
              <div className="card">
              <div className="card-body">

                  <OverlayTrigger key="top" placement="top" 
                      overlay={
                          <Tooltip>
                            <h5>Gestión de Tareas</h5>
                          </Tooltip>
                        }> 
                      <center>
                          <Button href={texRedirec} variant="primary" ><i className="fas fa-tasks fa-3x"></i></Button>
                      </center>
                  </OverlayTrigger>

              </div>
              </div>
          </div>


        </div>
      
      </div> */}

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

export default connect(mapStateToProps, null)(Dashboard);
