import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert'
import Moment from 'react-moment';
import moment from 'moment';
import { Modal, Button, Card, Spinner} from 'react-bootstrap';
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { getTaskByUser } from '../../actions/user';
import {registerDedication, registerDedicationAndTerminate} from '../../actions/project';
import {terminateTaskById, suspenseTaskById, reactiveTaskById } from '../../actions/stage';

const TeamMemberTask = ({registerDedication,terminateTaskById,registerDedicationAndTerminate, match, auth : {user,isAuthenticated, loading}, getTaskByUser, userTask: {userTask}, suspenseTaskById, reactiveTaskById}) => {
 
    const [currentPage, setCurrent] = useState(1);

    const [todosPerPage] = useState(5);

    const [nameComplete, setComplete] = useState("");

    const [IdDelete, setId] = useState("");    
    
    const [taskSelected, setTask] = useState("");

    const [txtFilter, setTxtFilter] = useState("");

    const [showAlert, setShowAlert] = useState(false);

    const [dedicationsCurrentPage, setDedicationsCurrent] = useState(1);

    const [projectFilter, setProjectFilter] = useState("");

    const [stageFilter, setStageFilter] = useState("");

    const [activityFilter, setActivityFilter] = useState("");

    const [minDateAsignated, setDateAsignated] = useState("");

    const [show, setShow] = useState(false);

    const [showSuspend, setSuspendShow] = useState(false);

    const [showDetailDedication, setShowDetailDedications] = useState(false);

    const [showWorkRegister, setWorkRegisterShow] = useState(false);

    const [showRestart, setRestartShow] = useState(false);

    const [statusFilter, setStatus] = useState("");

    const[reason, setReason]= useState("");

    const [dedicationForm, setDedicationForm] = useState({
        time: '',
        date: today,
        observation: ''

    });

    useEffect(() => {
        getTaskByUser(match.params.idUser);
    }, [getTaskByUser, match.params.idUser]);
        
    var listProject = [];
    var listStage = [];
    var listActivity = [];

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;

    // var redDate = (date) => {
    //     var current = moment().locale('ar');
    //     current = current.add(3, 'days')        
    //     var date2 = moment.utc(date);
    //     // console.log("act+3",current,date2, current>date2)
    //     if(current>=date2) return <Moment format="DD/MM/YYYY" className='btn-danger'>{date}</Moment>
    //     else return <Moment format="DD/MM/YYYY">{date}</Moment>
    // } 

    // funcion para dada una fecha valida que este a 3 dias de la fecha actual, si no esta lo marca en amarillo
    var yellowDate = (date) => {
        var current = moment().locale('ar');
        current = current.add(3, 'days')        
        var date2 = moment.utc(date);

        if(current>=date2) return <Fragment><Moment format="DD/MM/YYYY" className='btn-warning'>{date}</Moment><span className="badge badge-warning"><i className="fas fa-exclamation-triangle fax2"></i></span>  </Fragment>
        else return <Moment format="DD/MM/YYYY">{date}</Moment>
    }


    // valida que sea rol de integrante del equipo
    if(user !== null && isAuthenticated){
        if(user.rol !== "Integrante de Equipo de Proyecto"){
            return <Redirect to={`/`}/>            
        }      
    }

    const modalTeamMember = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    
    // pregunta para suspender la tarea asiganada al team member
    const modalSuspend = () => {
        if(showSuspend){
            setSuspendShow(false);
        }else{
            setSuspendShow(true);
        }
    }

    // pregunta para registrar trabajo a la tarea asiganada al team member
    const modalWorkRegister = () => {
        if(showWorkRegister){
            setWorkRegisterShow(false);
        }else{
            setWorkRegisterShow(true);
        }

    }
 
    const modalRestart = () =>{
        if(showRestart){
            setRestartShow(false);
        }else{
            setRestartShow(true);
        }
    }
    
    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }


    const modifyStatus = (e) => {
        setStatus(e.target.value);
        setCurrent(1);
    }

    const askEnd = (taskSelected) => {
        setTask(taskSelected)
        setComplete(taskSelected.name)
        setId(taskSelected._id)
        modalTeamMember();
    }

    const askSuspend = (taskSelected) => {
        setTask(taskSelected)
        setComplete(taskSelected._name)
        setId(taskSelected._id)
        modalSuspend();
    }

    const askWorkRegister = (taskSelected) => {       
        //fecha para restringir mínimo para asignar RRHH
        let dateMin =(taskSelected.dateUpAssigned).split("T")[0]; 
        setDateAsignated(dateMin)
        setTask(taskSelected)        
        modalWorkRegister();
    }

    // Agregar la razon de la suspension de Tarea.

    
    const addReason = (e) => {
        setReason(e.target.value);
    }

    //Terminar Tarea
    const endTask = () => {
        // console.log(taskSelected)
        terminateTaskById({id:taskSelected.taskId, idUserCreate:user._id,date: new Date()});
        modalTeamMember();
    }
    //Suspender Tarea
    const suspendTask = () => {
        suspenseTaskById({id:taskSelected.taskId,idUserCreate: user._id, reason, date:new Date()});
        modalSuspend();
    }

    //Reactivar Tarea
    const restartTask = () => {
        reactiveTaskById({id:taskSelected.taskId, idUserCreate:user._id, date:new Date()});
        modalRestart();
    }


    const changeDedicationsPagin = (event) => {
        setDedicationsCurrent(Number(event.target.id));
    }

    //# region ayudas contextuales
    const popoverTotal = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Total de Dedicaciones en la Tarea</Popover.Title>
          <Popover.Content>
            Total de Hs. dedicadas de todas las personas asignadas a tarea.
            Ej. 1.5 -> 1 Hs. y 30 min.  
          </Popover.Content>
        </Popover>
      );
    const popoverMia = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Total de Dedicaciones (Mías)</Popover.Title>
          <Popover.Content>
            Total de Hs. dedicadas de una persona a la tarea.
            Ej. 1.5 -> 1 Hs. y 30 min.  
          </Popover.Content>
        </Popover>
      );
    const popoverDuration = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Duración Estimada</Popover.Title>
          <Popover.Content>
            Duración estimada de la tarea
            Ej. 1.5 -> 1 Hs. y 30 min.  
          </Popover.Content>
        </Popover>
      );  
      const popoverHs= (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Horas registradas</Popover.Title>
          <Popover.Content>
            Horas Dedicadas para realizar la tarea.
            Ej. 2.5 -> 2 Hs. y 30 min.  
          </Popover.Content>
        </Popover>
      );     
    

    console.log("userTask: ", userTask)

    var showSpinner = true;

    if(userTask != null){        

        // Se arma el filtro de proyectos
        for (let index = 0; index < userTask.length; index++) {
            const element = userTask[index];
            if(!listProject.includes(element.nameProject)){
                listProject.push(element.nameProject);
            }
        }

        var listProjectHtml = listProject.map((proyect) =>
            <option key={proyect} value={proyect}>{proyect}</option>
        );

        // Se arma el filtro de etapas
        for (let index = 0; index < userTask.length; index++) {
            const element = userTask[index];
            if(!listStage.includes(element.nameStage)){
                listStage.push(element.nameStage);
            }
        }

        var listStageHtml = listStage.map((stage) =>
            <option key={stage} value={stage}>{stage}</option>
        );

        // Se arma el filtro de actividad
        for (let index = 0; index < userTask.length; index++) {
            const element = userTask[index];
            if(!listActivity.includes(element.nameActivity)){
                listActivity.push(element.nameActivity);
            }
        }

        var listActivityHtml = listActivity.map((actvity) =>
            <option key={actvity} value={actvity}>{actvity}</option>
        );

        // si no hay tareas crea un aviso de que no hay usuarios        
        if (userTask.length === 0){
            var whithItems = false;
            
            //var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No tiene tareas pendientes</b></center></li>)
            
            var itemNone = (
                <li className='itemTeam list-group-item-action list-group-item'>
                    <center>
                        <h2>Sin tareas pendientes...</h2>
                    </center>
                </li>)
        }
        
        // hay tareas, proceso de tratamiento
        // var whithItems = true;
        
        // Se realiza el filtro de la lista segun el elemento seleccionado
        var listT = userTask;


        if(projectFilter !== ""){
            var listT =  userTask.filter(function(task) {
                return task.nameProject === projectFilter;
            });
        }

        if(stageFilter !== ""){            

            var listT =  userTask.filter(function(task) {
                return task.nameStage === stageFilter;
            });
        }

        if(activityFilter !== ""){            

            var listT =  userTask.filter(function(task) {
                return task.nameActivity === activityFilter;
            });
        }

        if(txtFilter !== ""){

            var listT =  userTask.filter(function(task) {
                return task.name.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0
            });

        }
        if(statusFilter !== ""){// filtro segun estado
            listT =  userTask.filter(function(us) {
                return us.statusTask === statusFilter;
            });

            if (listT.length === 0){
                var whithItems = false;
                var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No existen tareas</b></center></li>)
                // var itemNone = (
                //     <li className='itemTeam list-group-item-action list-group-item'>
                //         <center>
                //             <h2>No existen tareas</h2>
                //             <Spinner animation="border" role="status" variant="primary">
                //             <span className="sr-only">Loading...</span>
                //             </Spinner>
                //         </center>
                //     </li>)
            }else{
                var whithItems = true;
            }
        }
        
        
        
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTask = listT.slice(indexOfFirstTodo, indexOfLastTodo);      

            
        var listTasks = currentTask.map((ti) =>        

        <tr className= {moment(today).isSame(moment(ti.endProvider,"YYYY-MM-DD")) ?  "enLimite":(moment(today).isBefore(moment(ti.endProvider)) ? "":"fueraLimite")}  key={ti._id}>
            <td>
                {ti.name}
                <div className="small text-muted">
                    <b>Fecha de relación: </b><Moment format="DD/MM/YYYY">{moment.utc(ti.dateUpAssigned)}</Moment>
                        {/* {moment(today).isSame(moment(ti.endProvider,"YYYY-MM-DD")) ? "yes":"no"}
                         {moment(today).isBefore(moment(ti.endProvider)) ? "yes":"no"} */}                     
                </div>
            </td>
            <td className="hide-sm">{ti.nameProject}</td>
            <td className="hide-sm">{ti.nameStage}</td>
            <td className="hide-sm">{ti.nameActivity}</td>
            <td>
                <div className="small text-muted">
                    <b>Inicio Previsto: </b><Moment format="DD/MM/YYYY">{moment.utc(ti.startProvider)}</Moment> 
                </div>
                <div className="small text-muted">
                    <b>Fin Previsto: </b> {yellowDate(ti.endProvider)}
                  
                </div>
            </td>
                <td className="hide-sm centerBtn">
                    {ti.statusTask === "CREADA"  ? <span className="badge badge-secundary">CREADA</span> : ""}
                    {ti.statusTask === "ASIGNADA"  ? <span className="badge badge-secundary">ASIGNADA</span> : ""}
                    {ti.statusTask === "ACTIVA"  ? <span className="badge badge-success">ACTIVA</span> : ""}
                    {ti.statusTask === "SUSPENDIDA" ? <span className="badge badge-warning">SUSPENDIDA</span> : ""}
                    {ti.statusTask === "CANCELADA" ? <span className="badge badge-danger">CANCELADA</span> : ""}
                    {ti.statusTask === "TERMINADA" ? <span className="badge badge-dark">TERMINADA</span> : ""}
                </td>
                <td className="hide-sm centerBtn">
                    <a onClick={e => detailDedication(ti)} className= "btn btn-success" title="Visualizar Dedicaciones">
                        <i className="fas fa-search coloWhite"></i>
                    </a>
                    <a onClick={e => askWorkRegister(ti)} className={ti.statusTask === "CREADA" | ti.statusTask === "ASIGNADA" |ti.statusTask === "ACTIVA" ? "btn btn-primary":"btn btn-primary hideBtn"} title="Registrar dedicación">

                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>
                    <a onClick={e => askEnd(ti)} className={ti.statusTask === "CREADA" | ti.statusTask === "ASIGNADA" |ti.statusTask === "ACTIVA" ? "btn btn-success":"btn btn-success hideBtn"} title="Finalizar">
                        <i className="far fa-check-square coloWhite"></i>
                    </a>
                    <a onClick={e => askSuspend(ti)} className={ti.statusTask === "CREADA" | ti.statusTask === "ASIGNADA" |ti.statusTask === "ACTIVA" ? "btn btn-warning":"btn btn-warning hideBtn"} title="Suspender">
                        <i className="fas fa-stopwatch "></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(listT.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        var renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className="liCustom" key={number}>
                <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
              </li>
            );
        });


        // console.log("->",taskSelected)

        //mis dedicaciones en una tarea
        if(taskSelected.dedications != null){            
            var totalDedications =  taskSelected.dedications.reduce((totalHoras, dedication) => {if(!isNaN(dedication.hsJob)) return totalHoras + dedication.hsJob
                                                                                                    else return totalHoras}, 0)            
            
            const dedicationsOrderByDate = taskSelected.dedications.sort((a, b) => a.date - b.date); 
            const indexOfLastTodo = dedicationsCurrentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentDedications = dedicationsOrderByDate.slice(indexOfFirstTodo, indexOfLastTodo);
           

            if (currentDedications.length === 0){
                var whithDedications = false;
                var dedicationNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay dedicaciones cargadas</b></center></li>)
            }else{
                whithDedications = true;
                // console.log("dedT",currentDedications)
                var dedications = currentDedications.map(dedication =>
                    <tr key={dedication.idDedication}>
                        <td>
                            <Moment format="DD/MM/YYYY">{moment.utc(dedication.date)}</Moment>
                        </td>
                        <td>
                            {dedication.hsJob}
                        </td>
                        <td>
                            {dedication.observation}
                        </td>
                    </tr>
                )

                var dedicationPageNumbers = [];
                for (let i = 1; i <= Math.ceil(taskSelected.dedications.length / todosPerPage); i++) {
                    dedicationPageNumbers.push(i);
                }
            
                var renderDedicationsPageNumbers = dedicationPageNumbers.map(number => {
                    return (
                        <li className="liCustom" key={number}>
                        <a className="page-link" id={number} onClick={(e) => changeDedicationsPagin(e)}>{number}</a>
                        </li>
                    );
                });
            }
        
        }

        // carga para TODAS las dedicaciones de una tarea
        if(taskSelected.allDedications != null){
            
            var totalAllDedications =  taskSelected.allDedications.reduce((totalHoras, dedication) => {if(!isNaN(dedication.hsJob)) return totalHoras + dedication.hsJob
                                                                                                    else return totalHoras}, 0)
                        
            const dedicationsOrderByDate = taskSelected.allDedications.slice().sort((a, b) => new Date(a.date).getTime() - 
            new Date(b.date).getTime()).reverse();
            // console.log("oeder",dedicationsOrderByDate)
            const indexOfLastTodo = dedicationsCurrentPage * todosPerPage;
            const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
            const currentDedications = dedicationsOrderByDate.slice(indexOfFirstTodo, indexOfLastTodo);
           

            if (currentDedications.length === 0){
                var whithDedications = false;
                var dedicationNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay dedicaciones cargadas</b></center></li>)
            }else{
                whithDedications = true;
                // console.log("dedT",currentDedications)
                var allDedications = currentDedications.map(dedication =>
                    <tr key={dedication.idDedication}>
                        <td>
                            <Moment format="DD/MM/YYYY">{moment.utc(dedication.date)}</Moment>
                        </td>
                        <td>
                            {dedication.hsJob}
                        </td>
                        <td>
                            {dedication.surnameUser}, {dedication.nameUser}
                        </td>
                        <td>
                            {dedication.observation}
                        </td>
                    </tr>
                )

                var dedicationPageNumbers = [];
                for (let i = 1; i <= Math.ceil(taskSelected.dedications.length / todosPerPage); i++) {
                    dedicationPageNumbers.push(i);
                }
            
                var renderDedicationsPageNumbers = dedicationPageNumbers.map(number => {
                    return (
                        <li className="liCustom" key={number}>
                        <a className="page-link" id={number} onClick={(e) => changeDedicationsPagin(e)}>{number}</a>
                        </li>
                    );
                });
            }        
        }


    }else{ 
        //sin tareas pendientes
        var whithItems = false;

        showSpinner = false;
        
        //var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No tiene tareas pendientes</b></center></li>)
        
        var itemNone = (
            <li className='itemTeam list-group-item-action list-group-item'>
                
                <center>
                    <h3>
                        <b>Cargando Tareas...     
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </b>
                    </h3>
                </center>
            </li>)
    }
    
    const {time, date, observation} = dedicationForm;
    
    const onChange = e => setDedicationForm({...dedicationForm, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();    
              
        if(date !== ""){
                if(time !== ""){
                registerDedication({relationTaskId: taskSelected._id, date, hsJob:time, observation, idUserCreate:user._id});            
                setDedicationForm({
                    time: '',
                    date: today,
                    observation: ''
                });
                modalWorkRegister();
            }else{
                setShowAlert(true)
            }
        }else{
            setShowAlert(true)
        }
    
    }

    const registerAndTerminate = () => {
        if(date !== ""){
            if(time !== ""){
            // console.log("a terminar:", taskSelected._id,taskSelected.taskId,user._id,date)
            registerDedicationAndTerminate({relationTaskId: taskSelected._id,taskId:taskSelected.taskId, date, hsJob:time, observation, idUserCreate:user._id});           
            setDedicationForm({
                time: '',
                date: today,
                observation: ''
            });
            modalWorkRegister();
        }else{
            setShowAlert(true)
            }
        }else{
            setShowAlert(true)
        }
    
    }

    //modal para la asignacion de horas a la tarea
    const modalWorkRegisterTask = (
        <Modal dialogClassName="modal-task" show={showWorkRegister} onHide={e => modalWorkRegister()}>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Horas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Alert variant="danger" show={showAlert}  onClose={() => setShowAlert(false)} dismissible>
                    {/* <Alert.Heading>Oh snap! You got an error!</Alert.Heading> */}
                    <p>
                    Para registrar una dedicación, son necesarios que se indique la <b>fecha y las Hs. dedicadas</b>!
                    </p>
                </Alert>
            <div className="row rowProject">             
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Tarea:</div>
                    <strong>{taskSelected.name}</strong>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Actividad:</div>
                    <div><strong>{taskSelected.nameActivity}</strong>                    
                    </div>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Etapa:</div>
                    <strong>{taskSelected.nameStage}</strong>
                </div>
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Proyecto:</div>
                    <strong>{taskSelected.nameProject}</strong>
                </div>
            </div>         
            <div className="row">
                <div className="col-lg-3 col-sm-3">
                   Inicio Previsto: <b><Moment format="DD/MM/YYYY">{moment.utc(taskSelected.startProvider)}</Moment> </b>
                </div>
                <div className="col-lg-3 col-sm-3">
                   Fin Previsto: <b><Moment format="DD/MM/YYYY">{moment.utc(taskSelected.endProvider)}</Moment> </b> 
                </div>
                <div className="col-lg-3 col-sm-3">                                    
                    <div className="float-left">  
                        Duración Estimada: <b>{taskSelected.duration}</b> 
                    </div>
                    <div className="float-right"> 
                        <OverlayTrigger trigger="click" placement="right" overlay={popoverDuration}>
                            <Link><i className="far fa-question-circle"></i></Link>
                        </OverlayTrigger>
                    </div>
                       
                </div>   
                <div className="col-lg-3 col-sm-3">
                   <div className="float-left">
                        Total Dedicaciones Registradas: <b>{totalDedications}</b>
                    </div>
                    <div className="float-right"> 
                        <OverlayTrigger trigger="click" placement="right" overlay={popoverMia}>
                            <Link><i className="far fa-question-circle"></i></Link>
                        </OverlayTrigger>
                    </div>
                </div>           
            </div> 
            <br></br>          
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    
                    <h5>Mis Dedicaciones Registradas</h5>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="hide-sm headTable">Fecha de registro</th>
                            <th className="hide-sm headTable">Horas Registradas</th>
                            <th className="hide-sm headTable">Observaciones</th>
                        </tr>
                        </thead>
                        <tbody>

                            {dedications} 

                        </tbody>
                    </table>
                    {whithDedications ? '' : dedicationNone}
                    <div className="">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {renderDedicationsPageNumbers}
                            </ul>
                        </nav>
                    </div>
                </div>
                
                <div className="col-lg-6 col-sm-6">
                    <Card>
                        <Card.Header>
                            <h5 className="my-2">Nueva dedicación</h5>
                        </Card.Header>
                        <Card.Body>
                            <form className="form"  onSubmit={e => onSubmit(e)}>
                                <div className="row">
                                    <div className="form-group col-lg-6">
                                        <div className="float-left">
                                            <h5>Horas a Registrar (*)</h5>
                                        </div>
                                        <div className="float-right"> 
                                            <OverlayTrigger trigger="click" placement="right" overlay={popoverHs}>
                                                <Link><i className="far fa-question-circle"></i></Link>
                                            </OverlayTrigger>
                                        </div>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            placeholder="0" 
                                            name="time" 
                                            step={0.5} 
                                            precision={2}
                                            min = {0} 
                                            value={time}
                                            onChange = {e => onChange(e)}
                                        />
                                    </div>
                                    <div className="form-group col-lg-6">                    
                                        <h5>Fecha Registrado</h5>
                                        <input 
                                            type="date" 
                                            className="form-control"
                                            placeholder="" 
                                            name="date" 
                                            value={date}
                                            min ={minDateAsignated}
                                            max={today}
                                            onChange = {e => onChange(e)}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                    <h5>Observación</h5>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            placeholder="Observación sobre la dedicación" 
                                            name="observation"
                                            minLength="3"
                                            maxLength="250"
                                            onChange = {e => onChange(e)}
                                            value={observation}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <span>(*) son campos obligatorios</span>
                                     </div>                                    
                                                               
                                </div>
                                <input type="submit" className="btn btn-primary" value="Registrar" /> 
                                     <Button variant="dark" onClick={e => registerAndTerminate()}>
                                        Registrar y Terminar
                                    </Button>     
                                    <Button variant="secondary" onClick={e => modalWorkRegister()}>
                                        Cerrar
                                    </Button> 
                            </form>
                        </Card.Body>
                    </Card>
                </div>          

            </div>
            
            </Modal.Body>
        </Modal>
    )

    //modal para la finalizacion de la tarea
    const modalEndTask = (
        <Modal show={show} onHide={e => modalTeamMember()}>
            <Modal.Header closeButton>
                <Modal.Title>Finalizar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de finalizar la tarea:<b> {nameComplete} </b> ?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <a onClick={e => endTask()} className="btn btn-success coloWhite" >
                    Si, estoy seguro
                </a>
                <Button variant="secondary" onClick={e => modalTeamMember()}>
                Cerrar
                </Button>
                
            </Modal.Footer>
        </Modal>
    )
    
    const modalRestartTask = (
        <Modal show={showRestart} onHide={e => modalRestart()}>
            <Modal.Header closeButton>
                <Modal.Title>Reanudar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="form">
                    <div className="form-group">
                    <p>
                        ¿Estás seguro de Reanudar la tarea: <b>{nameComplete}</b>?
                    </p>
                    </div>
                    <div className="form-group">
                        <h5>Motivo</h5>
                        <input 
                            type="text" 
                            placeholder="Motivo de Suspension" 
                            name="description"
                            minLength="3"
                            maxLength="50"
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <a onClick={e => restartTask()} className="btn btn-warning coloWhite" >
                    Si, estoy seguro
                </a>
                <Button variant="secondary" onClick={e => modalRestart()}>
                    Cerrar
                </Button>
                
            </Modal.Footer>
        </Modal>
    )

    //modal para la suspension de la tarea
    const modalSuspendTask = (
        <Modal show={showSuspend} onHide={e => modalSuspend()}>
            <Modal.Header closeButton>
                <Modal.Title>Suspender Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="form">
                    <div className="form-group">
                    <p>
                        ¿Estás seguro de suspender la tarea: <b>{nameComplete}</b>?
                    </p>
                    </div>
                    <div className="form-group">
                        <h5>Motivo</h5>
                        <input 
                            type="text" 
                            placeholder="Motivo de Suspension" 
                            name="description"
                            minLength="3"
                            maxLength="50"
                            onChange = {e => addReason(e)}
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <a onClick={e => suspendTask()} className="btn btn-warning coloWhite" >
                    Si, estoy seguro
                </a>
                <Button variant="secondary" onClick={e => modalSuspend()}>
                    Cerrar
                </Button>                
            </Modal.Footer>
        </Modal>
    )



    //#region Control de filtros
    const modifyProject = (e) => {
        setProjectFilter(e.target.value);
        setCurrent(1);
    }
    
    const modifyStage = (e) => {
        setStageFilter(e.target.value);
        setCurrent(1);
    }
    
    const modifyActivity = (e) => {
        setActivityFilter(e.target.value);
        setCurrent(1);
    }

    //#endregion

    //# region detalle dedicaciones
    


    const modalDetailDedications = () => {
        if(showDetailDedication){
            setShowDetailDedications(false);
        }else{
            setShowDetailDedications(true);
        }

    }

    const detailDedication = (taskSelected) => {   
        // console.log(taskSelected)    
        //fecha para restringir mínimo para asignar RRHH
        let dateMin =(taskSelected.dateUpAssigned).split("T")[0];         
        setDateAsignated(dateMin)
        setTask(taskSelected)        
        modalDetailDedications();
    }

    const modalDedications = (
        <Modal dialogClassName="modal-task" show={showDetailDedication} onHide={e => modalDetailDedications()}>
            <Modal.Header closeButton>
                <Modal.Title>Detalle Dedicaciones Registradas para la Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>           
            <div className="row rowProject">             
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Tarea:</div>
                    <strong>{taskSelected.name}</strong>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Actividad:</div>
                    <div><strong>{taskSelected.nameActivity}</strong>                    
                    </div>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Etapa:</div>
                    <strong>{taskSelected.nameStage}</strong>
                </div>
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Proyecto:</div>
                    <strong>{taskSelected.nameProject}</strong>
                </div>
            </div>         
            <div className="row">
                <div className="col-lg-3 col-sm-3">
                   Inicio Previsto: <b><Moment format="DD/MM/YYYY">{moment.utc(taskSelected.startProvider)}</Moment> </b>
                </div>
                <div className="col-lg-3 col-sm-3">
                   Fin Previsto: <b><Moment format="DD/MM/YYYY">{moment.utc(taskSelected.endProvider)}</Moment> </b> 
                </div>
                <div className="col-lg-3 col-sm-3">
                    Inicio Real: <b>{taskSelected.startDate !== undefined ?<Moment format="DD/MM/YYYY">{moment.utc(taskSelected.startDate)}</Moment>:"--/--/----"}  </b>                    
                </div>   
                <div className="col-lg-3 col-sm-3">
                     Fin Real: <b>{taskSelected.endDate !== undefined ?<Moment format="DD/MM/YYYY">{moment.utc(taskSelected.endDate)}</Moment>:"--/--/----"} </b>                   
                </div>           
            </div> 
            <br></br>          
            <div className="row">
                <div className="col-lg-8 col-sm-6">
                    
                    <h5>Dedicaciones Registradas</h5>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="hide-sm headTable">Fecha de registro</th>
                            <th className="hide-sm headTable">Horas Registradas</th>
                            <th className="hide-sm headTable">Perteneciente A</th>
                            <th className="hide-sm headTable">Observaciones</th>
                        </tr>
                        </thead>
                        <tbody>

                            {allDedications} 

                        </tbody>
                    </table>
                    {whithDedications ? '' : dedicationNone}
                    <div className="">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {renderDedicationsPageNumbers}
                            </ul>
                        </nav>
                    </div>
                </div>
                
                <div className="col-lg-4 col-sm-6">
                    <div className="row">
                        <div className="form-group col-lg-12">
                            Descripción de la tarea: <b>{taskSelected.description}</b>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-12"> 
                            <div className="float-left">  
                                Duración Estimada: <b>{taskSelected.duration}</b> 
                            </div>
                            <div className="float-right"> 
                                <OverlayTrigger trigger="click" placement="right" overlay={popoverDuration}>
                                    <Link><i className="far fa-question-circle"></i></Link>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-12"> 
                            <div className="float-left">                       
                                Total Dedicaciones Registradas: <b>{totalAllDedications}</b>
                            </div>
                            <div className="float-right"> 
                                <OverlayTrigger trigger="click" placement="right" overlay={popoverTotal}>
                                    <Link><i className="far fa-question-circle"></i></Link>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-12">
                            <div className="float-left">
                                Total Dedicaciones que registré: <b>{totalDedications}</b>
                            </div>
                            <div className="float-right"> 
                                <OverlayTrigger trigger="click" placement="right" overlay={popoverMia}>
                                    <Link><i className="far fa-question-circle"></i></Link>
                                </OverlayTrigger>
                             </div>
                        </div>
                    </div>
                    
                </div>          

            </div>
            
            </Modal.Body>
        </Modal>
    )
//# endregion

    const changeTxt = e => {
        setTxtFilter(e.target.value);
    }
    
    return (
        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h4 className="my-2">Bienvenido, <b> { user && user.name} {user && user.surname}</b></h4>
                </div>
                
            </div>
            <div className="row">
                <div className="col-lg-6 col-sm-6">

                    <div className="row">
                        
                        <div className="col-lg-3 col-sm-3 taskTxtCustom">
                            <h3 className="my-2">Mis Tareas</h3>
                        </div>


                        
                    </div>

                </div>
                <div className="col-lg-6 col-sm-6">
                    <div className="row">
                    <div className="col-lg-9 col-sm-9">
                            <input type="text" className="form-control " placeholder="Buscar por nombre de tarea" onChange = {e => changeTxt(e)} />
                    </div>
                    <div className="col-lg-3 col-sm-3">
                        <Link to={`/team-member/team-member-work-done/${ user && user._id}`}  className="btn btn-primary  float-right">
                            Reporte de Horas
                        </Link>
                        </div>
                    </div>
                </div>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre de la tarea</th>
                    <th className="hide-sm headTable">
                        <select name="Proyect" className="form-control" onChange = {e => modifyProject(e)}>
                            <option value="">PROYECTO</option>
                            {listProjectHtml}
                        </select>
                    </th>
                    <th className="hide-sm headTable">
                        <select name="Proyect" className="form-control" onChange = {e => modifyStage(e)}>
                            <option value="">ETAPA</option>
                            {listStageHtml}
                        </select>
                    </th>
                    <th className="hide-sm headTable">
                        <select name="Proyect" className="form-control" onChange = {e => modifyActivity(e)}>
                            <option value="">ACTIVIDAD</option>
                            {listActivityHtml}
                        </select>
                    </th>                    
                    <th className="hide-sm headTable headStatus2">Fechas Previstas</th>
                    <th className="hide-sm headTable headStatus2">
                        <select name="statusTask" className="form-control " onChange = {e => modifyStatus(e)}>
                            <option value="">ESTADO TAREA</option>
                            <option value="ASIGNADA">Ver ASIGNADAS</option>
                            <option value="ACTIVA">Ver ACTIVAS</option>
                            <option value="TERMINADA">Ver TERMINADAS</option>
                            <option value="SUSPENDIDA">Ver SUSPENDIDAS</option>
                            <option value="CANCELADA">Ver CANCELADAS</option>
                            
                        </select>
                    </th>
                    <th className="hide-sm headTable centerBtn">Opciones</th> 
                </tr>
                </thead>
                <tbody>
                    {listTasks}
                </tbody>
            </table>
            
            {whithItems ? '' : itemNone}

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            {modalDedications}
            
            {modalWorkRegisterTask}

            {modalRestartTask}

            {modalSuspendTask}

            {modalEndTask}
            

        </Fragment>
    )
}

TeamMemberTask.propTypes = {
    getTaskByUser: PropTypes.func.isRequired,
    registerDedication: PropTypes.func.isRequired,
    userTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    suspenseTaskById:PropTypes.func.isRequired,
    reactiveTaskById:PropTypes.func.isRequired,
    terminateTaskById:PropTypes.func.isRequired,
    registerDedicationAndTerminate:PropTypes.func.isRequired,

}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth
})

export default connect(mapStateToProps, {getTaskByUser,registerDedication, suspenseTaskById, reactiveTaskById, terminateTaskById,registerDedicationAndTerminate})(TeamMemberTask)

