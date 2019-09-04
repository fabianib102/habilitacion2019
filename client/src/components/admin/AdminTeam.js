import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, Tab, Form } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllTeam, getTeamUser, deleteUserTeam, reactiveUserTeam, addUserTeam, deleteTeam } from '../../actions/team';
import { getAllUsersActive} from '../../actions/user';

const AdminTeam = ({getAllTeam, getAllUsersActive, deleteTeam, getTeamUser, team: {team}, userActive: {userActive}, userTeam: {userTeam}, deleteUserTeam, reactiveUserTeam, addUserTeam}) => {

    useEffect(() => {
        getAllTeam();
        getAllUsersActive();
        getTeamUser();
    }, [getAllTeam, getAllUsersActive, getTeamUser]);

    const [idTeamSelected, setIdTeam] = useState("");

    const [itemIndex, setIndex] = useState(0);

    const [nameTeam, setNameTeam] = useState("");

    const [idTeamAdd, setIdTeamAdd] = useState("");

    const [idUserAdd, setIdUserAdd] = useState("");


    const [idTeamDelete, setItemDelete] = useState("");


    if(team != null){

        var listTeam = team.map((te, item) =>

            <li key={te._id} onClick={e => saveIdTeam(te._id, item, te.name)} className={item == itemIndex ? "itemTeam list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
                {te.name}

                <div className="float-right">

                    <Link to={`/admin-team/edit-team/${te._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    {   te.status === "ACTIVO" ? 

                        <a onClick={e => callModalDeleteTeam(te._id)} className="btn btn-danger" title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                        :
                        <a className="btn btn-warning" title="Reactivar">
                            <i className="fas fa-arrow-alt-circle-up"></i>
                        </a>
                    }
                    
                </div>

            </li>
        );
    }

    if(userActive !== null && userTeam !== null && team != null){

        var listAddTeamUser = []

        let idCompareTeam = team[0]._id;

        if(idTeamSelected !== ""){
            idCompareTeam = idTeamSelected
        }

        var listUserTeam = userTeam.filter(function(usr) {
            return usr.idTeam == idCompareTeam
        });

        for (let index = 0; index < userActive.length; index++) {

            const element = userActive[index];
            
            let indexFind = listUserTeam.findIndex(x => x.idUser === element._id);

            if(indexFind == -1){

                listAddTeamUser.push(element);
            }
        }

        //setArrayFilter(listAddTeamUser)

        var listUser = listAddTeamUser.map((te, item) =>
            <li key={te._id} className=" list-group-item-action list-group-item groupUser">
                {te.surname} {te.name}

                <div className="float-right">

                    <a className="btn btn-success" title="Añadir" onClick={e => callModalAddUser(te.surname + " " + te.name, idCompareTeam, te._id)}>
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>

                </div>

            </li>
        );

        var listUserSelect = (

            <div className="card">
                <div className="card-body bodyPerson">
                    {listUser}
                </div>
            </div>
        )   
        
    }

    const callModalAddUser = (namePass, idTeamPass, idUserPass) => {
        setNameUser(namePass);
        setIdTeamAdd(idTeamPass);
        setIdUserAdd(idUserPass);
        modalTeam();
    }

    const addUser = () => {
        addUserTeam(idTeamAdd, idUserAdd);
        getAllUsersActive();
        modalTeam();
    }

    if(userTeam !== null && userActive !== null && team !== null){

        let idCompareTeam = team[0]._id;

        if(idTeamSelected !== ""){
            idCompareTeam = idTeamSelected
        }

        var test = userTeam.filter(function(usr) {
            return usr.idTeam == idCompareTeam
        });

        var arrayTemp = [];
        for (let index = 0; index < test.length; index++) {

            var element = test[index];
            
            let userResg =  userActive.filter(function(usr) {
                return element.idUser == usr._id;
            });

            if(userResg[0] !== undefined){

                let indexFind = arrayTemp.findIndex(x => x._id === userResg[0]._id);

                if(indexFind > -1){

                    if(arrayTemp[indexFind].statusTeam === 'INACTIVO'){

                        arrayTemp[indexFind].statusTeam = element.status;
                        arrayTemp[indexFind].fechaAlta = element.dateStart;
                        arrayTemp[indexFind].fechaBaja = element.dateDown;
                    }

                }else{

                    userResg[0].statusTeam = element.status;
                    userResg[0].fechaAlta = element.dateStart;
                    userResg[0].fechaBaja = element.dateDown;
                    arrayTemp.push(userResg[0]);

                }

                
            }

        }

        var listUserTeam = arrayTemp.map((te) =>

            <tr key={te._id}>

                <td><a href="#">{te.surname} {te.name}</a></td>

                <td className="hide-sm"><Moment format="DD/MM/YYYY">{moment.utc(te.fechaAlta)}</Moment></td>

                <td className="hide-sm">{te.statusTeam === "ACTIVO" ?  " - " : <Moment format="DD/MM/YYYY">{moment.utc(te.fechaBaja)}</Moment>}</td>

                <td className="hide-sm centerBtn">
                    
                    {   te.statusTeam === "ACTIVO" ? 

                        <a onClick={e => callModalUserDelete(te.surname+" "+te.name,te._id)} className="btn btn-danger" title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                        :
                        <a onClick={e => callModalUserReactive(te.surname+" "+te.name,te._id)} className="btn btn-warning" title="Reactivar">
                            <i className="fas fa-arrow-alt-circle-up"></i>
                        </a>

                    }

                </td>

            </tr>
        );

    }

    const saveIdTeam = (idSelecTeam, itemPass, namePass) => {

        if(namePass == "" || nameTeam == ""){
            setNameTeam(team[0].name)
        }else{
            setNameTeam(namePass)
        }
        setIndex(itemPass);
        setIdTeam(idSelecTeam);
    }

    const [showModalDelete, setShowModal] = useState(false);

    const [nameUser, setNameUser] = useState("");

    const [idUserDelete, setIdUserDelete] = useState("");

    const callModalUserDelete = (nameComplete, idUser) => {
        setNameUser(nameComplete);
        setIdUserDelete(idUser);

        if(idTeamSelected === ""){
            setIdTeam(team[0]._id);
        }

        deleteModalUser();
    }

    const deleteModalUser = () => {
        if(showModalDelete){
            setShowModal(false);
        }else{
            setShowModal(true);
        }
    }

    const deleteUserTeamById = (idDeleteUser) => {

        let idTeam = idTeamSelected;
        let idUser = idDeleteUser;

        deleteUserTeam(idTeam, idUser);
        deleteModalUser();
    }

    //#region modal user delete

    const modalUser = (
        <Modal show={showModalDelete} onHide={e => deleteModalUser()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Recurso del equipo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    Estas seguro de eliminar el recurso {nameUser}, del equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => deleteModalUser()}>
                    Cerrar
                </Button>
                <a  className="btn btn-primary" onClick={e => deleteUserTeamById(idUserDelete)}>
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    //#region 
    var bodyTeam = (
        <div className="card-body bodyTeam">
            <ul className="list-group">
                {listTeam}
            </ul>
        </div>
    )
    //#endregion

    //#region pestaña de los integrantes
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
                        {listUserTeam}
                    </tbody>
                </table>

            </div>
        </div>
    );
    //#endregion


    //lugar para reactivar
    const [showModalReactive, setShowModalReactive] = useState(false);

    const callModalUserReactive = (nameComplete, idUser) => {
        setNameUser(nameComplete);
        setIdUserDelete(idUser);

        if(idTeamSelected === ""){
            setIdTeam(team[0]._id);
        }

        reactiveModalUser();
    }

    const reactiveModalUser = () => {
        if(showModalReactive){
            setShowModalReactive(false);
        }else{
            setShowModalReactive(true);
        }
    }

    const reactiveUserTeamById = (idReactiveUser) => {

        let idTeam = idTeamSelected;
        let idUser = idReactiveUser;

        reactiveUserTeam(idTeam, idUser);
        reactiveModalUser();
    }

    //#region modal user reactive

    const modalUserReactive = (
        <Modal show={showModalReactive} onHide={e => reactiveModalUser()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar Recurso del equipo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    Estas seguro de reactivar el recurso {nameUser}, al equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => reactiveModalUser()}>
                    Cerrar
                </Button>
                <a onClick={e => reactiveUserTeamById(idUserDelete)} className="btn btn-primary" >
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    const [showModalTeam, setShowModalTeam] = useState(false);

    const modalTeam = () => {
        if(showModalTeam){
            setShowModalTeam(false);
        }else{
            setShowModalTeam(true);
        }
    }

    //#region modal para seleccionar mas rrhh

    const modalSelectUser = (
        <Modal show={showModalTeam} onHide={e => modalTeam()}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccionación de RRHH </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    Estas seguro de agregar el recurso {nameUser}, al equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalTeam()}>
                    Cerrar
                </Button>
                <a className="btn btn-primary" onClick={e => addUser()}>
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );

    //#endregion

    //#region para dar de baja el equipo

    const [showModalDeleteTeam, setModalTeam] = useState(false);

    const callModalDeleteTeam = (idTeamPass) => {
        setItemDelete(idTeamPass);
        modalTeamDelete();
    }


    const modalTeamDelete = () => {
        if(showModalDeleteTeam){
            setModalTeam(false);
        }else{
            setModalTeam(true);
        }
    }


    const deleteTeamById = () => {
        deleteTeam(idTeamDelete);
        modalTeamDelete();
    }


    const modalDeleteTeam = (
        <Modal show={showModalDeleteTeam} onHide={e => modalTeamDelete()}>
            <Modal.Header closeButton>
                <Modal.Title>Dar de baja el equipo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    Estas seguro de dar de baja al equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalTeamDelete()}>
                    Cerrar
                </Button>
                <a onClick={e => deleteTeamById()} className="btn btn-primary" >
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
                    <Link to="/admin" className="btn btn-secondary">
                        Atrás
                    </Link>

                    <Link to="/admin-team/create-team"  className="btn btn-primary my-1">
                        Nuevo Equipo
                    </Link>
                </div>
            </div>

            <h2 className="my-2">Administración de Equipos</h2>
            <div className="row">

                <div className="col-sm-12 col-lg-5">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Lista de Equipos</strong>
                        </div>

                        {bodyTeam}

                    </div>

                </div>

                <div className="col-sm-12 col-lg-7">

                    <div className="card">

                        <div className="card-header">

                            <i className="fas fa-info-circle"></i>
                            <strong> Información del Equipo </strong>

                            {/* <div className="float-right">
                                <a className="btn btn-success" onClick={e => modalTeam()}>
                                    <i className="fas fa-plus-circle coloWhite" title="Añadir Integrante"></i>
                                </a>
                            </div> */}

                        </div>

                        <div className="card-body">

                            <Tabs defaultActiveKey="team" id="uncontrolled-tab-example">

                                <Tab eventKey="team" title="Integrantes del equipo">
                                    {htmlTabMember}
                                </Tab>
                
                                <Tab eventKey="data" title="Agregar mas integrantes">
                                    {listUserSelect}
                                </Tab>

                            </Tabs>

                        </div>


                    </div>

                </div>

            </div>

            {modalUser}

            {modalUserReactive}

            {modalSelectUser}

            {modalDeleteTeam}
            
        </Fragment>

    )
}

AdminTeam.propTypes = {
    getAllTeam: PropTypes.func.isRequired,
    getAllUsersActive: PropTypes.func.isRequired,
    getTeamUser: PropTypes.func.isRequired,
    userActive: PropTypes.object.isRequired,
    userTeam: PropTypes.object.isRequired,
    deleteUserTeam: PropTypes.func.isRequired,
    reactiveUserTeam: PropTypes.func.isRequired,
    addUserTeam: PropTypes.func.isRequired,
    deleteTeam: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    team: state.team,
    userActive: state.userActive,
    userTeam: state.userTeam,
})

export default connect(mapStateToProps, {getAllTeam, getAllUsersActive, getTeamUser, deleteTeam, deleteUserTeam, reactiveUserTeam, addUserTeam})(AdminTeam)
