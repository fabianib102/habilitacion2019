import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Moment from 'react-moment';
import moment from 'moment';

const AdminAgentDetail = ({match, agent: {agent}}) => {

    if(agent !== null){

        for (let index = 0; index < agent.length; index++) {
            
            if(agent[index]._id == match.params.idAgent){

                //if(agent[index].status === "INACTIVO"){
                //    var dateShow = (
                //        <Card.Title><b>Fecha de baja: </b><Moment format="DD/MM/YYYY">{moment.utc(agent[index].dateDischarged)}</Moment></Card.Title> 
                //    )
                //}

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <h5 className="my-2">Datos Personales</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        
                                        <Card.Title><b>Nombres: </b>{agent[index].name}</Card.Title>
                                        <Card.Title><b>Apellidos: </b>{agent[index].surname}</Card.Title>
                                        <Card.Title><b>CUIL: </b>{agent[index].cuil}</Card.Title>                                        
                                        <Card.Title><b>Dirección: </b>{agent[index].address}</Card.Title>

                                       {/* {agent[index].status === "INACTIVO" ? dateShow : ""} */}
                                        
                                    </div>
                                    <div className="col-lg-6">
                                    
                                        <Card.Title><b>Telefóno: </b>{agent[index].phone}</Card.Title>
                                        <Card.Title><b>Email: </b>{agent[index].email}</Card.Title>
                                        <Card.Title><b>Provincia: </b>{agent[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{agent[index].nameLocation}</Card.Title>
                                        
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <div className="form-group"></div>
                        
                        <Link to={`/admin-agent/edit-agent/${agent[index]._id}`} className="btn btn-primary">
                            Editar Información
                        </Link>

                    </div>
            
                ); 
            }
            
        }
    }

    return (
        <Fragment>

            <Link to="/admin-agent" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información del Representante</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">
                    {DetailData}
                </Tab>

                <Tab eventKey="team" title="Clientes">
                   <div className="containerCustom">
                        <div className="row">
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Clientes que Representa</h5>
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-6">
                                <div className="card">
                                    <div className="card-header">
                                         <h5 className="my-2">Clientes que Representó</h5>
                                    </div>
                                        

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

AdminAgentDetail.propTypes = {
    agent: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    agent: state.agent
})

export default connect(mapStateToProps)(AdminAgentDetail)
