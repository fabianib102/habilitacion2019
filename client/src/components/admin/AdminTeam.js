import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const AdminTeam = props => {
    return (

        <Fragment>
            
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin" className="btn btn-secondary">
                        Atras
                    </Link>

                    <Link to="/admin-user/create-user"  className="btn btn-primary my-1">
                        Nuevo Equipo
                    </Link>
                </div>
            </div>


            <div className="row">

                <div className="col-sm-12 col-lg-5">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Lista de Equipos</strong>
                        </div>

                        <div className="card-body">

                            <ul className="list-group">
                                <li className="active list-group-item-action list-group-item">
                                    Cras justo odio <span class="float-right badge badge-secondary badge-pill">14</span>
                                </li>

                                <li className="list-group-item-action list-group-item">
                                    Cras justo odio <span class="float-right badge badge-secondary badge-pill">14</span>
                                </li>

                            </ul>

                        </div>


                    </div>

                </div>

                <div className="col-sm-12 col-lg-7">

                    <div className="card">

                        <div className="card-header">
                            <i class="fas fa-info-circle"></i>
                            <strong> Detalles</strong>
                        </div>

                        <div className="card-body">

                            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                                <Tab eventKey="data" title="Proyecos asociados">
                                    <div className="tab-pane active">1. Lore</div>
                                </Tab>

                                <Tab eventKey="team" title="Integrantes del equipo">
                                    Acá tienen que ir los proyectos del usuario
                                </Tab>

                                <Tab eventKey="otherdata" title="Mas datos">
                                    Acá tienen mas datos.
                                </Tab>

                            </Tabs>

                        </div>


                    </div>

                </div>

            </div>

            
        </Fragment>

    )
}

AdminTeam.propTypes = {

}

export default AdminTeam
