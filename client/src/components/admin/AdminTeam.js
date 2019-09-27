import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, Tab, Form } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllTeam, getTeamUser, deleteUserTeam, reactiveUserTeam, addUserTeam, deleteTeam, reactiveTeam } from '../../actions/team';
import { getAllUsersActive} from '../../actions/user';

const AdminTeam = ({getAllTeam, getAllUsersActive, deleteTeam, reactiveTeam,setAlert, getTeamUser, team: {team}, userActive: {userActive}, userTeam: {userTeam}, deleteUserTeam, reactiveUserTeam, addUserTeam}) => {

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

    var whithItemsInt = true;
    var whithItemsT = true;
    var whithItemsNI = true;

    if(team != null){
        // si no hay usuarios crea un aviso de que no hay usuarios        
        if (team.length === 0){
            var whithItemsT = false;
            var itemNoneT = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Equipos</b></center></li>)
        }

        var listTeam = team.map((te, item) =>

            <li key={te._id} onClick={e => saveIdTeam(te._id, item, te.name)} className={item == itemIndex ? "itemTeam list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
                <div className="float-left">
                    {te.name}
                    <td className="hide-sm">
                        {te.status === "ACTIVO" ? <React.Fragment><Moment format="DD/MM/YYYY">{te.history.slice(-1)[0].dateUp}</Moment> - ACTUAL</React.Fragment>:
                             <React.Fragment>
                                <Moment format="DD/MM/YYYY">{te.history.slice(-1)[0].dateUp}</Moment> - <Moment format="DD/MM/YYYY">{te.history.slice(-1)[0].dateDown}</Moment>
                             </React.Fragment>
                        }
                    </td>
                </div>
                <div className="float-right">

                    <Link to={`/admin-team/edit-team/${te._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    {   te.status === "ACTIVO" ? 

                        <a onClick={e => callModalDeleteTeam(te._id)} className="btn btn-danger" title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                        :
                        <a onClick={e => callModalReactiveTeam(te._id)} className="btn btn-warning" title="Reactivar">
                            <i className="fas fa-arrow-alt-circle-up"></i>
                        </a>
                    }
                    
                </div>

            </li>
        );
    }

    if(userActive !== null && userTeam !== null && team !== [] && team[0] !== undefined){
        
        
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

        if (listAddTeamUser.length === 0){
            var whithItemsNI = false;
            var itemNoneNI = (<li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Integrantes para añadir</b></center></li>)
        }

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
                    {whithItemsNI ? '' : itemNoneNI}                    
                </div>
            </div>
        )   
        
    }else{
        // si no hay usuarios crea un aviso de que no hay usuarios        
        var whithItemsInt = false;
        var itemNoneInt = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay integrantes</b></center></li>)
        var whithItemsNI = false;
        var itemNoneNI = (<li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Integrantes para añadir</b></center></li>)
     
    }

    const callModalAddUser = (namePass, idTeamPass, idUserPass) => {
        // actualizo y llamo a modal para agregar
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

    if(userTeam !== null && userActive !== null && team !== [] && team[0] !== undefined){
        
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

                <td><Link to={`/admin-user/user-detail/${te._id}`} title="Ver Datos">
                        {te.surname} {te.name}
                    </Link>
                </td>
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
                        <a onClick={e => callModalUserHistory(te._id, te.name,te.surname, idTeamSelected)} className="btn btn-dark" title="Historial de Movimientos">
                            <i className="fas fa-history coloWhite"></i>
                        </a>
                </td>

            </tr>
        );

    }else{
          // si no hay usuarios crea un aviso de que no hay usuarios        
        var whithItemsInt = false;
        var itemNoneInt = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay integrantes</b></center></li>)
       
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

    const modalUserHistory = (
        <Modal show={showModalDelete} onHide={e => deleteModalUser()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Recurso del equipo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    Estas seguro de eliminar el recurso <b>{nameUser}</b>, del equipo?
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
                {whithItemsT ? '' : itemNoneT}
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
                {whithItemsInt ? '' : itemNoneInt}
            </div>
        </div>
    );
    //#endregion

    //manejo de Historial
    const [showModalHistory, setShowModalHistory] = useState(false);

    const [idUserHistory, setIdUserHistory] = useState("");

    const [nameUserHistory, setNameUserHistory] = useState("");

    const [surnameUserHistory, setSurameUserHistory] = useState("");

    if(userTeam !== null && team !== []){
        //console.log(userTeam)
        var arrayUserHistory = [];
            let userHistory =  userTeam.filter(function(t) {
                return t.idUser  == idUserHistory && t.idTeam == idTeamSelected;
            });
            //console.log(userHistory);                    
            arrayUserHistory = userHistory;
        //console.log("->",arrayUserHistory);
    
    if (arrayUserHistory.length !== 0){ //con historial
        var listHistory = arrayUserHistory.map((te) =>

                    <li key={te._id} className="list-group-item-action list-group-item">
                        <Moment format="DD/MM/YYYY ">{moment.utc(te.dateStart)}</Moment> -
                        {te.dateDown === null ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}

                    </li>
                );}
        else{ //sin equipos
            var listTeam = (<li key='0' className='itemTeam list-group-item-action list-group-item'><b>Sin movimientos</b></li>)
        };

    }

    const callModalUserHistory = (idUser,nameUserSelected,surnameUserSelected,idTeamSelected) => {
        setIdUserHistory(idUser);
        setNameUserHistory(nameUserSelected);
        setSurameUserHistory(surnameUserSelected);

        if(idTeamSelected === ""){
            setIdTeam(team[0]._id);
            setNameTeam(team[0].name)
        }

        historyModalUser();
    }
    const historyModalUser = () => {
        if(showModalHistory){
            setShowModalHistory(false);
        }else{
            setShowModalHistory(true);
        }
    }

    //#region modal user history    
    const modalUser = (
        <Modal show={showModalHistory} onHide={e => historyModalUser()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos en <b>{nameTeam}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de <b>{surnameUserHistory} {nameUserHistory}</b></center>
            <div className="row">

                <div className="col-lg-3 col-sm-3"></div>
                <div className="col-lg-6 col-sm-6">

                    <center><b> INICIO  -  FIN </b></center>
                    {listHistory}
                    
                </div>
            </div>
            
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => historyModalUser()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );

    //#endregion



    //lugar para reactivar
    const [showModalReactive, setShowModalReactive] = useState(false);

    const callModalUserReactive = (nameComplete, idUser) => {

        if(idTeamSelected === ""){
            setIdTeam(team[0]._id);
        }
        for (let index = 0; index < team.length; index++) {
            if (idTeamSelected === team[index]._id ){
                //valido que el equipo este activo, para agregar.
                if (team[index].status === 'INACTIVO'){
                    setAlert('No puedes añadir un nuevo integrante a un equipo inactivo', 'danger');
                } else {
                    setNameUser(nameComplete);
                    setIdUserDelete(idUser);
                    reactiveModalUser();
                }
            }
        }
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
                    Estas seguro de reactivar el recurso <b>{nameUser}</b>, al equipo?
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
                    Estas seguro de agregar el recurso <b>{nameUser}</b>, al equipo?
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



    //#region para reactivar el equipo
    const [showModalReactiveTeam, setModalReactive] = useState(false);

    const callModalReactiveTeam = (idTeamPass) => {
        setItemDelete(idTeamPass);
        modalTeamReactive();
    }

    const modalTeamReactive = () => {
        if(showModalReactiveTeam){
            setModalReactive(false);
        }else{
            setModalReactive(true);
        }
    }

    const reactiveTeamById = () => {
        reactiveTeam(idTeamDelete);
        modalTeamReactive();
    }
    
    const modalReactiveTeam = (
        <Modal show={showModalReactiveTeam} onHide={e => modalTeamReactive()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar el equipo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    Estas seguro de reactivar el equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalTeamReactive()}>
                    Cerrar
                </Button>
                <a onClick={e => reactiveTeamById()} className="btn btn-primary" >
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

            {modalUserHistory}

            {modalUser}

            {modalUserReactive}

            {modalSelectUser}

            {modalDeleteTeam}

            {modalReactiveTeam}
            
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
    deleteTeam: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    reactiveTeam: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    team: state.team,
    userActive: state.userActive,
    userTeam: state.userTeam,
})

export default connect(mapStateToProps, {getAllTeam, getAllUsersActive, getTeamUser, deleteTeam, reactiveTeam,setAlert, deleteUserTeam, reactiveUserTeam, addUserTeam})(AdminTeam)
