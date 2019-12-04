import React, {Fragment, useEffect, useState, Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Accordion, Card, Spinner} from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { getAllProjectReduced } from '../../actions/project';

const ProjectManagerReports = ({match, auth:{user}, projectReduced: {projectReduced}, getAllProjectReduced }) => {

    const [filterTypeProject, setType] = useState("");
    const [filterClient, setClient] = useState("");
    const [filterTeam, setTeam] = useState("");
    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        getAllProjectReduced(match.params.idUser);
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 4000);
          }
    }, [getAllProjectReduced, showSpinner]);

    var listTypeProject = [];
    var listClient = [];
    var listTeam = [];
    
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

    if(projectReduced != null){

        projectReduced.forEach(element => {
            listTypeProject.push(element.projectTypeName);
            listClient.push(element.clientName);
            listTeam.push(element.teamName)
        });

        listTypeProject = [...new Set(listTypeProject)];
        listClient = [...new Set(listClient)];
        listTeam = [...new Set(listTeam)];

        let listProAux = projectReduced;


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


        proyectAccordion = listProAux.map((pr) =>
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
        );


        var listTypeProj = listTypeProject.map((lPro) =>
            <option key={lPro} value={lPro}>{lPro.toUpperCase()}</option>
        );
        
        var lClient = listClient.map((lCli) =>
            <option key={lCli} value={lCli}>{lCli.toUpperCase()}</option>
        ); 

        var lTeam = listTeam.map((lTe) =>
            <option key={lTe} value={lTe}>{lTe.toUpperCase()}</option>
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
    
    return (
        <Fragment>
            
            <Link to={`/team-member/${ user && user._id}`} className="btn btn-secondary">
                Atrás
            </Link>
            
            <div className= "row">
                    <div className="col-lg-8 col-sm-8">
                        <h4 className="text-center"> Responsable de Proyecto: <strong>{user && user.name} {user && user.surname}</strong></h4>
                    </div>
                    <div className="col-lg-8 col-sm-8">
                        <br></br>
                        <center><h2>Reportes de Proyectos</h2></center>
                    </div>
                    {/* <div className="col-lg-4 col-sm-8 mb-4">
                        <Card>
                            <Card.Header>
                                <h5 className="my-2">Seleccionar Período</h5>
                            </Card.Header>
                            <Card.Body>
                            <div class= "row">
                                <div className="col-lg-6 col-sm-6">
                                    <p><b>Desde: </b></p>
                                    <input type="date" value={startFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" 
                                    // onChange = {e => changeStart(e)} 
                                    ></input>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <p><b>Hasta: </b></p>
                                    <input type="date" value={endFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" 
                                    // onChange = {e => changeEnd(e)} 
                                    ></input>
                                </div>
                            </div>
                            <div className="row mb-4">
                            <div className="col-lg-6 col-sm-8">
                                    <Link to={`/team-member/team-member-Report-Layout/${ user && user._id}/${startFilter}/${endFilter}`}  className="btn btn-primary my-2">
                                        Imprimir Reporte
                                    </Link>
                            </div>
                            </div>
                            
                            </Card.Body>
                        </Card>
                    </div> */}
            </div>
            <div className="row">
                <div className="col-lg-8 col-sm-8">
                        <h4>Seleccione Tipos de Reporte</h4>
                </div>
            </div>
            <div className="row">
                    <div className="col-sm">
                        <select name="Types" className="form-control" onChange={e => onChangeProject(e)}>
                            <option value="">Todos los Proyectos</option>
                            {listTypeProj}
                        </select>
                    </div>
                    <div className="col-sm">
                        <select name="Clients" className="form-control" onChange={e => onChangeClient(e)}>
                            <option value="">Todos los Clientes</option>
                            {lClient}
                        </select>
                    </div>

                    <div className="col-sm">
                        <select name="Teams" className="form-control" onChange={e => onChangeTeam(e)}>
                            <option value="">Todos los Equipos</option>
                            {lTeam}
                        </select>
                     </div>
                    
            </div>
            <br></br>
            <div className="row">
                <table className="table table-hover">
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
                    <tbody>
                        {proyectAccordion}
                    </tbody>
                </table>
            </div>
            
        </Fragment>
    )
}


ProjectManagerReports.propTypes = {
    getAllProjectReduced: PropTypes.func.isRequired,
    userTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth,
    projectReduced: state.projectReduced
})

export default connect(mapStateToProps, {getAllProjectReduced})(ProjectManagerReports)
