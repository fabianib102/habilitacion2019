import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Spinner} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {deleteProjectById, cancelProjectById, suspenseProjectById, reactivateProjectById,getProjectByLider } from '../../actions/project';
import Moment from 'react-moment';
import moment from 'moment';

const ProjectManager = ({match,deleteProjectById, cancelProjectById, suspenseProjectById,reactivateProjectById,getProjectByLider,auth:{user},projectLider:{projectLider}}) => {
    
    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(5);
    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");
    
    const [show, setShow] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showReactivate, setShowReactivate] = useState(false);
    const [showSuspense, setShowSuspense] = useState(false);
    const [txtFilter, setTxtFilter] = useState("");

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;

    // funcion para dada una fecha valida que este a 3 dias de la fecha actual, si no esta lo marca en amarillo
    var yellowDate = (date) => {
        var current = moment().locale('ar');
        current = current.add(3, 'days')        
        var date2 = moment.utc(date);

        if(current>=date2) return <Fragment><Moment format="DD/MM/YYYY" className='btn-warning' title="A 3 días, menos o pasado de la fecha">{moment.utc(date)}</Moment><span className="badge badge-warning"><i className="fas fa-exclamation-triangle fax2"></i></span>  </Fragment>
        else return <Moment format="DD/MM/YYYY">{moment.utc(date)}</Moment>
    }

    useEffect(() => {
        getProjectByLider(match.params.idUser);
    }, [getProjectByLider]);

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    const [statusFilter, setStatus] = useState("");

    const modifyStatus = (e) => {
        setStatus(e.target.value);
        setCurrent(1);
    }
    
    const [reason, setReason] = useState("");

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
        setComplete(nameComplete)
        setId(IdToDelete)
        modalElim();
    }

    const deleteProject = (idProject) => {
        deleteProjectById(idProject);
        modalElim();
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
        setComplete(nameComplete)
        setId(IdToCancel)
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
        setComplete(nameComplete)
        setId(IdToSuspense)
        modalSus();
    }

    const suspenseProject = (idProject) => {
        suspenseProjectById(idProject, user._id, reason);
        modalSus();
    }
    

    // PARA ELIMINACION DEL PROYECTO
    const modalReac = () => {
        if(showReactivate){
            setShowReactivate(false);
        }else{
            setShowReactivate(true);
        }
    }

    const askReactivate = (nameComplete, IdToReactivate) => {        
        setComplete(nameComplete)
        setId(IdToReactivate)
        modalReac();
    }
    
    // PARA REACTIVAR EL PROYECTO
    const reactivateProject = (idProject) => {
        reactivateProjectById(idProject, user._id);
        modalReac();
    }
    
    
    //buscar cliente, referente, responsable, equipo
    //filtro de estado
    if(projectLider != null){
        var projectFilter = projectLider;
        var whithItems = true;
        // console.log(projectFilter);

        if(txtFilter !== ""){
            var projectFilter =  projectLider.filter(function(pr) {
                return pr.name.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 | pr.client.nameClient.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
                | pr.team.nameTeam.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0
            });
            // console.log(projectFilter)
        }
        if(statusFilter !== ""){// filtro segun estado
            var projectFilter =  projectLider.filter(function(pr) {
                return pr.status === statusFilter;
            });
        }
                        
        // console.log(projectFilter)
        if (projectFilter.length === 0){
            var whithItems = false;
            var itemNone = (
                <li className='itemTeam list-group-item-action list-group-item'>
                    <center>
                        <h5>
                            <b>Cargando Proyectos...     
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="sr-only">Espere...</span>
                                </Spinner>
                            </b>
                        </h5>
                    </center>
                </li>)
        }else{
            var whithItems = true;
        }
        //console.log(projectFilter)
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentProject = projectFilter.slice(indexOfFirstTodo, indexOfLastTodo);

        if(projectFilter.length === 0){//no tengo nada
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay proyectos</b></center></li>)
   
        }
        var listProject = currentProject.map((pr) =>
            <tr className= {moment(today).isSame(moment(pr.endDateExpected,"YYYY-MM-DD")) ?  "enLimite":(moment(today).isBefore(moment(pr.endDateExpected)) ? "":"fueraLimite")} key={pr._id}>
                <td>
                    <div>{pr.name}</div>                    
                </td>
                <td>                    
                    {pr.client.nameClient}                   
                    <div className="small text-muted">
                        <b>Referente:</b> {pr.agent.surnameAgent}, {pr.agent.nameAgent}
                    </div>
                </td>
                <td>
                    <div>
                        {pr.team.nameTeam}                       
                    </div>                   
                </td>
                
                <td className="hide-sm">
                        <div>
                            <b>Inicio:</b> <Moment format="DD/MM/YYYY">{moment.utc(pr.startDateExpected)}</Moment>                       
                        </div> 
                        <div>
                            <b>Fin:</b> {yellowDate(pr.endDateExpected)}
                        </div>
                </td>

                <td className="hide-sm centerBtn">                    
                    {pr.status === "ACTIVO" ? <span className="badge badge-primary">ACTIVO</span> : ""}
                    {pr.status === "PREPARANDO" | pr.status === "FORMULANDO"  ? <span className="badge badge-secundary">FORMULANDO</span> : ""}
                    {pr.status === "SUSPENDIDO" ? <span className="badge badge-warning">SUSPENDIDO</span> : ""}
                    {pr.status === "CANCELADO" ? <span className="badge badge-danger">CANCELADO</span> : ""}
                    {pr.status === "TERMINADO" ? <span className="badge badge-success">TERMINADO</span> : ""}
                </td>

                <td className="hide-sm "> 
                    <Link to={`/proyect-manager/project-detail/${pr._id}`} className="btn btn-success my-1"title="Ver Información">
                        <i className="fas fa-search coloWhite"></i>
                    </Link>
                    <Link to={`/proyect-manager/project-activity/${pr._id}`} className="btn btn-dark my-1" title="Gestión de Etapas, Actividades y Tareas">
                                <i className="fas fa-project-diagram coloWhite"></i>
                        </Link>
                    {pr.status === "PREPARANDO" | pr.status === "FORMULANDO" ? 
                        <React.Fragment>
                            <Link to={`/project-manager/edit-project/${pr._id}`}  className="btn btn-primary" title="Editar Información">
                                <i className="far fa-edit"></i>
                            </Link>  
                            <a onClick={e => askDelete(pr.name, pr._id)} className="btn btn-danger my-1" title="Eliminar">
                                <i className="far fa-trash-alt coloWhite"></i>
                            </a> 
                        </React.Fragment>
                        : ""}
                    {pr.status === "ACTIVO" ? 
                        <React.Fragment>
                            <a onClick={e => askCancel(pr.name, pr._id)} className="btn btn-danger my-1" title="Cancelar">
                                <i className="fas fa-times coloWhite"></i>
                            </a>
                            <a onClick={e => askSuspense(pr.name, pr._id)} className="btn btn-warning my-1" title="Suspender">
                                <i className="fas fa-stopwatch"></i>
                            </a> 
                        </React.Fragment>                        
                        : ""}

                    {pr.status === "SUSPENDIDO" ? 
                        <React.Fragment>
                            <a onClick={e => askCancel(pr.name, pr._id)} className="btn btn-danger my-1" title="Cancelar">
                                <i className="fas fa-times coloWhite"></i>
                            </a>
                            <a onClick={e => askReactivate(pr.name, pr._id)} className="btn btn-warning my-1" title="Reactivar">
                                <i className="fas fa-arrow-alt-circle-up"></i>
                            </a>  
                        </React.Fragment>
                        :""}

                </td>

            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(projectLider.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        var renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className="liCustom" key={number}>
                <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
              </li>
            );
        });
        
    }else{//no tengo nada
        
        var whithItems = false;
        var itemNone = (
            <li className='itemTeam list-group-item-action list-group-item'>
                <center>
                    <h5>
                        <b>Cargando Proyectos...     
                            <Spinner animation="border" role="status" variant="primary">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </b>
                    </h5>
                </center>
            </li>)
    }

    // modal de eliminacion de proyecto
    const modalEliminar = (
        <Modal show={show} onHide={e => modalElim()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el proyecto: <b>{nameComplete}</b>?
                    
                </p>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => deleteProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalElim()}>
                    Cerrar
                </Button>
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
                    ¿Estás seguro de cancelar el proyecto: <b>{nameComplete}</b>  ?                  
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label className="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div className="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de cancelación" 
                                name="reason"
                                minLength="3"
                                maxLength="300"
                                onChange = {e => addReason(e)}
                            />
                        </div>
                    </div>
                </form>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => cancelProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalCan()}>
                    Cerrar
                </Button>
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
                    ¿Estás seguro de suspender el proyecto: <b>{nameComplete}</b>?                    
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label className="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div className="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de cancelación" 
                                name="reason"
                                minLength="3"
                                maxLength="300"
                                onChange = {e => addReason(e)}
                            />
                        </div>
                    </div>
                </form>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => suspenseProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalSus()}>
                Cerrar
                </Button>
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
                    ¿Estás seguro de reactivar el proyecto: <b>{nameComplete}</b>?
                    
                </p>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => reactivateProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalReac()}>
                Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );

    
    const changeTxt = e => {
        setTxtFilter(e.target.value);
    }

    return (

        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h4 className="my-2">Bienvenido/a, <b> { user && user.name} {user && user.surname}</b></h4>
                </div>
                
            </div>
 
            <div className="row">
                <div className="col-lg-6 col-sm-6">

                    <div className="row">
                        
                        <div className="col-lg-6 col-sm-6 taskTxtCustom">
                            <h3 className="my-2">Mis Proyectos</h3>
                        </div>                        
                    </div>

                </div>
                <div className="col-lg-6 col-sm-6">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12">
                            <input type="text" className="form-control " placeholder="Buscar por nombre de: Proyecto/Cliente/Equipo" onChange = {e => changeTxt(e)} />
                        </div>                 
                    </div>
                </div>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable ">Proyecto</th>
                    <th className="hide-sm headTable ">Cliente y Referente</th>
                    <th className="hide-sm headTable ">Equipo</th>
                    <th className="hide-sm headTable avcs">Período Previsto</th>
                    <th className="hide-sm headTable headStatus2">
                        <select name="status" className="form-control " onChange = {e => modifyStatus(e)}>
                            <option value="">ESTADO</option>
                            <option value="ACTIVO">Ver ACTIVOS</option>
                            <option value="TERMINADO">Ver TERMINADOS</option>
                            <option value="SUSPENDIDO">Ver SUSPENDIDOS</option>
                            <option value="CANCELADO">Ver CANCELADOS</option>
                            <option value="FORMULANDO">Ver EN FORMUACIÓN</option>
                        </select>
                    </th>
                    <th className="hide-sm headTable centerBtn optionHead2">Opciones</th>
                </tr>
                </thead>
                <tbody>{listProject}</tbody>
                
            </table>
            {whithItems ? '' : itemNone}
            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>
            {modalEliminar}
            {modalCancelar}
            {modalSuspense}
            {modalReactivate}
        </Fragment>

    )
}

ProjectManager.propTypes = {
    getProjectByLider: PropTypes.func.isRequired,
    projectLider: PropTypes.object.isRequired,
    deleteProjectById: PropTypes.func.isRequired,
    cancelProjectById: PropTypes.func.isRequired,
    suspenseProjectById: PropTypes.func.isRequired,
    reactivateProjectById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    projectLider: state.project,
    auth: state.auth,
})

export default connect(mapStateToProps, {getProjectByLider, deleteProjectById, cancelProjectById, suspenseProjectById, reactivateProjectById})(ProjectManager)
