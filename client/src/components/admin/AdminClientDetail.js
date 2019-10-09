import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';

import Moment from 'react-moment';
import moment from 'moment';

import { getClientAgent, deleteAgentClient, reactiveAgentClient} from '../../actions/client';
import {getAllAgent,} from '../../actions/agent';

const AdminClientDetail = ({match, client: {client}, getAllAgent, deleteAgentClient, reactiveAgentClient, getClientAgent, agent:{agent}, agentClient: {agentClient}, addAgentClient, setAlert}) => {

    const [show, setShow] = useState(false);

    const [nameComplete, setComplete] = useState("");
    
    const [IdDelete, setId] = useState("");

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }
    //--------

    //pregunta si quiere volver a reactivar al referente
    const [showReactive, setReactiveShow] = useState(false);

    const modalReactive = () => {
        if(showReactive){
            setReactiveShow(false);
        }else{
            setReactiveShow(true);
        }
    }

    const askReactive = (nameComplete, idToDelete) => {
        setComplete(nameComplete)
        setId(idToDelete)
        modalReactive();
    } 

    const askDelete = (nameComplete, IdToDelete) => {
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }


    useEffect(() => {
        getAllAgent();
        getClientAgent()
    }, [getAllAgent, getClientAgent]);

    const reactiveAgent = (idAgent) => {
        reactiveAgentClient(match.params.idClient, idAgent);
        modalReactive();
    }

    const deleteAgent = (idAgent) => {
        deleteAgentClient(match.params.idClient, idAgent)
        modalAdmin();
    }

    const [isDisable, setDisable] = useState(true);

    const [agentId, setAgent] = useState("");

    const onChangeAgent = e => {
        setAgent(e.target.value);
    }

    if(agentClient !== null && client !== null){
        var arrayAgentActive = [];
        var arrayAgentInactive = [];                         
                    
        // traigo registros activos de referentes para un cliente
        let agentsActive =  agentClient.filter(function(a) {
        return  match.params.idClient == a.idClient && a.status == "ACTIVO";
        });            
        arrayAgentActive = agentsActive;
        for (let index = 0; index < arrayAgentActive.length; index++) {
            let agentActive =  agent.filter(function(a) {
            return  arrayAgentActive[index].idAgent == a._id;
            });
            arrayAgentActive[index]["name"] = agentActive[0].name
            arrayAgentActive[index]["surname"] = agentActive[0].surname
        } 
        
        // traigo registros inactivos de referentes para un cliente
        let agentsInactive =  agentClient.filter(function(a) {
        return match.params.idClient == a.idClient && a.status == "INACTIVO";
        });
        
        arrayAgentInactive = agentsInactive;
        var procesado = [];
        for (let index = 0; index < arrayAgentInactive.length; index++) {
            if (!procesado.includes(arrayAgentInactive[index].idAgent)){
                procesado.push(arrayAgentInactive[index].idAgent)
            }
            let clientInactive =  agent.filter(function(a) {
            return  arrayAgentInactive[index].idAgent == a._id;
            });
            arrayAgentInactive[index]["name"] = clientInactive[0].name
            arrayAgentInactive[index]["surname"] = clientInactive[0].surname
        } 
        //console.log("proce",procesado)
        //control que si está activo, quito los registros que tenga de inactivos de ese referente.
        // MEJORA-> TRAER ULTIMO REGISTRO DE ACTIVIDAD DEL REPRESENTANTE (así hay menos procesamiento)
        var arrayAgentInactiveAux = [];
        
        if (arrayAgentActive.length !== 0){
            for (let index = 0; index < arrayAgentActive.length; index++) {
                for (let index2 = 0; index2 < arrayAgentInactive.length; index2++) {
                    if (arrayAgentInactive[index2].idAgent !== arrayAgentActive[index].idAgent){
                        arrayAgentInactiveAux.push(arrayAgentInactive[index2])
                    }
                }
            }

            if (arrayAgentInactiveAux.length !== 0 ){
                arrayAgentInactive = [];            
                for (let index = 0; index < procesado.length; index++) {
                    let procesadoInactive =  arrayAgentInactiveAux.filter(function(a) {
                        //console.log("aa",procesado[index],a.idAgent)
                    return procesado[index] == a.idAgent});
                    //console.log("tengoo",procesadoInactive)
                    if (procesadoInactive.length !== 0){
                        arrayAgentInactive.push(procesadoInactive[procesadoInactive.length-1])
                    }
                    //console.log("provii",arrayAgentInactive)           
                }
            }
        }else{
            if (arrayAgentInactive.length !== 0 ){            
                for (let index = 0; index < procesado.length; index++) {
                    let procesadoInactive =  arrayAgentInactive.filter(function(a) {
                        //console.log("a",procesado[index],a.idAgent)
                    return procesado[index] == a.idAgent});
                    //console.log("tengo",procesadoInactive)
                    arrayAgentInactiveAux.push(procesadoInactive[procesadoInactive.length-1])
                    //console.log("provi",arrayAgentInactiveAux)           
                }
               arrayAgentInactive =arrayAgentInactiveAux;
            }
        }
        //console.log("->",arrayAgentInactive,arrayAgentInactiveAux)
    // armando listado de representantes activos para un cliente
    if (arrayAgentActive.length !== 0){ //con representantes
        var itemsActive = true;
        var listAgentActive = arrayAgentActive.map((ag) =>
                    <tr key={ag._id}>

                        <td>
                            <Link to={`/admin-agent/agent-detail/${ag.idAgent}`} title="Ver Información del Referente">                                            
                                {ag.surname}, {ag.name}
                            </Link>                        
                        </td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY">{moment.utc(ag.dateStart)}</Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <a onClick={e => askDelete(ag.name, ag.idAgent)} className="btn btn-danger" title="Eliminar">
                                        <i className="far fa-trash-alt coloWhite"></i>
                                    </a>
                                    <Link onClick={e => callModalAgentClientHistory(ag._id, ag.name,ag.surname)} className="btn btn-dark my-1" title="Historial de Movimientos">
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

                        <td>
                            <Link to={`/admin-agent/agent-detail/${ag.idAgent}`} title="Ver Información del Cliente">                                            
                                {ag.surname}, {ag.name}
                            </Link>     
                        </td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY">{moment.utc(ag.dateStart)}</Moment></td>

                        <td className="hide-sm"><Moment format="DD/MM/YYYY">{moment.utc(ag.dateDown)}</Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <a onClick={e => askReactive(ag.name, ag.idAgent)} className="btn btn-warning my-1" title="Reactivar">
                                        <i className="fas fa-arrow-alt-circle-up"></i>
                                    </a>
                                    <Link onClick={e => callModalAgentClientHistory(ag._id, ag.name,ag.surname)} className="btn btn-dark my-1" title="Historial de Movimientos">
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
                                    <Link to={`/admin-client/edit-client/${client[index]._id}`} className="btn btn-primary" title="Editar Información">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>
                                    <a  onClick={e => callModalClientHistory(client[index]._id, client[index].name)} className="btn btn-dark" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </a> 
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <Card.Title><b>Estado: </b>{statusShow}</Card.Title>
                                        <Card.Title><b>Nombre o Razón Social: </b>{client[index].name}</Card.Title>
                                        <Card.Title><b>CUIL: </b>{client[index].cuil}</Card.Title>
                                        <Card.Title><b>Condición frente al IVA: </b>{client[index].condition}</Card.Title>
                                        <Card.Title><b>Dirección: </b>{client[index].address}</Card.Title>                                       
                                        
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

//manejo de Historial Cliente
    const [showModalHistoryClient, setShowModalHistoryClient] = useState(false);    

    const [idClientHistory, setIdClientHistory] = useState("");

    const [nameClientHistory, setNameClientHistory] = useState("");
    
    if(agent !== null){
        var arrayClientHistory = [];
            let clientHistory =  client.filter(function(t) {
                return t._id  == match.params.idClient;
            });                   
            arrayClientHistory = clientHistory;
            
    if (arrayClientHistory.length !== 0){
        
        var listHistory = arrayClientHistory[0].history.map((te) =>
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

     const callModalClientHistory = (idClient,nameClientSelected) => {
        setIdClientHistory(idClient);
        setNameClientHistory(nameClientSelected);
        historyModalClient();
    }

    const historyModalClient = () => {
        if(showModalHistoryClient){
            setShowModalHistoryClient(false);
        }else{
            setShowModalHistoryClient(true);
        }
    }

//#region modal client history    
    const modalClient = (
        <Modal show={showModalHistoryClient} onHide={e => historyModalClient()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de <b>{nameClientHistory}</b></center>
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
                <Button variant="secondary" onClick={e => historyModalClient()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
//#endregion


//manejo de Historial Referente-Cliente
    const [showModalHistory, setShowModalHistory] = useState(false);

    const [idAgentHistory, setIdAgentHistory] = useState("");

    const [nameAgentHistory, setNameAgentHistory] = useState("");

    const [surnameAgentHistory, setSurameAgentHistory] = useState("");

    if(agentClient !== null && client !== []){
        var arrayAgentClientHistory = [];
            let agentClientHistory =  agentClient.filter(function(t) {
                return t.idClient ==  match.params.idClient;
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
                <Modal.Title>Historial de Movimientos en <b></b></Modal.Title>
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

    // modal eliminar referente
    const modalDeleteAgent = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Referente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar el referente: <b>{nameComplete}</b>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
                <a onClick={e => deleteAgent(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    );

    //modal reativar referente
    const modalReactiveAgent = (
        <Modal show={showReactive} onHide={e => modalReactive()} >
            <Modal.Header closeButton title="Cerrar">
                <Modal.Title>Reactivar Referente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de reactivar el referente: <b>{nameComplete}</b>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalReactive() } >
                Cerrar
                </Button>
                <a onClick={e => reactiveAgent(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    )

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
            {modalClient}
            {modalAgentClient}            
            {modalDeleteAgent}
            {modalReactiveAgent}
        </Fragment>
    )
}

AdminClientDetail.propTypes = {
    client: PropTypes.object.isRequired,
    getAllAgent: PropTypes.func.isRequired,
    getClientAgent: PropTypes.func.isRequired,
    agentClient: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    deleteAgentClient: PropTypes.func.isRequired,
    reactiveAgentClient: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    agent: state.agent,
    client: state.client,
    agentClient: state.agentClient
})

export default connect(mapStateToProps,{getAllAgent,getClientAgent,setAlert, deleteAgentClient, reactiveAgentClient})(AdminClientDetail)
