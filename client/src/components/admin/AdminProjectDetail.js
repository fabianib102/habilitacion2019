import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import {getFilterStage} from '../../actions/stage';
import Moment from 'react-moment';
import moment from 'moment';

const AdminProjectDetail = ({match, getFilterStage, project: {project}}) => {


    useEffect(() => {
        getFilterStage(match.params.idProject, getFilterStage);
    }, [getFilterStage]);

    var projectFilter;

    //para manejo de Historial Proyecto
    const [showModalHistoryProject, setShowModalHistoryProject] = useState(false);    

    const [idUProjecttHistory, setIdProjectHistory] = useState("");

    const [nameProjectHistory, setNameProjectHistory] = useState("");

    //para manejo de Historial Lider
    const [showModalHistoryUser, setShowModalHistoryUser] = useState(false);    

    const [idUsertHistory, setIdUserHistory] = useState("");

    const [nameUserHistory, setNameUserHistory] = useState("");

    //obtencion del proyecto a visualizar
    if(project != null){

        let projectFil =  project.filter(function(pro) {
            return pro._id == match.params.idProject;
        });

        projectFilter = projectFil[0];

        //console.log("Datos: ", projectFilter);
        
    }else{
        return <Redirect to='/admin-project'/>
    }

    //listado de miembros de un equipo
    var listMember = projectFilter.membersTeam.map((ri, item) =>
        
        <li className="justify-content-between list-group-item" key={ri.userId}>
            <Fragment>
                <i class="fas fa-minus"></i> 
                <Link to={`/admin-user/user-detail/${ri.userId}`} title="Ver Datos">
                    {ri.surname}, {ri.name}
                </Link>
            </Fragment>
        </li>
        
    );

    //listado de riesgos del proyecto
    if(projectFilter.listRisk !== null){
        var listRisks = projectFilter.listRisk.map((ri) =>
            <tr key={ri._id}>
                 <td>{ri.nameRisk}</td>
                    <td className="hide-sm">
                        <center>
                            {ri.percentage !== undefined ? ri.percentage : "50"} %
                        {/* <div className="form-group ">
                            <select className="float-center" >
                                <option value="25">25%</option>
                                <option value="50">50%</option>
                                <option value="75">75%</option>
                                <option value="100">100%</option>                                
                            </select>
                        </div> */}
                        </center>
                    </td>
                    <td className="hide-sm"> {ri.impact !== undefined ? ri.impact : "MEDIO"}</td>
                    <td> 
                        <Link to={``} className="btn btn-primary disabledCursor" title="Editar Riesgo">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>   
                        <Link to={``} className="btn btn-danger disabledCursor" title="Eliminar Riesgo">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </Link>
                    </td>
            </tr>);
    }  
    
    //armado de datos del hisotrial del proyecto
    if (projectFilter.history.length !== 0){
        
        var listHistory = projectFilter.history.map((te) =>
                    <tr>
                        <td className="hide-sm">                            
                            <Fragment>
                            <Moment format="DD/MM/YYYY ">{moment.utc(te.dateUp)}</Moment> - 
                            {te.dateDown === null || te.dateDown === undefined ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}    
                            </Fragment>
                        </td>
                        <td className="hide-sm">
                            {te.status}
                        </td>
                        <td className="hide-sm">
                        {te.surnameUserchanged} {te.nameUserchanged}
                        
                        </td>
                        <td className="hide-sm">
                            {te.reason}
                        </td>
                    </tr>
                );        
    }
   

     const callModalProjectHistory = (id,nameSelected) => {
        setIdProjectHistory(id);
        setNameProjectHistory(nameSelected);
        historyModalProject();
    }

    const historyModalProject = () => {
        if(showModalHistoryProject){
            setShowModalHistoryProject(false);
        }else{
            setShowModalHistoryProject(true);
        }
    }

    //#region modal project history    
    var modalProject = (
        <Modal size="lg" show={showModalHistoryProject} onHide={e => historyModalProject()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes del proyecto <b>{nameProjectHistory}</b></center>
            <div className="row">

                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Período</th>
                                <th className="hide-sm headTable centerBtn">Estado</th>
                                <th className="hide-sm headTable centerBtn">Realizado por</th>
                                <th className="hide-sm headTable centerBtn">Motivo</th>
                            </tr>
                            </thead>
                           <tbody>
                                {listHistory}
                           </tbody>
                            
                    </table>  
                    
                </div>
            </div>
            
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => historyModalProject()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    //#endregion


 
    //armado de datos del hisotrial de los lideres del proyecto
    if (projectFilter.historyLiderProject.length !== 0){
        
        var listHistory = projectFilter.historyLiderProject.map((te) =>
                    <tr>
                        <td className="hide-sm">
                            {te.surname}, {te.name}
                        </td>
                        <td className="hide-sm">                            
                            <Fragment>
                                <Moment format="DD/MM/YYYY ">{moment.utc(te.dateUp)}</Moment> - 
                                {te.dateDown === null || te.dateDown === undefined ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}                            
                            
                            </Fragment>
                        </td>
                        <td className="hide-sm">
                            {te.reason}
                        </td>
                        
                    </tr>
                );        

    }

     const callModalUserHistory = (idUser,nameUserSelected) => {
        setIdUserHistory(idUser);
        setNameUserHistory(nameUserSelected);
        historyModalUser();
    }

    const historyModalUser = () => {
        if(showModalHistoryUser){
            setShowModalHistoryUser(false);
        }else{
            setShowModalHistoryUser(true);
        }
    }

    //#region modal lider history    
    const modalUser = (
        <Modal show={showModalHistoryUser} onHide={e => historyModalUser()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos de Líderes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de lider en el proyecto <b>{nameUserHistory}</b></center>
            <div className="row">

                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Apellido y Nombre</th>
                                <th className="hide-sm headTable centerBtn">Período</th>
                                <th className="hide-sm headTable centerBtn">Motivo</th>
                            </tr>
                            </thead>
                           <tbody>
                                {listHistory}
                           </tbody>
                            
                    </table>  
                    
                </div>
            </div>
            
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => historyModalUser()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    //#endregion

    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2"><i className="fas fa-clipboard-list"></i> Proyecto: <b>{projectFilter.name}</b></h5>
                                    <h6>Descripción: {projectFilter.description}</h6>
                                </div>
                                <div className="float-right">
                                    <Link to={``} className="btn btn-primary disabledCursor" title="Editar Información">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>
                                    <a  onClick={e => callModalProjectHistory(projectFilter._id, projectFilter.name)} className="btn btn-dark" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </a>                                     
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">   
                                        <Card.Title>Fecha de Inicio Prevista: <b><Moment format="DD/MM/YYYY">{projectFilter.startDateExpected}</Moment></b></Card.Title>
                                        <Card.Title>Fecha de Inicio Real: <b>{projectFilter.startDate !== undefined ? <Moment format="DD/MM/YYYY">{projectFilter.startDate}</Moment> : "-" }</b></Card.Title>
                                        <Card.Title>Tipo de Proyecto: <b>{projectFilter.projectType.nameProjectType}</b></Card.Title>
                                        <Card.Title>Cliente: <b>{projectFilter.client.nameClient}</b></Card.Title>
                                        <Card.Title>Responsable del Proyecto: 
                                            <Link onClick={e => callModalUserHistory(projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].liderProject, projectFilter.name)} title="Ver Historial de Líderes">
                                                <b> {projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].surname}, {projectFilter.historyLiderProject[projectFilter.historyLiderProject.length - 1].name}</b>
                                            </Link>
                                        </Card.Title>
                                 
                                    </div>
                                    <div className="col-lg-6">
                                        <Card.Title>Fecha de Fin Prevista: <b><Moment format="DD/MM/YYYY">{projectFilter.endDateExpected}</Moment></b></Card.Title>
                                        <Card.Title>Fecha de Fin Real: <b>{projectFilter.endDate !== undefined ? <Moment format="DD/MM/YYYY">{projectFilter.endDate}</Moment> : "-" }</b></Card.Title>
                                        <Card.Title>Subtipo de Proyecto: <b>{projectFilter.subTypeProject.nameProjectSubType}</b></Card.Title> 
                                        <Card.Title>Referente del Cliente:<b> {projectFilter.agent.surnameAgent}, {projectFilter.agent.nameAgent}</b></Card.Title>
                                        <Card.Title>Estado del Proyecto:
                                            {projectFilter.status === "ACTIVO" ? <span class="badge badge-success">ACTIVO</span> : ""}
                                            {projectFilter.status === "PREPARANDO"  | projectFilter.status === "FORMULANDO" ? <span class="badge badge-secundary">FORMULANDO</span> : ""}
                                            {projectFilter.status === "SUSPENDIDO" ? <span class="badge badge-warning">SUSPENDIDO</span> : ""}
                                            {projectFilter.status === "CANCELADO" ? <span class="badge badge-danger">CANCELADO</span> : ""}
                                            {projectFilter.status === "TERMINADO" ? <span class="badge badge-dark">TERMINADO</span> : ""}
                                        </Card.Title>                                                                                 
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
                                <h5 className="my-2"><i className="fas fa-users"></i> Equipo a cargo: <b>{projectFilter.team.nameTeam}</b></h5>                                     
                            </div>
                            
                        </Card.Header>
                        <Card.Body>
                            <div className="row">
                                <div className="col-lg-12"> 
                                    <ul className="list-group">
                                        {listMember}
                                    </ul>  
                                </div>
                            </div>
                        </Card.Body>
                    </Card> 
                </div>
                <div className="containerCustom col-lg-8 ">
                    <div className="card">
                        <div className="card-header">
                            <div className="float-left">
                                <h5 ><i className="fas fa-exclamation-triangle"></i> Riesgos del Proyecto</h5>
                            </div>
                            <div className="float-right">
                                <Link to={``} className="btn btn-success disabledCursor" title="Agregar Riesgos">
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
                                        <th className="hide-sm headTable">Impacto</th>    
                                        <th className="hide-sm headTable centerBtn optionHead">Opciones</th>                                  
                                    </tr>
                                </thead>
                                <tbody >
                                    {listRisks}                         
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
            {modalProject}
            {modalUser}
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
