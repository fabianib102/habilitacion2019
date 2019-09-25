import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accordion, Card, Button} from 'react-bootstrap';
import { ProgressBar } from 'react-bootstrap';
import { connect } from 'react-redux';

const AdminProjectActivity = ({match, project: {project}}) => {


    // if(project.length > 0){

    //     let projectFilter =  project.filter(function(pro) {
    //         return pro._id == match.params.idProject;
    //     });

    //     console.log(projectFilter);

    // }


    return (
        <Fragment>

            {/* <div className="card descripCustom">
                <div className="card-header">Descripción del proyecto</div>

                <div className="card-body">

                    <div className="row">
                        <dt class="col-lg-4"><span className="badge badge-secondary">Nombre: </span> Es el noombre del proyecto</dt>

                        <dt class="col-lg-4">
                            <span className="badge badge-secondary">Descripción: </span> 
                            Es una Descripción del proyecto
                        </dt>
                        
                        <dt class="col-lg-4">
                            <span className="badge badge-secondary">Tipo de proyecto: </span> 
                            Es un tipo del proyecto
                        </dt>

                        <dt class="col-lg-4">
                            <span className="badge badge-secondary">Sub Tipo de proyecto: </span> 
                            Es un subtipo del proyecto
                        </dt>

                        <dt class="col-lg-4">
                            <span className="badge badge-secondary">Riesgo: </span> 
                            Es un riego del proyecto
                        </dt>

                        <dt class="col-lg-4">
                            <span className="badge badge-secondary">Equipo: </span> 
                            Nombre del equipo del proyecto
                        </dt>

                    </div>

                </div>

            </div> */}

            <div className="row">

                <div className="col-lg-5">
                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Etapas</strong>

                            <div className="float-right">
                                <a className="btn btn-primary" title="Subir">
                                    Agregar Etapa
                                </a>
                            </div>

                        </div>

                        <div className="card-body">

                            <Accordion>
                                <Card>
                                    
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            
                                            Etapa 1

                                        </Accordion.Toggle>
                                    </Card.Header>

                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            
                                            <a className="btn btn-success btnAddAct" title="Subir">
                                                <i className="fas fa-plus-circle coloWhite"></i> Agregar Actividad
                                            </a>

                                            <ul className="list-group">
                                                <li className="justify-content-between list-group-item">
                                                    Actividad Uno
                                                </li>
                                                <li className="justify-content-between list-group-item">
                                                    Actividad Dos
                                                </li>
                                                <li className="justify-content-between list-group-item">
                                                    Actividad Tres
                                                </li>
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>

                                </Card>
                                <Card>
                                    <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Etapa 2
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <ul className="list-group">
                                                <li className="justify-content-between list-group-item">
                                                    Actividad Seis
                                                </li>
                                                <li className="justify-content-between list-group-item">
                                                    Actividad Cuatro
                                                </li>
                                                <li className="justify-content-between list-group-item">
                                                    Actividad Cinco
                                                </li>
                                            </ul>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>

                        </div>

                    </div>
                </div>

                <div className="col-lg-7">

                    <div className="card">
                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Etapa: Etapa 1</strong>

                            <div className="float-right">
                                <a className="btn btn-success" title="Subir">
                                    <i className="fas fa-sort-down coloWhite"></i>
                                </a>
                                <a className="btn btn-success" title="Subir">
                                    <i className="fas fa-sort-up coloWhite"></i>
                                </a>
                                <a className="btn btn-primary" title="Editar Etapa">
                                    <i className="far fa-edit coloWhite"></i>
                                </a>
                                <a className="btn btn-danger" title="Eliminar Etapa">
                                    <i className="far fa-trash-alt coloWhite"></i>
                                </a>
                            </div>

                        </div>

                        <div className="card-body">

                            <div className="row">

                                <p className="col-lg-12">
                                    <strong><u>Descripción</u>: Es una descripción corta de lo que se hace en esta estapa.</strong>
                                </p>

                                <div class="brand-card-body col-lg-12">
                                    <div>
                                        <div class="text-value">89 hs.</div>
                                        <div class="text-uppercase text-muted small">Horas Trabajadas</div>
                                    </div>
                                    <div>
                                        <div class="text-value">Equipo de Infraestructura</div>
                                        <div class="text-uppercase text-muted small">Equipo Asociado</div>
                                    </div>
                                </div>

                                <div class="brand-card-body col-lg-12">
                                    <div>
                                        <div class="text-value">12/05/2019</div>
                                        <div class="text-uppercase text-muted small">Fecha de inicio</div>
                                    </div>
                                    <div>
                                        <div class="text-value">05/08/2020</div>
                                        <div class="text-uppercase text-muted small">Fecha de Fin</div>
                                    </div>
                                </div>

                            </div>

                            <div className="row rowList">
                                
                                <ul className="listCustom">
                                    <div className="progress-group">
                                        <div className="progress-group-header">
                                            <i className="icon-user progress-group-icon"></i>
                                            <span className="title">Porcentaje de terminado</span>
                                            <span className="ml-auto font-weight-bold">43%</span>
                                        </div>
                                        <ProgressBar className="progressCustom" variant="success" now={43} />
                                    </div>
                                </ul>
                                
                            </div>

                        </div>

                    </div>

                </div>

            </div>
            
        </Fragment>
    )

}

AdminProjectActivity.propTypes = {
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.project
})

export default connect(mapStateToProps, null)(AdminProjectActivity)