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
                        <Card.Title>Fecha de baja: <Moment format="DD/MM/YYYY">{moment.utc(client[index].dateDischarged)}</Moment></Card.Title> 
                    )
                }

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        
                                        <Card.Title>Nombre o razón social: {client[index].name}</Card.Title>
                                        <Card.Title>CUIL: {client[index].cuil}</Card.Title>
                                        <Card.Title>Condición frente al IVA: {client[index].condition}</Card.Title>
                                        <Card.Title>Dirección: {client[index].address}</Card.Title>

                                        {client[index].status === "INACTIVO" ? dateShow : ""}
                                        
                                    </div>
                                    <div className="col-lg-6">
                                    
                                        <Card.Title>Telefóno: {client[index].phone}</Card.Title>
                                        <Card.Title>Email: {client[index].email}</Card.Title>
                                        <Card.Title>Provincia: {client[index].nameProvince}</Card.Title>
                                        <Card.Title>Localidad: {client[index].nameLocation}</Card.Title>
                                        
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
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

            <h2 className="my-2">Información del cliente</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos Personales">
                    {DetailData}
                </Tab>

                <Tab eventKey="project" title="Proyectos Asociados">
                    Proyectos asociados al Cliente
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
