import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';

import {setAlert} from '../../actions/alert';
import {getFilterStage, registerStage, editStage, registerActivity, registerTask, deleteTaskById, editTaskById, editActivityById} from '../../actions/stage';
import { getAllTask } from '../../actions/task';

const AdminProjectActivity = ({match,setAlert,editActivityById, editTaskById, deleteTaskById, registerTask, getAllTask, tasks: {tasks}, stage: {stage, loading}, project: {project}, registerStage, getFilterStage, editStage, registerActivity}) => {

    const [showModalStage, setModalStage] = useState(false);

    const [showModalActivity, setModalActiviy] = useState(false);

    const [editBool, setBoolStage] = useState(false);

    const [itemStage, setIndexStage] = useState(-1);

    const [itemTask, setItemTask] = useState(-1);

    const [nameStage, setnameStage] = useState("");

    const [nameTask, setNameTask] = useState("");

    const [descTask, setDescTask] = useState("");

    const [dateStartPre, setDateStartPre] = useState("");

    const [dateEndPre, setDateEndPre] = useState("");

    const [descStage, setdescStage] = useState("");

    const [idStageState, setIdStage] = useState("");

    const [nameActivity, setNameAct] = useState("");

    const [descActivity, setdesc] = useState("");

    const [dateStartActivity, setDateStartAct] = useState("");

    const [dateEndActivity, setDateEndAct] = useState("");

    const [startProvide, setStart] = useState("");

    const [endProvide, setEnd] = useState("");

    const [showAddTask, setModalTaskAdd] = useState(false);

    const [showAlert, setAlerts] = useState(false);

    const [idActivitySelect, setIdActivity] = useState("");

    const [txtAlert, setTxt] = useState("");

    const [listTaskSelect, setTaskList] = useState([]);


    const [showModalTaskDelete, setModalTaskDelete] = useState(false);
    const [showModalTaskEdit, setModalTaskEdit] = useState(false);

    const [showModalActivityEdit, setModalActivityEdit] = useState(false);

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

    const [formDataTask, SetFormDataTask] = useState({
        descriptionTask: '',
        startDateProvideTask: '',
        endDateProvideTask: ''
    });

    const {descriptionTask, startDateProvideTask, endDateProvideTask} = formDataTask;

    const onChangeTask = e => SetFormDataTask({...formDataTask, [e.target.name]: e.target.value});


    //seteo de datos de actividades
    const [formDataActivity, SetFormDataActivity] = useState({
        descriptionActivity: '',
        startDateProvideActivity: '',
        endDateProvideActivity: ''
    });

    const {descriptionActivity, startDateProvideActivity, endDateProvideActivity} = formDataActivity;

    const onChangeActivity = e => SetFormDataActivity({...formDataActivity, [e.target.name]: e.target.value});


    useEffect(() => {
        getAllTask();
        getFilterStage(match.params.idProject);
    }, [getFilterStage, getAllTask]);

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const {name, description, startDateProvide, endDateProvide, startDate, endDate} = formData;

    const onChangeAct = e => SetFormDataAct({...formDataAct, [e.target.name]: e.target.value});

    const {nameActivityForm, descriptionActivityForm, startDateProvideActivityForm, endDateProvideActivityForm} = formDataAct;

    var projectFilter;

    if(project !== null){

        let projectFil =  project.filter(function(pro) {
            return pro._id === match.params.idProject;
        });

        projectFilter = projectFil[0];

        console.log("PROY: ", projectFilter);
        //Para uso de restricciones de fechas
        var fechaStartLimit = projectFilter.startDateExpected.split("T")[0];
        var fechaEndLimit = projectFilter.endDateExpected.split("T")[0]
        console.log(fechaStartLimit,fechaEndLimit)
        console.log("stage",stage)
        if(stage !== null){
            var stageFil =  stage.filter(function(stg) {
                return stg.projectId === match.params.idProject;
            });
            console.log("ETAPAS: ", stageFil);
        }
        
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

    const selectActivity = (nameActPass, descActPass, idPassActivity, startDatePass, endDatePass) => {
        setNameAct(nameActPass);
        setdesc(descActPass);
        setIdActivity(idPassActivity);
        setDateStartAct(convertDate(startDatePass));


        setDateEndAct(convertDate(endDatePass));

        setNameTask("");

    }

    const selectTask = (itemTaskPass, nameTaskPass, descTaskPass, startDatePass, endDatePass) => {
        setItemTask(itemTaskPass);
        setNameTask(nameTaskPass);
        setDescTask(descTaskPass);
        setDateStartPre(convertDate(startDatePass));
        setDateEndPre(convertDate(endDatePass));
    }

    if(stage !== null){
        
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
                                        <Card.Header onClick={e => selectActivity(act.name, act.description, act._id, act.startDateProvide, act.endDateProvide)} className="cardAct">
                                            <Accordion.Toggle as={Button} variant="link" eventKey={act._id} >
                                                {act.name}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={act._id}>
                                            <Card.Body>
                                                <div className="card-body">

                                                    Tareas

                                                    <a onClick={e => addTask(act.arrayTask)} className="btn btn-warning btnTask" title="Agregar Tarea">
                                                        <i className="fas fa-plus-circle coloWhite"></i>
                                                    </a>

                                                    <ul className="list-group">

                                                        {!(act.arrayTask.length > 0) ? "No tiene tareas" : ""}

                                                        {act.arrayTask.map((task,itemTaskSelect)=>
                                                            <li key={task._id} onClick={e => selectTask(task._id, task.name, task.description, task.startDateProvideTask, task.endDateProvideTask)} className={task._id == itemTask ? "list-group-item-action list-group-item selectTask":"list-group-item-action list-group-item"}>
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

    if(stageFil !== null){
        console.log(stageFil)
        if (stageFil.length !== 0){
            var stageListExist = stageFil.map((ls, item)=>
                <li className="justify-content-between list-group-item" key={ls._id}>
                    {ls.name}
                    <div className="float-right">
                        <Moment format="DD/MM/YYYY ">{moment.utc(ls.startDateProvide)}</Moment> -
                        <Moment format="DD/MM/YYYY ">{moment.utc(ls.endDateProvide)}</Moment>
                    </div>

                </li>
            )
        }else{
            var stageListExist = <li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Etapas</b></center></li>
        }
    }

    //#region Agrega una etapa

    const onSubmit = async e => {
        e.preventDefault();
        let projectId = match.params.idProject;
        console.log(startDateProvide,endDateProvide)
        if (startDateProvide<=endDateProvide){
            console.log(startDateProvide,endDateProvide,startDateProvide<=endDateProvide)
            if(editBool){
                editStage({projectId, idStage:idStageState, name, description, startDateProvide, endDateProvide});
            }else{
                registerStage({projectId, name, description, startDateProvide, endDateProvide});
            }
        }else{//fechas incorrectas
            console.log(startDateProvide,endDateProvide,startDateProvide<=endDateProvide)
            setAlert('Peíodo de Fechas previstas incorrectas.', 'danger');
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
                            class="form-control"
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
                            class="form-control"
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
                                class="form-control"
                                placeholder="" 
                                name="startDateProvide"
                                onChange = {e => onChange(e)}
                                value={startDateProvide}
                                min = {fechaStartLimit}
                                max = {fechaEndLimit}
                            />
                        </div>
                        <div className="form-group col-lg-6">
                            <h5>Fecha de Fin Previsto (*)</h5>
                            <input 
                                type="date" 
                                class="form-control"
                                placeholder="" 
                                name="endDateProvide"
                                onChange = {e => onChange(e)}
                                value={endDateProvide}
                                min = {fechaStartLimit}
                                max = {fechaEndLimit}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-6">
                            <h5>Inicio y fin previsto  del Proyecto</h5>
                            <ul><li className="center-content-between list-group-item" key="00">
                                <Moment format="DD/MM/YYYY ">{moment.utc(projectFilter.startDateExpected)}</Moment> -
                                <Moment format="DD/MM/YYYY ">{moment.utc(projectFilter.endDateExpected)}</Moment>
                            </li></ul>
                        </div>
                        <div className="form-group col-lg-6">

                            <h5>Etapas existentes</h5>
                            <ul className="list-group">
                                {stageListExist}
                            </ul>
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
        let dia = fecha.getDate()+1;
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
                    
            <div className="card-header headerStage">
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

                    <p className="col-lg-12 descTxt">
                        <strong><u>Descripción</u>:</strong> {descStage}
                    </p>

                    <div className="brand-card-body col-lg-6 brandCustom">
                        <div>
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{startProvide}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Previsto</div>
                        </div>
                        <div>
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{endProvide}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Fin Previsto</div>
                        </div>
                    </div>

                    <div className="brand-card-body col-lg-6">
                        <div>
                            <div className="text-value">
                                -
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Real</div>
                        </div>
                        <div>
                            <div className="text-value">
                                -
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Fin Real</div>
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
                            class="form-control"
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
                            class="form-control"
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
                                class="form-control"
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
                                class="form-control"
                                placeholder="" 
                                name="endDateProvideActivityForm"
                                onChange = {e => onChangeAct(e)}
                                value={endDateProvideActivityForm}
                            />
                        </div>

                    </div>

                    <input type="submit" className="btn btn-primary"  value="Agregar Actividad" />

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
                    
            <div className="card-header headerAct">
                <strong>Actividad: {nameActivity}</strong>

                <div className="float-right">
                    <a onClick={e => editActivity()} className="btn btn-primary" title="Editar Etapa">
                        <i className="far fa-edit coloWhite"></i>
                    </a>
                    <a  className="btn btn-danger" title="Eliminar Etapa">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12 descTxt">
                        <strong><u>Descripción</u>:</strong> {descActivity}
                    </p>

                    <div className="brand-card-body col-lg-6 brandCustom">
                        <div>
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{dateStartActivity}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Previsto</div>
                        </div>
                        <div>
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{dateEndActivity}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small"> Fecha de Fin Previsto</div>
                        </div>
                    </div>
                    <div className="brand-card-body col-lg-6">
                        <div>
                            <div className="text-value"> - </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Real</div>
                        </div>
                        <div>
                            <div className="text-value"> - </div>
                            <div className="text-uppercase text-muted small">Fecha de Fin Real</div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
    //#endregion


    //#region edita una actividad


    const editActivitySubmit = async e => {
        e.preventDefault();

        editActivityById({projectId: match.params.idProject, idActivity: idActivitySelect, description: descriptionActivity, startDateProvide: startDateProvideActivity, endDateProvide: endDateProvideActivity});

        setNameAct("");
        modalEditActivity();
    }



    const editActivity = () => {

        SetFormDataActivity({
            descriptionActivity: descActivity,
            startDateProvideActivity: dateStartActivity,
            endDateProvideActivity: dateEndActivity
        });
        
        modalEditActivity()
    }


    const modalEditActivity = () => {
        if(showModalActivityEdit){
            setModalActivityEdit(false);
        }else{
            setModalActivityEdit(true);
        }
    }

    const modalActivityEdit = (
        <Modal size="lg" show={showModalActivityEdit} onHide={e => modalEditActivity()}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Actividad: {nameActivity}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <form className="form" onSubmit={e => editActivitySubmit(e)}>

                    <div className="form-group">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción de la Actividad" 
                            name="descriptionActivity"
                            minLength="3"
                            maxLength="60"
                            onChange = {e => onChangeActivity(e)}
                            value={descriptionActivity}
                        />
                    </div>

                    <div className="row">

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Inicio Previsto (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="startDateProvideActivity"
                                onChange = {e => onChangeActivity(e)}
                                value={startDateProvideActivity}
                            />
                        </div>

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Fin Previsto (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="endDateProvideActivity"
                                onChange = {e => onChangeActivity(e)}
                                value={endDateProvideActivity}
                            />
                        </div>

                    </div>

                    <input type="submit" className="btn btn-primary" value="Editar Tarea" />

                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalEditActivity()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>

    )


    //#endregion





    

    //#region DATOS DE TAREA

    var cardTask = (
        <div className="card cardCustomStage">
                    
            <div className="card-header headerTask">
                <strong>Tarea: {nameTask}</strong>

                <div className="float-right">
                    <a onClick={e => editTask()} className="btn btn-primary" title="Editar Etapa">
                        <i className="far fa-edit coloWhite"></i>
                    </a>
                    <a onClick={e => modalDeleteTask()} className="btn btn-danger" title="Eliminar Tarea">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12 descTxt">
                        <strong><u>Descripción</u>:</strong> {descTask}
                    </p>

                    <div className="brand-card-body col-lg-6 brandCustom">
                        <div>
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{dateStartPre}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Previsto</div>
                        </div>
                        <div>
                            <div className="text-value">
                                <Moment format="DD/MM/YYYY">{dateEndPre}</Moment>
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Fin Previsto</div>
                        </div>
                    </div>

                    <div className="brand-card-body col-lg-6">
                        <div>
                            <div className="text-value">
                                -
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Real</div>
                        </div>
                        <div>
                            <div className="text-value">
                                -
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Fin Real</div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
    //#endregion

    //#region  modal para agregar tareas


    const addTaskToStage = (idPass, namePassTask, descPassTask) => {
        
        setAlerts(false);

        var filterTask =  listTaskSelect.filter(function(t) {
            return t.taskId == idPass;
        });

        if(filterTask.length > 0){
            setTxt("La tarea ya existe para la actividad");
            setAlerts(true);
        }else{

            if( startDateProvideTask != "" && endDateProvideTask != ""){
                registerTask({projectId: match.params.idProject, stageId: idStageState, activityId: idActivitySelect,taskId:idPass, name: namePassTask, description:descPassTask, startDateProvideTask, endDateProvideTask})
                setModalTaskAdd();
            }else{
                setTxt("Debes ingresar las fechas de inicio y fin previsto");
                setAlerts(true)
            }
            
        }

    }

    if(tasks != null){
        var listTask = tasks.map((te, item) =>
            <li key={te._id} className=" list-group-item-action list-group-item groupUser">
                {te.name}

                <div className="float-right">

                    <a onClick={e => addTaskToStage(te._id, te.name, te.description)} className="btn btn-success" title="Añadir">
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>

                </div>
            </li>
        );
    }

    const addTask = (arrayListPass) => {
        setTaskList(arrayListPass)
        modalAddTask();
    }

    const modalAddTask = () => {
        if(showAddTask){
            setModalTaskAdd(false);
        }else{
            setModalTaskAdd(true);
        }
    }

    const modalTask = (
        <Modal size="lg" show={showAddTask} onHide={e => setModalTaskAdd()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar tarea para la actividad: {nameActivity}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Alert show={showAlert} variant="danger">
                    <Alert.Heading>{txtAlert}</Alert.Heading>
                </Alert>
                            
                <div className="row">

                    <div className="form-group col-lg-6">
                        <h5>Fecha de Inicio Previsto (*)</h5>
                        <input 
                            type="date" 
                            placeholder="" 
                            name="startDateProvideTask"
                            onChange = {e => onChangeTask(e)}
                            value={startDateProvideTask}
                        />
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Fecha de Fin Previsto (*)</h5>
                        <input 
                            type="date" 
                            placeholder="" 
                            name="endDateProvideTask"
                            onChange = {e => onChangeTask(e)}
                            value={endDateProvideTask}
                        />
                    </div>

                </div>

                {listTask}

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => setModalTaskAdd()}>
                Cerrar
                </Button>
            </Modal.Footer>
        </Modal>

    )
    //#endregion

    //#region eliminar una tarea

    const deleteTask = (idTaskDelete) => {
        deleteTaskById({projectId: match.params.idProject, idTask: idTaskDelete});
        modalDeleteTask();
        setNameTask("");
    }
    
    const modalDeleteTask = () => {
        if(showModalTaskDelete){
            setModalTaskDelete(false);
        }else{
            setModalTaskDelete(true);
        }
    }

    const modalTaskDelete = (
        <Modal show={showModalTaskDelete} onHide={e => modalDeleteTask()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <p>Estas seguro de eliminar la tarea {nameTask}</p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalDeleteTask()}>
                    Cerrar
                </Button>
                <a onClick={e => deleteTask(itemTask)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>

    )

    //#endregion

    //#region Editar una tarea

    const editTask = () => {

        //SetFormDataTask({...formDataAct, startDateProvideTask: dateStartPre})

        SetFormDataTask({
            descriptionTask: descTask,
            startDateProvideTask: dateStartPre,
            endDateProvideTask: dateEndPre
        });
        
        modalEditTask()
    }

    const modalEditTask = () => {
        if(showModalTaskEdit){
            setModalTaskEdit(false);
        }else{
            setModalTaskEdit(true);
        }
    }
    

    const editTaskSubmit = async e => {
        e.preventDefault();

        editTaskById({projectId: match.params.idProject, idTask: itemTask, description: descriptionTask, startDateProvideTask, endDateProvideTask});

        setDescTask(descriptionTask);
        setDateStartPre(startDateProvideTask);
        setDateEndPre(endDateProvideTask)

        modalEditTask();
    }


    const modalTaskEdit = (
        <Modal size="lg" show={showModalTaskEdit} onHide={e => modalEditTask()}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Tarea: {nameTask}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <form className="form" onSubmit={e => editTaskSubmit(e)}>

                    <div className="form-group">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            class="form-control"
                            placeholder="Descripción de la Tarea" 
                            name="descriptionTask"
                            minLength="3"
                            maxLength="60"
                            onChange = {e => onChangeTask(e)}
                            value={descriptionTask}
                        />
                    </div>

                    <div className="row">

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Inicio Previsto (*)</h5>
                            <input 
                                type="date" 
                                class="form-control"
                                placeholder="" 
                                name="startDateProvideTask"
                                onChange = {e => onChangeTask(e)}
                                value={startDateProvideTask}
                            />
                        </div>

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Fin Previsto (*)</h5>
                            <input 
                                type="date" 
                                placeholder="" 
                                name="endDateProvideTask"
                                onChange = {e => onChangeTask(e)}
                                value={endDateProvideTask}
                            />
                        </div>

                    </div>

                    <input type="submit" className="btn btn-primary" value="Editar Tarea" />

                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalEditTask()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>

    )

    //#endregion
        console.log("ETAPAS",stage)
    return (
        <Fragment>

            <div className="row rowProject">
                    <Link to="/admin-project" className="btn btn-secondary">
                            Atrás
                    </Link>

                    
            </div>    
            <h2>Proyecto: <strong>{projectFilter.name}</strong></h2>   
            <div className="row rowProject">
             
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Cliente:</div>
                    <strong>{projectFilter.client.nameClient}</strong>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Referente del Cliente:</div>
                    <div><strong>{projectFilter.agent.surnameAgent}, {projectFilter.agent.nameAgent}</strong>
                       
                    </div>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Equipo Asignado:</div>
                    <strong>{projectFilter.team.nameTeam}</strong>
                </div>
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Responsable del Proyecto:</div>
                    <strong>{projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].surname}, {projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].name}</strong>
                </div>
            </div>
          
            <div className="row">

                <div className="col-lg-5">
                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Etapas</strong>

                            <div className="float-right">
                                <a onClick={e => addStage()} className="btn btn-primary" title="Agregar Etapa">
                                    <i className="fas fa-plus-circle coloWhite"></i>
                                </a>
                            </div>

                        </div>

                        <div className="card-body bodyTeamStage">

                            {stage.length !== 0 ? 
                                <Accordion>
                                    {listStageAcordion}
                                </Accordion>
                                : 
                                <li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Etapas</b></center></li>
                            }

                        </div>

                    </div>
                </div>

                <div className="col-lg-7">
                    
                    {nameStage !== "" ? cardStage : ""}

                    {nameActivity !== "" && nameStage !== "" ? cardActivity : ""}

                    { nameActivity !== "" && nameStage !== "" && nameTask !== "" ? cardTask : ""}

                </div>

            </div>
                
            {modalStage}

            {modalAct}

            {modalTask}

            {modalTaskDelete}

            {modalTaskEdit}

            {modalActivityEdit}
            
        </Fragment>
    )

}

AdminProjectActivity.propTypes = {
    registerStage: PropTypes.func.isRequired,
    getAllTask: PropTypes.func.isRequired,
    getFilterStage: PropTypes.func.isRequired,
    editStage: PropTypes.func.isRequired,
    registerActivity: PropTypes.func.isRequired,
    registerTask: PropTypes.func.isRequired,
    deleteTaskById: PropTypes.func.isRequired,
    editTaskById: PropTypes.func.isRequired,
    editActivityById: PropTypes.func.isRequired, 
    tasks: PropTypes.object.isRequired,
    stage: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    stage: state.stage,
    project: state.project,
    tasks: state.task
})


export default connect(mapStateToProps, {editActivityById, editTaskById, deleteTaskById, getAllTask, registerStage, getFilterStage, editStage, registerActivity, registerTask,setAlert})(AdminProjectActivity)
