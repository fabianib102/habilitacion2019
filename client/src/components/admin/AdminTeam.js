import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, Tab, Card } from 'react-bootstrap';

import Moment from 'react-moment';
import moment from 'moment';

import { getAllTeam, getTeamUser, deleteUserTeam, reactiveUserTeam } from '../../actions/team';
import { getAllUsers} from '../../actions/user';

const AdminTeam = ({getAllTeam, getAllUsers, getTeamUser, team: {team}, users: {users}, userTeam: {userTeam}, deleteUserTeam, reactiveUserTeam}) => {

    useEffect(() => {
        getAllTeam();
        getAllUsers();
        getTeamUser();
    }, [getAllTeam, getAllUsers, getTeamUser]);

    const [idTeamSelected, setIdTeam] = useState("");

    const [itemIndex, setIndex] = useState(0);

    if(team != null){

        var listTeam = team.map((te, item) =>

            <li key={te._id} className={item == itemIndex ? "itemTeam list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
                {te.name}

                <div className="float-right">

                    <Link to={`/admin-team/edit-team/${te._id}`} className="btn btn-success" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a className="btn btn-danger">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>

                    <a onClick={e => saveIdTeam(te._id, item)} className="btn btn-primary">
                        <i className="fas fa-arrow-circle-right coloWhite"></i>
                    </a>
                    
                </div>

            </li>
        );
    }

    if(users !== null){

        var listUser = users.map((te) =>
            <li key={te._id} className=" list-group-item-action list-group-item">
                {te.surname} {te.name}
            </li>
        );
        
    }

    if(userTeam !== null && users !== null && team !== null){

        let idCompareTeam = team[0]._id;

        if(idTeamSelected !== ""){
            idCompareTeam = idTeamSelected
        }

        var test = userTeam;
        var arrayTemp = [];
        for (let index = 0; index < test.length; index++) {

            var element = test[index];
            
            let userTeam =  users.filter(function(usr) {
                return element.idUser == usr._id && idCompareTeam === element.idTeam;
            });

            if(userTeam[0] !== undefined){

                userTeam[0].statusTeam = element.status;
                userTeam[0].fechaAlta = element.dateStart;
                userTeam[0].fechaBaja = element.dateDown;

                arrayTemp.push(userTeam[0]);
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
                            <i className="far fa-trash-alt"></i>
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

    const saveIdTeam = (idSelecTeam, itemPass) => {
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

    //#region modal para seleccionar los

    const modalSelectUser = (
        <Modal show={showModalTeam} onHide={e => modalTeam()}>
            <Modal.Header closeButton>
                <Modal.Title>Seleccionar RRHH para agregar al equipo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
            <div className="card">

                <div className="card-header">
                    <i className="fa fa-align-justify"></i>
                    <strong> Lista de Equipos</strong>
                </div>

            </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">
                    Cerrar
                </Button>
                <a className="btn btn-primary" >
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
                            <strong> Detalles </strong>

                            <div className="float-right">
                                <a className="btn btn-success" onClick={e => modalTeam()}>
                                    <i className="fas fa-plus-circle coloWhite"></i>
                                </a>
                            </div>

                        </div>

                        <div className="card-body">

                            <Tabs defaultActiveKey="team" id="uncontrolled-tab-example">

                                <Tab eventKey="team" title="Integrantes del equipo">
                                    {htmlTabMember}
                                </Tab>
                
                                {/* <Tab eventKey="data" title="Proyectos asociados">
                                    <div className="tab-pane">Información de proyectos</div>
                                </Tab> */}

                            </Tabs>

                        </div>


                    </div>

                </div>

            </div>

            {modalUser}

            {modalUserReactive}

            {modalSelectUser}
            
        </Fragment>

    )
}

AdminTeam.propTypes = {
    getAllTeam: PropTypes.func.isRequired,
    getAllUsers: PropTypes.func.isRequired,
    getTeamUser: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    userTeam: PropTypes.object.isRequired,
    deleteUserTeam: PropTypes.func.isRequired,

    reactiveUserTeam: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    team: state.team,
    users: state.users,
    userTeam: state.userTeam,
})

export default connect(mapStateToProps, {getAllTeam, getAllUsers, getTeamUser, deleteUserTeam, reactiveUserTeam})(AdminTeam)
