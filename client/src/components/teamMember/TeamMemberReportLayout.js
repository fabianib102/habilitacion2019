import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import PrintButton from './PrintButton';
import PropTypes from 'prop-types';


const TeamMemberReportLayout = ({match,auth : {user}}) => {


    return (
        <Fragment>
            <div id= 'print-info' className="border border-dark " style={{width:'200mm',padding:'10px'}}> 
                
                <br/>

                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <p className="float-right ">Fecha de emision: 27/10/2019</p>
                    </div>
                </div>
                
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h3 className="text-center">Reporte de Rendicion de horas</h3>
                    </div>
                </div>
                
                <br/>

                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h5>Identificador(Leg.): {user && user.identifier}</h5>
                        <h5>Nombre: {user && user.name} {user && user.surname}</h5>
                        <h5>CUIL: {user && user.cuil}</h5>
                    </div>
                </div>

                <br/>   
                
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h4>Listado de Proyectos - Tareas entre (01/10/2019 - 27/10/2019)</h4>
                    </div>
                </div>

                <div className= "row">          
                    <div className="col-lg-12 col-sm-12">
                    <Accordion>
                        <Card>
                            <Card.Header>
                            <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <h5>Implementacion de sistemas</h5>
                                </Accordion.Toggle>
                            </div>
                            <div className="col-lg-6 col-sm-6 ">
                                <p className="float-right ">15h</p>
                            </div>        
                            </div>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-6">
                                                <p>Restauracion de BD</p>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 ">
                                            <p className="float-right ">5h</p>
                                        </div>        
                                    </div>    
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-6">
                                                <p>Preparacion de Equipos</p>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 ">
                                            <p className="float-right ">1h</p>
                                        </div>        
                                    </div>    
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-6">
                                                <p>Implementacion</p>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 ">
                                            <p className="float-right ">4h</p>
                                        </div>        
                                    </div>    
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-6">
                                                <p>Capacitacion de Personal</p>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 ">
                                            <p className="float-right ">5h</p>
                                        </div>        
                                    </div>    
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <Card>
                            <Card.Header>
                            <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    <h5>Actualizacion de Equipos</h5>
                                </Accordion.Toggle>
                            </div>
                            <div className="col-lg-6 col-sm-6 ">
                                <p className="float-right ">9h</p>
                            </div>        
                            </div>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                <div className="row">
                                        <div className="col-lg-6 col-sm-6">
                                                <p>Implementacion</p>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 ">
                                            <p className="float-right ">4h</p>
                                        </div>        
                                    </div>    
                                    <div className="row">
                                        <div className="col-lg-6 col-sm-6">
                                                <p>Capacitacion de Personal</p>
                                        </div>
                                        <div className="col-lg-6 col-sm-6 ">
                                            <p className="float-right ">5h</p>
                                        </div>        
                                    </div>    
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                    </div>
                </div>      
                
                <br/>

            </div>
            <div className="col-lg-3 col-sm-3">
                <PrintButton id={"print-info"} label={"Imprimir"}></PrintButton>
            </div>
        </Fragment>
    )

}

TeamMemberReportLayout.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(TeamMemberReportLayout)