import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { Button, Card, Modal, ToggleButtonGroup, } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import {getFilterStage} from '../../actions/stage';
import { getAllTeam } from '../../actions/team';
import {detailProjectById, relationTaskById, relationUserTask} from '../../actions/project';

const AdminProjectRelationTask = ({match, setAlert,getAllTeam, history, getFilterStage, relationUserTask, stage: {stage, loading}, detailProjectById, projectDetail: {projectDetail}, relationTaskById, relationsTask: {relationsTask},auth:{user}, team:{team}}) => {

    const [showModalTask, setModalTask] = useState(false);

    const [idUserSelect, setIdUserSeleted] = useState("");

    const [itemIndex, setIndex] = useState("");

    const [arrayUserTeam, setArrayTeam] = useState([]);


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;
 
    //fecha para restringir mínimo para asignar RRHH
    var dateToday = new Date();
    let dateMin = new Date(dateToday.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];    
    const [minDate, setDate] = useState(dateMin);

    const [dateSelected, setDateSelected] = useState(today);
    const [responsableSelected, setResponsableSelected] = useState('');
    const [durationEst, setDurationSelected] = useState(0);
    

    var idProject;
    var taskActivityFilter;
    var activityFilter;
    var stageFilter;
    var idStageSelected ="";
    var idActivitySelected="";
    var idTaskSelected="";
    var nameTeam = "-";
    var desactivateResponsable = false;
    var desactivateDuration = false;
    var taskName = ""


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
                        
                        idStageSelected = stageFilter._id;
                        idActivitySelected = activityFilter._id;
                        idTaskSelected = taskActivityFilter._id;
                        taskName = taskActivityFilter.name
                        //chequear que se encuentre asignado un responsable                        
                        // deshabilitar campo                        
                        if(activityItem.arrayTask[j].idResponsable !== undefined ){
                            var responsableId = activityItem.arrayTask[j].idResponsable                           
                            desactivateResponsable = true
                        }
                        // chequear que se encuentre asignado una duracion
                        // deshabilitar campo
                        if(activityItem.arrayTask[j].duration !== undefined){
                            var durationtask = activityItem.arrayTask[j].duration                            
                            desactivateDuration = true
                        }

                    }
                }
            }
        }
    }

    useEffect(() => {      
        getAllTeam();
        detailProjectById(idProject);
        relationTaskById(idProject);
        

        if(desactivateDuration){
            setDurationSelected(durationtask)
        }
        setResponsableSelected(responsableId);        

    }, [getFilterStage, detailProjectById, relationTaskById]);

    const onChangeDate = (e) => {
        setDateSelected(e.target.value)
    }

    const onChangeRes = (e) => {
        setResponsableSelected(e.target.value)
    }

    const onChangeDur = (e) => {
        setDurationSelected(e.target.value)
    }

    const onSubmit = async e => {
        e.preventDefault();      
        // console.log("A GUARDAR:",idProject, idStageSelected, idActivitySelected, idTaskSelected, arrayUserTeam,"res",responsableSelected, durationEst, new Date(),user._id);
        if(arrayUserTeam.length !== 0 & responsableSelected !== ""){
            relationUserTask({projectId:idProject, stageId:idStageSelected, activityId:idActivitySelected, taskId:idTaskSelected, assignedMembers:arrayUserTeam, idResponsable:responsableSelected, duration:durationEst, date:new Date(),idUserCreate:user._id,history})            
        }else{
            setAlert('Se debe seleccionar un integrante como mínimo y un responsable.', 'danger');
        }
    }

    if(projectDetail !== null){ // añade integrantes disponibles a seleccionar
        if(projectDetail.teamMember.length !== 0){   
            var listUserTeam = projectDetail.teamMember.map((us) =>
                <option key={us.userId} value={us.idUser}>{us.surname.toUpperCase()}, {us.name.toUpperCase()}</option>
            );            
        }
    }


    const saveUserTask = (idUser) => { //guardar una seleccion de integrante con su fecha
        var dateCustom = new Date(dateSelected);
        listTeam = arrayUserTeam;
        // console.log("tengo en arrayTeams:",listTeam,idUser)

        for (let index = 0; index < projectDetail.teamMember.length; index++) {
            const element = projectDetail.teamMember[index];
            // console.log("analizo...",element)
            if(element.idUser === idUser){
                let u = []
                u.push(element.idUser)
                u.push(dateCustom)
                listTeam.push(u);
                element.addList = true;
                // console.log("-------->",element)
            }
        }
        // console.log("en lista",listTeam)
        setArrayTeam(listTeam);              
       
        // console.log(idStageSelected,idActivitySelected,idTaskSelected,idUser,dateCustom)        

        modalTask();
    }
    
    const quitToList = (idUser, itemPass) => { //quita de la lista a asignar para enviar

        listTeam = arrayUserTeam;
        // console.log("quitamos!:",idUser,itemPass,listTeam)
        for (let j = 0; j < projectDetail.teamMember.length; j++) {
            const element = projectDetail.teamMember[j];
            // console.log("comparo:",element,idUser)
            if(element._id === idUser){
                // console.log("cambio a false!")
                element.addList = false;
            }
        }
        let auxListTeam = []
        for (let index = 0; index < listTeam.length; index++) {
            const element = listTeam[index];
            // console.log("veo:",element,idUser)
            if(element[0]._id !== idUser){
                // console.log("adentro!")
                auxListTeam.pop(element)
            }
        }
        
        // console.log("sale",auxListTeam,projectDetail.teamMember)
        
        setIndex(itemPass);
        
        setArrayTeam(auxListTeam);
        
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
        var t = team.filter(function(t) {
            return t._id === projectDetail.teamId;
        });
        
        if(t.length !== 0){ //seteo nombre del equipo
            nameTeam = t[0].name
        }


        if(projectDetail.teamMember.length > 0){
            let us = []
            for (let index = 0; index < projectDetail.teamMember.length; index++) {
                const element = projectDetail.teamMember[index];                 

                for (let i = 0; i < relationsTask.length; i++) {
                    if(element.idUser === relationsTask[i].userId & relationsTask[i].taskId === idTaskSelected & projectDetail.teamMember[index].assignated === true ){
                        let item = {"_id":element._id,"assgnated":element.assignated,"idUser":element.idUser,"name":element.name,"surname":element.surname,"dateUpAssigned":relationsTask[i].dateUpAssigned}
                        us.push(item)
                    }            
                }
            }
            if (us.length === 0 ){// no tengo RRHH asignados
                var listTeam = <li className='itemTeam list-group-item-action list-group-item'><center><b>No hay  RRHH asignados</b></center></li>
            }else{// tengo RRHH asignados
                var listTaskRelation = us.map((te, item) =>
                        <li key={te._id}  className="list-group-item-action list-group-item">
                            {te.name}  {te.surname} -  <Moment format="DD/MM/YYYY">{moment.utc(te.dateUpAssigned)}</Moment>

                        </li>
                );
            }
        }

    }
    //#endregion

    //#region  despliega el equipo    
    if(projectDetail != null){
        let us = []
        for (let index = 0; index < projectDetail.teamMember.length; index++) {
            if (projectDetail.teamMember[index].assignated === false){
                us.push(projectDetail.teamMember[index])
            }
        }
        
        if (us.length === 0 ){// no tengo RRHH para asignar
                var listTeam = <li className='itemTeam list-group-item-action list-group-item'><center><b>No hay  RRHH disponibles para asignar</b></center></li>
            }else{// tengo RRHH para asignar
        
            var listTeam = us.map((te, item) =>

                <li key={te._id}  className="list-group-item-action list-group-item">
                    {te.name}  {te.surname}

                    <div className="float-right">     

                        <a onClick={e => quitToList(te._id, item)} className={te.addList ? "btn btn-danger": "hideBtn btn btn-danger"} title="Quitar">
                            <i className="fas fa-minus-circle coloWhite"></i>
                        </a> 

                        <a onClick={e => addTaskModal(te.idUser, item)} className={!te.addList ? "btn btn-success": "hideBtn btn btn-primary"} title="Añadir">
                            <i className="fas fa-plus-circle coloWhite"></i>
                        </a>
                    </div>
        
                </li>
            );
        }

    }
    //#endregion

   
    //#region Agregar relacion entre tarea y recurso

    const addTaskModal = (idUserPass,item) => {
        setIndex(item)
        setIdUserSeleted(idUserPass)
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
                <Modal.Title>Asociar Tarea: {taskName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estás seguro de asociar la tarea con el recurso?
                </p>

                <div className="form-group col-lg-12">
                    <h5>Fecha de Inicio de relación (*)</h5>
                    <input 
                        type="date" 
                        className="form-control"
                        placeholder=""
                        onChange = {e => onChangeDate(e)}
                        value={dateSelected}
                        min = {minDate}
                    />
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalTask()}>
                    Cerrar
                </Button>
                <Link className="btn btn-primary" onClick={e => saveUserTask(idUserSelect)}>
                    Aceptar
                </Link>
            </Modal.Footer>
        </Modal>
    );
    //#endregion


    // console.log("p",projectDetail)
    return (
        <Fragment>

            <div className="row rowProject">
                    <Link to={`/admin-project/project-activity/${idProject}`} className="btn btn-secondary">
                            Atrás
                    </Link>
                      
            </div>
            <h2>Asignar Recursos - Tarea: <strong>{taskActivityFilter ? taskActivityFilter.name : "-"}</strong></h2>
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
                    <div><strong>{activityFilter ? activityFilter.name : "-"}</strong>
                        
                    </div>
                </div>

                    
            </div>
            <form  className="form" onSubmit={e => onSubmit(e)}>
                <div className="row">
                    <div className="col-lg-6">
                        <div className="row">
                            <div className="form-group col-lg-12">
                            <h5>Responsable de la Tarea (*)</h5>
                            <select name="responsable" class="form-control" onChange={e => onChangeRes(e)} value={responsableSelected} disabled={desactivateResponsable}>
                                <option value="0">* Seleccione el responsable</option>
                                {listUserTeam}
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-lg-12">
                            <h5>Duración Estimada en Hs (*)</h5>
                            <input
                                type="number"
                                class="form-control"                                
                                name="duration"
                                step={0.5} 
                                precision={2}
                                min = {0} 
                                value={durationEst}
                                onChange={e => onChangeDur(e)}     
                                disabled={desactivateDuration}                    
                            />
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fa fa-align-justify"></i>
                                        <strong>{' '} Recursos Asignados Anteriormente</strong>
                                    </div>
                                    <div className="card-body ">
                                        <ul className="list-group">
                                            {listTaskRelation}
                                        </ul>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className="col-lg-6">
                        <div className="card">

                            <div className="card-header">
                                <i className="fa fa-align-justify"></i>
                                <strong>{' '} Equipo {nameTeam} </strong>
                            </div>

                            <div className="card-body ">                            
                                <ul className="list-group">
                                    {listTeam}
                                </ul>
                            </div>

                        </div>
                    </div>
                        
                </div>
                <div className="form-group">
                    <span>(*) son campos obligatorios</span>
                </div>

                <input type="submit" className="btn btn-primary" value="Asignar" />

                <Link to={`/admin-project/project-activity/${idProject}`} className="btn btn-danger">
                    Cancelar
                </Link>
            </form>
            

            {modalTaskRelation}
            
        </Fragment>
    )
}

AdminProjectRelationTask.propTypes = {
    getFilterStage: PropTypes.func.isRequired,
    detailProjectById: PropTypes.func.isRequired,
    relationTaskById: PropTypes.func.isRequired,
    relationUserTask: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
    projectDetail: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
}
 

const mapStateToProps = state => ({
    stage: state.stage,
    projectDetail: state.projectDetail,
    relationsTask: state.relationsTask,
    team: state.team,
    auth: state.auth,
})

export default connect(mapStateToProps, {setAlert,getAllTeam,getFilterStage, detailProjectById, relationTaskById, relationUserTask})(AdminProjectRelationTask)

