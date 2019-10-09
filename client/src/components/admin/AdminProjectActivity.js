import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import Moment from 'react-moment';
//import { registerStage } from '../../actions/project';
import {getFilterStage, registerStage, editStage, registerActivity} from '../../actions/stage';

const AdminProjectActivity = ({match, stage: {stage, loading}, project: {project}, registerStage, getFilterStage, editStage, registerActivity}) => {

    const [showModalStage, setModalStage] = useState(false);

    const [showModalActivity, setModalActiviy] = useState(false);

    const [editBool, setBoolStage] = useState(false);

    const [itemStage, setIndexStage] = useState(-1);

    const [itemTask, setItemTask] = useState(-1);

    const [nameStage, setnameStage] = useState("");

    const [nameTask, setNameTask] = useState("");

    const [descTask, setDescTask] = useState("");

    const [descStage, setdescStage] = useState("");

    const [idStageState, setIdStage] = useState("");

    const [nameActivity, setNameAct] = useState("");

    const [descActivity, setdesc] = useState("");

    const [startProvide, setStart] = useState("");
    const [endProvide, setEnd] = useState("");

    const [formData, SetFormData] = useState({
        name: '',
        description: '',
        startDateProvide: '',
        endDateProvide: '',
        startDate: '',
        endDate: ''
    });

    const [formDataAct, SetFormDataAct] = useState({
        nameActivityForm: '',
        descriptionActivityForm: '',
        startDateProvideActivityForm: '',
        endDateProvideActivityForm: '',
    });

    useEffect(() => {
        getFilterStage(match.params.idProject);
    }, [getFilterStage]);

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const {name, description, startDateProvide, endDateProvide, startDate, endDate} = formData;

    const onChangeAct = e => SetFormDataAct({...formDataAct, [e.target.name]: e.target.value});

    const {nameActivityForm, descriptionActivityForm, startDateProvideActivityForm, endDateProvideActivityForm} = formDataAct;

    var projectFilter;

    if(project != null){

        let projectFil =  project.filter(function(pro) {
            return pro._id == match.params.idProject;
        });

        projectFilter = projectFil[0];
        
    }else{
        return <Redirect to='/admin-project'/>
    }

    const selectStage = (idStage, itemPass, namePass, descPass, startPass, endPass) => {
        setIndexStage(itemPass);
        setnameStage(namePass);
        setdescStage(descPass);
        setIdStage(idStage);
        setStart(startPass);
        setEnd(endPass);
        setNameAct("");
    }

    const selectActivity = (nameActPass, descActPass) => {
        setNameAct(nameActPass);
        setdesc(descActPass);
        setNameTask("");
    }

    const selectTask = (itemTaskPass, nameTaskPass, descTaskPass) => {
        setItemTask(itemTaskPass);
        setNameTask(nameTaskPass);
        setDescTask(descTaskPass)
    }

    if(stage != null){
        
        var listStageAcordion = stage.map((ls, item)=>

            <Card key={ls._id}>

                <Card.Header onClick={e => selectStage(ls._id, item, ls.name, ls.description, ls.startDateProvide, ls.endDateProvide)} className={item == itemStage ? "selectStage": ""}>
                    <Accordion.Toggle as={Button} variant="link" eventKey={item}>
                        {ls.name}
                    </Accordion.Toggle>
                </Card.Header>

                <Accordion.Collapse eventKey={item}>
                    <Card.Body>

                        Actividades
                        
                        <a className="btn btn-success btnAddAct" onClick={e => addActivity()} title="
                        Agregar Actividad">
                            <i className="fas fa-plus-circle coloWhite"></i>
                        </a>

                        <Accordion>
                            {ls.arrayActivity.length > 0 ? 
                                ls.arrayActivity.map((act, itemAct)=>
                                    <Card key={act._id}>
                                        <Card.Header onClick={e => selectActivity(act.name, act.description)} className="cardAct">
                                            <Accordion.Toggle as={Button} variant="link" eventKey={act._id} >
                                                {act.name}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={act._id}>
                                            <Card.Body>
                                                <div className="card-body">

                                                    Tareas

                                                    <a className="btn btn-warning btnTask" title="Agregar Tarea">
                                                        <i className="fas fa-plus-circle coloWhite"></i>
                                                    </a>

                                                    <ul className="list-group">

                                                        {!(act.arrayTask.length > 0) ? "No tiene tareas" : ""}

                                                        {act.arrayTask.map((task,itemTaskSelect)=>
                                                            <li key={task._id} onClick={e => selectTask(task._id, task.name, task.description)} className={task._id == itemTask ? "list-group-item-action list-group-item selectTask":"list-group-item-action list-group-item"}>
                                                                {task.name}
                                                            </li>
                                                        )}

                                                    </ul>
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                )
                                : 
                                "No tiene actividades"
                            }
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

        if(editBool){
            editStage({projectId, name, description, startDateProvide, endDateProvide});
        }else{
            registerStage({projectId, name, description, startDateProvide, endDateProvide});
        }

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

        setBoolStage(false);

        SetFormData({
            name: '',
            description: '',
            startDateProvide: '',
            endDateProvide: '',
        });

        modalStageAdmin();
    }

    const modalStage = (
        <Modal size="lg" show={showModalStage} onHide={e => modalStageAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>{editBool ? "Editar Etapa" : "Agregar Etapa"}</Modal.Title>
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

    const convertDate = (datePass) => {
        const fecha = new Date(datePass);
        let mes = fecha.getMonth()+1;
        if(mes<10) mes='0'+mes;
        let dia = fecha.getDate();
        if(dia<10) dia='0'+dia;
        let anio = fecha.getFullYear();
        var cumple = `${anio}-${mes}-${dia}`;
        return cumple;
    }

    const stageEditModal = () => {

        setBoolStage(true);
        
        var filterStage = stage.filter(function(lo) {
            return lo._id === idStageState;
        });

        let stageEdit = filterStage[0];

        stageEdit.startDateProvide = convertDate(stageEdit.startDateProvide);
        stageEdit.endDateProvide = convertDate(stageEdit.endDateProvide);

        SetFormData({
            name: loading || !stageEdit.name ? '' : stageEdit.name,
            description: loading || !stageEdit.description ? '' : stageEdit.description,
            startDateProvide: loading || !stageEdit.startDateProvide ? '' : stageEdit.startDateProvide,
            endDateProvide: loading || !stageEdit.endDateProvide ? '' : stageEdit.endDateProvide,
        });

        modalStageAdmin();

    }

    var cardStage = (
        <div className="card cardCustomStage">
                    
            <div className="card-header">
                <strong>Etapa: {nameStage}</strong>

                <div className="float-right">
                    <a onClick={e => stageEditModal()} className="btn btn-primary" title="Editar Etapa">
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
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{startProvide}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio</div>
                        </div>
                        <div>
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{endProvide}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Fin</div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
    //#endregion

    //#region Agregar una actividad


    const onSubmitActivity = async e => {
        e.preventDefault();
        let projectId = match.params.idProject;
        registerActivity({projectId, stageId:idStageState, name: nameActivityForm, description: descriptionActivityForm, startDateProvide: startDateProvideActivityForm, endDateProvide: endDateProvideActivityForm});
        modalActivityAdmin();
    }

    const modalActivityAdmin = () => {
        if(showModalActivity){
            setModalActiviy(false);
        }else{
            setModalActiviy(true);
        }
    }

    const addActivity = () => {
        setBoolStage(false);
        modalActivityAdmin();
    }

    const modalAct = (
        <Modal size="lg" show={showModalActivity} onHide={e => modalActivityAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>{editBool ? "Editar Actividad" : "Agregar Actividad"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <form className="form" onSubmit={e => onSubmitActivity(e)}>

                    <div className="form-group">
                        <h5>Nombre (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Nombre de la actividad" 
                            name="nameActivityForm"
                            minLength="3"
                            maxLength="50"
                            onChange = {e => onChangeAct(e)}
                            value={nameActivityForm}
                        />
                    </div>

                    <div className="form-group">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción de la Actividad" 
                            name="descriptionActivityForm"
                            minLength="3"
                            maxLength="60"
                            onChange = {e => onChangeAct(e)}
                            value={descriptionActivityForm}
                        />
                    </div>

                    <div className="row">

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Inicio Previsto (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="startDateProvideActivityForm"
                                onChange = {e => onChangeAct(e)}
                                value={startDateProvideActivityForm}
                            />
                        </div>

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Fin Previsto (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="endDateProvideActivityForm"
                                onChange = {e => onChangeAct(e)}
                                value={endDateProvideActivityForm}
                            />
                        </div>

                    </div>

                    <input type="submit" className="btn btn-primary" value="Agregar Actividad" />

                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalActivityAdmin()}>
                Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    )

    //#endregion

    //#region DATOS DE ACTIVIDAD

    var cardActivity = (
        <div className="card cardCustomStage">
                    
            <div className="card-header">
                <strong>Actividad: {nameActivity}</strong>

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
                        <strong><u>Descripción</u>:</strong> {descActivity}
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

    //#region DATOS DE TAREA

    var cardTask = (
        <div className="card cardCustomStage">
                    
            <div className="card-header">
                <strong>Tarea: {nameTask}</strong>

                <div className="float-right">
                    <a className="btn btn-danger" title="Eliminar Etapa">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12">
                        <strong><u>Descripción</u>:</strong> {descTask}
                    </p>

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
                                    <i className="fas fa-plus-circle coloWhite"></i>
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
                    
                    {nameStage != "" ? cardStage : ""}

                    {nameActivity != "" && nameStage != "" ? cardActivity : ""}

                    { nameActivity != "" && nameStage != "" && nameTask != "" ? cardTask : ""}

                </div>

            </div>

            {modalStage}

            {modalAct}
            
        </Fragment>
    )

}

AdminProjectActivity.propTypes = {
    registerStage: PropTypes.func.isRequired,
    getFilterStage: PropTypes.func.isRequired,
    editStage: PropTypes.func.isRequired,
    registerActivity: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    stage: state.stage,
    project: state.project,
})

export default connect(mapStateToProps, {registerStage, getFilterStage, editStage, registerActivity})(AdminProjectActivity)