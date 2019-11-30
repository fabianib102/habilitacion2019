import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';
import PrintButton from '../teamMember/PrintButton';
import { relationTaskById, getAllProjectSimple } from '../../actions/project';



const ProjectManagerTaskReport = ({getAllProjectSimple, projectSimple : {projectSimple}, relationTaskById, relationsTask: {relationsTask},auth:{user}}) => {

    const [projectSelected, setProjectSelected] = useState("5dd5415a5fc4872820ceba51");

    const [startFilter , setStartFilter] = useState();
    const [endFilter, setEndFilter] = useState("");

    useEffect(() => {
        getAllProjectSimple();
        setStartFilter(moment().startOf('month').format("YYYY-MM-DD"));
        setEndFilter(moment().format("YYYY-MM-DD"));
    }, [getAllProjectSimple]);

    if(projectSimple != null){

        var projectNameListHtml = projectSimple.map((proyect) =>
            <option name={proyect.name} value={proyect._id}>{proyect.name}</option>
        );    

        
        if(relationsTask !== null && relationsTask !== undefined && relationsTask !== []){

            if(projectSelected != "" && projectSelected != undefined) {
                var projectSelectedHtml =  projectSimple.filter(project => project._id == projectSelected );    
            }

            
            var relationsTaskTable = relationsTask.map((task) =>
                <tr>
                    <td>{task.status}</td>
                    <td>{task.taskId}</td>
                    <td>11-11-2019</td>
                    <td>11-11-2019</td>
                    <td>{task.userId}</td>
                </tr>
            );

            var asignadaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == "ASIGNADO") return total + 1
                else return total}, 0);
            
            var creadaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'CREADO') return total + 1
                else return total}, 0);
            
            var activaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'ACTIVA') return total + 1
                else return total}, 0);

            var suspendidaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'SUSPENDIDA') return total + 1
                else return total}, 0);

            var canceladaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'CANCELADA') return total + 1
                else return total}, 0);

            var terminadaCount = relationsTask.reduce((total = 0, tarea) => {
                if(tarea.status == 'TERMINADA') return total + 1
                else return total}, 0);        
            
        }  


    
    }
    

    const modifyProject = (e) => {
        relationTaskById(e.target.value);
        setProjectSelected(e.target.value);
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
                    <Link to={`/project-manager/`} className="btn btn-secondary">
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
                            <select name="Proyect" className="form-control" onChange = {e => modifyProject(e)}>
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
                                    <h5>Proyecto:</h5>
                                    <h5>Fecha Inicio Previsto:</h5>
                                    <h5>Fecha Fin Previsto:</h5>
                                    
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
                                                <select name="Proyect" className="form-control">
                                                    <option value="PROYECTO 1">INICIADA</option>
                                                    <option value="PROYECTO 2">EN PROCESO</option>
                                                    <option value="PROYECTO 3">FINALIZADA</option>
                                                </select></th>
                                            <th className="hide-sm headTable">Nombre</th>
                                            <th className="hide-sm headTable">Inicio Previso</th>
                                            <th className="hide-sm headTable">Fin Previso</th>
                                            <th className="hide-sm headTable">Usuario Asignado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {relationsTaskTable}
                                        <tr>
                                            <td>EN PROCESO</td>
                                            <td>Una Tarea En proceso</td>
                                            <td>11-11-2019</td>
                                            <td>11-11-2019</td>
                                            <td>Sanchez Jose Andres</td>
                                        </tr>
                                        <tr>
                                            <td>FINALIZADA</td>
                                            <td>Una Tarea Finalizada</td>
                                            <td>11-11-2019</td>
                                            <td>11-11-2019</td>
                                            <td>Sanchez Jose Andres</td>
                                        </tr>
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
    relationTaskById: PropTypes.func.isRequired,
    getAllProjectSimple: PropTypes.func.isRequired,
    projectSimple:  PropTypes.object.isRequired,
    relationsTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    projectSimple: state.projectSimple,
    relationsTask: state.relationsTask,
    auth: state.auth,
})

export default connect(mapStateToProps, {relationTaskById, getAllProjectSimple})(ProjectManagerTaskReport)