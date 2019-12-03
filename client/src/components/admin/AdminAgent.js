import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tooltip } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';
import { getAllAgent, deleteAgentById, reactiveAgentById } from '../../actions/agent';

const AdminAgent = ({getAllAgent, reactiveAgentById, getAllLocation, deleteAgentById, getAllProvince, agent: {agent}, province: {province}, location: {location}}) => {

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


    
    if(province !== null && agent !== null && location !== null){
        
        for (let index = 0; index < agent.length; index++) {
            const agentObj = agent[index];

            var namePro = province.filter(function(pro) {
                return pro._id === agentObj.provinceId;
            });

            var nameLoc = location.filter(function(loc) {
                return loc._id === agentObj.locationId;
            });

            agent[index].nameProvince = namePro[0].name;

            agent[index].nameLocation = nameLoc[0].name;
            
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

    useEffect(() => {
        getAllAgent();
        getAllProvince();
        getAllLocation();
    }, [getAllAgent, getAllProvince, getAllLocation]);

    const reactiveAgent = (idAgent) => {
        reactiveAgentById(idAgent);
        modalReactive();
    }

    const deleteAgent = (idAgent) => {
        deleteAgentById(idAgent);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(agent != null){

        var agentFilter = agent;
        var noAgents = false;

        console.log("agentes", agent);


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
                {/*<td className="hide-sm"></td> */}
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
        if (agent.length === 0){
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
                    <Link to="/admin" className="btn btn-secondary">
                        Atrás
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
                            <h2 className="mb-2">Administración de Referentes de Clientes</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                            <input type="text" className="form-control " placeholder="Buscar Referente por Nombre o CUIL" onChange = {e => changeTxt(e)} />
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

AdminAgent.propTypes = {
    getAllAgent: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
    agent: PropTypes.object.isRequired,
    deleteAgentById: PropTypes.func.isRequired,
    reactiveAgentById: PropTypes.func.isRequired,
    province: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    agent: state.agent,
    province: state.province,
    location: state.location
})

export default connect(mapStateToProps, {getAllProvince, getAllLocation, getAllAgent, deleteAgentById, reactiveAgentById})(AdminAgent)
