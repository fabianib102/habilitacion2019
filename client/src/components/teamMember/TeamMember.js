import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { Modal, Button, Card } from 'react-bootstrap';
import { getTaskByUser } from '../../actions/user';
import {registerDedication} from '../../actions/project';
import {terminateTaskById, suspenseTaskById, reactiveTaskById } from '../../actions/stage';

const TeamMemberTask = ({registerDedication,terminateTaskById, match, auth : {user}, getTaskByUser, userTask: {userTask}, suspenseTaskById, reactiveTaskById}) => {


    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");
    
    const [idSuspend, setIdSuspend] = useState(""); 
    
    const [taskSelected, setTask] = useState("");

    const [dedicationForm, setDedicationForm] = useState({
        time: '',
        date: '',
        observation: ''

    });
    const [dedicationsCurrentPage, setDedicationsCurrent] = useState(1);

    const [projectFilter, setProjectFilter] = useState("");
    const [stageFilter, setStageFilter] = useState("");
    const [activityFilter, setActivityFilter] = useState("");
    const [minDateAsignated, setDateAsignated] = useState("");

    var listProject = [];
    var listStage = [];
    var listActivity = [];

    useEffect(() => {
        getTaskByUser(match.params.idUser);
    }, [getTaskByUser]);

    // console.log("info del usuario: ", user);


    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    const modalTeamMember = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    
    // pregunta para suspender la tarea asiganada al team member
    const [showSuspend, setSuspendShow] = useState(false);

    const modalSuspend = () => {
        if(showSuspend){
            setSuspendShow(false);
        }else{
            setSuspendShow(true);
        }
    }

    // pregunta para registrar trabajo a la tarea asiganada al team member
    const [showWorkRegister, setWorkRegisterShow] = useState(false);

    const modalWorkRegister = () => {
        if(showWorkRegister){
            setWorkRegisterShow(false);
        }else{
            setWorkRegisterShow(true);
        }

        setDedicationForm({
            time: '',
            date: '',
            observation: ''

        });
    }

    const [showRestart, setRestartShow] = useState(false);
    
    const modalRestart = () =>{
        if(showRestart){
            setRestartShow(false);
        }else{
            setRestartShow(true);
        }
    }
    //--------
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

    const askRestart = () => {
        modalRestart();
    }


    const askWorkRegister = (taskSelected) => {       
        //fecha para restringir mínimo para asignar RRHH
        let dateMin =(taskSelected.dateUpAssigned).split("T")[0];   
        setDateAsignated(dateMin)
        setTask(taskSelected)
        modalWorkRegister();
    }

    // Agregar la razon de la suspension de Tarea
    const[reason, setReason]= useState("");
    
    const addReason = (e) => {
        setReason(e.target.value);
    }

    //Terminar Tarea
    const endTask = () => {
        console.log(taskSelected)
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

    const workRegisterTask = (id) => {
        modalWorkRegister();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    const changeDedicationsPagin = (event) => {
        setDedicationsCurrent(Number(event.target.id));
    }

    
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
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No tiene tareas pendientes</b></center></li>)
        }

        // hay tareas, proceso de tratamiento
        var whithItems = true;
        
        // Se realiza el filtro de la lista segun el elemento seleccionado
        var listT = userTask;

        if(projectFilter != ""){
            
            var listT =  userTask.filter(function(task) {
                return task.nameProject === projectFilter;
            });
        }

        if(stageFilter != ""){
            
            var listT =  userTask.filter(function(task) {
                return task.nameStage === stageFilter;
            });
        }

        if(activityFilter != ""){
            
            var listT =  userTask.filter(function(task) {
                return task.nameActivity === activityFilter;
            });
        }


        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTask = listT.slice(indexOfFirstTodo, indexOfLastTodo);

        var redDate = (date) => {
            var current = moment().locale('ar');
            var date2 = moment.utc(date);
            if(current>date2) return <Moment format="DD/MM/YYYY" className='btn-danger'>{date}</Moment>
            else return <Moment format="DD/MM/YYYY">{date}</Moment>
        }
        
        var listTasks = currentTask.map((ti) =>
            <tr key={ti._id}>
                <td>
                    {ti.name}
                    <div className="small text-muted">
                        <b>Fecha de relación: </b><Moment format="DD/MM/YYYY">{moment.utc(ti.dateRegister)}</Moment>
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
                        <b>Fin Previsto: </b><Moment format="DD/MM/YYYY">{moment.utc(ti.endProvider)}</Moment>
                    </div>
                </td>
                <td className="hide-sm centerBtn">
                    <a onClick={e => askWorkRegister(ti)} className="btn btn-primary" title="Registrar trabajo">
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>
                    <a onClick={e => askEnd(ti)} className="btn btn-success" title="Finalizar">
                        <i className="far fa-check-square coloWhite"></i>
                    </a>
                    <a onClick={e => askSuspend(ti)} className="btn btn-warning" title="Suspender">
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


        console.log("->",taskSelected)

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

    }else{ //sin tareas pendientes
        var whithItems = false;
        var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No tiene tareas pendientes</b></center></li>)
    }
    
    const {time, date, observation} = dedicationForm;
    
    const onChange = e => setDedicationForm({...dedicationForm, [e.target.name]: e.target.value});

    const onSubmit = async e => {
            e.preventDefault();          

            registerDedication({relationTaskId: taskSelected._id, date, hsJob:time, observation, idUserCreate:user._id});            
            setDedicationForm({
                time: '',
                date: ''
            });
            modalWorkRegister();
    }

    const registerAndTerminate = () => {
        registerDedication({relationTaskId: taskSelected._id, date, hsJob:time, observation, idUserCreate:user._id});            
        setDedicationForm({
            time: '',
            date: ''
        });
        console.log("a terminar:",taskSelected.taskId,user._id,date)
        terminateTaskById({id:taskSelected.taskId,idUserCreate:user._id,date});
        modalWorkRegister();
}
    //modal para la asignacion de horas a la tarea
    const modalWorkRegisterTask = (
        <Modal dialogClassName="modal-task" show={showWorkRegister} onHide={e => modalWorkRegister()}>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Horas</Modal.Title>
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
                    Duración Estimada: <b>{taskSelected.duration}</b>
                </div>   
                <div className="col-lg-3 col-sm-3">
                   Total Dedicaciones Registradas: <b>{totalDedications}</b>
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
                                        <h5>Horas a Registrar (*)</h5>
                                        <p>Ejemplo: 2,5, para 2h y 30m</p>
                                        <input 
                                            type="number" 
                                            class="form-control"
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
                                        <p>Ejemplo: 10/10/2019</p>
                                        <input 
                                            type="date" 
                                            class="form-control"
                                            placeholder="" 
                                            name="date" 
                                            value={date}
                                            min ={minDateAsignated}
                                            onChange = {e => onChange(e)}
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                    <h5>Observación</h5>
                                        <input 
                                            type="text" 
                                            class="form-control"
                                            placeholder="Observación sobre la dedicación" 
                                            name="observation"
                                            minLength="3"
                                            maxLength="200"
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



    return (
        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h4 className="my-2">Bienvenido, <b> { user && user.name} {user && user.surname}</b></h4>
                </div>
                <div className="col-lg-6 col-sm-6">
                    <Link to={`/team-member/team-member-detail/${ user && user._id}`}  className="btn btn-primary my-2 float-right">
                        Informacion Personal
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h3 className="my-2">Mis Tareas</h3>        
                </div>
                <div className="col-lg-6 col-sm-6">
                    <Link to={`/team-member/team-member-work-done/${ user && user._id}`}  className="btn btn-primary my-2 float-right">
                        Reporte de Horas
                    </Link>
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
                    <th className="hide-sm headTable">Fechas Previstas</th>
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
    terminateTaskById:PropTypes.func.isRequired

}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth
})

export default connect(mapStateToProps, {getTaskByUser,registerDedication, suspenseTaskById, reactiveTaskById, terminateTaskById})(TeamMemberTask)

