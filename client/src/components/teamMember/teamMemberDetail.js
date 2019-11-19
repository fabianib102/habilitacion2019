import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';

import {getAllTeam, getTeamUser} from '../../actions/team';
import {getAllLocation} from '../../actions/location';
import {getTaskByUser}  from '../../actions/user';

const TeamMemberDetail = ({match,getAllTeam,getTeamUser, team: {team},userTeam: {userTeam}, auth : {user}, getAllLocation, location:{location}, getTaskByUser, userTask: {userTask}}) => {

    useEffect(() => {
        getAllTeam();
        getTeamUser();
        getAllLocation();
        getTaskByUser(match.params.idUser);
    },[getAllTeam, getTeamUser, getAllLocation,getTaskByUser]);
    
    var arrayTeamsActive = [];
    var arrayProyectActive = [];

    // armamos los datos de equipos y proyectos para los paneles
    if(userTeam !== null && user !== null){

        for (let index = 0; index < userTeam.length; index++) {           

            if(userTeam[index].idUser == match.params.idUser  && userTeam[index].status == "ACTIVO"){

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
                        </tr>
                    );
            }
            else{
            //sin equipos
                var listTeamActive = (<li className='itemTeam list-group-item-action list-group-item'><b>No se encuentra asociado a ningún Equipo</b></li>);
                var itemsActive = false   
            }    
    }

    //se arma el listado de proyectos activos 
    if(userTask !== null){

        for (let index = 0; index < userTask.length; index++) {           
            if(!arrayProyectActive.includes(userTask[index].nameProyect)){
                arrayProyectActive.push(userTask[index].nameProyect);
                console.log(userTask[index].nameProyect);
            }; 
        };

        // armando listado de equipos activos para el usuario        
        if (arrayProyectActive.length != 0){
            var proyectItemsActive = true;
            var listProyectHtml = arrayProyectActive.map((le) => (
                        <tr>
                            <td>{le}</td>
                            <td className="hide-sm"><Moment format="DD/MM/YYYY"></Moment></td>
                        </tr>
                    )
            );
        }
        else{
            //sin equipos
            var listProyectHtml = (<li className='itemTeam list-group-item-action list-group-item'><b>No se encuentra asociado a ningún Equipo</b></li>);
            var proyectItemsActive = false   
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
                    </tr>
                    </thead>
                    {itemsActive ? <tbody> {listTeamActive} </tbody>  : <tbody></tbody>}
                    
            </table>
            {itemsActive ? '' : listTeamActive}

        </div>
    )
    //#endregion
    
    //#region Proyectos actuales
    var bodyProyectActive = (
        <div className="card-body bodyTeam">

            <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Nombre</th>
                        <th className="hide-sm headTable">Inicio</th>
                    </tr>
                    </thead>
                    {proyectItemsActive ? <tbody> {listProyectHtml} </tbody>  : <tbody></tbody>}
                    
            </table>
            {proyectItemsActive ? '' : listProyectHtml}

        </div>
    )
    //#endregion

    //Para sacar el nombre de localidad
    var locationHtml = () =>{
        var locationName = 'Resistencia';
        return <Card.Title><b>Localidad: </b> {locationName}</Card.Title>
    }
    
    return (

        <Fragment>

            <Link to={`/team-member/${ user && user._id}`} className="btn btn-secondary">
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
                                        {locationHtml()}
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

                                    {bodyProyectActive}
                                                
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
    getTaskByUser: PropTypes.func.isRequired,
    
    userTeam: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    userTask: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    team: state.team,
    userTeam: state.userTeam,
    auth: state.auth,
    location: state.location,
    userTask: state.userTask
})

export default connect(mapStateToProps,{getAllTeam,getTeamUser,getAllLocation, getTaskByUser})(TeamMemberDetail)