import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';


const AdminUserDetail = ({match, users: {users}}) => {

    if(users !== null){
        for (let index = 0; index < users.length; index++) {
           
            if(users[index]._id == match.params.idUser){
                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        
                                        <Card.Title><b>Apellido:</b> {users[index].surname}</Card.Title>
                                        <Card.Title><b>Nombre:</b> {users[index].name}</Card.Title>
                                        <Card.Title><b>CUIL:</b> {users[index].cuil}</Card.Title>
                                        <Card.Title><b>Nacimiento:</b> <Moment format="DD/MM/YYYY">{moment.utc(users[index].birth)}</Moment></Card.Title>
                                        <Card.Title><b>Dirección:</b> {users[index].address}</Card.Title>
                                        
                                        
                                    </div>
                                    <div className="col-lg-6">
                                        
                                        <Card.Title><b>Provincia:</b> {users[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{users[index].nameLocation}</Card.Title>                                        <Card.Title><b>Teléfono:</b> {users[index].phone}</Card.Title>
                                        <Card.Title><b>Rol:</b> {users[index].rol}</Card.Title>
                                        <Card.Title><b>Email:</b> {users[index].email}</Card.Title>
                                        
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
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

AdminUserDetail.propTypes = {
    users: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    users: state.users
})

export default connect(mapStateToProps)(AdminUserDetail)
