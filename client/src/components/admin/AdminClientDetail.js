import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';

import Moment from 'react-moment';
import moment from 'moment';

import { getClientAgent, addAgentClient} from '../../actions/client';
import {getAllAgent} from '../../actions/agent';

const AdminClientDetail = ({match, client: {client}, getAllAgent, getClientAgent, agent:{agent}, agentClient: {agentClient}, addAgentClient, setAlert}) => {

    const [show, setShow] = useState(false);

    const modalAddAgent = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    } 

    useEffect(() => {
        getAllAgent();
        getClientAgent()
    }, [getAllAgent, getClientAgent]);

    const [isDisable, setDisable] = useState(true);

    const [agentId, setAgent] = useState("");


    const askAddAgent = () => {
        modalAddAgent()
    }

    const onChangeAgent = e => {
        setAgent(e.target.value);
    }

    const saveAgent = () => {
        var idClient =match.params.idClient
        for (let index = 0; index < agent.length; index++) {
            if (agentId === agent[index]._id ){
                    //valido que el representante este activo, para agregar.
                    if (agent[index].status === 'INACTIVO'){
                        setAlert('No se puede añadir un representante inactivo al cliente', 'danger');
                    } else {
                        // actualizo y llamo a modal para agregar
                        addAgentClient(idClient, agentId); 
                    }
                    modalAddAgent();
            }
        }
    }


    if(agentClient !== null && client !== null){
        var arrayAgentActive = [];
        var arrayAgentInactive = [];
        
        for (let index = 0; index < agentClient.length; index++) {           
           //NOTA: redefinir y generalizar para disponer ya agentes activos e inactivos y no buscar.
            if(agentClient[index].idClient === match.params.idClient){

                let agentsActive =  agent.filter(function(a) {
                return agentClient[index].idAgent == a._id && a.status == "ACTIVO";
                });

            if(agentsActive[0] !== undefined &&  !arrayAgentActive.includes(agentsActive[0])){
                arrayAgentActive.push(agentsActive[0]);
                };  
            
                let agentsInactive =  agent.filter(function(a) {
                return agentClient[index].idAgent == a._id && a.status == "INACTIVO";
                });

            if(agentsInactive[0] !== undefined &&  !arrayAgentInactive.includes(agentsInactive[0])){
                arrayAgentInactive.push(agentsInactive[0]);
                };   
            };            

        };

        // Trato y obtengo los clientes ya añadidos
        var arrayAgents = arrayAgentActive.concat(arrayAgentInactive);        
        var filterAgents = [];
            for (let index = 0; index < agent.length; index++) {
                if (!arrayAgents.includes(agent[index]) && agent[index].status === 'ACTIVO'){
                    filterAgents.push(agent[index]);
                }                              
            }

        var listAgent = filterAgents.map((ag) =>
            <option key={ag._id} value={ag._id}>{ag.surname},{ag.name}</option>
        );

    // armando listado de representantes activos para un cliente
    if (arrayAgentActive.length !== 0){ //con representantes
        var itemsActive = true;
        var listAgentActive = arrayAgentActive.map((ag) =>
                    <tr key={ag._id}>

                        <td>{ag.name}</td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <Link to={`/admin-agent/agent-detail/${ag._id}`} className="btn btn-success my-1" title="Información">
                                        <i className="fas fa-info-circle"></i>
                                    </Link>
                                    <Link to="" className="btn btn-dark my-1" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </Link>
                        </td>
                    </tr>
                );}
        else{ //sin representantes
            var listAgentActive = (<li className='itemTeam list-group-item-action list-group-item'><b>No dispone actualmente de Representantes</b></li>)
            var itemsActive = false;
        };
    

    // armando listado de representantes inactivos (anteriores) para un cliente
     if (arrayAgentInactive.length !== 0){ //con representantes
        var itemsInactive = true;
        var listAgentInactive = arrayAgentInactive.map((ag) =>
                    <tr key={ag._id}>

                        <td>{ag.name}</td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <Link to={`/admin-agent/agent-detail/${ag._id}`} className="btn btn-success my-1" title="Información">
                                        <i className="fas fa-info-circle"></i>
                                    </Link>
                                    <Link to="" className="btn btn-dark my-1" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </Link>
                        </td>
                    </tr>
                );}
        else{ //sin representantes
            var listAgentInactive = (<li key='-1' className='itemTeam list-group-item-action list-group-item'><b> No dispuso de Representantes anteriores</b></li>)
            
            var itemsInactive = false;
        };

    }


    if(client !== null){

        for (let index = 0; index < client.length; index++) {
            
            if(client[index]._id == match.params.idClient){

               if(client[index].status === "ACTIVO"){
                    var statusShow = (
                        <span class="badge badge-success" title="Cliente Disponible">ACTIVO</span> 
                    )
                }else{
                    var statusShow = (
                        <span class="badge badge-danger" title="Cliente NO Disponible">INACTIVO</span> 
                    )
                }

                //setenado nombre y apellido del representante
                var nameClient = client[index].name;

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Datos Personales</h5>    
                                </div>
                                <div className="float-right">
                                    {statusShow}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        
                                        <Card.Title><b>Nombre o Razón Social: </b>{client[index].name}</Card.Title>
                                        <Card.Title><b>CUIL: </b>{client[index].cuil}</Card.Title>
                                        <Card.Title><b>Condición frente al IVA: </b>{client[index].condition}</Card.Title>
                                        <Card.Title><b>Dirección: </b>{client[index].address}</Card.Title>

                                        {/* {client[index].status === "INACTIVO" ? dateShow : ""} */}
                                        
                                    </div>
                                    <div className="col-lg-6">
                                    
                                        <Card.Title><b>Telefóno: </b>{client[index].phone}</Card.Title>
                                        <Card.Title><b>Email: </b>{client[index].email}</Card.Title>
                                        <Card.Title><b>Provincia: </b>{client[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{client[index].nameLocation}</Card.Title>
                                        
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className="form-group"></div>
                        
                        <Link to={`/admin-client/edit-client/${client[index]._id}`} className="btn btn-primary">
                            Editar Información
                        </Link>

                    </div>
            
                ); 
            }
            
        }
    }

    //#region  representantes actuales
    var bodyAgentActive = (
        <div className="card-body bodyAgent">

            <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Apellido y Nombre</th>
                        <th className="hide-sm headTable">Inicio</th>
                        <th className="hide-sm headTable centerBtn">Opciones</th>
                    </tr>
                    </thead>
                    {itemsActive ? <tbody> {listAgentActive} </tbody>  : <tbody><tr></tr></tbody>}
                    
            </table>
            {itemsActive ? '' : listAgentActive}
        </div>
    )
    //#endregion

    //#region  representantes anteriores
    var bodyAgentInactive = (
        <div className="card-body bodyAgent">
            <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Apellido y Nombre</th>
                        <th className="hide-sm headTable">Inicio</th>
                        <th className="hide-sm headTable">Fin</th>
                        <th className="hide-sm headTable centerBtn">Opciones</th>
                    </tr>
                    </thead>     

                    {itemsInactive ? <tbody> {listAgentInactive} </tbody>  : <tbody><tr></tr></tbody>}
                    
            </table>
            {itemsInactive ? '' : listAgentInactive}
        </div>
    )
    //#endregion

    //#region modal para la insercion de representantes
    const modalAgent = (
        <Modal show={show} onHide={e => modalAddAgent()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar un Representante a <b>{nameClient}</b> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <div className="form-group">
                <div className="row">
                <div className="col-lg-3 col-sm-3"></div>
                <div className="col-lg-6 col-sm-6">
                    <h5>Representante (*)</h5>
            
                {/* --- revisar: traer Apellido y nombre  */}
                    <select name="agentId" value={agentId} onChange = {e => onChangeAgent(e)}>
                        <option value="0">* Selección del Representante</option>
                         {listAgent}
                    </select>
                </div>
                    
                </div>
            </div>


            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAddAgent()}>
                Cerrar
                </Button>
                <a onClick={e => saveAgent()} className="btn btn-primary" >
                    Agregar
                </a>
            </Modal.Footer>
        </Modal>
    );
    //#endregion

    return (
        <Fragment>

            <Link to="/admin-client" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información del Cliente</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">
                    {DetailData}
                </Tab>

                <Tab eventKey="agent" title="Representantes">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="float-left">                                           
                                            <h5 className="my-2">Representantes que Dispone</h5>
                                        </div>
                                        <div className="float-right">
                                            <a onClick={e => askAddAgent()} className="btn btn-success" title="Agregar Representante">
                                                <i className="fas fa-plus-circle coloWhite"></i>
                                            </a>
                                        </div>
                                    </div>


                                    {bodyAgentActive}
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Representantes que Dispuso</h5>
                                    </div>
                                        
                                    {bodyAgentInactive} 
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

AdminClientDetail.propTypes = {
    client: PropTypes.object.isRequired,
    getAllAgent: PropTypes.func.isRequired,
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

export default connect(mapStateToProps,{getAllAgent,getClientAgent,addAgentClient,setAlert})(AdminClientDetail)
