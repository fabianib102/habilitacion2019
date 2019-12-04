import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import Moment from 'react-moment';
import moment from 'moment';

import { getAllTeam, getTeamUser} from '../../actions/team';

const ProjectManagerDetail = ({match,getAllTeam,getTeamUser, users: {users}, team: {team},userTeam: {userTeam}}) => {

    useEffect(() => {
        getAllTeam();
        getTeamUser()
    }, [getAllTeam, getTeamUser]);


    if(userTeam !== null && users !== null){
        var arrayTeamsActive = [];
        var arrayTeamsInactive = [];
        
        for (let index = 0; index < userTeam.length; index++) {           
           
            if(userTeam[index].idUser == match.params.idUser){

                let teamsActive =  team.filter(function(t) {
                return userTeam[index].idTeam == t._id && t.status == "ACTIVO";
                });

            if(teamsActive[0] !== undefined &&  !arrayTeamsActive.includes(teamsActive[0])){
                arrayTeamsActive.push(teamsActive[0]);
                };  
            
                let teamsInactive =  team.filter(function(t) {
                return userTeam[index].idTeam == t._id && t.status == "INACTIVO";
                });

            if(teamsInactive[0] !== undefined &&  !arrayTeamsInactive.includes(teamsInactive[0])){
                arrayTeamsInactive.push(teamsInactive[0]);
                };   
            };            

        };
    // armando listado de equipos activos para RRHH
    if (arrayTeamsActive.length !== 0){ //con equipos
        var itemsActive = true;
        var listTeamActive = arrayTeamsActive.map((te) =>
                    <tr key={te._id}>

                        <td>{te.name}</td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <Link to="" className="btn btn-success my-1" title="Información">
                                        <i className="fas fa-info-circle"></i>
                                    </Link>
                                    <Link to="" className="btn btn-dark my-1" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </Link>
                        </td>
                    </tr>
                );}
        else{ //sin equipos
            var listTeamActive = (<li className='itemTeam list-group-item-action list-group-item'><b>No se encuentra asociado a ningún Equipo</b></li>)
            var itemsActive = false;
        };
    

    // armando listado de equipos inactivos (anteriores) para RRHH
     if (arrayTeamsInactive.length !== 0){ //con equipos
        var itemsInactive = true;
        var listTeamInactive = arrayTeamsInactive.map((te) =>
                    <tr key={te._id}>

                        <td>{te.name}</td>
                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>

                        <td className="hide-sm centerBtn">
                            
                                    <Link to="" className="btn btn-success my-1" title="Información">
                                        <i className="fas fa-info-circle"></i>
                                    </Link>
                                    <Link to="" className="btn btn-dark my-1" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </Link>
                        </td>
                    </tr>
                );}
        else{ //sin equipos
            var listTeamInactive = (<li key='-1' className='itemTeam list-group-item-action list-group-item'><b>No hay registro de equipos asociados anteriormente</b></li>)
            
            var itemsInactive = false;
        };

    }

    if(users !== null){
        for (let index = 0; index < users.length; index++) {
           
            if(users[index]._id == match.params.idUser){
                
               if(users[index].status === "ACTIVO"){
                    var statusShow = (
                        <span class="badge badge-success" title="Cliente Disponible">ACTIVO</span> 
                    )
                }else{
                    var statusShow = (
                        <span class="badge badge-danger" title="Cliente NO Disponible">INACTIVO</span> 
                    )
                }
                
                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Datos Personales</h5>
                                </div>
                                <div className="float-right">
                                    <a   className="btn btn-warning hideBtn" title="Cambiar contraseña">
                                        <i class="fas fa-key"></i>
                                    </a>
                                    <a  onClick={e => callModalUserHistory(users[index]._id, users[index].name,  users[index].surname)} className="btn btn-dark" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </a> 
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">   
                                        <Card.Title><b>Estado: </b>{statusShow}</Card.Title>
                                        <Card.Title><b>Identificador(Leg.):</b> {users[index].identifier}</Card.Title>
                                        <Card.Title><b>Apellido:</b> {users[index].surname}</Card.Title>
                                        <Card.Title><b>Nombre:</b> {users[index].name}</Card.Title>
                                        <Card.Title><b>CUIL:</b> {users[index].cuil}</Card.Title>
                                        <Card.Title><b>Nacimiento:</b> <Moment format="DD/MM/YYYY">{moment.utc(users[index].birth)}</Moment></Card.Title>
                                        <Card.Title><b>Rol:</b> {users[index].rol}</Card.Title>                                                                               
                                        
                                    </div>
                                    <div className="col-lg-6">
                                        <Card.Title><b>Dirección:</b> {users[index].address}</Card.Title>
                                        <Card.Title><b>Provincia:</b> {users[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{users[index].nameLocation}</Card.Title>                                        <Card.Title><b>Teléfono:</b> {users[index].phone}</Card.Title>
                                        <Card.Title><b>Email:</b> {users[index].email}</Card.Title>
                                        
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                                  
                    <div className="form-group"></div>
                    </div>

                ); 
            }
            
        }
    }
//manejo de Historial Usuario
    const [showModalHistoryUser, setShowModalHistoryUser] = useState(false);    

    const [idUsertHistory, setIdUserHistory] = useState("");

    const [nameUserHistory, setNameUserHistory] = useState("");
    const [surnameUserHistory, setSurameUserHistory] = useState("");
    
    if(users !== null){
        var arrayUserHistory = [];
            let userHistory =  users.filter(function(t) {
                return t._id  == match.params.idUser;
            });                   
            arrayUserHistory = userHistory;
            
    if (arrayUserHistory.length !== 0){
        
        var listHistory = arrayUserHistory[0].history.map((te) =>
                    <tr>
                        <td className="hide-sm">                            
                            <Moment format="DD/MM/YYYY ">{moment.utc(te.dateUp)}</Moment>
                        </td>
                        <td className="hide-sm">
                            {te.dateDown === null || te.dateDown === undefined ? ' ACTUAL': <Moment format="DD/MM/YYYY ">{moment.utc(te.dateDown)}</Moment>}                            
                        </td>
                        <td className="hide-sm">
                            {te.reason}
                        </td>
                    </tr>
                );}        

    }

     const callModalUserHistory = (idUser,nameUserSelected, surnameUserSelected) => {
        setIdUserHistory(idUser);
        setNameUserHistory(nameUserSelected);
        setSurameUserHistory(surnameUserSelected);
        historyModalUser();
    }

    const historyModalUser = () => {
        if(showModalHistoryUser){
            setShowModalHistoryUser(false);
        }else{
            setShowModalHistoryUser(true);
        }
    }

//#region modal client history    
    const modalUser = (
        <Modal show={showModalHistoryUser} onHide={e => historyModalUser()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de <b>{surnameUserHistory},{nameUserHistory}</b></center>
            <div className="row">

                <div className="col-lg-12 col-sm-6">                    
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="hide-sm headTable centerBtn">Inicio</th>
                                <th className="hide-sm headTable centerBtn">Fin</th>
                                <th className="hide-sm headTable centerBtn">Motivo</th>
                            </tr>
                            </thead>
                           <tbody>
                                {listHistory}
                           </tbody>
                            
                    </table>  
                    
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


    //#region  equipos actuales
    var bodyTeamActive = (
        <div className="card-body bodyTeam">

            <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Nombre</th>
                        <th className="hide-sm headTable">Inicio</th>
                        <th className="hide-sm headTable centerBtn">Opciones</th>
                    </tr>
                    </thead>
                    {itemsActive ? <tbody> {listTeamActive} </tbody>  : <tbody></tbody>}
                    
            </table>
            {itemsActive ? '' : listTeamActive}
        </div>
    )
    //#endregion

    //#region  equipos anteriores
    var bodyTeamInactive = (
        <div className="card-body bodyTeam">
            <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Nombre</th>
                        <th className="hide-sm headTable">Inicio</th>
                        <th className="hide-sm headTable">Fin</th>
                        <th className="hide-sm headTable centerBtn">Opciones</th>
                    </tr>
                    </thead>     

                    {itemsInactive ? <tbody> {listTeamInactive} </tbody>  : <tbody></tbody>}
                    
            </table>
            {itemsInactive ? '' : listTeamInactive}
        </div>
    )
    //#endregion

    return (

        <Fragment>

            <Link to={`/project-manager/${match.params.idUser}`} className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Mi Información Personal</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">

                    {DetailData}

                </Tab>

                <Tab eventKey="team" title="Equipos">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Equipos en que Participo</h5>
                                    </div>

                                    {bodyTeamActive}

                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Equipos en que Participé</h5>
                                    </div>
                                        {bodyTeamInactive}

                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                
                
                
            </Tabs>
            {modalUser}
        </Fragment>

    )
}
//admin-user/edit-user/match.params.idUser
ProjectManagerDetail.propTypes = {
    users: PropTypes.object.isRequired,
    getAllTeam: PropTypes.func.isRequired,
    getTeamUser: PropTypes.func.isRequired,
    userTeam: PropTypes.object.isRequired,
    
    
}

const mapStateToProps = state => ({
    team: state.team,
    users: state.users,
    userTeam: state.userTeam,
})

export default connect(mapStateToProps,{getAllTeam,getTeamUser})(ProjectManagerDetail)
