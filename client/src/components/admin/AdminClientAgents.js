import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, Tab, Form } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllClient, getClientAgent, deleteAgentClient, reactiveAgentClient, addAgentClient, deleteClientById, reactiveClientById } from '../../actions/client';
import { getAllAgentsActive,getAllAgent} from '../../actions/agent';

const AdminClientAgent = ({getAllClient, getAllAgentsActive, deleteClientById, reactiveClientById,setAlert, getClientAgent, getAllAgent, agent:{agent}, client: {client},  agentClient: {agentClient}, deleteAgentClient, reactiveAgentClient, addAgentClient}) => {
{/*agentActive: {agentActive},*/}
    useEffect(() => {
        getAllClient();
        getAllAgentsActive();
        getClientAgent();
        getAllAgent();
    }, [getAllClient, getAllAgentsActive, getClientAgent]);

    const [idClientSelected, setIdClient] = useState("");

    const [itemIndex, setIndex] = useState(0);

    const [nameClient, setNameClient] = useState("");

    const [idClientAdd, setIdClientAdd] = useState("");

    const [idAgentAdd, setIdAgentAdd] = useState("");

    const [idClientDelete, setItemDelete] = useState("");

    var whithItemsInt = true;
    var whithItemsT = true;
    var whithItemsNI = true;
    
    //parseo momentaneo, cambiar!
    var agentActive = [];
    
    for (let index = 0; index < agent.length; index++) {           
           //NOTA: redefinir y generalizar para disponer ya agentes activos e inactivos y no buscar.
            //console.log(agent[index].status)
            if(agent[index].status == "ACTIVO"){
                agentActive.push(agent[index])
            };            

        };
    // fin cambio 

    if(client != null){
        // si no hay representanets crea un aviso de que no hay representantes        
        if (client.length === 0){
            var whithItemsT = false;
            var itemNoneT = (<li className='itemClient list-group-item-action list-group-item'><center><b>No hay Clientes</b></center></li>)
        }else{
        var listClient = client.map((te, item) =>

            <li key={te._id} onClick={e => saveIdClient(te._id, item, te.name)} className={item == itemIndex ? "itemClient list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
                <div className="float-left">
                    {te.name}
                    <div className="hide-sm">
                        {te.status === "ACTIVO" ? <React.Fragment><Moment format="DD/MM/YYYY">{te.history.slice(-1)[0].dateUp}</Moment> - ACTUAL</React.Fragment>:
                             <React.Fragment>
                                <Moment format="DD/MM/YYYY">{te.history.slice(-1)[0].dateUp}</Moment> - <Moment format="DD/MM/YYYY">{te.history.slice(-1)[0].dateDown}</Moment>
                             </React.Fragment>
                        }
                    </div>
                </div>
                <div className="float-right">

                    <Link to={`/admin-client/edit-client/${te._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    {   te.status === "ACTIVO" ? 

                        <a onClick={e => callModalDeleteClient(te._id)} className="btn btn-danger" title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                        :
                        <a onClick={e => callModalReactiveClient(te._id)} className="btn btn-warning" title="Reactivar">
                            <i className="fas fa-arrow-alt-circle-up"></i>
                        </a>
                    }
                    
                </div>

            </li>
        );
        }
    }
    //console.log("act:",agentActive)
    if(agentActive !== null && agentClient !== null && client !== [] && client[0] !== undefined){
        
        
        var listAddClientAgent = []

        let idCompareClient = client[0]._id;

        if(idClientSelected !== ""){
            idCompareClient = idClientSelected
        }

        var listAgentClient = agentClient.filter(function(usr) {
            return usr.idClient == idCompareClient
        });

        for (let index = 0; index < agentActive.length; index++) {

            const element = agentActive[index];
            
            let indexFind = listAgentClient.findIndex(x => x.idAgent === element._id);

            if(indexFind == -1){

                listAddClientAgent.push(element);
            }
        }


        if (listAddClientAgent.length === 0){
            var whithItemsNI = false;
            var itemNoneNI = (<li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Integrantes para añadir</b></center></li>)
        }

        var listAgent = listAddClientAgent.map((te, item) =>
            <li key={te._id} className=" list-group-item-action list-group-item groupAgent">
                {te.surname} {te.name}

                <div className="float-right">

                    <a className="btn btn-success" title="Añadir" onClick={e => callModalAddAgent(te.surname + " " + te.name, idCompareClient, te._id)}>
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>

                </div>

            </li>
        );

        var listAgentSelect = (

            <div className="card">
                <div className="card-body bodyPerson">
                    {listAgent}
                    {whithItemsNI ? '' : itemNoneNI}                    
                </div>
            </div>
        )   
        
    }else{
        // si no hay representantes crea un aviso de que no hay representantes        
        var whithItemsInt = false;
        var itemNoneInt = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Representantes</b></center></li>)
        var whithItemsNI = false;
        var itemNoneNI = (<li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Integrantes para añadir</b></center></li>)
     
    }

    const callModalAddAgent = (namePass, idClientPass, idAgentPass) => {
        // actualizo y llamo a modal para agregar
        setNameAgent(namePass);
        setIdClientAdd(idClientPass);
        setIdAgentAdd(idAgentPass);
        modalClient();        
    }

    const addAgent = () => {
        addAgentClient(idClientAdd, idAgentAdd);
        getAllAgentsActive();
        modalClient();
    }

    if(agentClient !== null && agentActive !== null && client !== [] && client[0] !== undefined){
        
        let idCompareClient = client[0]._id;

        if(idClientSelected !== ""){
            idCompareClient = idClientSelected
        }

        var test = agentClient.filter(function(usr) {
            return usr.idClient == idCompareClient
        });

        var arrayTemp = [];
        for (let index = 0; index < test.length; index++) {

            var element = test[index];
            
            let agentResg =  agentActive.filter(function(usr) {
                return element.idAgent == usr._id;
            });

            if(agentResg[0] !== undefined){

                let indexFind = arrayTemp.findIndex(x => x._id === agentResg[0]._id);
            
                if(indexFind > -1){

                    if(arrayTemp[indexFind].status === 'INACTIVO'){
                        //console.log(element.status);
                        arrayTemp[indexFind].statusClient = element.status;
                        arrayTemp[indexFind].fechaAlta = element.dateStart;
                        arrayTemp[indexFind].fechaBaja = element.dateDown;
                    }

                }else{
                    //console.log("in",element.status);
                    agentResg[0].statusClient = element.status;
                    agentResg[0].fechaAlta = element.dateStart;
                    agentResg[0].fechaBaja = element.dateDown;
                    arrayTemp.push(agentResg[0]);

                }

                
            }

        }
        console.log("->",arrayTemp)
        var listAgentClient = arrayTemp.map((te) =>

            <tr key={te._id}>

                <td><Link to={`/admin-agent/agent-detail/${te._id}`} title="Ver Datos">
                        {te.surname} {te.name}
                    </Link>
                </td>
                <td className="hide-sm"><Moment format="DD/MM/YYYY">{moment.utc(te.fechaAlta)}</Moment></td>

                <td className="hide-sm">{te.statusClient === "ACTIVO" ?  " - " : <Moment format="DD/MM/YYYY">{moment.utc(te.fechaBaja)}</Moment>}</td>

                <td className="hide-sm centerBtn">
                    
                    {   te.statusClient === "ACTIVO" ? 

                        <a onClick={e => callModalAgentDelete(te.surname+" "+te.name,te._id)} className="btn btn-danger" title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                        :
                        <a onClick={e => callModalAgentReactive(te.surname+" "+te.name,te._id)} className="btn btn-warning" title="Reactivar">
                            <i className="fas fa-arrow-alt-circle-up"></i>
                        </a>

                    }
                        <a onClick={e => callModalAgentHistory(te._id, te.name,te.surname, idClientSelected)} className="btn btn-dark" title="Historial de Movimientos">
                            <i className="fas fa-history coloWhite"></i>
                        </a>
                </td>

            </tr>
        );

    }else{
          // si no hay representantes crea un aviso de que no hay representantes        
        var whithItemsInt = false;
        var itemNoneInt = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay integrantes</b></center></li>)
       
    }

    const saveIdClient = (idSelecClient, itemPass, namePass) => {

        if(namePass == "" || nameClient == ""){
            setNameClient(client[0].name)
        }else{
            setNameClient(namePass)
        }
        setIndex(itemPass);
        setIdClient(idSelecClient);
    }

    const [showModalDelete, setShowModal] = useState(false);

    const [nameAgent, setNameAgent] = useState("");

    const [idAgentDelete, setIdAgentDelete] = useState("");

    const callModalAgentDelete = (nameComplete, idAgent) => {
        setNameAgent(nameComplete);
        setIdAgentDelete(idAgent);

        if(idClientSelected === ""){
            setIdClient(client[0]._id);
        }

        deleteModalAgent();
    }

    const deleteModalAgent = () => {
        if(showModalDelete){
            setShowModal(false);
        }else{
            setShowModal(true);
        }
    }

    const deleteAgentClientById = (idDeleteAgent) => {

        let idClient = idClientSelected;
        let idAgent = idDeleteAgent;

        deleteAgentClient(idClient, idAgent);
        deleteModalAgent();
    }

    //#region modal agent delete

    const modalAgentHistory = (
        <Modal show={showModalDelete} onHide={e => deleteModalAgent()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Recurso del Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estas seguro de eliminar el recurso <b>{nameAgent}</b>, del cliente?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => deleteModalAgent()}>
                    Cerrar
                </Button>
                <a  className="btn btn-primary" onClick={e => deleteAgentClientById(idAgentDelete)}>
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    //#region 
    var bodyClient = (
        <div className="card-body bodyClient">
            <ul className="list-group">
                {listClient}
                {whithItemsT ? '' : itemNoneT}
            </ul>
        </div>
    )
    //#endregion

    //#region pestaña de los representantes
    var htmlTabMember = (
        <div className="card">
            <div className="card-body bodyPerson">

                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Nombre</th>
                        <th className="hide-sm headTable">Fecha de alta</th>
                        <th className="hide-sm headTable">Fecha de baja</th>
                        <th className="hide-sm headTable centerBtn">Opciones</th>
                    </tr>
                    </thead>
                    <tbody>
                        {listAgentClient}
                    </tbody>
                </table>
                {whithItemsInt ? '' : itemNoneInt}
            </div>
        </div>
    );
    //#endregion

    //manejo de Historial
    const [showModalHistory, setShowModalHistory] = useState(false);

    const [idAgentHistory, setIdAgentHistory] = useState("");

    const [nameAgentHistory, setNameAgentHistory] = useState("");

    const [surnameAgentHistory, setSurameAgentHistory] = useState("");

    if(agentClient !== null && client !== []){
        var arrayAgentHistory = [];
            let agentHistory =  agentClient.filter(function(t) {
                return t.idAgent  == idAgentHistory && t.idClient == idClientSelected;
            });                   
            arrayAgentHistory = agentHistory;
    
    if (arrayAgentHistory.length !== 0){ //con historial
        var listHistory = arrayAgentHistory.map((te) =>

                    <li key={te._id} className="list-group-item-action list-group-item">
                        <Moment format="DD/MM/YYYY ">{moment.utc(te.dateStart)}</Moment> -
                        {te.dateDown === null ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}

                    </li>
                );}
        else{ //sin clientes
            var listClient = (<li key='0' className='itemClient list-group-item-action list-group-item'><b>Sin movimientos</b></li>)
        };

    }

    const callModalAgentHistory = (idAgent,nameAgentSelected,surnameAgentSelected,idClientSelected) => {
        setIdAgentHistory(idAgent);
        setNameAgentHistory(nameAgentSelected);
        setSurameAgentHistory(surnameAgentSelected);

        if(idClientSelected === ""){
            setIdClient(client[0]._id);
            setNameClient(client[0].name)
        }

        historyModalAgent();
    }
    const historyModalAgent = () => {
        if(showModalHistory){
            setShowModalHistory(false);
        }else{
            setShowModalHistory(true);
        }
    }

    //#region modal agent history    
    const modalAgent = (
        <Modal show={showModalHistory} onHide={e => historyModalAgent()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos en <b>{nameClient}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de <b>{surnameAgentHistory} {nameAgentHistory}</b></center>
            <div className="row">

                <div className="col-lg-3 col-sm-3"></div>
                <div className="col-lg-6 col-sm-6">

                    <center><b> INICIO  -  FIN </b></center>
                    {listHistory}
                    
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



    //lugar para reactivar
    const [showModalReactive, setShowModalReactive] = useState(false);

    const callModalAgentReactive = (nameComplete, idAgent) => {

        if(idClientSelected === ""){
            setIdClient(client[0]._id);
        }
        for (let index = 0; index < client.length; index++) {
            if (idClientSelected === client[index]._id ){
                //valido que el cliente este activo, para agregar.
                if (client[index].status === 'INACTIVO'){
                    setAlert('No puedes añadir un nuevo representante a un cliente inactivo', 'danger');
                } else {
                    setNameAgent(nameComplete);
                    setIdAgentDelete(idAgent);
                    reactiveModalAgent();
                }
            }
        }
    }

    const reactiveModalAgent = () => {
        if(showModalReactive){
            setShowModalReactive(false);
        }else{
            setShowModalReactive(true);
        }
    }

    const reactiveAgentClientById = (idReactiveAgent) => {

        let idClient = idClientSelected;
        let idAgent = idReactiveAgent;

        reactiveAgentClient(idClient, idAgent);
        reactiveModalAgent();
    }

    //#region modal agent reactive

    const modalAgentReactive = (
        <Modal show={showModalReactive} onHide={e => reactiveModalAgent()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar Recurso del cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estas seguro de reactivar el recurso <b>{nameAgent}</b>, al cliente?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => reactiveModalAgent()}>
                    Cerrar
                </Button>
                <a onClick={e => reactiveAgentClientById(idAgentDelete)} className="btn btn-primary" >
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    const [showModalClient, setShowModalClient] = useState(false);

    const modalClient = () => {
        if(showModalClient){
            setShowModalClient(false);
        }else{
            setShowModalClient(true);
        }
    }

    //#region modal para seleccionar mas representantes

    const modalSelectAgent = (
        <Modal show={showModalClient} onHide={e => modalClient()}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccionación de Representante </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estas seguro de agregar el recurso <b>{nameAgent}</b>, al cliente?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalClient()}>
                    Cerrar
                </Button>
                <a className="btn btn-primary" onClick={e => addAgent()}>
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    //#region para dar de baja el cliente

    const [showModalDeleteClient, setModalClient] = useState(false);

    const callModalDeleteClient = (idClientPass) => {
        setItemDelete(idClientPass);
        modalClientDelete();
    }


    const modalClientDelete = () => {
        if(showModalDeleteClient){
            setModalClient(false);
        }else{
            setModalClient(true);
        }
    }


    const deleteClient = () => {
        deleteClientById(idClientDelete);
        modalClientDelete();
    }


    const modalDeleteClient = (
        <Modal show={showModalDeleteClient} onHide={e => modalClientDelete()}>
            <Modal.Header closeButton>
                <Modal.Title>Baja Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estas seguro de dar de baja al cliente?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalClientDelete()}>
                    Cerrar
                </Button>
                <a onClick={e => deleteClient()} className="btn btn-primary" >
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );


    //#endregion



    //#region para reactivar el cliente
    const [showModalReactiveClient, setModalReactive] = useState(false);

    const callModalReactiveClient = (idClientPass) => {
        setItemDelete(idClientPass);
        modalClientReactive();
    }

    const modalClientReactive = () => {
        if(showModalReactiveClient){
            setModalReactive(false);
        }else{
            setModalReactive(true);
        }
    }

    const reactiveClient = () => {
        reactiveClientById(idClientDelete);
        modalClientReactive();
    }
    
    const modalReactiveClient = (
        <Modal show={showModalReactiveClient} onHide={e => modalClientReactive()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar el Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estas seguro de reactivar el Cliente?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalClientReactive()}>
                    Cerrar
                </Button>
                <a onClick={e => reactiveClient()} className="btn btn-primary" >
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    return (

        <Fragment>
            
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin-client" className="btn btn-secondary">
                        Atrás
                    </Link>

                    <Link to="/admin-client/create-client"  className="btn btn-primary my-1">
                        Nuevo Cliente
                    </Link>
                </div>
            </div>

            <h2 className="my-2">Administración de Clientes y Representantes</h2>
            <div className="row">

                <div className="col-sm-12 col-lg-5">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Lista de Clientes</strong>
                        </div>

                        {bodyClient}

                    </div>

                </div>

                <div className="col-sm-12 col-lg-7">

                    <div className="card">

                        <div className="card-header">

                            <i className="fas fa-info-circle"></i>
                           <strong> Información del Cliente </strong>

                        </div>

                        <div className="card-body">

                            <Tabs defaultActiveKey="client" id="uncontrolled-tab-example">

                                <Tab eventKey="client" title="Representantes del Cliente">
                                    {htmlTabMember}
                                </Tab>
                
                                <Tab eventKey="data" title="Agregar más Representantes">
                                    {listAgentSelect}
                                </Tab>

                            </Tabs>

                        </div>


                    </div>

                </div>

            </div>

            {modalAgentHistory}

            {modalAgent}

            {modalAgentReactive}

            {modalSelectAgent}

            {modalDeleteClient}

            {modalReactiveClient}
            
        </Fragment>

    )
}

AdminClientAgent.propTypes = {
    getAllClient: PropTypes.func.isRequired,
    getAllAgentsActive: PropTypes.func.isRequired,
    getClientAgent: PropTypes.func.isRequired,
    agentActive: PropTypes.object.isRequired,
    agentClient: PropTypes.object.isRequired,
    deleteAgentClient: PropTypes.func.isRequired,
    reactiveAgentClient: PropTypes.func.isRequired,
    addAgentClient: PropTypes.func.isRequired,
    deleteClientById: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    reactiveClientById: PropTypes.func.isRequired,
    agent: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    agentActive: state.agentActive,
    agentClient: state.agentClient,
    agent: state.agent,
})

export default connect(mapStateToProps, {getAllClient, getAllAgentsActive, getClientAgent, deleteClientById, reactiveClientById,setAlert, deleteAgentClient, reactiveAgentClient, addAgentClient, getAllAgent})(AdminClientAgent)
