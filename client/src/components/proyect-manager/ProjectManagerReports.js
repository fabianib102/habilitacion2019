import React, {Fragment, useEffect, useState, Component} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Accordion, Card, Spinner} from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { getAllClientReduced, getAllTypeProjectReduced, getAllTeamReduced} from '../../actions/project';
import PrintButton2 from './PrintButton2';

const ProjectManagerReports = ({match, auth:{user}, getAllClientReduced, getAllTeamReduced ,getAllTypeProjectReduced, clientReduced: {clientReduced} }) => {

    const [filterGeneral, setFilter] = useState("");
    const [filterType, setType] = useState("");
    const [filterTeam, setTeam] = useState("");
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
        // eslint-disable-next-line no-fallthrough
        default:
            break;
    }

    useEffect(() => {
        
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 4000);
          }

        if(match.params.type === "client"){
            getAllClientReduced();
        }

        if(match.params.type === "typeProject"){
            getAllTypeProjectReduced();
        }

        if(match.params.type === "team"){
            getAllTeamReduced();
        }

    }, [getAllClientReduced, match.params.type, getAllTypeProjectReduced, getAllTeamReduced, showSpinner]);

    var listClient = [];
    var listTypeProject = [];
    var listTeam = [];
    
    //Region Spinner
    const spin = () => setShowSpinner(!showSpinner);
    
    class Box extends Component{
        render(){
            return(
                <center className="itemTeam list-group-item-action list-group-item">
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

    if(clientReduced != null){

        clientReduced.forEach(element => {
            listClient.push(element.nameClient);
            listTypeProject.push(element.projectTypeName);
            listTeam.push(element.teamProject);
        });

        listClient = [...new Set(listClient)];
        listTypeProject = [...new Set(listTypeProject)];
        listTeam = [...new Set(listTeam)];

        var listProAux = clientReduced;

        if(filterGeneral !== ""){
            listProAux = listProAux.filter(function(pro) {
                return pro.nameClient === filterGeneral
            });
        }

        if(filterType !== ""){
            listProAux = listProAux.filter(function(pro) {
                return pro.projectTypeName === filterType
            });
        }

        if(filterTeam !== ""){
            listProAux = listProAux.filter(function(pro) {
                return pro.teamProject === filterTeam
            });
        }

        proyectAccordion = listProAux.map((pr) =>
            <tr key={pr._id}>
                <td className="hide-sm">{pr.nameProject}</td>
                <td className="hide-sm">{pr.projectTypeName}</td>
                <td className="hide-sm">{pr.nameClient}</td>
                <td className="hide-sm">{pr.teamProject}</td>
                <td className="hide-sm">{pr.status}</td>
                <td className="hide-sm">
                    <b>Inicio:</b> <Moment format="DD/MM/YYYY">{pr.startDateExpected}</Moment> <br/>
                    <b>Fin:</b> <Moment format="DD/MM/YYYY">{pr.endDateExpected}</Moment>
                </td>
            </tr>
        );
        
        var lClient = listClient.map((lCli) =>
            <option key={lCli} value={lCli}>{lCli.toUpperCase()}</option>
        );
        
        var lType = listTypeProject.map((lCli) =>
            <option key={lCli} value={lCli}>{lCli}</option>
        );

        var lTeam = listTeam.map((lCli) =>
            <option key={lCli} value={lCli}>{lCli}</option>
        );

    }

    const onChangeClient = (e) => {
        setFilter(e.target.value);
    }

    const onChangeType = (e) => {
        setType(e.target.value);
    }

    const onChangeTeam = (e) => {
        setTeam(e.target.value);
    }

    return (
        <Fragment>
            
            <Link to={`/team-member/${ user && user._id}`} className="btn btn-secondary">
                Atrás
            </Link>
            
            <PrintButton2 
                id="print" 
                label="Descargar PDF" 
                title={match.params.type}
                filter={filterGeneral}
                filterType={filterType}
                filterTeam={filterTeam}  
            ></PrintButton2>
            
            <div className="row">
                <div className="col-lg-8 col-sm-8">
                    <h2>Reporte de proyectos por {type}</h2>
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
                                <select name="Types" className="form-control" onChange={e => onChangeType(e)}>
                                    <option value="">Todos los Tipo de Proyectos</option>
                                    {lType}
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
                                <select name="Tasks" className="form-control" onChange={e => onChangeClient(e)}>
                                    <option value="">Todos los proyectos</option>
                                    {}
                                </select>
                            </div>
                    }
                    
            </div>
            
            <br></br>

            <div className="row" >
                <div className="col-lg-12">
                    <table className="table table-hover" id="print">
                        
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
            </div>
            
        </Fragment>
    )
}


ProjectManagerReports.propTypes = {
    getAllClientReduced: PropTypes.func.isRequired,
    getAllTypeProjectReduced: PropTypes.func.isRequired,
    getAllTeamReduced: PropTypes.func.isRequired,
    userTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    clientReduced: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth,
    clientReduced: state.clientReduced
})

export default connect(mapStateToProps, {getAllClientReduced, getAllTypeProjectReduced, getAllTeamReduced})(ProjectManagerReports)
