import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';

import { getAllTeam, getTeamUser} from '../../actions/team';

const AdminUserDetail = ({match,getAllTeam,getTeamUser, users: {users}, team: {team},userTeam: {userTeam}}) => {

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
            console.log(listTeamInactive.key)
            var itemsInactive = false;
        };

    }

    if(users !== null){
        for (let index = 0; index < users.length; index++) {
           
            if(users[index]._id == match.params.idUser){
                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <h5 className="my-2">Datos Personales</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">                                        
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
                    
                    <Link to={`/admin-user/edit-user/${users[index]._id}`} className="btn btn-primary">
                        Editar Información
                    </Link>

                    </div>

                ); 
            }
            
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

            <Link to="/admin-user" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información del RRHH</h2>

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
                                         <h5 className="my-2">Equipos en que Participa</h5>
                                    </div>

                                    {bodyTeamActive}

                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Equipos en que Participó</h5>
                                    </div>
                                        {bodyTeamInactive}

                                </div>
                            </div>
                        </div>
                    </div>
                </Tab>
                
                <Tab eventKey="project" title="Proyectos">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-6">
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

                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Proyectos en que Participó</h5>
                                    </div>
                                        
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

                                                <tbody></tbody>
                                                
                                        </table>
                                       <ul className="list-group">
                                            <li key='0' className='itemTeam list-group-item-action list-group-item'><b>No estuvo asociado a ningún Proyecto</b></li>                
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
AdminUserDetail.propTypes = {
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

export default connect(mapStateToProps,{getAllTeam,getTeamUser})(AdminUserDetail)
