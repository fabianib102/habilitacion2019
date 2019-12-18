import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Alert from 'react-bootstrap/Alert'
import Moment from 'react-moment';
import moment from 'moment';
import { Modal, Button, Card, Spinner} from 'react-bootstrap';
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { getTaskByUser } from '../../actions/user';
import {registerDedication, registerDedicationAndTerminate} from '../../actions/project';
import {terminateTaskById, suspenseTaskById, reactiveTaskById } from '../../actions/stage';

const TeamMemberTask = ({registerDedication,terminateTaskById,registerDedicationAndTerminate, match, auth : {user,isAuthenticated, loading}, getTaskByUser, userTask: {userTask}, suspenseTaskById, reactiveTaskById}) => {
 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;

    const [nameComplete, setComplete] = useState("");

    const [IdDelete, setId] = useState("");    
    
    const [taskSelected, setTask] = useState("");

    const [showAlert, setShowAlert] = useState(false);

    const [minDateAsignated, setDateAsignated] = useState("");

    const [show, setShow] = useState(false);

    const [showSuspend, setSuspendShow] = useState(false);

    const [showDetailDedication, setShowDetailDedications] = useState(false);

    const [showWorkRegister, setWorkRegisterShow] = useState(false);

    const [showRestart, setRestartShow] = useState(false);

    // const [statusFilter, setStatus] = useState("");

    const[reason, setReason]= useState("");

    const [dedicationForm, setDedicationForm] = useState({
        time: '',
        date: today,
        observation: ''

    });
    
    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        getTaskByUser(match.params.idUser);
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 4000);
          }
    }, [getTaskByUser, match.params.idUser, showSpinner]);
  
    
  //Region Spinner
  const spin = () => setShowSpinner(!showSpinner);
    
  class Box extends Component{
      render(){
          return(
            <li className='itemTeam list-group-item-action list-group-item'>
              <center>
                  <h5>Cargando...
                      <Spinner animation="border" role="status" variant="primary" >
                          <span className="sr-only">Loading...</span>
                      </Spinner>
                  </h5>
              </center>
              </li>
          )
      }
  }


    // funcion para dada una fecha valida que este a 3 dias de la fecha actual, si no esta lo marca en amarillo
    var yellowDate = (date) => {
        var current = moment().locale('ar');
        current = current.add(3, 'days')        
        var date2 = moment.utc(date);

        if(current>=date2) return <Fragment><Moment format="DD/MM/YYYY" className='btn-warning' title="A 3 días, menos o pasado de la fecha">{moment.utc(date)}</Moment><span className="badge badge-warning"><i className="fas fa-exclamation-triangle fax2"></i></span>  </Fragment>
        else return <Moment format="DD/MM/YYYY">{moment.utc(date)}</Moment>
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
  
    const askEnd = (taskSelected) => {
        setTask(taskSelected)
        setComplete(taskSelected.name)
        setId(taskSelected._id)
        modalTeamMember();
    }

    const askSuspend = (taskSelected) => {
        setTask(taskSelected)
        setComplete(taskSelected.name)
        setId(taskSelected._id)
        modalSuspend();
    }

    const askRestart = (taskSelected) => {
        setTask(taskSelected)
        setComplete(taskSelected.name)
        setId(taskSelected._id)
        modalRestart();
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


    if(userTask != null){        
        var len = userTask.length;
        //mis dedicaciones en una tarea
        if(taskSelected.dedications != null){            
            var totalDedications =  taskSelected.dedications.reduce((totalHoras, dedication) => {if(!isNaN(dedication.hsJob)) return totalHoras + dedication.hsJob
                                                                                                    else return totalHoras}, 0)            
            
            const dedicationsOrderByDate = taskSelected.dedications.sort((a, b) => a.date - b.date); 
            var myDedications = dedicationsOrderByDate;           
        
        }

        // carga para TODAS las dedicaciones de una tarea
        if(taskSelected.allDedications != null){            
            var totalAllDedications =  taskSelected.allDedications.reduce((totalHoras, dedication) => {if(!isNaN(dedication.hsJob)) return totalHoras + dedication.hsJob
                                                                                                    else return totalHoras}, 0)                        
            var allDedications = taskSelected.allDedications            
        }


    }else{ 
       var len = 0
    }
    
    const selectStatus = {
        'CREADA': 'CREADA',
        'ASIGNADA': 'ASIGNADA',
        'ACTIVA': 'ACTIVA',
        'SUSPENDIDA': 'SUSPENDIDA',
        'CANCELADA': 'CANCELADA',
        'TERMINADA': 'TERMINADA',
    };

    const optionsDedications = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'Todos', value: totalDedications
        } ], 
        sizePerPage: 5, 
        pageStartIndex: 1, 
        paginationSize: 3, 
        prePage: '<',
        nextPage: '>', 
        firstPage: '<<', 
        lastPage: '>>', 
        prePageTitle: 'Ir al Anterior', 
        nextPageTitle: 'Ir al Siguiente',
        firstPageTitle: 'ir al Primero', 
        lastPageTitle: 'Ir al último',
        paginationPosition: 'bottom',
        // --------ORDENAMIENTO--------
        defaultSortName: 'date',  
        defaultSortOrder: 'desc',  //desc
        // ------- TITULO BOTONES ------
        // exportCSVText: 'Exportar en .CSV',
        //------------ BUSQUEDAS ------
        noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron registros</b></center></li>)
      };

      const optionsAllDedications = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'Todos', value: totalAllDedications
        } ], 
        sizePerPage: 5, 
        pageStartIndex: 1, 
        paginationSize: 3, 
        prePage: '<',
        nextPage: '>', 
        firstPage: '<<', 
        lastPage: '>>', 
        prePageTitle: 'Ir al Anterior', 
        nextPageTitle: 'Ir al Siguiente',
        firstPageTitle: 'ir al Primero', 
        lastPageTitle: 'Ir al último',
        paginationPosition: 'bottom',
        // --------ORDENAMIENTO--------
        defaultSortName: 'date',  
        defaultSortOrder: 'desc',  //desc
        // ------- TITULO BOTONES ------
        // exportCSVText: 'Exportar en .CSV',
        //------------ BUSQUEDAS ------
        noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron registros</b></center></li>)
      };

    const options = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'Todos', value: len
        } ], 
        sizePerPage: 5, 
        pageStartIndex: 1, 
        paginationSize: 3, 
        prePage: '<',
        nextPage: '>', 
        firstPage: '<<', 
        lastPage: '>>', 
        prePageTitle: 'Ir al Anterior', 
        nextPageTitle: 'Ir al Siguiente',
        firstPageTitle: 'ir al Primero', 
        lastPageTitle: 'Ir al último',
        paginationPosition: 'bottom',
        // --------ORDENAMIENTO--------
        defaultSortName: 'dateUpAssigned',  
        defaultSortOrder: 'asc',  //desc
        // ------- TITULO BOTONES ------
        // exportCSVText: 'Exportar en .CSV',
        //------------ BUSQUEDAS ------
        noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron coincidencias</b></center></li>)
      };

    function datesProvideFormatter(cell, row){
    return (<Fragment> 
                 <div className="small text-muted">
                    <b>Inicio Previsto: </b><Moment format="DD/MM/YYYY">{moment.utc(row.startProvider)}</Moment> 
                </div>
                <div className="small text-muted">
                    <b>Fin Previsto: </b> {row.statusTask !== "TERMINADA" & row.statusTask !== "CANCELADA" ? yellowDate(row.endProvider): <Moment format="DD/MM/YYYY">{moment.utc(row.endProvider)}</Moment>}
                  
                </div>
            </Fragment>
            )
    }

    function buttonFormatter(cell, row){
    return (<Fragment> 
                <a onClick={e => detailDedication(row)} className= "btn btn-success" title="Visualizar Dedicaciones">
                    <i className="fas fa-search coloWhite"></i>
                </a>
                <a onClick={e => askWorkRegister(row)} className={row.statusTask === "CREADA" | row.statusTask === "ASIGNADA" |row.statusTask === "ACTIVA" ? "btn btn-primary":"btn btn-primary hideBtn"} title="Registrar dedicación">

                    <i className="fas fa-plus-circle coloWhite"></i>
                </a>
                <a onClick={e => askEnd(row)} className={row.statusTask === "CREADA" | row.statusTask === "ASIGNADA" |row.statusTask === "ACTIVA" ? "btn btn-success":"btn btn-success hideBtn"} title="Finalizar">
                    <i className="far fa-check-square coloWhite"></i>
                </a>
                {row.statusTask === "SUSPENDIDA" ?
                <a onClick={e => askRestart(row)} className= "btn btn-warning" title="Reactivar Tarea">
                <i className="fas fa-arrow-alt-circle-up"></i>
                </a>:""}
                {row.statusTask === "ACTIVA" | row.statusTask === "ASIGNADA" | row.statusTask === "CREADA" | row.statusTask === "CANCELADA" | row.statusTask === "TERMINADA"?
                <a onClick={e => askSuspend(row)} className={row.statusTask === "ACTIVA" ? "btn btn-warning":"btn btn-warning hideBtn"} title="Suspender">
                    <i className="fas fa-stopwatch "></i>
                </a>:""
                }

            </Fragment>
            )
    }

    function dateAssignedFormatter(cell, row){
        return (<Moment format="DD/MM/YYYY">{moment.utc(row.dateUpAssigned)}</Moment>
                )
        }
        
    function enumFormatter(cell, row, enumObject) {
        // console.log(cell,row,enumObject,enumObject[cell])
        return enumObject[cell];
    }

    function rowClassNameFormat(row, rowIdx) {
        return row.statusTask !== "TERMINADA" & row.statusTask !== "CANCELADA" ? (moment(today).isSame(moment(row.endProvider,"YYYY-MM-DD")) ?  "enLimite":(moment(today).isBefore(moment(row.endProvider)) & row.statusTask !== "TERMINADA" ? "":"fueraLimite")):""
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
                        <OverlayTrigger trigger="click" placement="bottom" overlay={popoverDuration}>
                            <Link><i className="far fa-question-circle"></i></Link>
                        </OverlayTrigger>
                    </div>
                       
                </div>   
                <div className="col-lg-3 col-sm-3">
                   <div className="float-left">
                        Total Dedicaciones Registradas: <b>{totalDedications}</b>
                    </div>
                    <div className="float-right"> 
                        <OverlayTrigger trigger="click" placement="bottom" overlay={popoverMia}>
                            <Link><i className="far fa-question-circle"></i></Link>
                        </OverlayTrigger>
                    </div>
                </div>           
            </div> 
            <br></br>          
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    
                    <h5>Mis Dedicaciones Registradas</h5>
                    {userTask !== null ?
                    <BootstrapTable data={ myDedications }  pagination={ true } options={ optionsDedications }>
                        <TableHeaderColumn isKey dataField='date' dataSort csvHeader='Fecha de registro'>Fecha de registro</TableHeaderColumn>
                        <TableHeaderColumn dataField='hsJob'  dataSort  csvHeader='Horas Registradas'>Horas Registradas</TableHeaderColumn>
                        <TableHeaderColumn dataField='observation'  dataSort csvHeader='Observaciones'>Observaciones</TableHeaderColumn>
                        
                    </BootstrapTable>
                    :""}
                   
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
                                            <OverlayTrigger trigger="click" placement="bottom" overlay={popoverHs}>
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
                    {userTask !== null && allDedications != null ?
                    <BootstrapTable data={ allDedications }  pagination={ true } options={ optionsAllDedications }>
                        <TableHeaderColumn isKey dataField='date' dataSort csvHeader='Fecha de registro'>Fecha de registro</TableHeaderColumn>
                        <TableHeaderColumn dataField='hsJob'  dataSort  csvHeader='Horas Registradas'  width='15%'>Horas Registradas</TableHeaderColumn>
                        <TableHeaderColumn dataField='surnameUser'  dataSort  csvHeader='Apellido'>Apellido</TableHeaderColumn>
                        <TableHeaderColumn dataField='nameUser' dataSort csvHeader='Nombre'>Nombre</TableHeaderColumn>
                        <TableHeaderColumn dataField='observation'  csvHeader='Observaciones'>Observaciones</TableHeaderColumn>
                        
                    </BootstrapTable>
                    :""}                    
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
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverDuration}>
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
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverTotal}>
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
                                <OverlayTrigger trigger="click" placement="bottom" overlay={popoverMia}>
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

    
    return (
        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h4 className="my-2">Bienvenido/a, <b> {user && user.surname} { user && user.name} </b></h4>
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
                        <div className="col-lg-12 col-sm-12">
                            {/* <input type="text" className="form-control " placeholder="Buscar por nombre de: Proyecto/Etapa/Actividad/Tarea" onChange = {e => changeTxt(e)} /> */}
                        </div>                 
                    </div>
                </div>
            </div>
            {userTask !== null ?
                <BootstrapTable data={ userTask }  pagination={ true } options={ options }  exportCSV={ false } trClassName={rowClassNameFormat}>
                    <TableHeaderColumn isKey dataField='name'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese una Tarea'} } csvHeader='Tarea'>Tarea</TableHeaderColumn>
                    <TableHeaderColumn dataField='dateUpAssigned'  dataSort dataFormat={dateAssignedFormatter} csvHeader='Fecha Asignada'  width='8%'>Fecha Asignada</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameProject'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese  un Proyecto'} }  csvHeader='Proyecto'>Proyecto</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameStage'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese  una Etapa'} } csvHeader='Etapa'>Etapa</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameActivity'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese  una Actividad'} } csvHeader='Actividad'>Actividad</TableHeaderColumn>
                    <TableHeaderColumn dataField='datesProvide' dataFormat={datesProvideFormatter} csvHeader='Fechas Previstas' width='8%' >Fechas Previstas</TableHeaderColumn>
                    <TableHeaderColumn dataField='statusTask'  dataSort  filterFormatted dataFormat={ enumFormatter } formatExtraData={ selectStatus } filter={ { type: 'SelectFilter', options: selectStatus, selectText: 'Todos los' } } width='10%'csvHeader='Estado'>Estado</TableHeaderColumn>                  
                    <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='17%' export={ false } >Opciones <br/></TableHeaderColumn>
                </BootstrapTable>
                :""}
                {showSpinner && <Box/>}
         

            {modalDedications}
            
            {modalWorkRegisterTask}

            {modalRestartTask}

            {modalSuspendTask}

            {modalEndTask}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

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

