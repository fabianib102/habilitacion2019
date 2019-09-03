import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';

const AdminClientDetail = ({match, client: {client}}) => {

    if(client !== null){

        for (let index = 0; index < client.length; index++) {
            
            if(client[index]._id == match.params.idClient){

                if(client[index].status === "INACTIVO"){
                    var dateShow = (
                        <Card.Title><b>Fecha de baja: </b><Moment format="DD/MM/YYYY">{moment.utc(client[index].dateDischarged)}</Moment></Card.Title> 
                    )
                }

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        
                                        <Card.Title><b>Nombre o Razón Social: </b>{client[index].name}</Card.Title>
                                        <Card.Title><b>CUIL: </b>{client[index].cuil}</Card.Title>
                                        <Card.Title><b>Condición frente al IVA: </b>{client[index].condition}</Card.Title>
                                        <Card.Title><b>Dirección: </b>{client[index].address}</Card.Title>

                                        {client[index].status === "INACTIVO" ? dateShow : ""}
                                        
                                    </div>
                                    <div className="col-lg-6">
                                    
                                        <Card.Title><b>Telefóno: </b>{client[index].phone}</Card.Title>
                                        <Card.Title><b>Email: </b>{client[index].email}</Card.Title>
                                        <Card.Title><b>Provincia: </b>{client[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{client[index].nameLocation}</Card.Title>
                                        
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className="form-group"></div>
                        
                        <Link to={`/admin-client/edit-client/${client[index]._id}`} className="btn btn-primary">
                            Editar Información
                        </Link>

                    </div>
            
                ); 
            }
            
        }
    }

    return (
        <Fragment>

            <Link to="/admin-client" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información del Cliente</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">
                    {DetailData}
                </Tab>

                <Tab eventKey="project" title="Proyectos">
                   <div className="containerCustom">                  
                        <div className="card">

                            <div className="card-header">
                                 <h5 className="my-2">Proyectos Asociados Actualmente</h5>
                            </div>
                            <div className="card-body bodyTeam">
                                <ul className="list-group">
                                    <li key='0' className='itemTeam list-group-item-action list-group-item'><b>No se encuentra asociado a ningún Proyecto</b></li>                
                                </ul>
                            </div>

                        </div>

                    </div>
                </Tab>

            </Tabs>
            
        </Fragment>
    )
}

AdminClientDetail.propTypes = {
    client: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    client: state.client
})

export default connect(mapStateToProps)(AdminClientDetail)
