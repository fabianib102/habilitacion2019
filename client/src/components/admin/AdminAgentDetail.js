import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import Moment from 'react-moment';
import moment from 'moment';

import { getAllClient} from '../../actions/client';

const AdminAgentDetail = ({match,getAllClient, agent: {agent}, client: {client}}) => {

    useEffect(() => {
        getAllClient();
    }, [getAllClient]);


    if(agent !== null && client!== null){      
        for (let index = 0; index < client.length; index++) { 
            //console.log("CLI:",client[index])  
            // buscamos datos del cliente al que representa
            for (let index2 = 0; index2 < client[index].customerReferences.length; index2++) {           
                //console.log("REF",client[index].name,client[index].customerReferences)
                if( client[index].customerReferences[index2].idAgent === match.params.idAgent){
                    //console.log("SON",client[index].customerReferences[index2].idAgent,match.params.idAgent)
                    //var dataAgentClient =  client[index].customerReferences[index2];
                    var clientName = client[index].name
                }
            }
        }


        for (let index = 0; index < agent.length; index++) {
            
            if(agent[index]._id === match.params.idAgent){
                //buscamos historial del referente
                //console.log("HIST",agent[index].historial)
                let posLastHistory = agent[index].history.length - 1;        
                var dataAgentClient = agent[index].history[posLastHistory];
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

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Datos Personales</h5>
                                </div>
                                <div className="float-right">
                                    {agent[index].status === "INACTIVO" ? '':
                                    <Link to={`/admin-agent/edit-agent/${agent[index]._id}`} className="btn btn-primary" title="Editar Información">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>
                                    }
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
                                        
                                       
                                        
                                    </div>
                                    <div className="col-lg-6">                                   
                                        <Card.Title><b>Telefóno: </b>{agent[index].phone}</Card.Title> 
                                        <Card.Title><b>Email: </b>{agent[index].email}</Card.Title>
                                        <Card.Title><b>Provincia: </b>{agent[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{agent[index].nameLocation}</Card.Title>                                       
                                        <Card.Title><b>Período de Actividad: </b>                                           
                                                <React.Fragment>
                                                    <Moment format="DD/MM/YYYY">{dataAgentClient.dateStart}</Moment> 
                                                </React.Fragment>
                                                {dateDownShow}                                          
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
    const [idAgentHistory, setIdAgentHistory] = useState("");

    const [nameAgentHistory, setNameAgentHistory] = useState("");

    const [surnameAgentHistory, setSurameAgentHistory] = useState("");

   
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

            <h2 className="my-2">Información del Referente de <b>{clientName}</b></h2>

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
            {modalAgent}
        </Fragment>
    )
}

AdminAgentDetail.propTypes = {
    agent: PropTypes.object.isRequired,
    getAllClient: PropTypes.func.isRequired,   
    agentClient: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    agent: state.agent,
    client: state.client,
})

export default connect(mapStateToProps,{getAllClient})(AdminAgentDetail)
