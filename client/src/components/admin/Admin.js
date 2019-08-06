import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
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
                <i className="fas fa-user"/> Bienvenido { user && user.name} {user && user.surname}
            </p>

            <div className="container contCustom">

                <div className="row">

                    <div className="col-sm-4 divadmin">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gestión de usuarios</h5>
                            <Link to="/admin-user" className="btn btn-primary my-1">
                                Ingresar
                            </Link>
                        </div>
                        </div>
                    </div>

                    <div className="col-sm-4 divadmin">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gestión de Tareas</h5>
                            <Link to="/admin-task" className="btn btn-primary my-1">
                                Ingresar
                            </Link>
                        </div>
                        </div>
                    </div>

                    <div className="col-sm-4 divadmin">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gestión de Riesgos</h5>
                            <Link to="/admin-risk" className="btn btn-primary my-1">
                                Ingresar
                            </Link>
                        </div>
                        </div>
                    </div>

                    <div className="col-sm-4 divadmin">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gestión de Tipos de proyecto</h5>
                            <Link to="/admin-project-type" className="btn btn-primary my-1">
                                Ingresar
                            </Link>
                        </div>
                        </div>
                    </div>

                    <div className="col-sm-4 divadmin">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gestión de Cliente</h5>
                            <Link to="/admin-client" className="btn btn-primary my-1">
                                Ingresar
                            </Link>
                        </div>
                        </div>
                    </div>

                    <div className="col-sm-4 divadmin">
                        <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gestión de Provincia</h5>
                            <Link to="/admin-province" className="btn btn-primary my-1">
                                Ingresar
                            </Link>
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
