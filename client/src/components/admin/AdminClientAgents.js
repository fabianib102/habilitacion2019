import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, Tab, Form } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllClient, getClientAgent, deleteAgentClient, reactiveAgentClient, addAgentClient, deleteClientById, reactiveClientById } from '../../actions/client';
import { getAllAgentsActive,getAllAgent, registerAgent} from '../../actions/agent';
import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';

const AdminClientAgent = ({getAllClient, getAllAgentsActive, deleteClientById, reactiveClientById,setAlert, getClientAgent, getAllAgent,registerAgent, getAllProvince, getAllLocation, province: {province} ,location: {location}, agent:{agent}, client: {client},  agentClient: {agentClient}, deleteAgentClient, reactiveAgentClient, addAgentClient}) => {
{/*agentActive: {agentActive},*/}
    useEffect(() => {
        getAllClient();
        getAllAgentsActive();
        getClientAgent();
        getAllAgent();
        getAllProvince();
        getAllLocation();
    }, [getAllClient, getAllAgentsActive, getClientAgent,getAllProvince, getAllLocation]);

// para alta de referentes
    const [formData, SetFormData] = useState({
        name: '',
        surname: '',
        cuil: '',
        address: '',
        email: '',
        phone: '',
        provinceId: "",
        locationId: "",
    });

    const {name, surname, cuil, address, email, phone, provinceId, locationId} = formData;
    const [clientId, setClientId] = useState('?'); // manejo del atributo del form clientId a parte.

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

   //Función, solo permite ingresar números en el cuil
    const onChangeNumber = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            SetFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    const onSubmit = async e => {
        e.preventDefault();
        if(name === "" || cuil === "" || surname === "" || address === "" || email === "" || phone === ""){
            setAlert('Debes ingresar el nombre, apellido, cuil, dirección, email y telefono', 'danger');
        }else{
            registerAgent({name, surname, cuil, address, email, phone, provinceId, locationId, clientId});
            } 
        modalClient();
    }

    if(province != null){
        var listProvince = province.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name}</option>
        );
    }

    const [isDisable, setDisable] = useState(true);

    var filterLocation;

    const onChangeProvince = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisable(false);
    }

    const onChangeClient = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisable(false);
    }

    if(location != null){

        filterLocation = location;

        if(provinceId != ""){
            filterLocation = location.filter(function(lo) {
                return lo.idProvince === provinceId;
            });
        }

        var listLocation = filterLocation.map((loc) =>
            <option key={loc._id} value={loc._id}>{loc.name}</option>
        );
    }
//fin elementos para alta referente

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
            
            if(agent[index].status == "ACTIVO"){
                agentActive.push(agent[index])
            };            

        };
    // fin cambio 

    if(client != null){
        // si no hay referentes crea un aviso de que no hay referentes        
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

    const callModalAddAgent = (namePass, idClientPass, idAgentPass) => {
        // actualizo y llamo a modal para agregar
        setNameAgent(namePass);
        setIdClientAdd(idClientPass);
        setIdAgentAdd(idAgentPass);
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
                        arrayTemp[indexFind].statusClient = element.status;
                        arrayTemp[indexFind].fechaAlta = element.dateStart;
                        arrayTemp[indexFind].fechaBaja = element.dateDown;
                    }

                }else{
                    agentResg[0].statusClient = element.status;
                    agentResg[0].fechaAlta = element.dateStart;
                    agentResg[0].fechaBaja = element.dateDown;
                    arrayTemp.push(agentResg[0]);

                }

                
            }

        }

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
          // si no hay referentes crea un aviso de que no hay referentes        
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
        setClientId(idSelecClient);
    }

    const [showModalDelete, setShowModal] = useState(false);

    const [nameAgent, setNameAgent] = useState("");

    const [idAgentDelete, setIdAgentDelete] = useState("");

    const callModalAgentDelete = (nameComplete, idAgent) => {
        setNameAgent(nameComplete);
        setIdAgentDelete(idAgent);

        if(idClientSelected === ""){
            setIdClient(client[0]._id);
            setClientId(client[0]._id)
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

    //#region pestaña de los referentes
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
            setClientId(client[0]._id);
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
            setClientId(client[0]._id);
        }
        for (let index = 0; index < client.length; index++) {
            if (idClientSelected === client[index]._id ){
                //valido que el cliente este activo, para agregar.
                if (client[index].status === 'INACTIVO'){
                    setAlert('No puedes añadir un nuevo referente a un cliente inactivo', 'danger');
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
            //validar que cliente esté activo.
            for (let index = 0; index < client.length; index++) {
                if (idClientSelected === client[index]._id ){
                    //valido que el cliente este activo, para agregar.
                    if (client[index].status === 'INACTIVO'){
                        setAlert('No puedes añadir un nuevo referente a un cliente inactivo', 'danger');
                    } else {
                        setShowModalClient(true);
                }
            }
        }
            
        }
    }

    //#region modal para seleccionar mas referentes

    const modalSelectAgent = (
        <Modal size="lg" show={showModalClient} onHide={e => modalClient()}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccionación de Referente </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="form" onSubmit={e => onSubmit(e)}>
                    <div className="row">

                        <div className="form-group col-lg-6">
                            
                                <h5>Nombres (*)</h5>
                                <input 
                                    type="text" 
                                    placeholder="Nombre del Referente" 
                                    name="name"
                                    minLength="3"
                                    maxLength="50"
                                    onChange = {e => onChange(e)}
                                    value={name}
                                />
                        </div>

                         <div className="form-group col-lg-6">                            
                                <h5>Apellidos (*)</h5>
                                <input 
                                    type="text" 
                                    placeholder="Apellido del Referente" 
                                    name="surname"
                                    minLength="3"
                                    maxLength="50"
                                    onChange = {e => onChange(e)}
                                    value={surname}
                                />
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-6">                            
                                <h5>CUIL (*)</h5>
                                <input 
                                    type="text" 
                                    placeholder="CUIL" 
                                    name="cuil"
                                    maxLength="11"
                                    minLength="11"
                                    onChange = {e => onChange(e)}
                                    value={cuil}
                                />
                        </div>

                        <div className="form-group col-lg-6">
                                <h5>Dirección (*)</h5>
                                <input 
                                    type="text" 
                                    placeholder="Dirección" 
                                    name="address"
                                    maxLength="150"
                                    minLength="5"
                                    onChange = {e => onChange(e)}
                                    value={address}
                                />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-lg-6">  
                                <h5>Email (*)</h5>
                                <input 
                                    type="email" 
                                    placeholder="Email"
                                    name="email"
                                    maxLength="30"
                                    minLength="5"
                                    onChange = {e => onChange(e)}
                                    value={email}
                                />
                        </div>

                        <div className="form-group col-lg-6"> 
                                <h5>Teléfono (*)</h5>
                                <input 
                                    type="text" 
                                    placeholder="Teléfono" 
                                    name="phone"
                                    maxLength="15"
                                    minLength="10"
                                    onChange = {e => onChangeNumber(e)}
                                    value={phone}
                                />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-lg-6">  
                            <h5>Provincia (*)</h5>
                            <select name="provinceId" value={provinceId} onChange = {e => onChangeProvince(e)}>
                                <option value="0">* Selección de Provincia</option>
                                {listProvince}
                            </select>
                        </div>

                        <div className="form-group col-lg-6">
                            <h5>Localidad (*)</h5>
                            <select name="locationId" value={locationId} onChange = {e => onChange(e)} disabled={isDisable}>
                                <option value="0">* Selección de Localidad</option>
                                {listLocation}
                            </select>
                        </div>                  
                    </div> 


                    <div className="form-group">
                        <span>(*) son campos obligatorios</span>
                    </div>

                    <input type="submit" className="btn btn-primary" value="Registrar"/>

                </form>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalClient()}>
                    Cerrar
                </Button>
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

            <h2 className="my-2">Administración de Clientes y Referentes</h2>
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
                            <div className="float-right">
                                <a className="btn btn-success" onClick={e => modalClient()}>
                                    <i className="fas fa-plus-circle coloWhite" title="Añadir Referente"></i>
                                </a>
                            </div>
                        </div>

                        <div className="card-body">

                         {/*   <Tabs defaultActiveKey="client" id="uncontrolled-tab-example">


                                <Tab eventKey="client" title="Referentes del Cliente">
                                */}
                                    {htmlTabMember}
                               {/*  </Tab>
                
                               <Tab eventKey="data" title="Agregar más Referentes">
                                    {listAgentSelect}

                                </Tab> 

                            </Tabs>*/}

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
    registerAgent: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    agentActive: state.agentActive,
    agentClient: state.agentClient,
    agent: state.agent,
    province: state.province,
    location: state.location,
})

export default connect(mapStateToProps, {getAllClient, getAllAgentsActive, getClientAgent, deleteClientById, reactiveClientById,setAlert, deleteAgentClient, reactiveAgentClient, addAgentClient, getAllAgent, registerAgent,getAllProvince, getAllLocation})(AdminClientAgent)
