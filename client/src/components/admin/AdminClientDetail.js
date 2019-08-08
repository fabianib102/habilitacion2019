import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const AdminClientDetail = ({match, client: {client}}) => {

    console.log(client);

    if(client !== null){
        for (let index = 0; index < client.length; index++) {
            
            if(client[index]._id == match.params.idClient){

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
                Atras
            </Link>

            <h2 className="my-2">Detalles del cliente</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos Personales">
                    {DetailData}
                </Tab>

                <Tab eventKey="project" title="Proyectos Asociados">
                    Acá tienen que ir los proyectos del usuario
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
