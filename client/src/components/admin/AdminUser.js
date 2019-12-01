import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';
import { getAllUsers, deleteUserByEmail, reactiveUserByEmail } from '../../actions/user';


const AdminUser = ({deleteUserByEmail, reactiveUserByEmail, getAllUsers,getAllLocation,getAllProvince, users: {users}, province: {province}, location: {location}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [emailDelete, setEmail] = useState("");

    const [statusFilter, setStatus] = useState("");
    const [statusConnection, setConnection] = useState("");

    const modifyStatus = (e) => {
        setStatus(e.target.value);
        setCurrent(1);
    }

    const modifyStatusConnection = (e) => {
        console.log(e.target.value)
        if(e.target.value === "undefined"){
            setConnection(undefined);
            console.log("setee por igual")
        }else{            
            setConnection(e.target.value);
        }
        
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
    //verificar
    if(province !== null && users !== null && location !== null){
        
        for (let index = 0; index < users.length; index++) {
            const usersObj = users[index];

            var namePro = province.filter(function(pro) {
                return pro._id === usersObj.provinceId;
            });

            var nameLoc = location.filter(function(loc) {
                return loc._id === usersObj.locationId;
            });
        if (namePro[0] == null || nameLoc[0] == null){
            users[index].nameProvince = '-';

            users[index].nameLocation = '-';
            }else{
            users[index].nameProvince = namePro[0].name;

            users[index].nameLocation = nameLoc[0].name;
            }
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
   

    const askDelete = (nameComplete, EmailToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setEmail(EmailToDelete)
        modalAdmin();
    }

    const [reason, setReason] = useState("");

    const addReason = (e) => {
        setReason(e.target.value);
    }
    //pregunta si quiere volver a reactivar al RRHH
    const [showReactive, setReactiveShow] = useState(false);

    const modalReactive = () => {
        if(showReactive){
            setReactiveShow(false);
        }else{
            setReactiveShow(true);
        }
    }
    
    const askReactive = (nameComplete, EmailToDelete) => {
        setComplete(nameComplete)
        setEmail(EmailToDelete)
        modalReactive();
    }
    

    useEffect(() => {
        getAllUsers();        
        getAllProvince();
        getAllLocation();
    }, [getAllUsers, getAllProvince, getAllLocation]);

    const reactiveUser = (email) => {
        reactiveUserByEmail(email);
        modalReactive();
    }

    const deleteUser = (email) => {
        deleteUserByEmail(email,reason);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(users !== null){

        // si no hay usuarios crea un aviso de que no hay usuarios        
        if (users.length === 0){
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Usuarios</b></center></li>)
        }

        // hay usuarios, proceso de tratamiento
        var usersFilter = users;
        var whithItems = true;

        if(statusFilter !== ""){
            var usersFilter =  users.filter(function(usr) {
                return usr.status === statusFilter;
            });
        }
        
        if(provinceFilterId !== ""){
            usersFilter =  usersFilter.filter(function(usr) {
                return usr.provinceId === provinceFilterId;
            });
        }

        if(locationFilterId !== ""){
            usersFilter =  usersFilter.filter(function(usr) {
                return usr.locationId === locationFilterId;
            });
        }

        if(statusConnection !== ""){
            usersFilter =  users.filter(function(usr) {
                return usr.last_connection === statusConnection;
            });
        }

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentUsers = usersFilter.slice(indexOfFirstTodo, indexOfLastTodo);
        var listUsers = currentUsers.map((us) =>
            <tr key={us._id}>
                <td className="hide-sm">{us.surname}, {us.name}</td>
                <td className="hide-sm">{us.email}</td>
                <td className="hide-sm">{us.nameProvince}</td>
                <td className="hide-sm">{us.nameLocation}</td>                
                <td className="hide-sm">
                    {us.status === "ACTIVO" ? <React.Fragment><Moment format="DD/MM/YYYY">{us.history.slice(-1)[0].dateUp}</Moment> - ACTUAL</React.Fragment>:
                         <React.Fragment>
                            <Moment format="DD/MM/YYYY">{us.history.slice(-1)[0].dateUp}</Moment> - <Moment format="DD/MM/YYYY">{us.history.slice(-1)[0].dateDown}</Moment>
                         </React.Fragment>
                    }
                </td>
                <td className="hide-sm">
                    {us.last_connection !== undefined ?
                         <React.Fragment>
                            <Moment format="DD/MM/YYYY HH:mm">{us.last_connection}</Moment>
                         </React.Fragment>
                    :"Sin Ingresar"}
                </td>
                <td className="hide-sm">

                    <Link to={`/admin-user/user-detail/${us._id}`} className="btn btn-success my-1" title="Información">
                        <i className="fas fa-info-circle"></i>
                    </Link>

                    {us.status === "ACTIVO" ? <Link to={`/admin-user/edit-user/${us._id}`} className="btn btn-primary my-1" title="Editar">
                                                <i className="far fa-edit"></i>
                                               </Link>
                                               : ""
                    }

                    {us.status === "ACTIVO" ? <a onClick={e => askDelete(us.name + " " + us.surname, us.email)} className="btn btn-danger my-1" title="Eliminar">
                                                <i className="far fa-trash-alt coloWhite"></i>
                                            </a> : 
                                            <a onClick={e => askReactive(us.name + " " + us.surname, us.email)} className="btn btn-warning my-1" title="Reactivar">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }

                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(usersFilter.length / todosPerPage); i++) {
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
                <Modal.Title>Eliminar RRHH</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el RRHH:<b> {nameComplete}</b>?
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
                <Link  onClick={e => deleteUser(emailDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );

    const modalReactiveHtml = (
        <Modal show={showReactive} onHide={e => modalReactive()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar RRHH</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                ¿Estás seguro de reactivar el RRHH: <b>{nameComplete}</b>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                 <Link onClick={e => reactiveUser(emailDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalReactive()}>
                Cerrar
                </Button>

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

                    <Link to="/admin-user/create-user"  className="btn btn-primary my-1">
                        Nuevo RRHH
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
            

            <h2 className="my-2">Administración de RRHH</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Apellidos y Nombres</th>
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
                    <th className="hide-sm headTable">
                    <select name="status" className="form-control" onChange = {e => modifyStatusConnection(e)}>
                            <option value="">TODAS LAS CONEXIONES</option>
                            <option value="undefined">SIN CONECTARSE</option>
                        </select>
                    </th>
                    
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listUsers}</tbody>                
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

AdminUser.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    deleteUserByEmail: PropTypes.func.isRequired,
    reactiveUserByEmail: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
    province: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    users: state.users,
    province: state.province,
    location: state.location
})

export default connect(mapStateToProps, {getAllUsers, deleteUserByEmail, reactiveUserByEmail,getAllProvince, getAllLocation})(AdminUser);
