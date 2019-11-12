import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';

import { getAllTeam, getTeamUser} from '../../actions/team';
import { getAllLocation } from '../../actions/location';

const TeamMemberDetail = ({match, getAllTeam, getTeamUser,  team: {team}, userTeam: {userTeam},getAllLocation, location:{location}, auth : {user},users: {users}}) => {

    useEffect(() => {
        getAllTeam();
        getTeamUser();
        getAllLocation();
    }, [getAllTeam, getTeamUser, getAllLocation]);

    const id = match.params.idUser;

    if(users !== null && location !== null){
        for (let index = 0; index < location.length; index++) {
            if(location[index]._id == "5d44ccd9ab0a8d1b041039d2"){
            var localidad = (<Card.Title><b>Localidad: </b>{id}</Card.Title>);
            }
        }
    }
    

    //var localidad = (<Card.Title><b>Localidad: </b> {user && user.locationId}</Card.Title>)

    

    if(userTeam !== null && user !== null){
        
        var arrayTeamsActive = [];

        for (let index = 0; index < userTeam.length; index++) {           

            if((userTeam[index].idUser == match.params.idUser) && userTeam[index].status == "ACTIVO"){

                let teamsActive =  team.filter(function(t) {
                return userTeam[index].idTeam == t._id && t.status == "ACTIVO";
                });

            if(teamsActive[0] !== undefined &&  !arrayTeamsActive.includes(teamsActive[0])){
                arrayTeamsActive.push(teamsActive[0]);
                };  

            };            

        
        };

        // armando listado de equipos activos para el usuario        
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
                    );
            }
            else{
            //sin equipos
                var listTeamActive = (<li className='itemTeam list-group-item-action list-group-item'><b>No se encuentra asociado a ningún Equipo</b></li>);
                var itemsActive = false   
            }
    }

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
    
    return (

        <Fragment>

            <Link to="/proyect-manager" className="btn btn-secondary">
                Atrás
            </Link>

            <h4 className="my-2">Información Personal de {user && user.name} {user && user.surname}</h4>
            
            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">
                <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Datos Personales</h5>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">                                        
                                        <Card.Title><b>Identificador(Leg.): </b>{user && user.identifier}</Card.Title>
                                        <Card.Title><b>Apellido: </b> {user && user.surname} </Card.Title>
                                        <Card.Title><b>Nombre: </b> {user && user.name}</Card.Title>
                                        <Card.Title><b>CUIL: </b> {user && user.cuil}</Card.Title>
                                        <Card.Title><b>Nacimiento:</b> <Moment format="DD/MM/YYYY">{moment.utc(user && user.birth)}</Moment></Card.Title>
                                    </div>
                                    <div className="col-lg-6">
                                        <Card.Title><b>Provincia: </b> {user && user.province}</Card.Title>
                                        {localidad}
                                        <Card.Title><b>Dirección: </b> {user && user.address}</Card.Title>
                                        <Card.Title><b>Teléfono: </b> {user && user.phone}</Card.Title>
                                        <Card.Title><b>Email: </b> {user && user.email}</Card.Title>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Tab>

                <Tab eventKey="team" title="Equipos">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Equipos en que Participa</h5>
                                    </div>

                                    {bodyTeamActive}

                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                
                <Tab eventKey="project" title="Proyectos">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Proyectos en que Participa</h5>
                                    </div>

                                    <div className="card-body bodyTeam">
                                        <table className="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th className="hide-sm headTable">Nombre</th>
                                                    <th className="hide-sm headTable">Inicio</th>
                                                    <th className="hide-sm headTable centerBtn">Opciones</th>
                                                </tr>
                                                </thead>
                                               <tbody></tbody>
                                                
                                        </table>  
                                        <ul className="list-group">
                                            <li key='0' className='itemTeam list-group-item-action list-group-item'><b>No se encuentra asociado a ningún Proyecto</b></li>                
                                        </ul>                                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                
            </Tabs>
        </Fragment>
    )
}

//admin-user/edit-user/match.params.idUser

TeamMemberDetail.propTypes = {
    getAllTeam: PropTypes.func.isRequired,
    getTeamUser: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    userTeam: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    team: state.team,
    users: state.users,
    userTeam: state.userTeam,
    location: state.location,
    auth: state.auth
})

export default connect(mapStateToProps,{getAllTeam,getTeamUser,getAllLocation})(TeamMemberDetail)