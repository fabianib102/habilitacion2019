import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, Modal, ToggleButtonGroup, } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import {getFilterStage} from '../../actions/stage';
import {detailProjectById, relationTaskById, relationUserTask} from '../../actions/project';

const AdminProjectRelationTask = ({match, setAlert, history, getFilterStage, relationUserTask, stage: {stage, loading}, detailProjectById, projectDetail: {projectDetail}, relationTaskById, relationsTask: {relationsTask},auth:{user}}) => {


    const [itemStage, setIndexStage] = useState(-1);    

    const [itemActivity, setItemAct] = useState(-1);

    const [itemTask, setItemTask] = useState(-1);

    const [filterMember, setMember] = useState([]);

    const [taskName, setTaskName] = useState("");

    const [alertText, setAlertText] = useState("");

    const [showModalTask, setModalTask] = useState(false);

    const [idUserSelect, setIdUserSeleted] = useState("");

    const [itemIndex, setIndex] = useState("");

    const [arrayUserTeam, setArrayTeam] = useState([]);


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;

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


    if(stage !== null){ //busco tarea de la actividad y traigo su idProjecto
        for (let index = 0; index < stage.length; index++) {
            let stageItem = stage[index];
            for (let i = 0; i < stageItem.arrayActivity.length; i++) {
                let activityItem = stageItem.arrayActivity[i]
                for (let j = 0; j < activityItem.arrayTask.length; j++) {
                    if (activityItem.arrayTask[j]._id === match.params.idRelationTask){ // guardo, tarea, actividad y etapa del proyecto en que trabajo
                        // console.log("encontre!",activityItem.arrayTask[j]._id)
                        idProject = activityItem.arrayTask[j].projectId;
                        taskActivityFilter = activityItem.arrayTask[j];
                        activityFilter = activityItem;
                        stageFilter = stageItem;
                        
                        idStageSelected = stageFilter._id;
                        idActivitySelected = activityFilter._id;
                        idTaskSelected = taskActivityFilter._id;
                    }
                }
            }
        }
    }

    useEffect(() => {        
        // getRelationsTaskById(match.params.idProject) 
        // getFilterStage(match.params.idProject);
        detailProjectById(idProject);
        relationTaskById(idProject)
    }, [getFilterStage, detailProjectById, relationTaskById]);

    
    var stageBand = false
    
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
        console.log("A GUARDAR:",idProject, idStageSelected, idActivitySelected, idTaskSelected, arrayUserTeam, responsableSelected,"duration", durationEst, new Date(),user._id);
        if(arrayUserTeam.length !== 0 & responsableSelected !== ""){
            relationUserTask({projectId:idProject, stageId:idStageSelected, activityId:idActivitySelected, taskId:idTaskSelected, assignedMembers:arrayUserTeam, idResponsable:responsableSelected, duration:durationEst, date:new Date(),idUserCreate:user._id,history})            
        }else{
            setAlert('Se debe seleccionar un integrante como mínimo y un responsable.', 'danger');
        }
    }

    if(projectDetail !== null){ // añade integrantes disponibles a seleccionar
        if(projectDetail.teamMember.length !== 0){
            // console.log(projectDetail.teamMember)
            var listUserTeam = projectDetail.teamMember.map((us) =>
                <option key={us._id} value={us._id}>{us.surname.toUpperCase()}, {us.name.toUpperCase()}</option>
            );
            // console.log(listUserTeam)
        }
    }


    const saveUserTask = (idUser) => { //guardar una seleccion de integrante con su fecha
        var dateCustom = new Date(dateSelected);
        listTeam = arrayUserTeam;
        console.log("tengo en arrayTeams:",listTeam,idUser)

        for (let index = 0; index < projectDetail.teamMember.length; index++) {
            const element = projectDetail.teamMember[index];
            console.log("analizo...",element)
            if(element.idUser === idUser){
                let u = []
                u.push(element.idUser)
                u.push(dateCustom)
                listTeam.push(u);
                element.addList = true;
                console.log("-------->",element)
            }
        }

        setArrayTeam(listTeam);              
       
        console.log(idStageSelected,idActivitySelected,idTaskSelected,idUser,dateCustom)        

        modalTask();
    }
    
    const quitToList = (idUser, itemPass) => { //quita de la lista a asignar para enviar

        listTeam = arrayUserTeam;
        console.log("quitamos!:",idUser,itemPass,listTeam)
        for (let j = 0; j < projectDetail.teamMember.length; j++) {
            const element = projectDetail.teamMember[j];
            console.log("comparo:",element,idUser)
            if(element._id === idUser){
                console.log("cambio a false!")
                element.addList = false;
            }
        }
        let auxListTeam = []
        for (let index = 0; index < listTeam.length; index++) {
            const element = listTeam[index];
            console.log("veo:",element,idUser)
            if(element[0]._id !== idUser){
                console.log("adentro!")
                auxListTeam.push(element)
            }
        }
        
        console.log("sale",auxListTeam,projectDetail.teamMember)
        
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
        console.log("parser",projectDetail.teamMember)
    }

    //#region Agregar relacion ya añadidas previamente
    if(projectDetail !== null){ 
        if(projectDetail.teamMember.length > 0){
            let us = []
            for (let index = 0; index < projectDetail.teamMember.length; index++) {
                if (projectDetail.teamMember[index].assignated === true){
                    us.push(projectDetail.teamMember[index])
                }
            }
            var listTaskRelation = us.map((te, item) =>
                    <li key={te._id}  className="list-group-item-action list-group-item">
                        {te.name}  {te.surname}  

                    </li>
            );
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
        console.log("no asignadooo",us)
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



    console.log("p",projectDetail)
    return (
        <Fragment>

            <div className="row rowProject">
                    <Link to="/admin-project" className="btn btn-secondary">
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
                            <select name="responsable" class="form-control" onChange={e => onChangeRes(e)} value={responsableSelected}>
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
                                <strong>{' '} Equipo {projectDetail ?"--" :""} </strong>
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

                <Link to="/admin-project" className="btn btn-danger">
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
    auth: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
}
 

const mapStateToProps = state => ({
    stage: state.stage,
    projectDetail: state.projectDetail,
    relationsTask: state.relationsTask,
    auth: state.auth,
})

export default connect(mapStateToProps, {setAlert,getFilterStage, detailProjectById, relationTaskById, relationUserTask})(AdminProjectRelationTask)

