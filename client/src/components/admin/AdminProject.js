import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Spinner} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProject, deleteProjectById} from '../../actions/project';
import Moment from 'react-moment';
import moment from 'moment';

const AdminProject = ({getAllProject, deleteProjectById, project: {project},auth:{user}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(5);
    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");
    
    const [show, setShow] = useState(false);
    const [txtFilter, setTxtFilter] = useState("");
    const [txtFilter2, setTxtFilter2] = useState("");
    const [txtFilter3, setTxtFilter3] = useState("");

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
        getAllProject();
    }, [getAllProject]);

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    const [statusFilter, setStatus] = useState("");

    const modifyStatus = (e) => {
        setStatus(e.target.value);
        setCurrent(1);
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

    
    //buscar cliente, referente, responsable, equipo
    //filtro de estado
    if(project != null){
        var projectFilter = project;
        var whithItems = true;

        // console.log("proyectos:",project);

        if(txtFilter !== ""){
            var projectFilter =  project.filter(function(pr) {
                return pr.name.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
            });           
        }

        if(txtFilter2 !== ""){
            var projectFilter =  project.filter(function(pr) {
                return pr.historyLiderProject[pr.historyLiderProject.length - 1].surname.toLowerCase().indexOf(txtFilter2.toLowerCase()) >= 0 
                | pr.team.nameTeam.toLowerCase().indexOf(txtFilter2.toLowerCase()) >= 0
                | pr.historyLiderProject[pr.historyLiderProject.length - 1].name.toLowerCase().indexOf(txtFilter2.toLowerCase()) >= 0 
            }); 
        }

        if(txtFilter3 !== ""){
            var projectFilter =  project.filter(function(pr) {
                return pr.client.nameClient.toLowerCase().indexOf(txtFilter3.toLowerCase()) >= 0                
                | pr.agent.nameAgent.toLowerCase().indexOf(txtFilter3.toLowerCase()) >= 0
                | pr.agent.surnameAgent.toLowerCase().indexOf(txtFilter3.toLowerCase()) >= 0 ;
            });
        }

        if(statusFilter !== ""){// filtro segun estado
            var projectFilter =  project.filter(function(pr) {
                return pr.status === statusFilter;
        });
        
         }


        // console.log("projectfilter",projectFilter)
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
        
            console.log(projectFilter)
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
                
            <div>{pr.client.nameClient} </div>
                <div className="small text-muted">
                    <b>Referente:</b> {pr.agent.surnameAgent}, {pr.agent.nameAgent}
                </div>
            </td>
            <td>
                    <div>
                        {pr.team.nameTeam}                       
                    </div> 

                <div className="small text-muted">
                    <div>
                        <b>Responsable:</b> {pr.historyLiderProject[pr.historyLiderProject.length - 1].surname}, {pr.historyLiderProject[pr.historyLiderProject.length - 1].name}
                    </div>
                </div>
            </td>
            
            <td className="hide-sm">
                    <div>
                        <b>Inicio:</b> <Moment format="DD/MM/YYYY">{moment.utc(pr.startDateExpected)}</Moment>                       
                    </div> 
                    <div>
                        <b>Fin:</b> {pr.status !== "TERMINADO" & pr.status !== "CANCELADO" ? yellowDate(pr.endDateExpected): <Moment format="DD/MM/YYYY">{moment.utc(pr.endDateExpected)}</Moment>}
                        {/* <b>Fin:</b> {yellowDate(pr.endDateExpected)} */}
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
                    <Link to={`/admin-project/project-detail/${pr._id}`} className="btn btn-success my-1"title="Ver Información">
                        <i className="fas fa-search coloWhite"></i>
                    </Link>
                    <Link to={`/admin-project/project-activity/${pr._id}`} className="btn btn-dark my-1" title="Ver Etapas, Actividades y Tareas">
                                <i className="fas fa-project-diagram coloWhite"></i>
                        </Link>
                    {pr.status === "PREPARANDO" | pr.status === "FORMULANDO" ? 
                        <React.Fragment>
                            <Link to={`/admin-project/edit-project/${pr._id}`}  className="btn btn-primary" title="Editar Información">
                                <i className="far fa-edit"></i>
                            </Link>  
                            <a onClick={e => askDelete(pr.name, pr._id)} className="btn btn-danger my-1" title="Eliminar">
                                <i className="far fa-trash-alt coloWhite"></i>
                            </a> 
                        </React.Fragment>
                        : ""}
                    

                </td>

            </tr>
        );

                var pageNumbers = [];
                for (let i = 1; i <= Math.ceil(project.length / todosPerPage); i++) {
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
    };

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
    
    const changeTxt = e => {
        setTxtFilter(e.target.value);
    }
    const changeTxt2 = e => {
        setTxtFilter2(e.target.value);
    }
    const changeTxt3 = e => {
        setTxtFilter3(e.target.value);
    }

    return (

        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin" className="btn btn-secondary">
                        Atrás
                    </Link>

                    <Link to="/admin-project/create-project" className="btn btn-primary my-1">
                        Nuevo Proyecto
                    </Link>
                </div>
                <div className="form-group col-lg-6 col-sm-6 selectStatus">                    
                </div>
            </div>
            
                <div className="col-lg-12 col-sm-12">
                    <div className="row row-hover">
                        <div className="col-lg-6 col-sm-6">    
                            <h2 className="mb-2">Administración de Proyectos</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                            {/* <input type="text" className="form-control " placeholder="Buscar por nombre de: Proyecto/Cliente/Referente/Equipo" onChange = {e => changeTxt(e)} /> */}
                        </div>                 
                    </div>
                </div>
            
            <div className="react-bs-table-container">
            <table className="table table-hover table-bordered">
                <thead className="react-bs-container-header table-header-wrapper">
                <tr>
                    <th className="hide-sm  ">Proyecto
                        <input type="text" className="form-control " placeholder="Buscar por nombre Proyecto" onChange = {e => changeTxt(e)} />
                    </th>
                    <th className="hide-sm  ">Cliente y Referente
                        <input type="text" className="form-control " placeholder="Buscar por nombre Cliente/Referente" onChange = {e => changeTxt3(e)} />
                    </th>
                    <th className="hide-sm  ">Equipo y Responsable del Proyecto
                    <input type="text" className="form-control " placeholder="Buscar por nombre Equipo/Responsable" onChange = {e => changeTxt2(e)} />
                    </th>
                    <th className="hide-sm  avcs">Período Previsto</th>
                    <th className="hide-sm  headStatus2">
                        <center>Estado</center>
                        <select name="status" className="filter select-filter form-control placeholder-selected" onChange = {e => modifyStatus(e)}>
                            <option value="">TODOS</option>
                            <option value="ACTIVO">Ver ACTIVOS</option>
                            <option value="TERMINADO">Ver TERMINADOS</option>
                            <option value="SUSPENDIDO">Ver SUSPENDIDOS</option>
                            <option value="CANCELADO">Ver CANCELADOS</option>
                            <option value="FORMULANDO">Ver EN FORMUACIÓN</option>
                        </select>
                    </th>
                    <th className="hide-sm  centerBtn optionHead3">Opciones</th>
                </tr>
                </thead>
                <tbody>{listProject}</tbody>
                
            </table>
            </div>
            {whithItems ? '' : itemNone}
            <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 col-lg-6"></div>
                <div className="col-md-6 col-xs-6 col-sm-6 col-lg-6">
                    <center>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            {renderPageNumbers}
                        </ul>
                    </nav>
                    </center>
                </div>
            </div>
            {modalEliminar}
        </Fragment>

    )
}

AdminProject.propTypes = {
    getAllProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    deleteProjectById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.project,
    auth: state.auth,
})

export default connect(mapStateToProps, {getAllProject, deleteProjectById, })(AdminProject)
