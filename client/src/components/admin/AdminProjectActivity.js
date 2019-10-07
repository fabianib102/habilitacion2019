import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';

import {getFilterStage, registerStage} from '../../actions/stage';

const AdminProjectActivity = ({match, stage: {stage}, project: {project}, registerStage, getFilterStage}) => {

    const [showModalStage, setModalStage] = useState(false);

    const [itemStage, setIndexStage] = useState(-1);

    const [nameStage, setnameStage] = useState("");

    const [descStage, setdescStage] = useState("");

    const [formData, SetFormData] = useState({
        name: '',
        description: '',
        startDateProvide: '',
        endDateProvide: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        getFilterStage(match.params.idProject);
    }, [getFilterStage]);

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const {name, description, startDateProvide, endDateProvide, startDate, endDate} = formData;

    var projectFilter;

    if(project != null){

        let projectFil =  project.filter(function(pro) {
            return pro._id == match.params.idProject;
        });

        projectFilter = projectFil[0];
        
    }else{
        return <Redirect to='/admin-project'/>
    }

    const selectStage = (idStage, itemPass, namePass, descPass) => {
        setIndexStage(itemPass);
        setnameStage(namePass);
        setdescStage(descPass);
    }

    if(stage != null){
        
        var listStageAcordion = stage.map((ls, item)=>

            <Card key={ls._id}>

                <Card.Header onClick={e => selectStage(ls._id, item, ls.name, ls.description)} className={item == itemStage ? "selectStage": ""}>
                    <Accordion.Toggle as={Button} variant="link" eventKey={item}>
                        {ls.name}
                    </Accordion.Toggle>
                </Card.Header>

                <Accordion.Collapse eventKey={item}>
                    <Card.Body>
                        
                        <a className="btn btn-success btnAddAct" title="Subir">
                            <i className="fas fa-plus-circle coloWhite"></i> Agregar Actividad
                        </a>


                        <Accordion>
                            <Card>
                                <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                    Actividad 1
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>

                                        <Accordion defaultActiveKey="0">
                                            <Card>
                                                <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                                    Tarea Uno 
                                                </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="5">
                                                <Card.Body>Hello! I'm the body</Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                            <Card>
                                                <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                                    Tarea Dos
                                                </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="6">
                                                <Card.Body>Hello! I'm another body</Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>

                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Actividad 2
                                </Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                <Card.Body>Hello! I'm another body</Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>



                    </Card.Body>
                </Accordion.Collapse>
                
            </Card>

        )

    }

    //#region Agrega una etapa

    const onSubmit = async e => {
        e.preventDefault();
        let projectId = match.params.idProject;
        registerStage({projectId, name, description, startDateProvide, endDateProvide, startDate, endDate});
        modalStageAdmin();
    }

    const modalStageAdmin = () => {
        if(showModalStage){
            setModalStage(false);
        }else{
            setModalStage(true);
        }
    }

    const addStage = () => {
        modalStageAdmin();
    }

    const modalStage = (
        <Modal size="lg" show={showModalStage} onHide={e => modalStageAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Etapa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <form className="form" onSubmit={e => onSubmit(e)}>

                    <div className="form-group">
                        <h5>Nombre (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Nombre de la etapa" 
                            name="name"
                            minLength="3"
                            maxLength="50"
                            onChange = {e => onChange(e)}
                            value={name}
                        />
                    </div>

                    <div className="form-group">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción de la etapa" 
                            name="description"
                            minLength="3"
                            maxLength="60"
                            onChange = {e => onChange(e)}
                            value={description}
                        />
                    </div>

                    <div className="row">

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Inicio Previsto (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="startDateProvide"
                                onChange = {e => onChange(e)}
                                value={startDateProvide}
                            />
                        </div>

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Fin Previsto (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="endDateProvide"
                                onChange = {e => onChange(e)}
                                value={endDateProvide}
                            />
                        </div>

                    </div>

                    <div className="row">

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Inicio (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="startDate"
                                onChange = {e => onChange(e)}
                                value={startDate}
                            />
                        </div>

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Fin (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="endDate"
                                onChange = {e => onChange(e)}
                                value={endDate}
                            />
                        </div>

                    </div>

                    <input type="submit" className="btn btn-primary" value="Agregar" />

                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalStageAdmin()}>
                Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    )

    //#endregion

    //#region DATOS DE ETAPAS
    var cardStage = (
        <div className="card cardCustomStage">
                    
            <div className="card-header">
                <strong>Etapa: {nameStage}</strong>

                <div className="float-right">
                    <a className="btn btn-primary" title="Editar Etapa">
                        <i className="far fa-edit coloWhite"></i>
                    </a>
                    <a className="btn btn-danger" title="Eliminar Etapa">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12">
                        <strong><u>Descripción</u>:</strong> {descStage}
                    </p>

                    <div className="brand-card-body col-lg-6">
                        <div>
                            <div className="text-value">12/05/2019</div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio</div>
                        </div>
                        <div>
                            <div className="text-value">12/05/2019</div>
                            <div className="text-uppercase text-muted small">Fecha de Fin</div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
    //#endregion

    //#region DATOS DE ACTIVIDAD
    var cardActivity = (
        <div className="card cardCustomStage">
                    
            <div className="card-header">
                <strong>Actividad: {nameStage}</strong>

                <div className="float-right">
                    <a className="btn btn-primary" title="Editar Etapa">
                        <i className="far fa-edit coloWhite"></i>
                    </a>
                    <a className="btn btn-danger" title="Eliminar Etapa">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12">
                        <strong><u>Descripción</u>:</strong> {descStage}
                    </p>

                    <div className="brand-card-body col-lg-6">
                        <div>
                            <div className="text-value">12/05/2019</div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio</div>
                        </div>
                        <div>
                            <div className="text-value">12/05/2019</div>
                            <div className="text-uppercase text-muted small">Fecha de Fin</div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
    //#endregion



    return (
        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <div className="text-center row">

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Proyecto</div>
                    <strong>{projectFilter.name}</strong>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Cliente</div>
                    <strong>{projectFilter.nombreCliente}</strong>
                </div>

            </div>

            <div className="row">

                <div className="col-lg-5">
                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Etapas</strong>

                            <div className="float-right">
                                <a onClick={e => addStage()} className="btn btn-primary" title="Subir">
                                    Agregar Etapa
                                </a>
                            </div>

                        </div>

                        <div className="card-body">

                            {stage != null ? 
                                <Accordion>
                                    {listStageAcordion}
                                </Accordion>
                                : 
                                <p>El proyecto no tiene etapas</p>
                            }

                        </div>

                    </div>
                </div>

                <div className="col-lg-7">

                    {cardStage}

                    {cardActivity}

                    {cardStage}

                </div>

            </div>

            {modalStage}
            
        </Fragment>
    )

}

AdminProjectActivity.propTypes = {
    registerStage: PropTypes.func.isRequired,
    getFilterStage: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    stage: state.stage,
    project: state.project,
})

export default connect(mapStateToProps, {registerStage, getFilterStage})(AdminProjectActivity)