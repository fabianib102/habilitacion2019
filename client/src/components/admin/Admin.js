import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tooltip } from 'react-bootstrap';
import { Button, OverlayTrigger} from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.css';

const Admin = ({auth: {user}}) => {

    if(user !== null){
        if(user.rol === "Operativo"){
            return <Redirect to="/dashboard" />
        }
    }

    return (
        <Fragment>
            <h2 className="text-primary">Administrador</h2>
            <p className="lead">
                <i className="fas fa-user"/> Bienvenido, { user && user.name} {user && user.surname}
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
                                      <h5>Gestión de Tipos de Proyecto</h5>
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
                                      <h5>Gestión de Provincia</h5>
                                    </Tooltip>
                                  }> 
                                <center>
                                    <Button href="/admin-province" variant="primary" ><i className="fas fa-map-marked fa-3x"></i></Button>
                                </center>
                            </OverlayTrigger>

                        </div>
                        </div>
                    </div>


                    {/* <div className="col-sm-4 divadmin">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gestión de Subtipos de proyecto</h5>
                            <Link to="/admin-project-subtype" className="btn btn-primary my-1">
                                Ingresar
                            </Link>
                        </div>
                        </div>
                    </div> */}

                    {/* <div className="profile-exp bg-white p-2">
                        <h2 className="text-primary">Gestión de usuarios</h2>
                        <Link to="/admin-user" className="btn btn-primary my-1">
                            Ingresar
                        </Link>
                    </div> */}

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
