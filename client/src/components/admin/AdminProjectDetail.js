import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import {getFilterStage} from '../../actions/stage';
import Moment from 'react-moment';

const AdminProjectDetail = ({match, getFilterStage, project: {project}}) => {


    useEffect(() => {
        getFilterStage(match.params.idProject, getFilterStage);
    }, [getFilterStage]);

    var projectFilter;

    if(project != null){

        let projectFil =  project.filter(function(pro) {
            return pro._id == match.params.idProject;
        });

        projectFilter = projectFil[0];

        console.log("Datos: ", projectFilter);
        
    }else{
        return <Redirect to='/admin-project'/>
    }



    var listMember = projectFilter.teamMember.map((ri, item) =>
        <h6 key={item}>{ri}</h6>
    );


    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Información del Proyecto: {projectFilter.name}</h5>
                                    <h6>{projectFilter.description}</h6>
                                </div>
                                <div className="float-right">
                                    <Link to={``} className="btn btn-primary" title="Editar Información">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>
                                    
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">   
                                        <Card.Title><b>Fecha de Inicio Prevista: <Moment format="DD/MM/YYYY">{projectFilter.startDateExpected}</Moment></b></Card.Title>
                                        <Card.Title><b>Fecha de Inicio Real: Falta</b></Card.Title>
                                        <Card.Title><b>Tipo de Proyecto: {projectFilter.nombreTipo}</b></Card.Title>
                                        <Card.Title><b>Cliente: {projectFilter.nombreCliente}</b></Card.Title>
                                        <Card.Title><b>Responsable del Proyecto: Falta</b></Card.Title>
                                 
                                    </div>
                                    <div className="col-lg-6">
                                        <Card.Title><b>Fecha de Fin Prevista: <Moment format="DD/MM/YYYY">{projectFilter.endDateExpected}</Moment></b></Card.Title>
                                        <Card.Title><b>Fecha de Fin Real: Falta</b></Card.Title>
                                        <Card.Title><b>Subtipo de Proyecto: {projectFilter.nombreSubTipo}</b></Card.Title> 
                                        <Card.Title><b>Referente del Cliente: Falta</b></Card.Title>                                                                               
                                    </div>
                                   
                                </div> 
                                
                            </Card.Body>
                        </Card>
                                  
                    <div className="form-group"></div>
                    
             </div>
             <div className="row">
             <div className="containerCustom col-lg-4">
                                    <Card>
                                        <Card.Header>
                                            <div className="float-left">
                                                <h5 className="my-2">Equipo a cargo: {projectFilter.nombreEquipo}</h5>                                     
                                            </div>
                                            
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-lg-12">   
                                                    {listMember}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                        
                    
                                </div>
                        <div className="containerCustom col-lg-8 ">
                            <div className="card">

                                    <div className="card-header">
                                        <i className="fa fa-align-justify"></i>
                                        <strong> Riesgos del Proyecto</strong>
                                        <div className="float-right">
                                                <Link to={``} className="btn btn-success" title="Agregar Riesgos">
                                                    <i className="fas fa-plus-circle coloWhite"></i>
                                                </Link>
                                                
                                            </div>
                                    </div>
                                    <div className="card-body ">
                                    <table className="table table-hover">
                                        <thead>
                                        <tr>
                                            <th className="hide-sm headTable">Nombre del Riesgo</th>
                                            <th className="hide-sm headTable">Probabilidad de Ocurrencia</th>
                                            
                                        </tr>
                                        </thead>
                                        <tbody >
                                        <tr >
                                        <td>Riesgo1</td>
                                            <td className="hide-sm">
                                                <div className="form-group">
                                                    <select className="float-center" >
                                                        <option value="">25%</option>
                                                        <option value="">50%</option>
                                                        <option value="">75%</option>
                                                        <option value="">100%</option>
                                                        
                                                    </select>
                                                    <div className="float-right">
                                                    <Link to={``} className="btn btn-danger" title="Eliminar">
                                                        <i className="far fa-trash-alt coloWhite"></i>
                                                    </Link>
                                                    
                                                    </div>
                                                </div>
                                            </td>
                                        
                                        </tr>
                                        <tr >
                                            <td>Riesgo1</td>
                                            <td className="hide-sm">
                                                <div className="form-group">
                                                    <select className="float-center" >
                                                        <option value="">25%</option>
                                                        <option value="">50%</option>
                                                        <option value="">75%</option>
                                                        <option value="">100%</option>
                                                        
                                                    </select>
                                                    <div className="float-right">
                                                    <Link to={``} className="btn btn-danger" title="Eliminar">
                                                        <i className="far fa-trash-alt coloWhite"></i>
                                                    </Link>
                                                    
                                                    </div>
                                                </div>
                                            </td>
                                        
                                        </tr>
                                        <tr >
                                            <td>Riesgo1</td>
                                            <td className="hide-sm">
                                                <div className="form-group">
                                                    <select className="float-center" >
                                                        <option value="">25%</option>
                                                        <option value="">50%</option>
                                                        <option value="">75%</option>
                                                        <option value="">100%</option>
                                                        
                                                    </select>
                                                    <div className="float-right">
                                                    <Link to={``} className="btn btn-danger" title="Eliminar">
                                                        <i className="far fa-trash-alt coloWhite"></i>
                                                    </Link>
                                                    
                                                    </div>
                                                </div>
                                            </td>
                                        
                                        </tr>
                                        </tbody>
                                    </table>

                                </div>
                                </div>
                                </div>
            </div>
            
        </Fragment>
    )
}

AdminProjectDetail.propTypes = {
    getFilterStage: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    project: state.project,
})

export default connect(mapStateToProps, {getFilterStage})(AdminProjectDetail)
