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

    const saveClient = () => {
        var idAgent =match.params.idAgent
        for (let index = 0; index < client.length; index++) {
            if (clientId === client[index]._id ){
                    //valido que el cliente este activo, para agregar.
                    if (client[index].status === 'INACTIVO'){
                        setAlert('No puedes añadir un nuevo representante a un cliente inactivo', 'danger');
                    } else {
                        // actualizo y llamo a modal para agregar
                        addAgentClient(clientId, idAgent);
                    }
                    modalAddClient();
            }
        }
    }

    if(agentClient !== null && agent !== null){
        var arrayClientActive = [];
        var arrayClientInactive = [];
        
        for (let index = 0; index < agentClient.length; index++) {           
           //NOTA: redefinir y generalizar para disponer ya clientes activos e inactivos y no buscar.
            if(agentClient[index].idAgent === match.params.idAgent){

                let clientsActive =  client.filter(function(c) {
                return agentClient[index].idClient == c._id && c.status == "ACTIVO";
                });

            if(clientsActive[0] !== undefined &&  !arrayClientActive.includes(clientsActive[0])){
                arrayClientActive.push(clientsActive[0]);
                };  
            
                let clientsInactive =  client.filter(function(c) {
                return agentClient[index].idClient == c._id && c.status == "INACTIVO";
                });

            if(clientsInactive[0] !== undefined &&  !arrayClientInactive.includes(clientsInactive[0])){
                arrayClientInactive.push(clientsInactive[0]);
                };   
            };            

        };

        // Trato y obtengo los clientes que no representa para poder añadir
        var arrayClients = arrayClientActive.concat(arrayClientInactive);        
        var filterClients = [];
            for (let index = 0; index < client.length; index++) {
                if (!arrayClients.includes(client[index])){
                    filterClients.push(client[index]);
                }                              
            }
        console.log("TENGO:",filterClients)

        var listClient = filterClients.map((cli) =>
            <option key={cli._id} value={cli._id}>{cli.name}</option>
        );


    // armando listado de clientes activos para referente
    if (arrayClientActive.length !== 0){ //con clientes
        var itemsActive = true;
        var listClientActive = arrayClientActive.map((cli) =>
                    <tr key={cli._id}>

                        <td>{cli.name}</td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <Link to={`/admin-client/client-detail/${cli._id}`} className="btn btn-success my-1" title="Información">
                                        <i className="fas fa-info-circle"></i>
                                    </Link>
                                    <Link to="" className="btn btn-dark my-1" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </Link>
                        </td>
                    </tr>
                );}
        else{ //sin clientes
            var listClientActive = (<li className='itemTeam list-group-item-action list-group-item'><b>No representa a ningún Cliente actualmente</b></li>)
            var itemsActive = false;
        };
    

    // armando listado de clientes inactivos (anteriores) para referente
     if (arrayClientInactive.length !== 0){ //con clientes
        var itemsInactive = true;
        var listClientInactive = arrayClientInactive.map((cli) =>
                    <tr key={cli._id}>

                        <td>{cli.name}</td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <Link to="" className="btn btn-success my-1" title="Información">
                                        <i className="fas fa-info-circle"></i>
                                    </Link>
                                    <Link to="" className="btn btn-dark my-1" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </Link>
                        </td>
                    </tr>
                );}
        else{ //sin equipos
            var listClientInactive = (<li key='-1' className='itemTeam list-group-item-action list-group-item'><b>No representó a ningún Cliente anteriormente</b></li>)
            
            var itemsInactive = false;
        };

    }


    if(agent !== null){

        for (let index = 0; index < agent.length; index++) {
            
            if(agent[index]._id === match.params.idAgent){

                //if(agent[index].status === "INACTIVO"){
                //    var dateShow = (
                //        <Card.Title><b>Fecha de baja: </b><Moment format="DD/MM/YYYY">{moment.utc(agent[index].dateDischarged)}</Moment></Card.Title> 
                //    )
                //}

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <h5 className="my-2">Datos Personales</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        
                                        <Card.Title><b>Nombres: </b>{agent[index].name}</Card.Title>
                                        <Card.Title><b>Apellidos: </b>{agent[index].surname}</Card.Title>
                                        <Card.Title><b>CUIL: </b>{agent[index].cuil}</Card.Title>                                        
                                        <Card.Title><b>Dirección: </b>{agent[index].address}</Card.Title>

                                       {/* {agent[index].status === "INACTIVO" ? dateShow : ""} */}
                                        
                                    </div>
                                    <div className="col-lg-6">
                                    
                                        <Card.Title><b>Telefóno: </b>{agent[index].phone}</Card.Title>
                                        <Card.Title><b>Email: </b>{agent[index].email}</Card.Title>
                                        <Card.Title><b>Provincia: </b>{agent[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{agent[index].nameLocation}</Card.Title>
                                        
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className="form-group"></div>
                        
                        <Link to={`/admin-agent/edit-agent/${agent[index]._id}`} className="btn btn-primary">
                            Editar Información
                        </Link>

                    </div>
            
                ); 
            }
            
        }
    }
    //#region  equipos actuales
    var bodyClientActive = (
        <div className="card-body bodyClient">

            <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Nombre</th>
                        <th className="hide-sm headTable">Inicio</th>
                        <th className="hide-sm headTable centerBtn">Opciones</th>
                    </tr>
                    </thead>
                    {itemsActive ? <tbody> {listClientActive} </tbody>  : <tbody></tbody>}
                    
            </table>
            {itemsActive ? '' : listClientActive}
        </div>
    )
    //#endregion

    //#region  equipos anteriores
    var bodyClientInactive = (
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

                    {itemsInactive ? <tbody> {listClientInactive} </tbody>  : <tbody></tbody>}
                    
            </table>
            {itemsInactive ? '' : listClientInactive}
        </div>
    )
    //#endregion


    //#region modal para la insercion de clientes
    const modalClient = (
        <Modal show={show} onHide={e => modalAddClient()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <div className="form-group">
                    <h5>Cliente (*)</h5>
                    <select name="clientId" value={clientId} onChange = {e => onChangeClient(e)}>
                        <option value="0">* Selección de Cliente</option>
                        {listClient}
                    </select>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAddClient()}>
                Cerrar
                </Button>
                <a onClick={e => saveClient()} className="btn btn-primary" >
                    Agregar
                </a>
            </Modal.Footer>
        </Modal>
    );
    //#endregion

    return (
        <Fragment>

            <Link to="/admin-agent" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información del Representante</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">
                    {DetailData}
                </Tab>

                <Tab eventKey="client" title="Clientes">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="float-left">                                           
                                            <h5 className="my-2">Clientes que Representa</h5>
                                        </div>
                                        <div className="float-right">
                                            <a onClick={e => askAddClient()} className="btn btn-success" title="Agregar Cliente">
                                                <i className="fas fa-plus-circle coloWhite"></i>
                                            </a>
                                        </div>
                                    </div>


                                    {bodyClientActive}    
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Clientes que Representó</h5>
                                    </div>
                                        
                                    {bodyClientInactive}
                                </div>
                            </div>
                        </div>
                    </div>
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
                                               <tbody></tbody>
                                                
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

                                                <tbody></tbody>
                                                
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
            

            {modalClient}
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
