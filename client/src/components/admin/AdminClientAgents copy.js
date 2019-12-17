import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';
import { getAllAgent, deleteAgentById, reactiveAgentById } from '../../actions/agent';
import { getAllClient} from '../../actions/client';

const AdminClientAgent = ({match, getAllAgent,getAllClient, reactiveAgentById, getAllLocation, deleteAgentById, getAllProvince, client: {client}, agent: {agent}, province: {province}, location: {location}}) => {

    useEffect(() => {
        getAllAgent();
        getAllProvince();
        getAllLocation();
        getAllClient();
    }, [getAllAgent, getAllProvince, getAllLocation,getAllClient]);

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");

    const [statusFilter, setStatus] = useState("");
    const [txtFilter, setTxtFilter] = useState("");


    const modifyStatus = (e) => {
        setStatus(e.target.value);
        setCurrent(1);
    }

    const [isDisable, setDisable] = useState(true);

    const [provinceFilterId, setProvince] = useState("");

    const modifyProvince = (e) => {
        setProvince(e.target.value);
        setCurrent(1);
        setDisable(e.target.value != "" ? false: true);

        if(e.target.value === ""){
            setLocation("");
        }

    }


    const [locationFilterId, setLocation] = useState("");

    const modifyLocaly = (e) => {
        setLocation(e.target.value);
        setCurrent(1);
    }

    if(match.params.idClient !== undefined || match.params.idClient !== null){
        var idClient = match.params.idClient;
		// busco cliente segun el id de parámetro
		for (let index = 0; index < client.length; index++) {
            if(client[index]._id == match.params.idClient){
                var clientFilter = client[index];
                var nameClient = clientFilter.name
            }
        }
        //console.log("CLIENTE:",clientFilter)
    }


    //console.log("tengo referentes:",agent)
   	//console.log("ID",match.params.idClient)
    if(province !== null && agent !== null && location !== null){
       

        // id's referentes del cliente, obtengo referentes
		var agentFilter = []; 
		for (let index = 0; index < clientFilter.customerReferences.length; index++) {
            let agentFind = agent.filter(function(ag) {
                return ag._id === clientFilter.customerReferences[index].idAgent;
            });
            if (agentFind.length !== 0){
	            //console.log("agFind",agentFind)
    	        agentFilter.push(agentFind[0]);
    	    }
        }
        //console.log("TENEMOS Referentes filtrados:",agentFilter)
		// obtengo referentes de la lista que son del cliente

        for (let index = 0; index < agentFilter.length; index++) {
            const agentObj = agent[index];

            var namePro = province.filter(function(pro) {
                return pro._id === agentObj.provinceId;
            });

            var nameLoc = location.filter(function(loc) {
                return loc._id === agentObj.locationId;
            });

            agentFilter[index].nameProvince = namePro[0].name;

            agentFilter[index].nameLocation = nameLoc[0].name;
            
        }
        
        if(province != null){
            var listProvinces = province.map((pro) =>
                <option key={pro._id} value={pro._id}>{pro.name.toUpperCase()}</option>
            );
        }

        if(location != null && provinceFilterId != ""){

            var arrayLocFilter = location.filter(function(loc) {
                return loc.idProvince === provinceFilterId;
            });

            var listLocation = arrayLocFilter.map((loc) =>
                <option key={loc._id} value={loc._id}>{loc.name.toUpperCase()}</option>
            );
        }

    }


    //logica para mostrar el modal
    const [show, setShow] = useState(false);

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
    //--------

    const askDelete = (nameComplete, IdToDelete) => {
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }

    const [reason, setReason] = useState("");

    const addReason = (e) => {
        setReason(e.target.value);
    }

    const reactiveAgent = (idAgent) => {
        reactiveAgentById(idAgent);
        modalReactive();
    }

    const deleteAgent = (idAgent) => {
        deleteAgentById(idAgent,reason);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(agent != null){

        //var agentFilter = agent;
        var noAgents = false;
        var agentFilter = agent;

        console.log("filtro", agentFilter);


        if(txtFilter !== ""){
            var agentFilter =  agent.filter(function(usr) {
                return usr.name.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
                | usr.surname.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
                | usr.cuil.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 

               
            });
           
            console.log("filtro",agentFilter)
        }
        if(statusFilter != ""){
            agentFilter =  agentFilter.filter(function(usr) {
                return usr.status === statusFilter;
            });
        }

        if(provinceFilterId != ""){
            agentFilter =  agentFilter.filter(function(usr) {
                return usr.provinceId === provinceFilterId;
            });
        }

        if(locationFilterId != ""){
            agentFilter =  agentFilter.filter(function(usr) {
                return usr.locationId === locationFilterId;
            });
        }

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentAgents = agentFilter.slice(indexOfFirstTodo, indexOfLastTodo);
        
        var listAgent = currentAgents.map((ag) =>
            <tr key={ag._id}>
                <td>{ag.surname}, {ag.name}</td>
                <td className="hide-sm">{ag.cuil}</td>
                <td className="hide-sm">{ag.email}</td>
                <td className="hide-sm">{ag.nameProvince}</td>
                <td className="hide-sm">{ag.nameLocation}</td>
                <td className="hide-sm">
                    {ag.status === "ACTIVO" ? <React.Fragment><Moment format="DD/MM/YYYY">{ag.history.slice(-1)[0].dateUp}</Moment> - ACTUAL</React.Fragment>:
                         <React.Fragment>
                            <Moment format="DD/MM/YYYY">{ag.history.slice(-1)[0].dateUp}</Moment> - <Moment format="DD/MM/YYYY">{ag.history.slice(-1)[0].dateDown}</Moment>
                         </React.Fragment>
                    }
                </td>

                <td className="hide-sm ">

                    <Link to={`/admin-agent/agent-detail/${ag._id}`} className="btn btn-success my-1" title="Información">
                        <i className="fas fa-info-circle"></i>
                    </Link>
                  
                    {ag.status === "ACTIVO" ?  <Link to={`/admin-agent/edit-agent/${ag._id}`} className="btn btn-primary" title="Editar">
                                                    <i className="far fa-edit"></i>
                                                </Link>
                                               : ""
                    }

                    {ag.status === "ACTIVO" ?   <a onClick={e => askDelete(ag.name, ag._id)} className="btn btn-danger" title="Eliminar">
                                                    <i className="far fa-trash-alt coloWhite"></i>
                                                </a> : 
                                        
                                            <a onClick={e => askReactive(ag.name, ag._id)} className="btn btn-warning my-1" title="Reactivar">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }
                               

                </td>
            </tr>
        );
        //console.log(listAgent)
        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(agent.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        var renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className="liCustom" key={number}>
                <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
              </li>
            );
        });
        if (agentFilter.length === 0){
         var listAgent = (<tr></tr>);
         var noAgents = true;

        }
    }

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Referente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar el referente: <b>{nameComplete}</b>
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label class="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div class="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de baja" 
                                name="reason"
                                minLength="3"
                                maxLength="150"
                                onChange = {e => addReason(e)}
                            />
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
                <Link onClick={e => deleteAgent(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );


    const modalReactiveHtml = (
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
                <Link onClick={e => reactiveAgent(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );

    const changeTxt = e => {
        setTxtFilter(e.target.value);
    }

    return (
        <Fragment>

            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin-client" className="btn btn-secondary">
                        Atrás
                    </Link>

                    <Link to={`/admin-agent/create-agent/${idClient}`}  className="btn btn-primary my-1">
                        Nuevo Referente
                    </Link>

                </div>

                <div className="form-group col-lg-6 col-sm-6 selectStatus">
                    <select name="status" className="form-control selectOption" onChange = {e => modifyStatus(e)}>
                        <option value="">Ver TODOS</option>
                        <option value="ACTIVO">Ver ACTIVOS</option>
                        <option value="INACTIVO">Ver INACTIVOS</option>
                    </select>
                </div>

            </div>

            <div className="col-lg-12 col-sm-12">
                    <div className="row row-hover">
                        <div className="col-lg-6 col-sm-6">    
                        <h2 className="mb-2">Administración de Referentes de:</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                            <input type="text" className="form-control " placeholder="Buscar Referentes por Nombre o CUIL" onChange = {e => changeTxt(e)} />
                        </div>                 
                    </div>
                    <div className="row row-hover">
                        <div className="col-lg-6 col-sm-6">    
                        <h2 className="mb-2"><strong>{nameClient}</strong></h2>
                        </div>
                        
                    </div>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Apellido y Nombre</th>
                    <th className="hide-sm headTable">CUIL</th>
                    <th className="hide-sm headTable">Email</th>
                    <th className="hide-sm headTable">
                        <select name="status" className="form-control" onChange = {e => modifyProvince(e)}>
                            <option value="">PROVINCIA</option>
                            {listProvinces}
                        </select>
                    </th>

                    <th className="hide-sm headTable">
                        <select name="status" className="form-control" onChange = {e => modifyLocaly(e)} disabled={isDisable}>
                            <option value="">LOCALIDAD</option>
                            {listLocation}
                        </select>
                    </th>

                    <th className="hide-sm headTable">Período de Actividad</th>

                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listAgent}</tbody>
            </table>
            {noAgents ? <li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Referentes</b></center></li> : ''}

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            {modal}

            {modalReactiveHtml}
            
        </Fragment>
    )
}

AdminClientAgent.propTypes = {
 	getAllAgent: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    deleteAgentById: PropTypes.func.isRequired,
    reactiveAgentById: PropTypes.func.isRequired,
    province: PropTypes.object.isRequired,
    getAllClient: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    agent: state.agent,
    province: state.province,
    location: state.location,
    client: state.client
})

export default connect(mapStateToProps, {getAllClient,getAllProvince, getAllLocation, getAllAgent, deleteAgentById, reactiveAgentById})(AdminClientAgent)