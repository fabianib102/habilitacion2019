import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

import {getFilterStage} from '../../actions/stage';
import {deleteProjectById, cancelProjectById, suspenseProjectById, reactivateProjectById,liderProjectById } from '../../actions/project';


const AdminProjectDetail = ({match, getFilterStage, history, project: {project}, deleteProjectById, cancelProjectById, suspenseProjectById,reactivateProjectById,liderProjectById, auth:{user}}) => {


    useEffect(() => {
        getFilterStage(match.params.idProject, getFilterStage);
    }, [getFilterStage]);

    var projectFilter;

    //para manejo de Historial Proyecto
    const [showModalHistoryProject, setShowModalHistoryProject] = useState(false);
    const [idUProject, setIdProject] = useState("");
    const [nameProject, setNameProject] = useState("");

    //para manejo de Historial Lider
    const [showModalHistoryUser, setShowModalHistoryUser] = useState(false);   

    const [show, setShow] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showReactivate, setShowReactivate] = useState(false);
    const [showSuspense, setShowSuspense] = useState(false);
    const [showLider, setShowLider] = useState(false);
    const [idLider, setIdLider] = useState("");
    const [nameLider, setNameLider] = useState("");
    const [surnameLider, setSurnameLider] = useState("");
    const [reason, setReason] = useState("");

    //obtencion del proyecto a visualizar
    if(project != null){

        let projectFil =  project.filter(function(pro) {
            return pro._id == match.params.idProject;
        });

        projectFilter = projectFil[0];

        //console.log("Datos: ", projectFilter);
        
    }else{
        return <Redirect to='/admin-project'/>
    }

    //listado de miembros de un equipo
    var listMember = projectFilter.membersTeam.map((ri, item) =>
        
        <li className="justify-content-between list-group-item" key={ri.userId}>
            <Fragment>
            <div className="float-left">
                {projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].liderProject === ri.userId ? <i class="fas fa-medal"></i>:<i class="fas fa-minus"> </i>}
                <Link to={`/admin-user/user-detail/${ri.userId}`} title="Ver Datos">
                     {ri.surname}, {ri.name}
                </Link>    
            </div>
            <div className="float-right">
                <Link onClick={e => askLider(ri.name,ri.surname,projectFilter.name,ri.userId,projectFilter._id)} className={projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].liderProject === ri.userId ? "btn btn-primary disabledCursor": "btn btn-primary "} title="Seleccionar como lider">
                                        <i className="fas fa-plus-circle coloWhite"></i>
                </Link>
            </div>  
            </Fragment>
        </li>
        
    );

    //listado de riesgos del proyecto
    if(projectFilter.listRisk !== null){
        var listRisks = projectFilter.listRisk.map((ri) =>
            <tr key={ri._id}>
                 <td>{ri.nameRisk}</td>
                    <td className="hide-sm">
                        <center>
                            {ri.percentage !== undefined ? ri.percentage : "50"} %
                        {/* <div className="form-group ">
                            <select className="float-center" >
                                <option value="25">25%</option>
                                <option value="50">50%</option>
                                <option value="75">75%</option>
                                <option value="100">100%</option>                                
                            </select>
                        </div> */}
                        </center>
                    </td>
                    <td className="hide-sm"> {ri.impact !== undefined ? ri.impact : "MEDIO"}</td>
                    <td> 
                        <Link to={``} className="btn btn-primary disabledCursor" title="Editar Riesgo">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>   
                        <Link to={``} className="btn btn-danger disabledCursor" title="Eliminar Riesgo">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </Link>
                    </td>
            </tr>);
    }  
    
    //armado de datos del hisotrial del proyecto
    if (projectFilter.history.length !== 0){
        
        var listHistory = projectFilter.history.map((te) =>
                    <tr>
                        <td className="hide-sm">                            
                            <Fragment>
                            <Moment format="DD/MM/YYYY ">{moment.utc(te.dateUp)}</Moment> - 
                            {te.dateDown === null || te.dateDown === undefined ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}    
                            </Fragment>
                        </td>
                        <td className="hide-sm">
                            {te.status}
                        </td>
                        <td className="hide-sm">
                        {te.surnameUserchanged} {te.nameUserchanged}
                        
                        </td>
                        <td className="hide-sm">
                            {te.reason}
                        </td>
                    </tr>
                );        
    }
   

     const callModalProjectHistory = (id,nameSelected) => {
        setIdProject(id);
        setNameProject(nameSelected);
        historyModalProject();
    }

    const historyModalProject = () => {
        if(showModalHistoryProject){
            setShowModalHistoryProject(false);
        }else{
            setShowModalHistoryProject(true);
        }
    }

    //#region modal project history    
    var modalProject = (
        <Modal size="lg" show={showModalHistoryProject} onHide={e => historyModalProject()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes del proyecto <b>{nameProject}</b></center>
            <div className="row">

                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Período</th>
                                <th className="hide-sm headTable centerBtn">Estado</th>
                                <th className="hide-sm headTable centerBtn">Realizado por</th>
                                <th className="hide-sm headTable centerBtn">Motivo</th>
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
                <Button variant="secondary" onClick={e => historyModalProject()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    //#endregion


 
    //armado de datos del hisotrial de los lideres del proyecto
    if (projectFilter.historyLiderProject.length !== 0){
        
        var listHistory = projectFilter.historyLiderProject.map((te) =>
                    <tr>
                        <td className="hide-sm">
                            {te.surname}, {te.name}
                        </td>
                        <td className="hide-sm">                            
                            <Fragment>
                                <Moment format="DD/MM/YYYY ">{moment.utc(te.dateUp)}</Moment> - 
                                {te.dateDown === null || te.dateDown === undefined ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}                            
                            
                            </Fragment>
                        </td>
                        <td className="hide-sm">
                            {te.reason}
                        </td>
                        
                    </tr>
                );        

    }

    const callModalUserHistory = (idUser,nameUserSelected) => {
        setIdProject(idUser);
        setNameProject(nameUserSelected);
        historyModalUser();
    }

    const historyModalUser = () => {
        if(showModalHistoryUser){
            setShowModalHistoryUser(false);
        }else{
            setShowModalHistoryUser(true);
        }
    }

    //#region modal lider history    
    const modalUser = (
        <Modal show={showModalHistoryUser} onHide={e => historyModalUser()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos de Líderes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de lider en el proyecto <b>{nameProject}</b></center>
            <div className="row">

                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Apellido y Nombre</th>
                                <th className="hide-sm headTable centerBtn">Período</th>
                                <th className="hide-sm headTable centerBtn">Motivo</th>
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
                <Button variant="secondary" onClick={e => historyModalUser()}>
                    Cerrar
                </Button>                             
                {/* <Link to={`/admin-project/project-lider/${projectFilter._id}`} className="btn btn-primary" >
                    Cambiar Lider
                </Link> */}
            </Modal.Footer>
        </Modal>
    );
    //#endregion

  

    const addReason = (e) => {
        setReason(e.target.value);
    }


    // PARA ELIMINACION DEL PROYECTO
    const modalElim = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    const askDelete = (nameComplete, IdToDelete) => {        
        setNameProject(nameComplete)
        setIdProject(IdToDelete)
        modalElim();
    }

    const deleteProject = (idProject) => {
        deleteProjectById(idProject);
        modalElim();
        history.push('/admin-project')
    }


    //PARA CANCELACION DEL PROYECTO
    const modalCan = () => {
        if(showCancel){
            setShowCancel(false);
        }else{
            setShowCancel(true);
        }
    }
    const askCancel = (nameComplete, IdToCancel) => {
        setNameProject(nameComplete)
        setIdProject(IdToCancel)
        modalCan();
    }

    const cancelProject = (idProject) => {
        cancelProjectById(idProject, user._id, reason);
        modalCan();
    }

    //PARA SUSPENCION DEL PROYECTO
    const modalSus = () => {
        if(showSuspense){
            setShowSuspense(false);
        }else{
            setShowSuspense(true);
        }
    }
    const askSuspense = (nameComplete, IdToSuspense) => {
        setNameProject(nameComplete)
        setIdProject(IdToSuspense)
        modalSus();
    }

    const suspenseProject = (idProject) => {
        suspenseProjectById(idProject, user._id, reason);
        modalSus();
    }
    

    // PARA  REACTIVACION DEL PROYECTO
    const modalReac = () => {
        if(showReactivate){
            setShowReactivate(false);
        }else{
            setShowReactivate(true);
        }
    }
    const askReactivate = (nameComplete, IdToReactivate) => {        
        setNameProject(nameComplete)
        setIdProject(IdToReactivate)
        modalReac();
    }
    
    
    const reactivateProject = (idProject) => {
        reactivateProjectById(idProject, user._id);
        modalReac();
    }

    // PARA  CAMBIAR LIDER DEL PROYECTO
    const modalLider = () => {
        if(showLider){
            setShowLider(false);
        }else{
            setShowLider(true);
        }
    }
    const askLider= (nameLider,surnameLider,nameComplete,idLider, IdProject) => {        
        setNameLider(nameLider);
        setSurnameLider(surnameLider);
        setIdLider(idLider);
        setNameProject(nameComplete);
        setIdProject(IdProject);
        console.log(nameLider,surnameLider,nameComplete,idLider, IdProject)
        modalLider();
        
    }
    
    
    const liderProject = (idProject, idLiderNew) => {
        console.log(idProject, idLiderNew)
        liderProjectById(idProject, idLiderNew);
        modalLider();
    }

    // modal de eliminacion de proyecto
    const modalEliminar = (
        <Modal show={show} onHide={e => modalElim()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el proyecto: <b>{nameProject}</b>?
                    
                </p>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalElim()}>
                Cerrar
                </Button>
                <Link onClick={e => deleteProject(idUProject)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );
    
    // modal de cancelación de proyecto
    const modalCancelar = (
        <Modal show={showCancel} onHide={e => modalCan()}>
            <Modal.Header closeButton>
                <Modal.Title>Cancelar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de cancelar el proyecto: <b>{nameProject}</b> ?                   
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label class="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div class="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de cancelación" 
                                name="reason"
                                minLength="3"
                                maxLength="150"
                                onChange = {e => addReason(e)}
                            />
                        </div>
                    </div>
                </form>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalCan()}>
                Cerrar
                </Button>
                <Link onClick={e => cancelProject(idUProject)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );
    
    // modal de suspención de proyecto
    const modalSuspense = (
        <Modal show={showSuspense} onHide={e => modalSus()}>
            <Modal.Header closeButton>
                <Modal.Title>Suspender Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de suspender el proyecto: <b>{nameProject}</b> ?                   
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label class="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div class="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de cancelación" 
                                name="reason"
                                minLength="3"
                                maxLength="150"
                                onChange = {e => addReason(e)}
                            />
                        </div>
                    </div>
                </form>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalSus()}>
                Cerrar
                </Button>
                <Link onClick={e => suspenseProject(idUProject)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );

    // modal de reactivación de proyecto
    const modalReactivate = (
        <Modal show={showReactivate} onHide={e => modalReac()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de reactivar el proyecto: <b>{nameProject}</b>?
                    
                </p>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalReac()}>
                Cerrar
                </Button>
                <Link onClick={e => reactivateProject(idUProject)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );

    // modal de cambio de lider
    const modalLiderP= (
        <Modal show={showLider} onHide={e => modalLider()}>
            <Modal.Header closeButton>
                <Modal.Title>Cambio Lider de  Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de cambiar el lider del proyecto de  <b>{nameProject} </b>
                     por <b>{surnameLider} ,{nameLider}</b>?
                    
                </p>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalLider()}>
                Cerrar
                </Button>
                <Link onClick={e => liderProject(idUProject,idLider)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );

    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2"><i className="fas fa-clipboard-list"></i> Proyecto: <b>{projectFilter.name}</b></h5>
                                    <h6>Descripción: {projectFilter.description}</h6>
                                </div>
                                <div className="float-right">
                                {projectFilter.status === "PREPARANDO" | projectFilter.status === "FORMULANDO" ? 
                                    <React.Fragment>
                                        <Link to={`/admin-project/edit-project/${match.params.idProject}`}  className="btn btn-primary " title="Editar Información">
                                            <i className="far fa-edit coloWhite"></i>
                                        </Link>
                                        <a onClick={e => askDelete(projectFilter.name,projectFilter._id)} className="btn btn-danger my-1" title="Eliminar">
                                            <i className="far fa-trash-alt coloWhite"></i>
                                        </a>            
                                        <Link to={`/admin-project/project-activity/${match.params.idProject}`} className="btn btn-dark my-1" title="Getión de Etapas, Actividades y Tareas">
                                            <i className="fas fa-project-diagram coloWhite"></i>
                                        </Link>
                                    </React.Fragment>
                                    : ""}
                                {projectFilter.status === "ACTIVO" ? 
                                    <React.Fragment>
                                        <a onClick={e => askCancel(projectFilter.name,projectFilter._id)} className="btn btn-danger my-1" title="Cancelar">
                                            <i className="fas fa-times coloWhite"></i>
                                        </a>
                                        <a onClick={e => askSuspense(projectFilter.name,projectFilter._id)} className="btn btn-warning my-1" title="Suspender">
                                            <i className="fas fa-stop"></i>
                                        </a>  
                                        <Link to={`/admin-project/project-activity/${match.params.idProject}`} className="btn btn-dark my-1" title="Getión de Etapas, Actividades y Tareas">
                                            <i className="fas fa-project-diagram coloWhite"></i>
                                        </Link>
                                    </React.Fragment>                        
                                    : ""}

                                {projectFilter.status === "SUSPENDIDO" ? 
                                    <React.Fragment>
                                        <a className="btn btn-danger my-1" title="Terminar">
                                            <i className="fas fa-times coloWhite"></i>
                                        </a>
                                        <a onClick={e => askReactivate( projectFilter.name,projectFilter._id)} className="btn btn-warning my-1" title="Reactivar">
                                            <i className="fas fa-arrow-alt-circle-up"></i>
                                        </a> 
                                        <Link to={`/admin-project/project-activity/${match.params.idProject}`} className="btn btn-dark my-1" title="Getión de Etapas, Actividades y Tareas">
                                            <i className="fas fa-project-diagram coloWhite"></i>
                                        </Link>
                                    </React.Fragment>
                                    :""}                                  
                                    

                                    <a  onClick={e => callModalProjectHistory(projectFilter._id, projectFilter.name)} className="btn btn-dark" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </a>                                     
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">   
                                        <Card.Title>Fecha de Inicio Prevista: <b><Moment format="DD/MM/YYYY">{projectFilter.startDateExpected}</Moment></b></Card.Title>
                                        <Card.Title>Fecha de Inicio Real: <b>{projectFilter.startDate !== undefined ? <Moment format="DD/MM/YYYY">{projectFilter.startDate}</Moment> : "-" }</b></Card.Title>
                                        <Card.Title>Tipo de Proyecto: <b>{projectFilter.projectType.nameProjectType}</b></Card.Title>
                                        <Card.Title>Cliente: <b>{projectFilter.client.nameClient}</b></Card.Title>
                                        <Card.Title>Responsable del Proyecto: 
                                            <Link onClick={e => callModalUserHistory(projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].liderProject, projectFilter.name)} title="Ver Historial de Líderes">
                                                <b> {projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].surname}, {projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].name}</b>
                                            </Link>
                                        </Card.Title>
                                 
                                    </div>
                                    <div className="col-lg-6">
                                        <Card.Title>Fecha de Fin Prevista: <b><Moment format="DD/MM/YYYY">{projectFilter.endDateExpected}</Moment></b></Card.Title>
                                        <Card.Title>Fecha de Fin Real: <b>{projectFilter.endDate !== undefined ? <Moment format="DD/MM/YYYY">{projectFilter.endDate}</Moment> : "-" }</b></Card.Title>
                                        <Card.Title>Subtipo de Proyecto: <b>{projectFilter.subTypeProject.nameProjectSubType}</b></Card.Title> 
                                        <Card.Title>Referente del Cliente:<b> {projectFilter.agent.surnameAgent}, {projectFilter.agent.nameAgent}</b></Card.Title>
                                        <Card.Title>Estado del Proyecto:
                                            {projectFilter.status === "ACTIVO" ? <span class="badge badge-success">ACTIVO</span> : ""}
                                            {projectFilter.status === "PREPARANDO"  | projectFilter.status === "FORMULANDO" ? <span class="badge badge-secundary">FORMULANDO</span> : ""}
                                            {projectFilter.status === "SUSPENDIDO" ? <span class="badge badge-warning">SUSPENDIDO</span> : ""}
                                            {projectFilter.status === "CANCELADO" ? <span class="badge badge-danger">CANCELADO</span> : ""}
                                            {projectFilter.status === "TERMINADO" ? <span class="badge badge-dark">TERMINADO</span> : ""}
                                        </Card.Title>                                                                                 
                                    </div>
                                   
                                </div> 
                                
                            </Card.Body>
                        </Card>
                                  
                    <div className="form-group"></div>
                    
             </div>
             <div className="row">
                <div className="containerCustom col-lg-4">
                    <Card>
                        <Card.Header>
                            <div className="float-left">
                                <h5 className="my-2"><i className="fas fa-users"></i> Equipo a cargo: <b>{projectFilter.team.nameTeam}</b></h5>                                     
                            </div>
                            
                        </Card.Header>
                        <Card.Body>
                            <div className="row">
                                <div className="col-lg-12"> 
                                    <ul className="list-group">
                                        {listMember}
                                    </ul>  
                                </div>
                            </div>
                        </Card.Body>
                    </Card> 
                </div>
                <div className="containerCustom col-lg-8 ">
                    <div className="card">
                        <div className="card-header">
                            <div className="float-left">
                                <h5 ><i className="fas fa-exclamation-triangle"></i> Riesgos del Proyecto</h5>
                            </div>
                            <div className="float-right">
                                <Link to={``} className="btn btn-success disabledCursor" title="Agregar Riesgos">
                                    <i className="fas fa-plus-circle coloWhite"></i>
                                </Link>                                
                            </div>
                        </div>
                        <div className="card-body ">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th className="hide-sm headTable">Nombre del Riesgo</th>
                                        <th className="hide-sm headTable">Probabilidad de Ocurrencia</th>
                                        <th className="hide-sm headTable">Impacto</th>    
                                        <th className="hide-sm headTable centerBtn optionHead">Opciones</th>                                  
                                    </tr>
                                </thead>
                                <tbody >
                                    {listRisks}                         
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
            {modalProject}
            {modalUser}
            {modalEliminar}
            {modalCancelar}
            {modalSuspense}
            {modalReactivate}
            {modalLiderP}
        </Fragment>
    )
}

AdminProjectDetail.propTypes = {
    getFilterStage: PropTypes.func.isRequired,
    deleteProjectById: PropTypes.func.isRequired,
    cancelProjectById: PropTypes.func.isRequired,
    suspenseProjectById: PropTypes.func.isRequired,
    reactivateProjectById: PropTypes.func.isRequired,
    liderProjectById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.project,
    auth: state.auth,
})

export default connect(mapStateToProps, {getFilterStage, deleteProjectById, cancelProjectById, suspenseProjectById, reactivateProjectById, liderProjectById})(AdminProjectDetail)
