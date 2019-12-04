import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { Button, Modal, ToggleButtonGroup, } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import {detailProjectById, relationTaskById,  relationUserTask, deleteRelationTask} from '../../actions/project';

const ProjectManagerProjectDetailRelationTask = ({match, setAlert,history, relationUserTask,deleteRelationTask, stage: {stage, loading}, detailProjectById, projectDetail: {projectDetail}, relationTaskById, relationsTask: {relationsTask},auth:{user}}) => {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;
 
    //fecha para restringir mínimo para asignar RRHH
    var dateToday = new Date();
    let dateMin = new Date(dateToday.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];    
    const [minDate, setDate] = useState(dateMin);

    
    const [showModalTask, setModalTask] = useState(false);
    const [showModalDedication, setModalDedication] = useState(false);
    const [dateSelected, setDateSelected] = useState(today);
    const [responsableSelected, setResponsableSelected] = useState('');
    const [durationEst, setDurationSelected] = useState(0);
    const [startDateProvideTask, setStartDateProvide] = useState('');
    const [endDateProvideTask, setEndDateProvide] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [descriptionTask, setDescriptionTask] = useState('');
    const [relationIdSelect, setRelationIdSelected] = useState("");
    const [taskIdSelect, setTaskIdSelected] = useState("");
    const [nameUserSelect, setNameUserSelected] = useState("");
    const [surnameUserSelect, setSurnameUserSelected] = useState("");
    const [reason, setReason] = useState("");
    const [dedicationsSelected, setDedicationsSelected] = useState([]);
    
    var idProject;
    var taskActivityFilter;
    var activityFilter;
    var stageFilter;
    // var idStageSelected ="";
    // var idActivitySelected="";
    var idTaskSelected="";
    var nameTeam = "-";
    var taskName = "-";
    var whithItems = false;


    if(stage !== null){ //busco tarea de la actividad y traigo su idProjecto
        for (let index = 0; index < stage.length; index++) {
            let stageItem = stage[index];
            for (let i = 0; i < stageItem.arrayActivity.length; i++) {
                let activityItem = stageItem.arrayActivity[i]
                for (let j = 0; j < activityItem.arrayTask.length; j++) {
                    if (activityItem.arrayTask[j]._id === match.params.idRelationTask){ // guardo, tarea, actividad y etapa del proyecto en que trabajo
                        idProject = activityItem.arrayTask[j].projectId;
                        taskActivityFilter = activityItem.arrayTask[j];
                        activityFilter = activityItem;
                        stageFilter = stageItem;
                        
                        // idStageSelected = stageFilter._id;
                        // idActivitySelected = activityFilter._id;
                        idTaskSelected = taskActivityFilter._id;
                         taskName = taskActivityFilter.name;
                        var taskDateStartProvide = (taskActivityFilter.startDateProvideTask).split("T")[0];
                        var taskDateEndProvide = (taskActivityFilter.endDateProvideTask).split("T")[0];
                        var taskStatus = taskActivityFilter.status;
                        var description = taskActivityFilter.description;

                        if(taskActivityFilter.startDate !== undefined){
                            var taskDateStart =(taskActivityFilter.startDate).split("T")[0];
                        }else{
                            var taskDateStart = taskActivityFilter.startDate;
                        }

                        if(taskActivityFilter.endDate !== undefined){
                            var taskDateEnd =(taskActivityFilter.endDate).split("T")[0];
                        }else{
                            var taskDateEnd = taskActivityFilter.endDate;
                        }

                        // console.log("->",taskDateStartProvide,taskDateEndProvide,taskStatus,taskDateStart,taskDateEnd)

                        //chequear que se encuentre asignado un responsable
                        if(activityItem.arrayTask[j].idResponsable !== undefined ){
                            var responsableId = activityItem.arrayTask[j].idResponsable
                        }
                        // chequear que se encuentre asignado una duracion                       
                        if(activityItem.arrayTask[j].duration !== undefined){
                           var  durationtask = activityItem.arrayTask[j].duration
                        }


                    }
                }
            }
        }
    }

    useEffect(() => {      
        detailProjectById(idProject);
        relationTaskById(idProject);
        setDurationSelected(durationtask)
        setResponsableSelected(responsableId);     
        setStartDateProvide(taskDateStartProvide);
        setEndDateProvide(taskDateEndProvide);
        setStartDate(taskDateStart);
        setEndDate(taskDateEnd);
        setStatus(taskStatus);
        setDescriptionTask(description)   
    }, [detailProjectById, relationTaskById]); //getFilterStage

    const onChangeRes = (e) => {
        setResponsableSelected(e.target.value)
    }

    const onChangeDur = (e) => {
        setDurationSelected(e.target.value)
    }

    const onChangeDate = (e) => {
        setDateSelected(e.target.value)
    }

    const onChangeDateStartProvide = (e) => {
        setStartDateProvide(e.target.value)
    }
    const onChangeDateEndtProvide = (e) => {
        setEndDateProvide(e.target.value)
    }
    const onChangeDateStart = (e) => {
        setStartDate(e.target.value)
    }

    const onChangeDateEnd = (e) => {
        setEndDate(e.target.value)
    }

    const addReason = (e) => {
        setReason(e.target.value);
    }
    const onChangeDescriptionTask = (e) => {
        setStartDate(e.target.value)
    }


    if(projectDetail !== null){ // añade integrantes disponibles a seleccionar
        if(projectDetail.teamMember.length !== 0){   
            var listUserTeam = projectDetail.teamMember.map((us) =>
                <option key={us.userId} value={us.idUser}>{us.surname.toUpperCase()}, {us.name.toUpperCase()}</option>
            );            
        }
    }


    const elimUserTask = () => { //quita una asignacion de un rrhh a una tarea (logicamente)
            console.log("ELIMINO rel",relationIdSelect)
            console.log("busco tarea y elimino relacion",taskIdSelect)
            console.log("fecha de fin",dateSelected)
            console.log("razon",reason)
            deleteRelationTask({projectId:idProject,relationId:relationIdSelect,date:dateSelected,reason:reason,idUserCreate:user._id})
        modalTask();
    }
    

    if (relationsTask !== null & projectDetail !== null){        // traigo las relaciones existentes y las cargo 
        for (let x = 0; x < projectDetail.teamMember.length; x++) {       
                            
            const element = projectDetail.teamMember[x];
            let count = 0;  

            for (let index = 0; index < relationsTask.length; index++) {
                if(element.idUser === relationsTask[index].userId & relationsTask[index].taskId === idTaskSelected ){ // ya fue añadido para la tarea
                    element.assignated = true;
                    count++
                }            
            }
            if (count === 0){ // disponible para añadir
                element.assignated = false;
               
            }
       
        }
        // console.log("parser",projectDetail.teamMember)
    }

    //#region Agregar relacion ya añadidas previamente
    if(projectDetail !== null){ 

        if(projectDetail.teamMember.length > 0){
            let us = []
            for (let index = 0; index < projectDetail.teamMember.length; index++) {
                const element = projectDetail.teamMember[index];                 

                for (let i = 0; i < relationsTask.length; i++) {
                    if(element.idUser === relationsTask[i].userId & relationsTask[i].taskId === idTaskSelected & projectDetail.teamMember[index].assignated === true ){
                        // console.log("relation",relationsTask[i],element)
                        let item = {"_id":element._id,"assgnated":element.assignated,"idUser":element.idUser,"name":element.name,"surname":element.surname,
                        "dateUpAssigned":relationsTask[i].dateUpAssigned, "dateDownAssigned":relationsTask[i].dateDownAssigned, "relationId":relationsTask[i]._id, 
                        "dedications":relationsTask[i].dedications, "taskId":relationsTask[i].taskId,"status":relationsTask[i].status, "reason":relationsTask[i].reason};
                        us.push(item);
                    }            
                }
            }
            if (us.length === 0){
                whithItems = true
              var  itemNone = <li className='itemTeam list-group-item-action list-group-item'><center><b>No hay  RRHH asignados a la tarea</b></center></li>
            }else{
                // console.log("adentrooo",us)
            var listTaskRelation = us.map((te, item) =>
            <tr key={te._id}>
                <td>
                    {te.surname}, {te.name}                  
                </td>                
                <td className="hide-sm">
                    <div>
                        <b>Inicio:</b> <Moment format="DD/MM/YYYY">{moment.utc(te.dateUpAssigned)}</Moment>                       
                    </div> 
                    <div>
                        <b>Fin:</b>{te.dateDownAssigned !== undefined ? <Moment format="DD/MM/YYYY">{moment.utc(te.dateDownAssigned)}</Moment> :" ACTUAL"}
                    </div>
                </td>

                <td className="hide-sm centerBtn">                    
                    {/* {te.status === "TRABAJANDO" ? <span class="badge badge-success">TRABAJANDO</span> : ""} */}
                    {/* {te.status === "ASIGNADO"  ? <span class="badge badge-success">ASIGNADO</span> : ""}                    
                    {te.status === "DESASIGNADO" ? <span class="badge badge-dark">DESASIGNADO</span> : ""} */}
                    <span class={te.dedications.length === 0 ? "badge badge-dark":"badge badge-success"}>{te.dedications.length}</span>   
                </td>

                <td className="hide-sm ">    
                    <a  onClick={e => manageDedication(te.relationId,te.dedications, te.name, te.surname )} className={te.dedications.length !== 0 ? "btn btn-success": "btn btn-success hideBtn"} title="Ver dedicaciones">
                        <i className="fas fa-search coloWhite"></i>
                    </a>                 
                    <a onClick={e => quitToList(te.relationId,te.taskId, te.name, te.surname )} className={te.dedications.length === 0 & te.status !== "DESASIGNADO" ? "btn btn-danger": "btn btn-danger hideBtn"} title="Quitar Asignación">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a> 
                </td>

            </tr>                    
            );
            }
        }

    }
    //#endregion

   
    // //#region Agregar relacion entre tarea y recurso

    const quitToList = (relationId,taskId,name,surname) => {

        setRelationIdSelected(relationId);
        setTaskIdSelected(taskId);
        setNameUserSelected(name);
        setSurnameUserSelected(surname);
        modalTask()

    }

    const modalTask = () => {
        if(showModalTask){
            setModalTask(false);
        }else{
            setModalTask(true);
        }
    }
    
    const modalTaskRelation = (
        <Modal show={showModalTask} onHide={e => modalTask()}>
            <Modal.Header closeButton>
                <Modal.Title>Quitar asignación a la Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estás seguro de quitar la asignación a la tarea <b> {taskName}</b>,a  <b>{surnameUserSelect} {nameUserSelect}</b>?
                </p>

                <div className="form-group col-lg-12">
                    <h5>Fecha de Fin de relación (*)</h5>
                    <input 
                        type="date" 
                        className="form-control"
                        placeholder=""
                        onChange = {e => onChangeDate(e)}
                        value={dateSelected}
                        min = {minDate}
                    />
                </div>
                <div className="form-group col-lg-12">                  
                    <h5>Motivo:</h5>                        
                    <input 
                        type="text" 
                        className="form-control"
                        placeholder="Ingrese un motivo de desasignación" 
                        name="reason"
                        minLength="3"
                        maxLength="300"
                        onChange = {e => addReason(e)}
                    />                       
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalTask()}>
                    Cerrar
                </Button>
                <Link className="btn btn-primary" onClick={e => elimUserTask()}>
                    Aceptar
                </Link>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

     //#region dedicacion

        if (dedicationsSelected.length !== 0){        
            var listHistory = dedicationsSelected.map((te) =>
                    <tr>
                        <td className="hide-sm">
                            <Moment format="DD/MM/YYYY ">{moment.utc(te.date)}</Moment>                      
                        </td>
                        <td className="hide-sm">                            
                            {te.hsJob}
                        </td>                        
                        <td className="hide-sm">
                            {te.observation}
                        </td>
                    </tr>
                );
            }        


     const manageDedication = (relationId,dedications,name,surname) => {

        setRelationIdSelected(relationId);
        setDedicationsSelected(dedications);
        setNameUserSelected(name);
        setSurnameUserSelected(surname);
        modalDedication()

    }

    const modalDedication = () => {
        if(showModalDedication){
            setModalDedication(false);
        }else{
            setModalDedication(true);
        }
    }
    
    const modalDedications = (
        <Modal show={showModalDedication} onHide={e => modalDedication()}>
            <Modal.Header closeButton>
                <Modal.Title>Visualizar Dedicaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                   Dedicaciones de <b>{surnameUserSelect} {nameUserSelect}</b>
                </p>
                <div className="row">
                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Fecha</th>
                                <th className="hide-sm headTable centerBtn">Hs. Dedicadas</th>
                                <th className="hide-sm headTable centerBtn">Observation</th>
                            </tr>
                            </thead>
                           <tbody>
                                {listHistory}
                           </tbody>
                            
                    </table>  
                    
                </div>
            </div>
                

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalDedication()}>
                    Cerrar
                </Button>                
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    console.log("p",projectDetail)
    return (
        <Fragment>

            <div className="row rowProject">
                    <Link to={`/proyect-manager/project-activity/${idProject}`} className="btn btn-secondary">
                            Atrás
                    </Link>
                      
            </div>
            <h2>Información de la Tarea: <strong>{taskActivityFilter ? taskActivityFilter.name : "-"}</strong></h2>
            <div className="row rowProject"> 
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Proyecto: </div>
                    <strong>{projectDetail ? projectDetail.name : "-"}</strong>
                </div>                       
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Etapa:</div>
                    <strong>{stageFilter ? stageFilter.name : "-"}</strong>
                </div>

                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Actividad:</div>
                    <strong>{activityFilter ? activityFilter.name : "-"}</strong>
                </div>   
                <div className="mb-sm-2 mb-0 col-sm-12 col-md">
                    <div className="text-muted">Estado:</div>
                    {/* <strong>{activityFilter ? activityFilter.status : "-"}</strong> */}
                    <td className="hide-sm centerBtn">                    
                        {status === "ACTIVA" ? <h5><span class="badge badge-success">ACTIVA</span></h5>  : ""}
                        {status === "CREADA" ? <h5><span class="badge badge-secundary">CREADA</span></h5>  : ""}
                        {status === "ASIGNADA" ?  <h5><span class="badge badge-secundary">ASIGNADA</span></h5> : ""}
                        {status === "SUSPENDIDA" ?  <h5><span class="badge badge-warning">SUSPENDIDA</span></h5> : ""}
                        {status === "CANCELADA" ?  <h5><span class="badge badge-danger">CANCELADA</span></h5> : ""}
                        {status === "TERMINADA" ? <h5><span class="badge badge-dark">TERMINADA</span></h5> : ""}
                    </td>
                </div>                    
            </div>
            
            <form  className="form" >
                <div className="row">
                    <div className="col-lg-5"> 
                        <div className="row">
                            <div className="form-group col-lg-12">
                                <h5>Descripción</h5>
                                <input 
                                    type="text" 
                                    class="form-control"
                                    placeholder="Descripción de la Tarea" 
                                    name="descriptionTask"
                                    minLength="3"
                                    maxLength="200"
                                    onChange = {e => onChangeDescriptionTask(e)}
                                    value={descriptionTask}
                                    disabled={true} 
                                />
                                
                            </div>
                        </div>    
                        <div className="row">                            
                            <div className="form-group col-lg-6">
                                <h5>Fecha de Inicio Previsto</h5>
                                <input 
                                    type="date" 
                                    class="form-control"
                                    placeholder="" 
                                    name="startDateProvideTask"
                                    onChange = {e => onChangeDateStartProvide(e)}
                                    value={startDateProvideTask}
                                    disabled={true}  
                                />
                            </div>

                            <div className="form-group col-lg-6">
                                <h5>Fecha de Fin Previsto</h5>
                                <input 
                                    type="date" 
                                    class="form-control"
                                    placeholder="" 
                                    name="endDateProvideTask"
                                    onChange = {e => onChangeDateEndtProvide(e)}
                                    value={endDateProvideTask}
                                    disabled={true}  
                                />
                            </div>
                        </div>  

                        <div className="row">
                            <div className="form-group col-lg-6">
                                <h5>Fecha de Inicio Real</h5>
                                <input 
                                    type="date" 
                                    class="form-control"
                                    placeholder="" 
                                    name="startDateProvideTask"
                                    onChange = {e => onChangeDateStart(e)}
                                    value={startDate}
                                    disabled={true}  
                                />
                            </div>

                            <div className="form-group col-lg-6">
                                <h5>Fecha de Fin Real</h5>
                                <input 
                                    type="date" 
                                    class="form-control"
                                    placeholder="" 
                                    name="endDateProvideTask"
                                    onChange = {e => onChangeDateEnd(e)}
                                    value={endDate}
                                    disabled={true}  
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-6">
                            <h5>Duración Estimada</h5>
                            <input
                                type="number"
                                class="form-control"                                
                                name="duration"
                                step={0.5} 
                                precision={2}
                                min = {0} 
                                value={durationEst}
                                onChange={e => onChangeDur(e)}     
                                disabled={true}                    
                            />
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-7">
                        <div className="row">
                            <div className="form-group col-lg-12">
                            <h5>Responsable de la Tarea</h5>
                            <select name="responsable" class="form-control" onChange={e => onChangeRes(e)} value={responsableSelected} disabled={true}>
                                <option value="0">* Sin Responsable Asignado</option>
                                {listUserTeam}
                                </select>
                            </div>
                        </div>
                        
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-align-justify"></i>
                                <strong>{' '} Recursos Asignados </strong>
                            </div>

                            <div className="card-body ">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th className="hide-sm headTable ">Apellido y Nombre</th>
                                        <th className="hide-sm headTable ">Período Asignado</th>
                                        <th className="hide-sm headTable ">Decicaciones Cargadas</th>                                        
                                        <th className="hide-sm headTable centerBtn ">Opciones</th>
                                    </tr>
                                    </thead>
                                    <tbody>{listTaskRelation}</tbody>                                    
                                </table>
                                {whithItems ? '' : itemNone}
                            </div>
                        </div>
                    </div>
                        
                </div>

                <Link to={`/proyect-manager/project-activity/${idProject}`} className="btn btn-secondary">
                    Volver
                </Link>
            </form>
            

            {modalTaskRelation}
            {modalDedications}
            
        </Fragment>
    )
}


ProjectManagerProjectDetailRelationTask.propTypes = {
    detailProjectById: PropTypes.func.isRequired,
    relationTaskById: PropTypes.func.isRequired,
    relationUserTask: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
    projectDetail: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    deleteRelationTask: PropTypes.func.isRequired,
}
 

const mapStateToProps = state => ({
    stage: state.stage,
    projectDetail: state.projectDetail,
    relationsTask: state.relationsTask,
    auth: state.auth,
})

export default connect(mapStateToProps, {setAlert,detailProjectById, relationTaskById, relationUserTask, deleteRelationTask})(ProjectManagerProjectDetailRelationTask)



