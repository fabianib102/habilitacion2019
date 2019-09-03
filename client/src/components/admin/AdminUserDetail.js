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
        console.log(userTeam)
        for (let index = 0; index < userTeam.length; index++) {
           console.log(2)
            if(userTeam[index].idUser == match.params.idUser){
            //         let userTeam =  team.filter(function(t) {
            //     return userTeam[index].idTeam == t._id;
            // });
            //console.log(userTeam)
            }

        }
    }



    if(users !== null){
        for (let index = 0; index < users.length; index++) {
           
            if(users[index]._id == match.params.idUser){
                var DetailData = (

                    <div className="containerCustom">
                        <Card>
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

    return (

        <Fragment>

            <Link to="/admin-user" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos Personales">

                    {DetailData}

                </Tab>

                <Tab eventKey="team" title="Equipos Asociados">
                    Equipos asosiados al RRHH
                </Tab>
                
                <Tab eventKey="project" title="Proyectos Asociados">
                    Proyectos asociados al RRHH
                </Tab>

                
            </Tabs>
            
        </Fragment>

    )
}
//admin-user/edit-user/match.params.idUser
AdminUserDetail.propTypes = {
    users: PropTypes.object.isRequired,
    userTeam: PropTypes.object.isRequired,
    getAllTeam: PropTypes.func.isRequired,
    getTeamUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    team: state.team,
    users: state.users,
    userTeam: state.userTeam,
})

export default connect(mapStateToProps,{getAllTeam,getTeamUser})(AdminUserDetail)
