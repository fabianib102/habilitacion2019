import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Accordion, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { getAllProjectReduced } from '../../actions/project';

const ProjectManagerReports = ({match, auth:{user}, projectReduced: {projectReduced}, getAllProjectReduced }) => {

    useEffect(() => {
        getAllProjectReduced(match.params.idUser);
    }, [getAllProjectReduced]);

    //aplicar logica del spinner
    var proyectAccordion = (<tr><td className="hide-sm">SIN DATOS</td></tr>)

    if(projectReduced != null){

        proyectAccordion = projectReduced.map((pr) =>
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
                        <select name="Types" className="form-control" >
                                <option value="">Todos los Proyectos</option>
                                <option value="">IMPLEMENTACION DE UN NUEVO SISTEMA</option>
                                <option value="">BACKUP DE LA BASE DE DATOS DE CLIENTES</option>
                                {}
                        </select>
                    </div>
                    <div className="col-sm">
                        <select name="Clients" className="form-control" >
                            <option value="">Todos los Clientes</option>
                            <option value="">Star construcciones</option>
                            <option value="">Seguros Litoral</option>
                            {}
                        </select>
                    </div>

                    <div className="col-sm">
                        <select name="Teams" className="form-control" >
                            <option value="">Todos los Equipos</option>
                            <option value="">Desarrollo</option>
                            {}
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