import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PrintButton from '../teamMember/PrintButton';
import Moment from 'react-moment';
import { relationTaskById, getAllProjectSimple } from '../../actions/project';



const ProjectManagerTaskLayout = ({getAllProjectSimple, projectSimple : {projectSimple}, relationTaskById, relationsTask: {relationsTask}}) => {

    const [projectSelected, setProjectSelected] = useState("");

    useEffect(() => {
        getAllProjectSimple();
    }, [getAllProjectSimple]);

    if(projectSimple != null){

        var projectNameListHtml = projectSimple.map((proyect) =>
            <option name={proyect.name} value={proyect._id}>{proyect.name}</option>
        );    

        if(relationsTask !== null && relationsTask !== undefined && relationsTask !== []){

            var relationsTaskTable = relationsTask.map((task) =>
                <tr>
                    <td>{task.status}</td>
                    <td>{task.taskId}</td>
                    <td>11-11-2019</td>
                    <td>11-11-2019</td>
                    <td>{task.userId}</td>
                </tr>
            );

            var creadaPorcent = 0;
            var asignadaPorcent = 0;

            var totalCount = relationsTask.reduce((total, tarea) => {
                return total + 1}, 0);

            var asignadaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == "ASIGNADO") return total + 1
                else return total}, 0);
            
            var asignadaPorcent = asignadaCount/totalCount*100;
            
            var creadaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'CREADO') return total + 1
                else return total}, 0);
            
            var creadaPorcent = creadaCount/totalCount*100 === NaN  ? 0 : creadaCount/totalCount*100;
            
            var activaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'ACTIVA') return total + 1
                else return total}, 0);
            
            var activaPorcent = activaCount/totalCount*100;

            var suspendidaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'SUSPENDIDA') return total + 1
                else return total}, 0);
            
            var suspendidaPorcent = suspendidaCount/totalCount*100;

            var canceladaCount = relationsTask.reduce((total, tarea) => {
                if(tarea.status == 'CANCELADA') return total + 1
                else return total}, 0);
            
            var canceladaPorcent = canceladaCount/totalCount*100;

            var terminadaCount = relationsTask.reduce((total = 0, tarea) => {
                if(tarea.status == 'TERMINADA') return total + 1
                else return total}, 0);
            
            var terminadaPorcent = terminadaCount/totalCount*100;
            
            

        }    
        
    }
    
    const modifyProject = (e) => {
        relationTaskById(e.target.value);
        setProjectSelected(e.target.label);
    };

    var detalle = () => {
        
        return (
            <div>    
                <h4>Detalle de tareas segun estado</h4>

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
            </div>
        )
    }

    return (
        <Fragment>
            <div className="col-lg-12 col-sm-12">
                <div class= "row">
                    <Link to={`/team-member/team-member-work-done/`} className="btn btn-secondary">
                        Atrás
                    </Link>
                    <div >
                        <PrintButton id='ProjectTasksReport' label='Descargar PDF' className="float-right"> </PrintButton>
                    </div>
                </div>
            </div>
            
            <br/>

            <div id= 'ProjectTasksReport' className="border border-dark " style={{width:'200mm',padding:'10px'}}>

                <br/>
                    
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <p className='float-right'>Fecha de Emision: <Moment format="DD/MM/YYYY" className='float-right'></Moment></p>
                    </div>
                </div>
                
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                    <h3 className="text-center">Reporte de estado de tareas por proyecto</h3>
                    </div>
                </div>

                <br/>
                <div className="col-lg-12 col-sm-12">
                    <h4>Proyecto: IMPLEMENTACION DE NUEVO SISTEMA</h4>
                    <h5>Fecha Inicio Prvisto: </h5>
                    <h5>Fecha Inicio Fin: </h5>
                    <h5>Equipo: </h5>
                </div>
                
                <div className="col-lg-12 col-sm-12">
                    <br/>
                    <h3>Resumen de tareas segun estado</h3>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable">Estado</th>
                                <th className="hide-sm headTable">Cantidad</th>
                                <th className="hide-sm headTable">Porcentaje de Tareas en el proyecto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CREADA</td>
                                <td>{creadaCount}</td>
                                <td>{creadaPorcent}</td>
                            </tr>
                            <tr>
                                <td>ASIGNADA</td>
                                <td>{asignadaCount}</td>
                                <td>{asignadaPorcent}</td>
                            </tr>
                            <tr>
                                <td>ACTIVA</td>
                                <td>{activaCount}</td>
                                <td>{activaPorcent}</td>
                            </tr>
                            <tr>
                                <td>SUSPENDIDA</td>
                                <td>{suspendidaCount}</td>
                                <td>{suspendidaPorcent}</td>
                            </tr>
                            <tr>
                                <td>CANCLADA</td>
                                <td>{canceladaCount}</td>
                                <td>{canceladaPorcent}</td>
                            </tr>
                            <tr>
                                <td>TERMINADA</td>
                                <td>{terminadaCount}</td>
                                <td>{terminadaPorcent}</td>
                            </tr>
                        </tbody>
                    </table>                    
                </div>
            </div>
        </Fragment>
    )

}


ProjectManagerTaskLayout.propTypes = {
    relationTaskById: PropTypes.func.isRequired,
    getAllProjectSimple: PropTypes.func.isRequired,
    projectSimple:  PropTypes.object.isRequired,
    relationsTask: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    projectSimple: state.projectSimple,
    relationsTask: state.relationsTask
})

export default connect(mapStateToProps, {relationTaskById, getAllProjectSimple})(ProjectManagerTaskLayout)