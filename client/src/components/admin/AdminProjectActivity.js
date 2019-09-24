import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accordion, Card, Button} from 'react-bootstrap';
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

            <div className="card descripCustom">
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

            </div>

            <div className="row">

                <div className="col-lg-5">
                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Etapas</strong>
                        </div>

                        <div className="card-body">

                            <Accordion>
                                <Card>
                                    
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            
                                            Etapa 1

                                            {/* Dejar por las dudas
                                            <div className="float-right">

                                                <a className="btn btn-success" title="Arriba">
                                                    <i className="fas fa-trash-alt coloWhite"></i>
                                                </a>

                                                <a className="btn btn-success" title="Arriba">
                                                    <i className="fas fa-angle-up coloWhite"></i>
                                                </a>
                                                <a className="btn btn-success" title="Abajo">
                                                    <i className="fas fa-angle-down coloWhite"></i>
                                                </a>
                                            </div> */}

                                        </Accordion.Toggle>
                                    </Card.Header>

                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            Actividad Uno
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
                                            Actividad Dos
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>

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