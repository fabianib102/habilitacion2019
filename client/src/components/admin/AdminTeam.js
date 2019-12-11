import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, Tab, Form, Spinner} from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import Moment from 'react-moment';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { getAllTeam, getTeamUser, deleteUserTeam, reactiveUserTeam, addUserTeam, deleteTeam, reactiveTeam } from '../../actions/team';
import { getAllUsersActive} from '../../actions/user';

const AdminTeam = ({getAllTeam, getAllUsersActive, deleteTeam, reactiveTeam,setAlert, getTeamUser, team: {team}, userActive: {userActive}, userTeam: {userTeam}, deleteUserTeam, reactiveUserTeam, addUserTeam,auth:{user}}) => {
    const [showSpinner, setShowSpinner] = useState(true);
    useEffect(() => {
        getAllTeam();
        getAllUsersActive();
        getTeamUser();
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 2500);
        }
    }, [getAllTeam, getAllUsersActive, getTeamUser, showSpinner]);

    const [idTeamSelected, setIdTeam] = useState("");

    const [itemIndex, setIndex] = useState(0);

    const [nameTeam, setNameTeam] = useState("");

    const [idTeamAdd, setIdTeamAdd] = useState("");

    const [idUserAdd, setIdUserAdd] = useState("");


    const [idTeamDelete, setItemDelete] = useState("");
    
    const [reason, setReason] = useState("");

    const addReason = (e) => {
        setReason(e.target.value);
    }

    const [reasonInt, setReasonInt] = useState("");

    const addReasonInt = (e) => {
        setReasonInt(e.target.value);
    }

    var whithItemsT = true;
    var whithItemsNI = true;
    
    //Hooks Spinner
    
    //const [showSpinner, setShowSpinner] = useState(true);
    
    const spin = () => setShowSpinner(!showSpinner);
    
    class Box extends Component{
        render(){
            return(
                <li className='itemTeam list-group-item-action list-group-item'>
                    <center>
                        <h5>Cargando...
                            <Spinner animation="border" role="status" variant="primary" >
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </h5>
                    </center>
                    </li>
            )
        }
    }

    if(team != null){
        // si no hay usuarios crea un aviso de que no hay usuarios        
        if (team.length === 0){
            var whithItemsT = false;
            var itemNoneT = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Equipos</b></center></li>)
        }else{
        var listTeam = team.map((te, item) =>

            <li key={te._id} onClick={e => saveIdTeam(te._id, item, te.name)} className={item == itemIndex ? "itemTeam list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
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
    }

    if(userActive !== null && userTeam !== null && team !== [] && team[0] !== undefined){
        
        
        var listAddTeamUser = []

        let idCompareTeam = team[0]._id;

        if(idTeamSelected !== ""){
            idCompareTeam = idTeamSelected
        }

        var listUserTeam = userTeam.filter(function(usr) {
            return usr.idTeam === idCompareTeam
        });

        for (let index = 0; index < userActive.length; index++) {

            const element = userActive[index];
            
            let indexFind = listUserTeam.findIndex(x => x.idUser === element._id);

            if(indexFind === -1){

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
            return usr.idTeam === idCompareTeam
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

        var len = arrayTemp.length;      

    }
    // }
 const options = {
            //--------- PAGINACION ---------
            page: 1, 
            sizePerPageList: [ {
              text: '5', value: 5
            }, {
              text: '10', value: 10
            }, 
            {
              text: 'Todos', value: len
            } 
        ], 
            sizePerPage: 5, 
            pageStartIndex: 1, 
            paginationSize: 3, 
            prePage: '<',
            nextPage: '>', 
            firstPage: '<<', 
            lastPage: '>>', 
            prePageTitle: 'Ir al Anterior', 
            nextPageTitle: 'Ir al Siguiente',
            firstPageTitle: 'ir al Primero', 
            lastPageTitle: 'Ir al último',
            paginationPosition: 'bottom',
            // --------ORDENAMIENTO--------
            defaultSortName: 'name',  
            defaultSortOrder: 'asc',  //desc
            // ------- TITULO BOTONES ------
            // exportCSVText: 'Exportar en .CSV',
            //------------ BUSQUEDAS ------
            noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron coincidencias</b></center></li>)
          };

    function dateUpFormmatter(cell, row){
        return (<Fragment> 
            <Moment format="DD/MM/YYYY">{moment.utc(row.fechaAlta)}</Moment>
                </Fragment>
                )
        }

    function dateDownFormmatter(cell, row){
        return (<Fragment> 
               {row.statusTeam === "ACTIVO" ?  " - " : <Moment format="DD/MM/YYYY">{moment.utc(row.fechaBaja)}</Moment>}
                </Fragment>
                )
        }

    function buttonFormatter(cell, row){
        return (<Fragment> 
           {   row.statusTeam === "ACTIVO" ? 

                <a onClick={e => callModalUserDelete(row.surname+" "+row.name,row._id)} className="btn btn-danger" title="Eliminar">
                    <i className="far fa-trash-alt coloWhite"></i>
                </a>
                :
                <a onClick={e => callModalUserReactive(row.surname+" "+row.name,row._id)} className="btn btn-warning" title="Reactivar">
                    <i className="fas fa-arrow-alt-circle-up"></i>
                </a>

                }
                <a onClick={e => callModalUserHistory(row._id, row.name,row.surname, idTeamSelected)} className="btn btn-dark" title="Historial de Movimientos">
                    <i className="fas fa-history coloWhite"></i>
                </a>
            </Fragment>
            )
    }

    const saveIdTeam = (idSelecTeam, itemPass, namePass) => {

        if(namePass === "" || nameTeam === ""){
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

        deleteUserTeam(idTeam, idUser, reasonInt);
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
                    ¿Estás seguro de eliminar el recurso <b>{nameUser}</b>, del equipo?
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label class="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div class="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de baja" 
                                name="reasonInt"
                                minLength="3"
                                maxLength="150"
                                onChange = {e => addReasonInt(e)}
                            />
                        </div>
                    </div>
                </form>


            </Modal.Body>
            <Modal.Footer>
                <Link  className="btn btn-primary" onClick={e => deleteUserTeamById(idUserDelete)}>
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => deleteModalUser()}>
                    Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );

    //#endregion

    //#region 
    var bodyTeam = (
        <div className="card-body bodyTeam">
            <ul className="list-group">
                {listTeam}
                {whithItemsT ? spin: ""}
                {showSpinner && <Box/>}
                {whithItemsT ? '' : itemNoneT}
            </ul>
        </div>
    )
    //#endregion

    //#region pestaña de los integrantes
    var htmlTabMember = (
        <div className="card">
            <div className="card-body bodyPerson">
        
                 {userTeam !== null ?
                <BootstrapTable data={ arrayTemp }  pagination={ true } options={ options }  exportCSV={ false }>
                    <TableHeaderColumn dataField='name' isKey dataSort  width='40%' filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre del integrante'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>
                    <TableHeaderColumn dataField='fechaAlta'  dataSort dataFormat={dateUpFormmatter}  csvHeader='Fecha Alta'>Fecha Alta</TableHeaderColumn>
                    <TableHeaderColumn dataField='fechaBaja'  dataSort  dataFormat={dateDownFormmatter} csvHeader='Fecha Baja'>Fecha Baja</TableHeaderColumn>
                    <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='17%' export={ false } >Opciones <br/></TableHeaderColumn>
                </BootstrapTable>
                :""}
                {showSpinner && <Box/>}
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
        var arrayUserHistory = [];
            let userHistory =  userTeam.filter(function(t) {
                return t.idUser  === idUserHistory && t.idTeam == idTeamSelected;
            });                   
            arrayUserHistory = userHistory;
    
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
                    ¿Estás seguro de reactivar el recurso <b>{nameUser}</b>, al equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => reactiveUserTeamById(idUserDelete)} className="btn btn-primary" >
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => reactiveModalUser()}>
                    Cerrar
                </Button>

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
                    ¿Estás seguro de agregar el recurso <b>{nameUser}</b>, al equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Link className="btn btn-primary" onClick={e => addUser()}>
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => modalTeam()}>
                    Cerrar
                </Button>

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
        deleteTeam(idTeamDelete, reason);
        modalTeamDelete();
    }


    const modalDeleteTeam = (
        <Modal show={showModalDeleteTeam} onHide={e => modalTeamDelete()}>
            <Modal.Header closeButton>
                <Modal.Title>Dar de baja el equipo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estás seguro de dar de baja al equipo?
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
                <Link onClick={e => deleteTeamById()} className="btn btn-primary" >
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => modalTeamDelete()}>
                    Cerrar
                </Button>

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
                    ¿Estás seguro de reactivar el equipo?
                </p>

            </Modal.Body>
            <Modal.Footer>
            <Link onClick={e => reactiveTeamById()} className="btn btn-primary" >
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => modalTeamReactive()}>
                    Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );

    //#endregion

    return (

        <Fragment>
            
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                {user ? 
                user.rol === "Administrador General de Sistema" ?
                    <Link to="/admin" className="btn btn-secondary">
                        Atrás
                    </Link>
                    :
                    <Link to={`/project-manager/${user._id}`} className="btn btn-secondary">
                        Atrás
                    </Link>
                    :""}
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
                            
                        </div>

                        <div className="card-body">

                            <Tabs defaultActiveKey="team" id="uncontrolled-tab-example">

                                <Tab eventKey="team" title="Integrantes del equipo">
                                    {htmlTabMember}
                                </Tab>
                
                                <Tab eventKey="data" title="Agregar más integrantes">
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
    reactiveTeam: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    team: state.team,
    userActive: state.userActive,
    userTeam: state.userTeam,
    auth: state.auth,
})

export default connect(mapStateToProps, {getAllTeam, getAllUsersActive, getTeamUser, deleteTeam, reactiveTeam,setAlert, deleteUserTeam, reactiveUserTeam, addUserTeam})(AdminTeam)
