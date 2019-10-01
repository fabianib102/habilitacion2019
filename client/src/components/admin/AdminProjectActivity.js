import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
//import {registerStage} from '../../actions/stage';
import { getAllProject, registerStage } from '../../actions/project';

const AdminProjectActivity = ({match, project: {project}, registerStage, getAllProject}) => {

    const [showModalStage, setModalStage] = useState(false);

    const [formData, SetFormData] = useState({
        name: '',
        description: '',
        startDateProvide: '',
        endDateProvide: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        getAllProject();
    }, [getAllProject]);

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const {name, description, startDateProvide, endDateProvide, startDate, endDate} = formData;

    var projectFilter;
    var listStage = [];

    if(project != null){

        let projectFil =  project.filter(function(pro) {
            return pro._id == match.params.idProject;
        });

        projectFilter = projectFil[0];
        listStage = projectFilter.listStage
        
    }else{
        return <Redirect to='/admin-project'/>
    }


    const selectStage = (idStage) => {
        //alert(idStage)
    }

    if(listStage.length > 0){
        
        var listStageAcordion = listStage.map((ls, item)=>

            <Card key={ls._id}>

                <Card.Header onClick={e => selectStage(ls._id)}>
                    <Accordion.Toggle as={Button} variant="link" eventKey={item}>
                        {ls.name}
                    </Accordion.Toggle>
                </Card.Header>

                <Accordion.Collapse eventKey={item}>
                    <Card.Body>
                        
                        <a className="btn btn-success btnAddAct" title="Subir">
                            <i className="fas fa-plus-circle coloWhite"></i> Agregar Actividad
                        </a>

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


    return (
        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <div className="row detailCustom">
                <dt className="col-lg-6">
                    <span className="badge badge-secondary">Proyecto: </span> {projectFilter.name}
                </dt>
                <dt className="col-lg-6">
                    <span className="badge badge-secondary">Cliente: </span> {projectFilter.nombreCliente}
                </dt>
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

                            {listStage.length > 0 ? 
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

                                <div class="brand-card-body col-lg-6">
                                    <div>
                                        <div class="text-value">12/05/2019</div>
                                        <div class="text-uppercase text-muted small">Fecha de Inicio</div>
                                    </div>
                                    <div>
                                        <div class="text-value">12/05/2019</div>
                                        <div class="text-uppercase text-muted small">Fecha de Fin</div>
                                    </div>
                                </div>

                                <div class="brand-card-body col-lg-6">
                                    <div>
                                        <div class="text-value">12/05/2019</div>
                                        <div class="text-uppercase text-muted small">Fecha de inicio Previsto</div>
                                    </div>
                                    <div>
                                        <div class="text-value">05/08/2020</div>
                                        <div class="text-uppercase text-muted small">Fecha de Fin Previsto</div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {modalStage}
            
        </Fragment>
    )

}

AdminProjectActivity.propTypes = {
    registerStage: PropTypes.func.isRequired,
    getAllProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.project,
})

export default connect(mapStateToProps, {registerStage, getAllProject})(AdminProjectActivity)