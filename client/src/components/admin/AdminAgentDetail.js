import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';

import Moment from 'react-moment';
import moment from 'moment';

import { getAllClient, getClientAgent, addAgentClient} from '../../actions/client';

const AdminAgentDetail = ({match,getAllClient, getClientAgent, agent: {agent}, client: {client}, agentClient: {agentClient}, addAgentClient, setAlert}) => {

    const [show, setShow] = useState(false);

    const modalAddClient = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    useEffect(() => {
        getAllClient();
        getClientAgent()
    }, [getAllClient, getClientAgent]);

    const [isDisable, setDisable] = useState(true);

    const [clientId, setClient] = useState("");


    const askAddClient = () => {
        modalAddClient()
    }

    const onChangeClient = e => {
        setClient(e.target.value);
    }


    if(agent !== null && client!== null && agentClient !== null){      

        // buscamos datos del cliente al que representa
        for (let index = 0; index < agentClient.length; index++) {           
           
            if(agentClient[index].idAgent === match.params.idAgent){
                var dataAgentClient = agentClient[index];
                var clientForAgent =  client.filter(function(c) {
                return agentClient[index].idClient == c._id ;
                });
                clientForAgent = clientForAgent[0];
                var clientName = clientForAgent.name
            }
        }

        for (let index = 0; index < agent.length; index++) {
            
            if(agent[index]._id === match.params.idAgent){

                // verificamos estado del referente y seteamos su indicador visual
                if(agent[index].status === "ACTIVO"){
                    var statusShow = (
                        <span class="badge badge-success" title="Referente Disponible">ACTIVO</span> 
                    )
                    var dateDownShow = (' - ACTUAL');
                }else{
                    var statusShow = (
                        <span class="badge badge-danger" title="Referente NO Disponible">INACTIVO</span> 
                    );

                    if (dataAgentClient.dateDown !== null){
                        //console.log(dataAgentClient.dateDown)
                        var dateDownShow = (
                            <React.Fragment> - <Moment format="DD/MM/YYYY">{dataAgentClient.dateDown}</Moment></React.Fragment>
                    );
                    }else{
                        var dateDownShow = ('');
                    }
                }

                //setenado nombre y apellido del referente
                var surnameAgent = agent[index].surname;
                var nameAgent = agent[index].name;

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Datos Personales</h5>
                                </div>
                                <div className="float-right">
                                    <Link to={`/admin-agent/edit-agent/${agent[index]._id}`} className="btn btn-primary" title="Editar Información">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>
                                    <a  onClick={e => callModalAgentHistory(agent[index]._id, agent[index].name,agent[index].surname)} className="btn btn-dark" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </a>                                    
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <Card.Title><b>Estado: </b>{statusShow}</Card.Title>
                                        <Card.Title><b>Nombres: </b>{agent[index].name}</Card.Title>
                                        <Card.Title><b>Apellidos: </b>{agent[index].surname}</Card.Title>
                                        <Card.Title><b>CUIL: </b>{agent[index].cuil}</Card.Title>                                        
                                        <Card.Title><b>Dirección: </b>{agent[index].address}</Card.Title>
                                         <Card.Title><b>Telefóno: </b>{agent[index].phone}</Card.Title> 
                                       
                                        
                                    </div>
                                    <div className="col-lg-6">                                   
                                        
                                        <Card.Title><b>Email: </b>{agent[index].email}</Card.Title>
                                        <Card.Title><b>Provincia: </b>{agent[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{agent[index].nameLocation}</Card.Title>
                                        <Card.Title><b>Referente del Cliente: </b>
                                            <Link to={`/admin-client/client-detail/${clientForAgent._id}`} title="Ver Información del Cliente">                                            
                                                {clientName}
                                            </Link>
                                        </Card.Title>
                                        <Card.Title><b>Período de Actividad: </b>
                                            <Link onClick={e => callModalAgentClientHistory(agent[index]._id, agent[index].name,agent[index].surname)}  title="Ver Actividad">
                                                <React.Fragment>
                                                    <Moment format="DD/MM/YYYY">{dataAgentClient.dateStart}</Moment> 
                                                </React.Fragment>
                                                {dateDownShow}
                                            </Link>
                                        </Card.Title>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className="form-group"></div>
                        
             
                    </div>
            
                ); 
            }
            
        }
    }
    
    //manejo de Historial Referente-Cliente
    const [showModalHistory, setShowModalHistory] = useState(false);

    const [idAgentHistory, setIdAgentHistory] = useState("");

    const [nameAgentHistory, setNameAgentHistory] = useState("");

    const [surnameAgentHistory, setSurameAgentHistory] = useState("");

    if(agentClient !== null && client !== []){
        var arrayAgentClientHistory = [];
            let agentClientHistory =  agentClient.filter(function(t) {

                return t.idAgent  == match.params.idAgent && t.idClient == clientForAgent._id;
            });                   
            arrayAgentClientHistory = agentClientHistory;

    if (arrayAgentClientHistory.length !== 0){
        var listHistoryAgentClient = arrayAgentClientHistory.map((te) =>
                    <tr>
                        <td className="hide-sm">                            
                            <Moment format="DD/MM/YYYY ">{moment.utc(te.dateStart)}</Moment>
                        </td>
                        <td className="hide-sm">
                            {te.dateDown === null ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}                            
                        </td>
                        <td className="hide-sm">
                            {te.reason}
                        </td>
                    </tr>
                );}        

    }

     const callModalAgentClientHistory = (idAgent,nameAgentSelected,surnameAgentSelected) => {
        setIdAgentHistory(idAgent);
        setNameAgentHistory(nameAgentSelected);
        setSurameAgentHistory(surnameAgentSelected);
        historyModalAgentClient();
    }

    const historyModalAgentClient = () => {
        if(showModalHistory){
            setShowModalHistory(false);
        }else{
            setShowModalHistory(true);
        }
    }

//#region modal agent-client history    
    const modalAgentClient = (
        <Modal show={showModalHistory} onHide={e => historyModalAgentClient()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos en <b>{clientName}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de <b>{surnameAgentHistory} {nameAgentHistory}</b></center>
            <div className="row">

                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Inicio</th>
                                <th className="hide-sm headTable centerBtn">Fin</th>
                                <th className="hide-sm headTable centerBtn">Motivo</th>
                            </tr>
                            </thead>
                           <tbody>
                                {listHistoryAgentClient}
                           </tbody>
                            
                    </table>  
                    
                </div>
            </div>
            
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => historyModalAgentClient()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );

//#endregion


//manejo de Historial Referente
    const [showModalHistoryAgent, setShowModalHistoryAgent] = useState(false);
    
    if(agent !== null){
        var arrayAgentHistory = [];
            let agentHistory =  agent.filter(function(t) {
                return t._id  == match.params.idAgent;
            });                   
            arrayAgentHistory = agentHistory;
            
    if (arrayAgentHistory.length !== 0){
        
        var listHistory = arrayAgentHistory[0].history.map((te) =>
                    <tr>
                        <td className="hide-sm">                            
                            <Moment format="DD/MM/YYYY ">{moment.utc(te.dateUp)}</Moment>
                        </td>
                        <td className="hide-sm">
                            {te.dateDown === null || te.dateDown === undefined ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}                            
                        </td>
                        <td className="hide-sm">
                            {te.reason}
                        </td>
                    </tr>
                );}        

    }

     const callModalAgentHistory = (idAgent,nameAgentSelected,surnameAgentSelected) => {
        setIdAgentHistory(idAgent);
        setNameAgentHistory(nameAgentSelected);
        setSurameAgentHistory(surnameAgentSelected);
        historyModalAgent();
    }

    const historyModalAgent = () => {
        if(showModalHistoryAgent){
            setShowModalHistoryAgent(false);
        }else{
            setShowModalHistoryAgent(true);
        }
    }

//#region modal agent-client history    
    const modalAgent = (
        <Modal show={showModalHistoryAgent} onHide={e => historyModalAgent()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de <b>{surnameAgentHistory} {nameAgentHistory}</b></center>
            <div className="row">

                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Inicio</th>
                                <th className="hide-sm headTable centerBtn">Fin</th>
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
                <Button variant="secondary" onClick={e => historyModalAgent()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
//#endregion

    return (
        <Fragment>

            <Link to="/admin-agent" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información del Referente de Cliente</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">
                    {DetailData}
                </Tab>                             


                <Tab eventKey="project" title="Proyectos">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Proyectos en que Participa</h5>
                                    </div>

                                    <div className="card-body bodyTeam">
                                        <table className="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th className="hide-sm headTable">Nombre</th>
                                                    <th className="hide-sm headTable">Inicio</th>
                                                    <th className="hide-sm headTable centerBtn">Opciones</th>
                                                </tr>
                                                </thead>
                                               <tbody><tr></tr></tbody>
                                                
                                        </table>  
                                        <ul className="list-group">
                                            <li key='0' className='itemTeam list-group-item-action list-group-item'><b>No se encuentra asociado a ningún Proyecto</b></li>                
                                        </ul>                                      
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Proyectos en que Participó</h5>
                                    </div>
                                        
                                    <div className="card-body bodyTeam">
                                        <table className="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th className="hide-sm headTable">Nombre</th>
                                                    <th className="hide-sm headTable">Inicio</th>
                                                    <th className="hide-sm headTable">Fin</th>
                                                    <th className="hide-sm headTable centerBtn">Opciones</th>
                                                </tr>
                                                </thead>     

                                                <tbody><tr></tr></tbody>
                                                
                                        </table>
                                       <ul className="list-group">
                                            <li key='0' className='itemTeam list-group-item-action list-group-item'><b>No estuvo asociado a ningún Proyecto</b></li>                
                                        </ul>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>

            </Tabs>
            {modalAgentClient}
            {modalAgent}
        </Fragment>
    )
}

AdminAgentDetail.propTypes = {
    agent: PropTypes.object.isRequired,
    getAllClient: PropTypes.func.isRequired,
    getClientAgent: PropTypes.func.isRequired,
    agentClient: PropTypes.object.isRequired,
    addAgentClient: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    agent: state.agent,
    client: state.client,
    agentClient: state.agentClient
})

export default connect(mapStateToProps,{getAllClient,getClientAgent,addAgentClient,setAlert})(AdminAgentDetail)
