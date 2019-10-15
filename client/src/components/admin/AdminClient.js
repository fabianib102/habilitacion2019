import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tooltip } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';
import { getAllClient, deleteClientById, reactiveClientById } from '../../actions/client';

const AdminClient = ({getAllClient, reactiveClientById, getAllLocation, deleteClientById, getAllProvince, client: {client}, province: {province}, location: {location}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");

    const [statusFilter, setStatus] = useState("");

    const modifyStatus = (e) => {
        setStatus(e.target.value);
        setCurrent(1);
    }

    const [isDisable, setDisable] = useState(true);

    const [provinceFilterId, setProvince] = useState("");

    const modifyProvince = (e) => {
        setProvince(e.target.value);
        setCurrent(1);
        setDisable(e.target.value !== "" ? false: true);

        if(e.target.value === ""){
            setLocation("");
        }

    }


    const [locationFilterId, setLocation] = useState("");

    const modifyLocaly = (e) => {
        setLocation(e.target.value);
        setCurrent(1);
    }

    const [reason, setReason] = useState("");

    const addReason = (e) => {
        setReason(e.target.value);
    }

    if(province !== null && client !== null && location !== null){
        
        for (let index = 0; index < client.length; index++) {
            const clientObj = client[index];

            var namePro = province.filter(function(pro) {
                return pro._id === clientObj.provinceId;
            });

            var nameLoc = location.filter(function(loc) {
                return loc._id === clientObj.locationId;
            });

            client[index].nameProvince = namePro[0].name;

            client[index].nameLocation = nameLoc[0].name;
            
        }

        if(province !== null){
            var listProvinces = province.map((pro) =>
                <option key={pro._id} value={pro._id}>{pro.name.toUpperCase()}</option>
            );
        }

        if(location !== null && provinceFilterId !== ""){

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

    //pregunta si quiere volver a reactivar al usuario
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
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }

    useEffect(() => {
        getAllClient();
        getAllProvince();
        getAllLocation();
    }, [getAllClient, getAllProvince, getAllLocation]);

    const reactiveClient = (idClient) => {
        reactiveClientById(idClient);
        modalReactive();
    }

    const deleteClient = (idClient) => {
        deleteClientById(idClient,reason);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }
    

    if(client !== null){

        // si no hay clientes crea un aviso de que no hay usuarios        
        if (client.length === 0){
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Clientes</b></center></li>)
        }

        // hay clientes, proceso de tratamiento
        var whithItems = true;
        var clientFilter = client;

        if(statusFilter !== ""){
            clientFilter =  clientFilter.filter(function(usr) {
                return usr.status === statusFilter;
            });
        }

        if(provinceFilterId !== ""){
            clientFilter =  clientFilter.filter(function(usr) {
                return usr.provinceId === provinceFilterId;
            });
        }

        if(locationFilterId !== ""){
            clientFilter =  clientFilter.filter(function(usr) {
                return usr.locationId === locationFilterId;
            });
        }

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentClients = clientFilter.slice(indexOfFirstTodo, indexOfLastTodo);

        var listClient = currentClients.map((cli) =>
            <tr key={cli._id}>
                <td>{cli.name}</td>
                <td className="hide-sm">{cli.cuil}</td>
                <td className="hide-sm">{cli.email}</td>

                <td className="hide-sm">{cli.nameProvince}</td>
                <td className="hide-sm">{cli.nameLocation}</td>
                <td className="hide-sm">
                    {cli.status === "ACTIVO" ? <React.Fragment><Moment format="DD/MM/YYYY">{cli.history.slice(-1)[0].dateUp}</Moment> - ACTUAL</React.Fragment>:
                         <React.Fragment>
                            <Moment format="DD/MM/YYYY">{cli.history.slice(-1)[0].dateUp}</Moment> - <Moment format="DD/MM/YYYY">{cli.history.slice(-1)[0].dateDown}</Moment>
                         </React.Fragment>
                    } 
                </td>

                <td className="hide-sm ">

                    <Link to={`/admin-client/client-detail/${cli._id}`} className="btn btn-success my-1" title="Información del cliente">
                        <i className="fas fa-info-circle"></i>
                    </Link>
                  
                    {cli.status === "ACTIVO" ?  <Link to={`/admin-client/edit-client/${cli._id}`} className="btn btn-primary" title="Editar información del cliente">
                                                    <i className="far fa-edit"></i>
                                                </Link>                                                
                                               : ''
                    }
                    <Link to={`/admin-client-agents/${cli._id}`} className="btn btn-light" title="Ver Referentes del cliente">
                                                    <i className="fas fa-handshake"></i>
                                                </Link>

                    {cli.status === "ACTIVO" ?   <a onClick={e => askDelete(cli.name, cli._id)} className="btn btn-danger" title="Eliminar cliente">
                                                    <i className="far fa-trash-alt coloWhite"></i>
                                                </a> : 
                                        
                                            <a onClick={e => askReactive(cli.name, cli._id)} className="btn btn-warning my-1" title="Reactivar cliente">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }
                               

                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(client.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        var renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className="liCustom" key={number}>
                <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
              </li>
            );
        });

    }

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar el cliente: <b>{nameComplete}</b>
                    
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
                <a onClick={e => deleteClient(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    );


    const modalReactiveHtml = (
        <Modal show={showReactive} onHide={e => modalReactive()} >
            <Modal.Header closeButton title="Cerrar">
                <Modal.Title>Reactivar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de reactivar el cliente: <b>{nameComplete}</b>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalReactive() } >
                Cerrar
                </Button>
                <a onClick={e => reactiveClient(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    )

    return (
        <Fragment>

            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin" className="btn btn-secondary">
                        Atrás
                    </Link>

                    <Link to="/admin-client/create-client"  className="btn btn-primary my-1">
                        Nuevo Cliente
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

            <h2 className="my-2">Administración de Clientes</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre</th>
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
                <tbody>{listClient}</tbody>
            </table>

            {!whithItems ? '' : itemNone}
            
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

AdminClient.propTypes = {
    getAllClient: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    deleteClientById: PropTypes.func.isRequired,
    reactiveClientById: PropTypes.func.isRequired,
    province: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    province: state.province,
    location: state.location
})

export default connect(mapStateToProps, {getAllProvince, getAllLocation, getAllClient, deleteClientById, reactiveClientById})(AdminClient)
