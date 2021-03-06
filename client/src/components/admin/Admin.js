import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

const Admin = ({auth: {user}}) => {    
    if(user !== null){
        if(user.rol === "Integrante de Equipo de Proyecto"){
            return <Redirect to={`/team-member/${user._id}`}/>            
        }      
        
        if(user.rol === "Responsable de Proyecto"){
          return <Redirect to={`/project-manager/${user._id}`}/>
          
        }
             
    }

    return (
        <Fragment>
            <h2 className="text-primary">Administrador</h2>
            <p className="lead">
                <i className="fas fa-user"/> Bienvenido,<b> { user && user.name} {user && user.surname}</b>
            </p>

            <div className="container contCustom">
                <div className="row">
                    <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Recursos Humanos (RRHH)</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-user" variant="primary" ><i className="fas fa-user fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div>

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
                                    <Button href="/admin-task" variant="primary" ><i className="fas fa-tasks fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>                                                          

                        </div>
                        </div>
                    </div>

                    <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Riesgos</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-risk" variant="primary" ><i className="fas fa-exclamation-triangle fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>                          

                        </div>
                        </div>
                    </div>

                    <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Tipos de Proyectos</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-project-type" variant="primary" ><i className="fas fa-sitemap fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div>

                    <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Clientes</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-client" variant="primary" ><i className="fas fa-user-tie fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div>
                    

                    <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Equipos</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-team" variant="primary" ><i className="fas fa-users fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div>


                    <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Provincias</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-province" variant="primary" ><i className="fas fa-map-marked fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div>


                    {/* <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Etapas</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-stage" variant="primary" ><i className="fas fa-stream fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div> */}


                    {/* <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Actividades</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-activity" variant="primary" ><i className="fas fa-calendar fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div> */}


                    <div className="col-sm-2 divadmin">
                        <div className="card">
                        <div className="card-body">

                            <OverlayTrigger key="top" placement="top" 
                                overlay={
                                    <Tooltip>
                                      <h5>Gestión de Proyectos</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-project" variant="primary" ><i className="fas fa-clipboard-list fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div>



                </div>

            </div>


        </Fragment>
    )
}

Admin.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
  })

export default connect(mapStateToProps)(Admin);
