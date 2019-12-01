import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Card} from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';
import PrintButton from '../teamMember/PrintButton';
import {getProjectByLider } from '../../actions/project';
import {getTasksByLeader} from '../../actions/task';
import {getAllUsers} from '../../actions/user';
import {getAllTask} from '../../actions/task';

const ProjectManagerTaskReport = ({match, getProjectByLider, projectLider : { projectLider }, getTasksByLeader, tasksLider: {tasksLider}, auth:{user},getAllUsers, users :{users}, getAllTask, task:{tasks}}) => {

    const [projectSelected, setprojectSelected] = useState("");

    const [startFilter , setStartFilter] = useState();
    const [endFilter, setEndFilter] = useState("");
    const [stateFilter, setStateFilter] = useState("");

    var projectName = "";
    var startProvider = "";
    var endProvider = "";

    var listState = []; 

    useEffect(() => {
        getProjectByLider(match.params.idUser);
        getTasksByLeader(match.params.idUser);
        setStartFilter(moment().startOf('month').format("YYYY-MM-DD"));
        setEndFilter(moment().format("YYYY-MM-DD"));
        getAllUsers();
        getAllTask();
    }, [getProjectByLider,getAllUsers,getAllTask]);

    if(projectLider != null){

        var projectNameListHtml = projectLider.map((proyect) =>
            <option name={proyect.name} value={proyect._id}>{proyect.name}</option>
        );    

        
        if(tasksLider !== null && tasksLider !== undefined && tasksLider.arrayTask !== []){

            //se arma el listado del resumen
            var lisT = tasksLider.arrayTask.filter(function(task){
                    return task.projectId === projectSelected._id;
                }
            );

            var asignadaCount = lisT.reduce((total, tarea) => {
                if(tarea.status == "ASIGNADO") return total + 1
                else return total}, 0);
            
            var creadaCount = lisT.reduce((total, tarea) => {
                if(tarea.status == 'CREADO') return total + 1
                else return total}, 0);
            
            var activaCount = lisT.reduce((total, tarea) => {
                if(tarea.status == 'ACTIVA') return total + 1
                else return total}, 0);

            var suspendidaCount = lisT.reduce((total, tarea) => {
                if(tarea.status == 'SUSPENDIDA') return total + 1
                else return total}, 0);

            var canceladaCount = lisT.reduce((total, tarea) => {
                if(tarea.status == 'CANCELADA') return total + 1
                else return total}, 0);

            var terminadaCount = lisT.reduce((total = 0, tarea) => {
                if(tarea.status == 'TERMINADA') return total + 1
                else return total}, 0);        
        
            projectName = projectSelected.name;
    
            if(projectSelected != "") startProvider = <Moment format="DD/MM/YYYY">{moment.utc(projectSelected.startDateExpected)}</Moment>;
            
            if(projectSelected != "")  endProvider = <Moment format="DD/MM/YYYY">{moment.utc(projectSelected.endDateExpected)}</Moment>;;

            
            //--------------------------------------------------
            //se arma la parte del detalle

            //se arma el filtro
            for (let index = 0; index < lisT.length; index++) {
                const element = lisT[index];
                if(!listState.includes(element.status)){
                    listState.push(element.status);
                }
            }

            var listprojectHtml = listState.map((state) =>
                <option key={state} value={state}>{state}</option>
            );

            //se arma la lista
            var taskDetailList = tasksLider.arrayTask.filter(function(task){
                return task.projectId === projectSelected._id;
            });


            if(stateFilter !== ""){
                var taskDetailList =  tasksLider.arrayTask.filter(function(task){
                    return task.projectId === projectSelected._id && stateFilter === task.status;
                });
            }

            if(users != null && tasks != null) {
                var tasksLiderTable = taskDetailList.map((task) =>
                    <tr>
                        <td>{task.status}</td>
                        <td>{task.taskId}</td>
                        <td><Moment format="DD/MM/YYYY">{moment.utc(task.startDateProvide)}</Moment></td>
                        <td><Moment format="DD/MM/YYYY">{moment.utc(task.endDateProvide)}</Moment></td>
                        <td>{task.userId}</td>
                    </tr>
                );
            }   
        }  


    
    }

    const setprojectLiderData = (idProject) =>{

        for (let index = 0; index < projectLider.length; index++) {
            const proj = projectLider[index];
            if( proj._id === idProject) {
                setprojectSelected(proj)
            }
        };
    }

    const modifyprojectLider = (e) => {
        setprojectLiderData(e.target.value);
    }
    
    const changeState = (e) => {
        setStateFilter(e.target.value);
    }

    const changeStart = e => {
        setStartFilter(e.target.value);
    }

    const changeEnd = e => {
        setEndFilter(e.target.value);
    }

    return (
        <Fragment>
            <div className="col-lg-9 col-sm-9">
                <div class= "row">
                    <Link to={`/projectLider-manager/`} className="btn btn-secondary">
                        Atrás
                    </Link>
                </div>
            </div>
            <br/>

            <Card>
                <Card.Header>
                    <h2>Reporte de estado de tareas por proyecto</h2>
                </Card.Header>
                
                <Card.Body>
                                       
                    <div className="row">
                        <div className="col-lg-6 col-sm-6">
                            <h4>Seleccione el Proyecto a Buscar</h4>
                            <br/>
                            <select name="Proyect" className="form-control" onChange = {e => modifyprojectLider(e)}>
                                <option value="">PROYECTO</option>
                                {projectNameListHtml}
                            </select> 
                        </div>
                    </div>
                
                    <br/>

                    <div className="row">
                        <div id="reporte_resumen" style={{width:'200mm',padding:'10px'}}>
                            <Card>
                                <Card.Header>
                                    <h2>Resumen de tareas segun estado</h2>
                                </Card.Header>
                                <Card.Body>
                                    <p className='float-right'>Fecha de Emision: <Moment format="DD/MM/YYYY" className='float-right'></Moment></p>
                                    
                                    <br/>
                                    <br/>

                                    <div className="row ml-2">
                                        <h5>Proyecto:</h5>{projectName}
                                    </div>
                                    <div className="row ml-2">
                                        <h5>Fecha Inicio Previsto:</h5>{startProvider}
                                    </div>
                                    <div className="row ml-2">
                                        <h5>Fecha Fin Previsto:</h5>{endProvider}
                                    </div>
                                    
                                    <br/>

                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th className="hide-sm headTable">Estado</th>
                                                <th className="hide-sm headTable">Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>CREADA</td>
                                                <td>{creadaCount}</td>
                                            </tr>
                                            <tr>
                                                <td>ASIGNADA</td>
                                                <td>{asignadaCount}</td>
                                            </tr>
                                            <tr>
                                                <td>ACTIVA</td>
                                                <td>{activaCount}</td>
                                            </tr>
                                            <tr>
                                                <td>SUSPENDIDA</td>
                                                <td>{suspendidaCount}</td>
                                            </tr>
                                            <tr>
                                                <td>CANCLADA</td>
                                                <td>{canceladaCount}</td>
                                            </tr>
                                            <tr>
                                                <td>TERMINADA</td>
                                                <td>{terminadaCount}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card>
                        </div>
                        
                        <div className="col-lg-4 col-sm-8">
                            <Card>
                                <Card.Header>
                                    <h5 className="my-2">Seleccionar Período</h5>
                                </Card.Header>
                                <Card.Body>
                                    <div class= "row mb-4">
                                        <div className="col-lg-6 col-sm-6">
                                            <p><b>Desde: </b></p>
                                            <input type="date" value={startFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" onChange = {e => changeStart(e)} ></input>
                                        </div>
                                        <div className="col-lg-6 col-sm-6">
                                            <p><b>Hasta: </b></p>
                                            <input type="date" value={endFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" onChange = {e => changeEnd(e)} ></input>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-lg-6 col-sm-8">
                                        <div >
                                            <PrintButton id='reporte_resumen' label='Descargar Reporte' className="float-right"> </PrintButton>
                                        </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    
                    <br/>

                    <div style={{width:'200mm',padding:'10px'}}>
                        <Card>
                            <Card.Header>
                                <div className="row align-middle">
                                    <h4 className="align-middle ml-3 mr-2">Detalle de tareas segun estado</h4>
                                    <div >
                                        <PrintButton id='reporte_detalle' label='Descargar Detalle' className="float-right"> </PrintButton>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body id="reporte_detalle">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th className="hide-sm headTable">
                                                <select name="Proyect" className="form-control" onChange = {e => changeState(e)}>
                                                    <option key="" value="">ESTADO</option>
                                                    <option key="" value="pruebas">Pruebas</option>
                                                    {listprojectHtml}
                                                </select></th>
                                            <th className="hide-sm headTable">Nombre</th>
                                            <th className="hide-sm headTable">Inicio Previso</th>
                                            <th className="hide-sm headTable">Fin Previso</th>
                                            <th className="hide-sm headTable">Usuario Asignado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasksLiderTable}
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Card>
                    </div>
                </Card.Body>
            </Card>
        </Fragment>
    )
}


ProjectManagerTaskReport.propTypes = {
    getTasksByLeader: PropTypes.func.isRequired,
    getProjectByLider: PropTypes.func.isRequired,
    projectLider:  PropTypes.object.isRequired,
    tasksLider: PropTypes.object.isRequired,
    getAllUsers: PropTypes.object.isRequired,
    getAllTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    task: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    projectLider: state.projectLider,
    tasksLider: state.tasksLider,
    auth: state.auth,
    users: state.users,
    task: state.task
})

export default connect(mapStateToProps, {getTasksByLeader, getProjectByLider, getAllUsers, getAllTask})(ProjectManagerTaskReport)