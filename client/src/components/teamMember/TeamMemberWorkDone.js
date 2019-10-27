import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const TeamMemberWorkDone = ({match, auth:{user}}) => {


    return (
        <Fragment>
            
            <Link to="/team-member" className="btn btn-secondary">
                Atrás
            </Link>
            
            <div class= "row">
                <div className="col-lg-12 col-sm-12">
                    <h3>Informe Personal de Horas en Proyectos Activos</h3>
                </div>
            </div>

            <br/>

            <div class= "row">
                <div className="col-lg-12 col-sm-12">
                    <h5>Rango de Fechas</h5>
                </div>
            </div>
            <div class= "row">
                <div className="col-lg-3 col-sm-3">
                    <p><b>Desde: </b></p>
                    <input type="date"></input>
                </div>
                <div className="col-lg-3 col-sm-3">
                    <p><b>Hasta: </b></p>
                    <input type="date"></input>
                </div>
                <div className="col-lg-2 col-sm-2">
                    <Button>Filtrar</Button>
                    <Link to={`/team-member/team-member-Report-Layout/${ user && user._id}`}  className="btn btn-primary my-2">
                        Imprimir Reporte
                    </Link>
                </div>
            </div>
            
            <br/>

            <div className= "row">          
                <div className="col-lg-8 col-sm-8">
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
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                <h5>Actualizacion de Equipos</h5>
                            </Accordion.Toggle>
                        </div>
                        <div className="col-lg-6 col-sm-6 ">
                            <p className="float-right ">9h</p>
                        </div>        
                        </div>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
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
        </Fragment>
    )

}

TeamMemberWorkDone.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps)(TeamMemberWorkDone)