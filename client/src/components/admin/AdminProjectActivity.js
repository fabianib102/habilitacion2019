import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';

import {setAlert} from '../../actions/alert';
import {getFilterStage, registerStage, editStage, registerActivity, registerTask, deleteTaskById, editTaskById, editActivityById, deleteStageById} from '../../actions/stage';
import {deleteActivityById} from '../../actions/activity';
import { getAllTask } from '../../actions/task';
import { clearTimeout } from 'timers';

const AdminProjectActivity = ({match,setAlert,editActivityById, editTaskById, deleteTaskById,deleteStageById,deleteActivityById, registerTask, getAllTask, tasks: {tasks}, stage: {stage, loading}, project: {project}, registerStage, getFilterStage, editStage, registerActivity, auth:{user}}) => {

    const [showModalStage, setModalStage] = useState(false);

    const [showModalActivity, setModalActiviy] = useState(false);

    const [editBool, setBoolStage] = useState(false);

    const [itemStage, setIndexStage] = useState(-1);

    const [itemActivity, setIndexAct] = useState(-1);

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

    const [startActProvide, setStartAct] = useState("");

    const [endActProvide, setEndAct] = useState("");

    const [startTaskProvide, setStartTask] = useState("");

    const [endTaskProvide, setEndTask] = useState("");

    const [showAddTask, setModalTaskAdd] = useState(false);

    const [showAlert, setAlerts] = useState(false);

    const [idActivitySelect, setIdActivity] = useState("");

    const [txtAlert, setTxt] = useState("");

    const [listTaskSelect, setTaskList] = useState([]);

    const [showModalStageDelete, setModalStageDelete] = useState(false);

    const [showModalActivityDelete, setModalActivityDelete] = useState(false);

    const [showModalTaskDelete, setModalTaskDelete] = useState(false);

    const [showModalTaskEdit, setModalTaskEdit] = useState(false);

    const [showModalActivityEdit, setModalActivityEdit] = useState(false);
    const [usersAssigned, setUserTask] = useState("");

    const [statusStage, setStatusStage] = useState("");

    const [statusActivity, setStatusActivity] = useState("");

    const [statusTask, setStatusTask] = useState("");

    const [startDateStage, setStartDateStage] = useState("");
    const [startDateActivity, setStartDateActivity] = useState("");
    const [startDateTask, setStartDateTask] = useState("");

    const [endDateStage, setEndDateStage] = useState("");
    const [endDateActivity, setEndDateActivity] = useState("");
    const [endDateTask, setEndDateTask] = useState("");


    const [durationStage, setDurationStage] = useState("");
    const [durationActivity, setDurationActivity] = useState("");
    const [durationTask, setDurationTask] = useState("");

    const [txtFilter, setTxtFilter] = useState("");

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
    
    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        getAllTask();
        getFilterStage(match.params.idProject);
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 5000);
        }
    }, [getFilterStage, getAllTask, showSpinner]);

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const {name, description, startDateProvide, endDateProvide, startDate, endDate} = formData;

    const onChangeAct = e => SetFormDataAct({...formDataAct, [e.target.name]: e.target.value});

    const {nameActivityForm, descriptionActivityForm, startDateProvideActivityForm, endDateProvideActivityForm} = formDataAct;

    var projectFilter;
    
    //Region Spinner
    const spin = () => setShowSpinner(!showSpinner);
    
    class Box extends Component{
        render(){
            return(
                <center class="itemTeam list-group-item-action list-group-item">
                    <h5>Cargando...
                        <Spinner animation="border" role="status" variant="primary" >
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </h5>
                </center>
            )
        }
    }

    if(project !== null){

        let projectFil =  project.filter(function(pro) {
            return pro._id === match.params.idProject;
        });

        projectFilter = projectFil[0];

        // console.log("PROY: ", projectFilter);
        //Para uso de restricciones de fechas
        var fechaStartLimit = projectFilter.startDateExpected.split("T")[0];
        var fechaEndLimit = projectFilter.endDateExpected.split("T")[0]
        //console.log(fechaStartLimit,fechaEndLimit)
        //console.log("stage",stage)
        if(stage !== null & stage !== undefined){
            var stageFil =  stage.filter(function(stg) {
                return stg.projectId === match.params.idProject;
            });
            // console.log("ETAPAS: ", stageFil);
        }
        
    }else{
        return <Redirect to='/admin-project'/>
    }
//ls._id, item, ls.name, ls.description, ls.startDateProvide, ls.endDateProvide, ls.status,ls.startDate,ls.endDate
//idStage, itemPass, namePass, descPass, startPass, endPass,status,startDateS,endDateS
    const selectStage = (stageSelected,itemPass) => {        
        setIndexStage(itemPass);
        setnameStage(stageSelected.name);
        setdescStage(stageSelected.description);
        setIdStage(stageSelected._id);
        setStart(stageSelected.startDateProvide);
        setEnd(stageSelected.endDateProvide);
        setStartDateStage(stageSelected.startDate);
        setEndDateStage(stageSelected.endDate);
        setNameAct("");
        setStatusStage(stageSelected.status);
        setDurationStage(stageSelected.estimated_duration)
        setIndexAct(-1)
    }


    const selectActivity = (activitySelected, itemPass) => {  
        console.log("ACTIVIDAD SELECCIONADA",activitySelected)      
        setNameAct(activitySelected.name);
        setdesc(activitySelected.description);
        setIdActivity(activitySelected._id);
        setIndexAct(itemPass);
        setDateStartAct(convertDate(activitySelected.startDateProvide));        
        setDateEndAct(convertDate(activitySelected.endDateProvide));
        setStartDateActivity(activitySelected.startDate);
        setEndDateActivity(activitySelected.endDate);
        setNameTask("");
        setStatusActivity(activitySelected.status); 
        setDurationActivity(activitySelected.estimated_duration)       

    }
//task._id, task.name, task.description, task.startDateProvideTask, task.endDateProvideTask, task.assigned_people,task.status,task.startDate,task.endDate
//itemTaskPass, nameTaskPass, descTaskPass, startDatePass, endDatePass,assigned_people,status,startDateT,endDateT
    const selectTask = (taskSelected,item) => {               
        setItemTask(taskSelected._id);
        setNameTask(taskSelected.name);
        setDescTask(taskSelected.description);
        setDateStartPre(convertDate(taskSelected.startDateProvideTask));
        setDateEndPre(convertDate(taskSelected.endDateProvideTask));
        setStatusTask(taskSelected.status)
        setStartDateTask(taskSelected.startDate);
        setEndDateTask(taskSelected.endDate);
        setDurationTask(taskSelected.duration)  
        
        let assigned = taskSelected.assigned_people.map((us)=>
        <div className="col col-lg-3">- <b>{us.surname} {us.name}</b></div>
        )
        
        setUserTask(assigned);
    }
    var stageBand = false
    var controlSpinner = false;

    if(stage !== null){

        if (stage.length !== 0){// hay etapas,muestro
            stageBand = true;
            controlSpinner = false;
        }

        console.log(projectFilter)
        console.log(stage)

        var listStageAcordion = stage.map((ls, item)=>

            <Card key={ls._id}>

                <Card.Header onClick={e => selectStage(ls, item)} className={item === itemStage ? "selectStage": ""}>
                    <Accordion.Toggle as={Button} variant="link tree" eventKey={item}>
                        
                        <div className="float-left">
                            {item === itemStage ? <i class="fas fa-minus-square"></i> :<i class="fas fa-plus-square"></i>}{" "}  
                            {ls.status === "CREADA" ? <span  title="Creada"><i class="fas fa-circle create"></i></span>: ""}
                            {ls.status === "ACTIVA" ?<span title="Activa"><i class="fas fa-circle activo"></i></span> : ""}
                            {ls.status === "SUSPENDIDA" ?<span title="Suspendida"><i class="fas fa-circle suspence"></i></span> : ""}
                            {ls.status === "CANCELADA" ?<span title="Cancelada"><i class="fas fa-circle cancel"></i></span> : ""}
                            {ls.status === "TERMINADA" ?<span title="Terminada"><i class="fas fa-circle terminate"></i></span> : ""}
                            {" "}{ls.name}
                        </div>
                        <div className="float-right">
                            <a className="btn btn-success btnAddAct" onClick={e => addActivity()} title="Agregar Actividad">
                                <i className="fas fa-plus-circle coloWhite"></i>
                            </a>
                        </div>                       
                    </Accordion.Toggle>
                </Card.Header>

                <Accordion.Collapse eventKey={item}>
                    <Card.Body>
                        <Accordion>
                            {ls.arrayActivity.length > 0 ? 
                                ls.arrayActivity.map((act, itemAct)=>
                                    <Card key={act._id}>
                                        <Card.Header onClick={e => selectActivity(act,itemAct)} className={itemActivity === act._id ? "cardAct": ""}>
                                            <Accordion.Toggle as={Button} variant="link tree" eventKey={act._id} >
                                                <div className="float-left">
                                                {itemActivity === act._id ? <i class="fas fa-minus-square"></i> :<i class="fas fa-plus-square"></i>}{" "}
                                                {act.status === "CREADA" ? <span  title="Creada"><i class="fas fa-circle create"></i></span>: ""}
                                                {act.status === "ACTIVA" ?<span title="Activa"><i class="fas fa-circle activo"></i></span> : ""}
                                                {act.status === "SUSPENDIDA" ?<span title="Suspendida"><i class="fas fa-circle suspence"></i></span> : ""}
                                                {act.status === "CANCELADA" ?<span title="Cancelada"><i class="fas fa-circle cancel"></i></span> : ""}
                                                {act.status === "TERMINADA" ?<span title="Terminada"><i class="fas fa-circle terminate"></i></span> : ""}
                                                {" "}{act.name} 
                                                </div>
                                                <div className="float-right">
                                                    <a onClick={e => addTask(act.arrayTask)} className="btn btn-warning btnTask" title="Agregar Tarea">
                                                            <i className="fas fa-plus-circle coloWhite"></i>
                                                    </a>
                                                </div>
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={act._id}>
                                            <Card.Body>
                                                <div className="card-body">

                                                    <ul className="list-group">

                                                        {!(act.arrayTask.length > 0) ? <li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Tareas</b></center></li> : ""}

                                                        {act.arrayTask.map((task,itemTaskSelect)=>
                                                            <li key={task._id} onClick={e => selectTask(task,itemTaskSelect)} className={task._id === itemTask ? "list-group-item-action list-group-item selectTask":"list-group-item-action list-group-item"}>
                                                               {task.assigned_people.length >0  & task.assigned_people.length !== undefined ? <i class="fas fa-user-tag" title="RRHH Asignados"></i>:" " }{" "}
                                                               {task.status === "CREADA" ? <span  title="Creada"><i class="fas fa-circle create"></i></span>: ""}
                                                               {task.status === "ASIGNADA" ? <span  title="Asignada"><i class="fas fa-circle create"></i></span>: ""}
                                                                {task.status === "ACTIVA" ?<span title="Activa"><i class="fas fa-circle activo"></i></span> : ""}
                                                                {task.status === "SUSPENDIDA" ?<span title="Suspendida"><i class="fas fa-circle suspence"></i></span> : ""}
                                                                {task.status === "CANCELADA" ?<span title="Cancelada"><i class="fas fa-circle cancel"></i></span> : ""}
                                                                {task.status === "TERMINADA" ?<span title="Terminada"><i class="fas fa-circle terminate"></i></span> : ""}
                                                                {" "}{task.name}
                                                            </li>
                                                        )}

                                                    </ul>
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                )
                                : 
                                <li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Actividades</b></center></li>
                            }
                        </Accordion>

                    </Card.Body>
                </Accordion.Collapse>
                
            </Card>

        )

    }else{
        controlSpinner = true
    }

    if(stageFil !== null & stage !== null){
        //console.log(stageFil)
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
        //console.log(startDateProvide,endDateProvide)
        if (startDateProvide<=endDateProvide){
            //console.log(startDateProvide,endDateProvide,startDateProvide<=endDateProvide)
            if(editBool){
                editStage({projectId, idStage:idStageState, name, description, startDateProvide, endDateProvide});
            }else{
                registerStage({projectId, name, description, startDateProvide, endDateProvide, idUserCreate:user._id});
            }
        }else{//fechas incorrectas
            //console.log(startDateProvide,endDateProvide,startDateProvide<=endDateProvide)
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
                <Modal.Title>{!editBool ? "Editar Etapa" : "Agregar Etapa"}</Modal.Title>
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
                            maxLength="100"
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
                            maxLength="200"
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

                    <input type="submit" className="btn btn-primary" value={!editBool ? "Agregar Etapa" : "Modificar Etapa"} />

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
        var date = `${anio}-${mes}-${dia}`;
        return date;
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

      //#region eliminar una etapa

    const deleteStage = (idStageDelete) => {
        deleteStageById(idStageDelete);
        modalDeleteStage();
        // setNameTask("");
    }
    
    const modalDeleteStage = () => {
        if(showModalStageDelete){
            setModalStageDelete(false);
        }else{
            setModalStageDelete(true);
        }
    }

    const modalStageDelete = (
        <Modal show={showModalStageDelete} onHide={e => modalDeleteStage()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Etapa</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <p>¿Estás seguro de eliminar la etapa <b>{nameStage}</b>, con todas sus actividades y tareas ?</p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalDeleteStage()}>
                    Cerrar
                </Button>
                <Link onClick={e => deleteStage(idStageState)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>

    )

    //#endregion

    var cardStage = (
        <div className="card cardCustomStage">
                    
            <div className="card-header headerStage">             
            {statusStage === "CREADA" ? <span  title="Creada"><i class="fas fa-circle create"></i></span>: ""}
            {statusStage === "ACTIVA" ?<span title="Activa"><i class="fas fa-circle activo"></i></span> : ""}
            {statusStage === "SUSPENDIDA" ?<span title="Suspendida"><i class="fas fa-circle suspence"></i></span> : ""}
            {statusStage === "CANCELADA" ?<span title="Cancelada"><i class="fas fa-circle cancel"></i></span> : ""}
            {statusStage === "TERMINADA" ?<span title="Terminada"><i class="fas fa-circle terminate"></i></span> : ""}
                <strong> Etapa: {nameStage}</strong>

                <div className="float-right">

                    <a onClick={e => stageEditModal()} className={statusStage === "CREADA" ? "btn btn-primary" :"btn btn-primary hideBtn"} title="Editar Etapa">
                        <i className="far fa-edit coloWhite"></i>
                    </a>
                    <a onClick={e => modalDeleteStage()} className={statusStage === "CREADA" ? "btn btn-danger" :"btn btn-danger hideBtn"} title="Eliminar Etapa">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12 descTxt">
                        <div className="float-left">
                            <u>Descripción</u>: <strong>{descStage}</strong> 
                        </div>
                        <div className="float-right">
                             <u>Duración Estimada</u>: <strong>{durationStage}</strong>{"      "} 
                        </div>
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
                            {startDateStage !== undefined ? <Moment format="DD/MM/YYYY">{startDateStage}</Moment>: "-"}
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Real</div>
                        </div>
                        <div>
                            <div className="text-value">
                            {endDateStage !== undefined ? <Moment format="DD/MM/YYYY">{endDateStage}</Moment>: "-"}
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
        // console.log(startDateProvideActivityForm,endDateProvideActivityForm)
        if (startDateProvideActivityForm<=endDateProvideActivityForm){
            registerActivity({projectId, stageId:idStageState, name: nameActivityForm, description: descriptionActivityForm, startDateProvide: startDateProvideActivityForm, endDateProvide: endDateProvideActivityForm, idUserCreate:user._id});
        }else{//fechas incorrectas
            setAlert('Peíodo de Fechas previstas incorrectas.', 'danger');
        }
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
        // console.log("->",startProvide,endProvide)
        setStartAct(startProvide.split("T")[0])
        setEndAct(endProvide.split("T")[0]);
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
                            maxLength="100"
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
                            maxLength="200"
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
                                min = {startActProvide}
                                max = {endActProvide}
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
                                min = {startActProvide}
                                max = {endActProvide}
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
            {statusActivity === "CREADA" ? <span  title="Creada"><i class="fas fa-circle create"></i></span>: ""}
            {statusActivity === "ACTIVA" ?<span title="Activa"><i class="fas fa-circle activo"></i></span> : ""}
            {statusActivity === "SUSPENDIDA" ?<span title="Suspendida"><i class="fas fa-circle suspence"></i></span> : ""}
            {statusActivity === "CANCELADA" ?<span title="Cancelada"><i class="fas fa-circle cancel"></i></span> : ""}
            {statusActivity === "TERMINADA" ?<span title="Terminada"><i class="fas fa-circle terminate"></i></span> : ""}
                <strong> Actividad: {nameActivity}</strong>

                <div className="float-right">
                    <a onClick={e => editActivity()} className={statusActivity === "CREADA" | statusActivity === "CREADO" ? "btn btn-primary": "btn btn-primary hideBtn"} title="Editar Actividad">
                        <i className="far fa-edit coloWhite"></i>
                    </a>
                    <a onClick={e => modalDeleteActivity()} className={statusActivity === "CREADA" | statusActivity === "CREADO" ?"btn btn-danger": "btn btn-danger hideBtn"} title="Eliminar Actividad">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12 descTxt">
                        <div className="float-left">
                            <u>Descripción</u>: <strong>{descActivity}</strong> 
                        </div>
                        <div className="float-right">
                             <u>Duración Estimada</u>: <strong>{durationActivity}</strong>{"      "} 
                        </div>
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
                            <div className="text-value">
                            {startDateActivity !== undefined ?   <Moment format="DD/MM/YYYY">{startDateActivity}</Moment> :"-"}
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Real</div>
                        </div>
                        <div>
                            <div className="text-value">
                            {endDateActivity !== undefined ?  <Moment format="DD/MM/YYYY">{endDateActivity}</Moment> :"-"}
                            </div>
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

    //#region eliminar una actividad

        const deleteActivity = (idActivityDelete) => {
            deleteActivityById(idActivityDelete);
            modalDeleteActivity();
        }
        
        const modalDeleteActivity = () => {
            if(showModalActivityDelete){
                setModalActivityDelete(false);
            }else{
                setModalActivityDelete(true);
            }
        }
    
        const modalActivityDelete = (
            <Modal show={showModalActivityDelete} onHide={e => modalDeleteActivity()}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Actividad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
    
                    <p>¿Estás seguro de eliminar la actividad <b>{nameActivity}</b>, con todas sus tareas ?</p>
    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={e => modalDeleteActivity()}>
                        Cerrar
                    </Button>
                    <Link onClick={e => deleteActivity(idActivitySelect)} className="btn btn-primary" >
                        Si, estoy seguro.
                    </Link>
                </Modal.Footer>
            </Modal>
    
        )
    
        //#endregion

    const modalActivityEdit = (
        <Modal size="lg" show={showModalActivityEdit} onHide={e => modalEditActivity()}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Actividad: <b>{nameActivity}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <form className="form" onSubmit={e => editActivitySubmit(e)}>

                    <div className="form-group">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            class="form-control"
                            placeholder="Descripción de la Actividad" 
                            name="descriptionActivity"
                            minLength="3"
                            maxLength="200"
                            onChange = {e => onChangeActivity(e)}
                            value={descriptionActivity}
                        />
                    </div>

                    <div className="row">

                        <div className="form-group col-lg-6">
                            <h5>Fecha de Inicio Previsto (*)</h5>
                            <input 
                                type="date" 
                                class="form-control"
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
                                class="form-control"
                                placeholder="" 
                                name="endDateProvideActivity"
                                onChange = {e => onChangeActivity(e)}
                                value={endDateProvideActivity}
                            />
                        </div>

                    </div>

                    <input type="submit" className="btn btn-primary" value="Modificar Actividad" />

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
            {statusTask === "CREADA" ? <span  title="Creada"><i class="fas fa-circle create"></i></span>: ""}
            {statusTask === "ASIGNADA" ? <span  title="Asignada"><i class="fas fa-circle create"></i></span>: ""}
            {statusTask === "ACTIVA" ?<span title="Activa"><i class="fas fa-circle activo"></i></span> : ""}
            {statusTask === "SUSPENDIDA" ?<span title="Suspendida"><i class="fas fa-circle suspence"></i></span> : ""}
            {statusTask === "CANCELADA" ?<span title="Cancelada"><i class="fas fa-circle cancel"></i></span> : ""}
            {statusTask === "TERMINADA" ?<span title="Terminada"><i class="fas fa-circle terminate"></i></span> : ""}                
                <strong> Tarea: {nameTask}</strong>

                <div className="float-right">
                    <Link to={`/admin-project/project-detail-relation-task/${itemTask}`} className={statusTask !== "CREADA" ? "btn btn-success " : "btn btn-success hideBtn " }title="Ver Información">
                        <i className="fas fa-search coloWhite"></i>
                    </Link>
                    <Link to={`/admin-project/project-relation-task/${itemTask}`} className={(statusTask === "CREADA" | statusTask === "ASIGNADA" | statusTask === "ACTIVA") & projectFilter.status !== "SUSPENDIDO" ? "btn btn-success": "btn btn-success hideBtn"} title="Asignar RRHH">
                        <i className="fas fa-user-plus coloWhite"></i>
                    </Link>
                    <a onClick={e => editTask()} className={projectFilter.status !== "SUSPENDIDO" &&(statusTask === "CREADA" | statusTask === "ASIGNADA") ? "btn btn-primary" :"btn btn-primary hideBtn" } title="Editar Tarea">
                        <i className="far fa-edit coloWhite"></i>
                    </a>
                    <a onClick={e => modalDeleteTask()} className={projectFilter.status !== "SUSPENDIDO" &&(statusTask === "CREADA" | statusTask === "ASIGNADA") ? "btn btn-danger":"btn btn-danger hideBtn"} title="Eliminar Tarea">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </div>

            <div className="card-body bodyCustom">

                <div className="row">

                    <p className="col-lg-12 descTxt">
                        <div className="float-left">
                                <u>Descripción</u>: <strong>{descTask}</strong> 
                            </div>
                            <div className="float-right">
                                <u>Duración Estimada</u>: <strong>{durationTask}</strong>{"      "} 
                        </div>{"      "}
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
                                {startDateTask !== undefined ?<Moment format="DD/MM/YYYY">{startDateTask}</Moment> :"-"}
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Inicio Real</div>
                        </div>
                        <div>
                        <div className="text-value">
                            {endDateTask !== undefined ? <Moment format="DD/MM/YYYY">{endDateTask}</Moment>:"-"}
                            </div>
                            <div className="text-uppercase text-muted small">Fecha de Fin Real</div>
                        </div>
                    </div>
                    
                </div>
                {/* <p className="col-lg-12 descTxt">
                    <u>RRHH Asignados:</u> 
                </p> */}
                <div className="row">   
                    <div className="col col-lg-3">
                        <u>RRHH Asignados:</u> 
                    </div>
                    {usersAssigned.length === 0 ?  <div className="col col-lg-6"><b> -Sin Asignar- </b></div> : usersAssigned}
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
                registerTask({projectId: match.params.idProject, stageId: idStageState, activityId: idActivitySelect,taskId:idPass, name: namePassTask, description:descPassTask, startDateProvideTask, endDateProvideTask, idUserCreate:user._id})
                setModalTaskAdd();
            }else{
                setTxt("Debes ingresar las fechas de inicio y fin previsto");
                setAlerts(true)
            }
            
        }

    }

    if(tasks != null){

        let listT = tasks;

        if(txtFilter !== ""){

            listT =  tasks.filter(function(task) {
                return task.name.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0
            });

        }

        var listTask = listT.map((te, item) =>
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
        setStartTask(dateStartActivity.split("T")[0])
        setEndTask(dateEndActivity.split("T")[0]);
        modalAddTask();
    }

    const modalAddTask = () => {
        if(showAddTask){
            setModalTaskAdd(false);
        }else{
            setModalTaskAdd(true);
        }
    }

    //controla el nombre de la tarea para filtrarlo
    const changeTxt = e => {
        setTxtFilter(e.target.value);
    }

    const modalTask = (
        <Modal size="lg" show={showAddTask} onHide={e => setModalTaskAdd()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar tarea para la actividad: <b>{nameActivity}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Alert show={showAlert} variant="danger">
                    {txtAlert}
                </Alert>
                            
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
                            min = {startTaskProvide}
                            max = {endTaskProvide}
                        />
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Fecha de Fin Previsto (*)</h5>
                        <input 
                            type="date" 
                            class="form-control"
                            placeholder="" 
                            name="endDateProvideTask"
                            onChange = {e => onChangeTask(e)}
                            value={endDateProvideTask}
                            min = {startTaskProvide}
                            max = {endTaskProvide}
                        />
                    </div>

                </div>

                <div className="form-group col-lg-12">
                    <h5>Buscar Tarea</h5>
                    <input type="text" class="form-control" placeholder="Ingresa la tarea" onChange = {e => changeTxt(e)}/>
                </div>
                
                <div className="card-body bodyLocaly">
                    
                    <ul className="list-group">
                    {listTask}
                    </ul>

                </div>

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

                <p>¿Estás seguro de eliminar la tarea <b>{nameTask}</b>?</p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalDeleteTask()}>
                    Cerrar
                </Button>
                <Link onClick={e => deleteTask(itemTask)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
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
                            maxLength="200"
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

    );
    //Spinner
    const spinner = (<center class="itemTeam list-group-item-action list-group-item">
                        <h5>Cargando...
                            <Spinner animation="border" role="status" variant="primary" >
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </h5>
                    </center>);
    //#endregion

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
                        {/* <button onClick={spin}>..</button> */}
                        {stageBand ? spin : ""}
                            {stageBand ? 
                                
                                <Accordion>
                                    {showSpinner && <Box/>}
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
            
            {modalStageDelete}

            {modalActivityDelete}
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
    deleteStageById:PropTypes.func.isRequired,
    deleteActivityById: PropTypes.func.isRequired,
    editTaskById: PropTypes.func.isRequired,
    editActivityById: PropTypes.func.isRequired, 
    tasks: PropTypes.object.isRequired,
    stage: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    stage: state.stage,
    project: state.project,
    tasks: state.tasks,
    auth: state.auth,
})


export default connect(mapStateToProps, {editActivityById, editTaskById, deleteTaskById, getAllTask, registerStage, getFilterStage, editStage, registerActivity, registerTask,setAlert, deleteStageById, deleteActivityById})(AdminProjectActivity)
