import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProject } from '../../actions/project';
import Moment from 'react-moment';
import moment from 'moment';

const AdminProject = ({getAllProject, project: {project}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

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

    //console.log(project)
    //buscar cliente, referente, responsable, equipo
    //filtro de estado
    if(project != null){

        if(statusFilter !== ""){// filtro segun estado
            var projectFilter =  project.filter(function(pr) {
                return pr.status === statusFilter;
            });
            //console.log(projectFilter)
            if (projectFilter.length === 0){
                var whithItems = false;
                var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay proyectos</b></center></li>)
            }else{
                var whithItems = true;
            }
        }else{ // traigo todos los proyectos
            var projectFilter = project;
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
            <tr key={pr._id}>
                <td>
                    <div>{pr.name}</div>
                    <div className="small text-muted">
                        <b>Cliente:</b> {pr.client.nameClient}
                    </div>
                    <div className="small text-muted">
                        <b>Referente:</b> {pr.agent.surnameAgent}, {pr.agent.nameAgent}
                    </div>
                </td>
                <td>
                    {/* <div className="avatar">
                        <img src="https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png" className="img-avatar"/>
                        {
                            ri.status === "ACTIVO" ? 
                            <span className="avatar-status badge-success"></span>
                            :
                            <span className="avatar-status badge-danger"></span>

                        }
                    </div> */}
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
                            <b>Fin:</b> <Moment format="DD/MM/YYYY">{moment.utc(pr.endDateExpected)}</Moment>
                        </div>
                </td>

                <td className="hide-sm">                    
                    {pr.status === "ACTIVO" ? <span class="badge badge-success">ACTIVO</span> : ""}
                    {pr.status === "PREPARANDO" | pr.status === "FORMULANDO"  ? <span class="badge badge-secundary">FORMULANDO</span> : ""}
                    {pr.status === "SUSPENDIDO" ? <span class="badge badge-warning">SUSPENDIDO</span> : ""}
                    {pr.status === "CANCELADO" ? <span class="badge badge-danger">CANCELADO</span> : ""}
                    {pr.status === "TERMINADO" ? <span class="badge badge-dark">TERMINADO</span> : ""}
                </td>

                <td className="hide-sm centerBtn"> 
                    <Link to={`/admin-project/project-detail/${pr._id}`} className="btn btn-success my-1"title="Ver Información">
                        <i className="fas fa-search coloWhite"></i>
                    </Link>
                    {pr.status === "PREPARANDO" | pr.status === "FORMULANDO" ? 
                        <React.Fragment>
                            <a className="btn btn-danger my-1" title="Eliminar">
                                <i className="far fa-trash-alt coloWhite"></i>
                            </a> 
                            <a className="btn btn-info my-1" title="Activar">
                                <i className="fas fa-check-circle coloWhite"></i>
                            </a> 
                            <Link className="btn btn-primary" title="Editar Información">
                                <i className="far fa-edit"></i>
                            </Link>   
                            <Link to={`/admin-project/project-activity/${pr._id}`} className={pr.status === "ACTIVO" ? "btn btn-dark my-1" : "btn btn-dark my-1"} title="Getión de Etapas, Actividades y Tareas">
                                <i className="fas fa-project-diagram coloWhite"></i>
                            </Link>
                        </React.Fragment>
                        : ""}
                    {pr.status === "ACTIVO" ? 
                        <React.Fragment>
                            <a className="btn btn-danger my-1" title="Terminar">
                                <i className="fas fa-times coloWhite"></i>
                            </a>
                            <a className="btn btn-warning my-1" title="Suspender">
                                <i className="fas fa-stop"></i>
                            </a>  
                            <Link className="btn btn-primary" title="Editar Información">
                                <i className="far fa-edit"></i>
                            </Link>
                            <Link to={`/admin-project/project-activity/${pr._id}`} className={pr.status === "ACTIVO" ? "btn btn-dark my-1" : "btn btn-dark my-1"} title="Getión de Etapas, Actividades y Tareas">
                                <i className="fas fa-project-diagram coloWhite"></i>
                            </Link>
                        </React.Fragment>                        
                        : ""}

                    {pr.status === "SUSPENDIDO" ? 
                        <React.Fragment>
                            <a className="btn btn-danger my-1" title="Terminar">
                                <i className="fas fa-times coloWhite"></i>
                            </a>
                            <a className="btn btn-warning my-1" title="Reactivar">
                                <i className="fas fa-arrow-alt-circle-up"></i>
                            </a>  
                            <Link className="btn btn-primary" title="Editar Información">
                                <i className="far fa-edit"></i>
                            </Link>
                            <Link to={`/admin-project/project-activity/${pr._id}`} className={pr.status === "ACTIVO" ? "btn btn-dark my-1" : "btn btn-dark my-1"} title="Getión de Etapas, Actividades y Tareas">
                                <i className="fas fa-project-diagram coloWhite"></i>
                            </Link>
                        </React.Fragment>
                        :""}

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
        var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay proyectos</b></center></li>)
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
            <h2 className="my-2">Administración de Proyectos</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable nameHead">Proyecto y Cliente</th>
                    <th className="hide-sm headTable statusHead">Equipo y Responsable del Proyecto</th>
                    <th className="hide-sm headTable avcs">Período Previsto</th>
                    <th className="hide-sm headTable headClient">
                        <select name="status" className="form-control " onChange = {e => modifyStatus(e)}>
                            <option value="">ESTADO</option>
                            <option value="ACTIVO">Ver ACTIVOS</option>
                            <option value="TERMINADO">Ver TERMINADOS</option>
                            <option value="SUSPENDIDO">Ver SUSPENDIDOS</option>
                            <option value="CANCELADO">Ver CANCELADOS</option>
                            <option value="FORMULANDO">Ver EN FORMUACIÓN</option>
                        </select>
                    </th>
                    <th className="hide-sm headTable centerBtn optionHead">Opciones</th>
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

        </Fragment>

    )
}

AdminProject.propTypes = {
    getAllProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.project
})

export default connect(mapStateToProps, {getAllProject})(AdminProject)
