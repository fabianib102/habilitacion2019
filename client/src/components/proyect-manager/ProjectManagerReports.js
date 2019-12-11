import React, {Fragment, useEffect, useState, Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Accordion, Card, Spinner} from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { getAllProjectReduced } from '../../actions/project';
import { getTasksByLeader } from '../../actions/task';
import PrintButton2 from './PrintButton2';

const ProjectManagerReports = ({match, auth:{user}, projectReduced: {projectReduced}, getAllProjectReduced, getTasksByLeader, tasksLider: {tasksLider} }) => {

    const [filterTypeProject, setType] = useState("");
    const [filterClient, setClient] = useState("");
    const [filterTeam, setTeam] = useState("");
    const [filterProject, setProject] = useState("");
    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    var type = "";

    switch(match.params.type){
        case "client":
            type = "Cliente"
            break;
        case "typeProject":
            type = "Tipo de Proyecto";
            break;
        case "team":
            type = "Equipo";
            break;
        case "task":
            type = "Tareas";        
        default:
            break;
    }

    useEffect(() => {
        getAllProjectReduced(match.params.idUser);
        getTasksByLeader(match.params.idUser);
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 4000);
          }
    }, [getAllProjectReduced, getTasksByLeader, showSpinner]);

    var listTypeProject = [];
    var listClient = [];
    var listTeam = [];
    var listTask = [];
    var listProject = [];
    
    //Region Spinner
    const spin = () => setShowSpinner(!showSpinner);
    
    class Box extends Component{
        render(){
            return(
                <center class="itemTeam list-group-item-action list-group-item">
                    <h4>Cargando...
                        <Spinner animation="border" role="status" variant="primary" >
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </h4>
                </center>
            )
        }
    }
    //aplicar logica del spinner
    var proyectAccordion= (<tr>{showSpinner && <Box/>}</tr>);

    if(projectReduced != null && tasksLider != null ){

        projectReduced.forEach(element => {
            listTypeProject.push(element.projectTypeName);
            listClient.push(element.clientName);
            listTeam.push(element.teamName);
            
        });

        tasksLider.arrayTask.forEach( element => {
            listTask.push(element.status)
            listProject.push(element.projectName);
        });

        listTypeProject = [...new Set(listTypeProject)];
        listClient = [...new Set(listClient)];
        listTeam = [...new Set(listTeam)];
        listTask = [...new Set(listTask)];
        listProject = [...new Set(listProject)];

        console.log("listProject: ", listProject);

        var listProAux;

        if (match.params.type == "task") listProAux = tasksLider.arrayTask
        else listProAux = projectReduced;


        if(filterTypeProject !== ""){
            listProAux = listProAux.filter(function(pro) {
                return pro.projectTypeName === filterTypeProject
            });
        }

        if(filterClient !== ""){
            listProAux = listProAux.filter(function(pro) {
                return pro.clientName === filterClient
            });
        }


        if(filterTeam !== ""){
            listProAux = listProAux.filter(function(pro) {
                return pro.teamName === filterTeam
            });
        }

        if(filterProject !== ""){
            listProAux = listProAux.filter(function(pro) {
                return pro.projectName === filterProject
            });
        }

        if (match.params.type == "task") 
        
        {proyectAccordion = listProAux.map((pr) =>
            <tr key={pr._id}>
                <td className="hide-sm">{pr.taskName}</td>
                <td className="hide-sm">{pr.projectName}</td>
                <td className="hide-sm">{pr.stageName}</td>
                <td className="hide-sm">{pr.activityName}</td>
                <td className="hide-sm">{pr.userName}</td>
                <td className="hide-sm">{pr.status}</td>
                <td className="hide-sm">
                    <b>Inicio:</b> <Moment format="DD/MM/YYYY">{pr.startDateExpected}</Moment> <br/>
                    <b>Fin:</b> <Moment format="DD/MM/YYYY">{pr.endDateExpected}</Moment>
                </td>
            </tr>
        )}

        else 
        {proyectAccordion = listProAux.map((pr) =>
            <tr key={pr._id}>
                <td className="hide-sm">{pr.name}</td>
                <td className="hide-sm">{pr.projectTypeName}</td>
                <td className="hide-sm">{pr.clientName}</td>
                <td className="hide-sm">{pr.teamName}</td>
                <td className="hide-sm">{pr.status}</td>
                <td className="hide-sm">
                    <b>Inicio:</b> <Moment format="DD/MM/YYYY">{pr.startDateExpected}</Moment> <br/>
                    <b>Fin:</b> <Moment format="DD/MM/YYYY">{pr.endDateExpected}</Moment>
                </td>
            </tr>
        );}


        var listTypeProj = listTypeProject.map((lPro) =>
            <option key={lPro} value={lPro}>{lPro.toUpperCase()}</option>
        );
        
        var lClient = listClient.map((lCli) =>
            <option key={lCli} value={lCli}>{lCli.toUpperCase()}</option>
        ); 

        var lTeam = listTeam.map((lTe) =>
            <option key={lTe} value={lTe}>{lTe.toUpperCase()}</option>
        );
        
        var lTask = listTask.map((lTa) =>
            <option key={lTa} value={lTa}>{lTa.toUpperCase()}</option>
        );

        var lProject = listProject.map((lPr) =>
            <option key={lPr} value={lPr}>{lPr}</option>
        );

    }
    
    const onChangeProject = (e) => {
        setType(e.target.value)
    }

    const onChangeClient = (e) => {
        setClient(e.target.value)
    }

    const onChangeTeam = (e) => {
        setTeam(e.target.value)
    }
    
    const onChangeProjectName = (e) => {
        setProject(e.target.value)
    }

    return (
        <Fragment>
            
            <Link to={`/team-member/${ user && user._id}`} className="btn btn-secondary">
                Atrás
            </Link>
            
            <PrintButton2 id="print" label="Descargar PDF" title={match.params.type} ></PrintButton2>
            
            <div className="row">
                <div className="col-lg-8 col-sm-8">
                    <h2>Reporte por {type}</h2>
                </div>
            </div>
            
            <br></br>

            <div className="row">
                    {
                        match.params.type === "client" ? 
                            <div className="col-lg-5">
                                <h4>Filtrar por cliente:</h4>
                                <select name="Clients" className="form-control" onChange={e => onChangeClient(e)}>
                                    <option value="">Todos los Clientes</option>
                                    {lClient}
                                </select>
                            </div>
                        :
                        match.params.type === "typeProject" ? 
                            <div className="col-lg-5">
                                <h4>Filtrar por Tipo de proyectos:</h4>
                                <select name="Types" className="form-control" onChange={e => onChangeProject(e)}>
                                    <option value="">Todos los Tipo de Proyectos</option>
                                    {listTypeProj}
                                </select>
                            </div>
                        :
                        match.params.type === "team" ?
                            <div className="col-lg-5">
                                <h4>Filtrar por equipo:</h4>
                                <select name="Teams" className="form-control" onChange={e => onChangeTeam(e)}>
                                    <option value="">Todos los Equipos</option>
                                    {lTeam}
                                </select>
                            </div>
                        :
                            <div className="col-lg-5">
                                <h4>Filtrar por projecto:</h4>
                                <select name="Tasks" className="form-control" onChange={e => onChangeProjectName(e)}>
                                    <option value="">Todos los proyectos</option>
                                    {lProject}
                                </select>
                            </div>
                    }
                    
            </div>
            
            <br></br>

            <div className="row" >
                <div className="col-lg-12">
                    <table className="table table-hover" id="print">
                        {

                        match.params.type === "task" ?
                            
                            <thead>
                            <tr>
                                <th className="hide-sm headTable headStatus2">Tarea</th>
                                <th className="hide-sm headTable headStatus2">Projecto</th>
                                <th className="hide-sm headTable headStatus2">Etapa</th>
                                <th className="hide-sm headTable headStatus2">Actividad</th>
                                <th className="hide-sm headTable headStatus2">Usuario Asignado</th>
                                <th className="hide-sm headTable headStatus2">Estado</th>
                                <th className="hide-sm headTable headStatus2">Fechas Previstas</th>
                            </tr>
                            </thead>

                        :
                            <thead>
                            <tr>
                                <th className="hide-sm headTable">Proyecto</th>
                                <th className="hide-sm headTable">Tipo de Proyecto</th>
                                <th className="hide-sm headTable headStatus2">Cliente</th>
                                <th className="hide-sm headTable headStatus2">Equipo</th>
                                <th className="hide-sm headTable headStatus2">Estado</th>
                                <th className="hide-sm headTable headStatus2">Fechas Previstas</th>
                            </tr>
                            </thead>
                        }

                        <tbody>
                            {proyectAccordion}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </Fragment>
    )
}


ProjectManagerReports.propTypes = {
    getAllProjectReduced: PropTypes.func.isRequired,
    userTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    tasksLider: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth,
    projectReduced: state.projectReduced,
    tasksLider: state.tasksLider
})

export default connect(mapStateToProps, {getAllProjectReduced, getTasksByLeader})(ProjectManagerReports)
