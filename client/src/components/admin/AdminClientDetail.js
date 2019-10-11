import React, {Fragment,useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';

import Moment from 'react-moment';
import moment from 'moment';


const AdminClientDetail = ({match, client: {client}, setAlert}) => {

    const [show, setShow] = useState(false);

    const [nameComplete, setComplete] = useState("");
    
    const [IdDelete, setId] = useState("");

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    const [isDisable, setDisable] = useState(true);

  
    if(client !== null){

        for (let index = 0; index < client.length; index++) {
            
            if(client[index]._id == match.params.idClient){

               if(client[index].status === "ACTIVO"){
                    var statusShow = (
                        <span class="badge badge-success" title="Cliente Disponible">ACTIVO</span> 
                    )
                }else{
                    var statusShow = (
                        <span class="badge badge-danger" title="Cliente NO Disponible">INACTIVO</span> 
                    )
                }

                //setenado nombre y apellido del representante
                var nameClient = client[index].name;

                var DetailData = (

                    <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Datos Personales</h5>    
                                </div>
                                <div className="float-right">
                                    <Link to={`/admin-client/edit-client/${client[index]._id}`} className="btn btn-primary" title="Editar Información">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>
                                    <a  onClick={e => callModalClientHistory(client[index]._id, client[index].name)} className="btn btn-dark" title="Historial de Movimientos">
                                        <i className="fas fa-history coloWhite"></i>
                                    </a> 
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <Card.Title><b>Estado: </b>{statusShow}</Card.Title>
                                        <Card.Title><b>Nombre o Razón Social: </b>{client[index].name}</Card.Title>
                                        <Card.Title><b>CUIL: </b>{client[index].cuil}</Card.Title>
                                        <Card.Title><b>Condición frente al IVA: </b>{client[index].condition}</Card.Title>
                                        <Card.Title><b>Dirección: </b>{client[index].address}</Card.Title>                                       
                                        
                                    </div>
                                    <div className="col-lg-6">
                                    
                                        <Card.Title><b>Telefóno: </b>{client[index].phone}</Card.Title>
                                        <Card.Title><b>Email: </b>{client[index].email}</Card.Title>
                                        <Card.Title><b>Provincia: </b>{client[index].nameProvince}</Card.Title>
                                        <Card.Title><b>Localidad: </b>{client[index].nameLocation}</Card.Title>
                                        
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


//manejo de Historial Cliente
    const [showModalHistoryClient, setShowModalHistoryClient] = useState(false);    

    const [idClientHistory, setIdClientHistory] = useState("");

    const [nameClientHistory, setNameClientHistory] = useState("");
    
    if(client !== null){
        var arrayClientHistory = [];
            let clientHistory =  client.filter(function(t) {
                return t._id  == match.params.idClient;
            });                   
            arrayClientHistory = clientHistory;
            
    if (arrayClientHistory.length !== 0){
        
        var listHistory = arrayClientHistory[0].history.map((te) =>
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

     const callModalClientHistory = (idClient,nameClientSelected) => {
        setIdClientHistory(idClient);
        setNameClientHistory(nameClientSelected);
        historyModalClient();
    }

    const historyModalClient = () => {
        if(showModalHistoryClient){
            setShowModalHistoryClient(false);
        }else{
            setShowModalHistoryClient(true);
        }
    }

//#region modal client history    
    const modalClient = (
        <Modal show={showModalHistoryClient} onHide={e => historyModalClient()}>
            <Modal.Header closeButton>
                <Modal.Title>Historial de Movimientos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <center>Movimientos correspondientes de <b>{nameClientHistory}</b></center>
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
                <Button variant="secondary" onClick={e => historyModalClient()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
//#endregion


    return (
        <Fragment>

            <Link to="/admin-client" className="btn btn-secondary">
                Atrás
            </Link>

            <h2 className="my-2">Información del Cliente</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos">
                    {DetailData}
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
                                               <tbody><tr></tr></tbody>
                                                
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

                                                <tbody><tr></tr></tbody>
                                                
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
            {modalClient}
        </Fragment>
    )
}

AdminClientDetail.propTypes = {
    client: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
})

export default connect(mapStateToProps,{setAlert})(AdminClientDetail)
