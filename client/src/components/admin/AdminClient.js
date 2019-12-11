import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';

import { getAllClient, deleteClientById, reactiveClientById } from '../../actions/client';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const AdminClient = ({getAllClient, reactiveClientById, getAllLocation, deleteClientById, getAllProvince, client: {client},auth:{user}}) => {

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");


    const [reason, setReason] = useState("");

    const addReason = (e) => {
        setReason(e.target.value);
    }

    if(client !== null ){
        var len =  client.length
    }else{
        var len = 0.
    }

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

    const selectStatus = {
        'INACTIVO': 'INACTIVO',
        'ACTIVO': 'ACTIVO',
    };

    function enumFormatter(cell, row, enumObject) {
        // console.log(cell,row,enumObject,enumObject[cell])
    return enumObject[cell];
    }
    
    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }
    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    //pregunta si quiere volver a reactivar al usuario
    const [showReactive, setReactiveShow] = useState(false);

    const modalReactive = () => {
        if(showReactive){
            setReactiveShow(false);
        }else{
            setReactiveShow(true);
        }
    }
    
    const askReactive = (nameComplete, idToDelete) => {
        setComplete(nameComplete)
        setId(idToDelete)
        modalReactive();
    }


    const askDelete = (nameComplete, IdToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }

    useEffect(() => {
        getAllClient();
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 3500);
          }
    }, [getAllClient, showSpinner]);

    const reactiveClient = (idClient) => {
        reactiveClientById(idClient);
        modalReactive();
    }

    const deleteClient = (idClient) => {
        deleteClientById(idClient,reason);
        modalAdmin();
    }

        //Region Spinner
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
 

    function periodActivityFormmatter(cell, row){
        return (<Fragment> 
                {row.status === "ACTIVO" ? <React.Fragment><Moment format="DD/MM/YYYY">{row.history.slice(-1)[0].dateUp}</Moment> - ACTUAL</React.Fragment>:
                         <React.Fragment>
                            <Moment format="DD/MM/YYYY">{row.history.slice(-1)[0].dateUp}</Moment> - <Moment format="DD/MM/YYYY">{row.history.slice(-1)[0].dateDown}</Moment>
                         </React.Fragment>
                    } 
                </Fragment>
                )
      }

    function buttonFormatter(cell, row){
        return (<Fragment> 
                <Link to={`/admin-client/client-detail/${row._id}`} className="btn btn-success my-1" title="Información del cliente">
                        <i className="fas fa-info-circle"></i>
                    </Link>
                  
                    {row.status === "ACTIVO" ?  <Link to={`/admin-client/edit-client/${row._id}`} className="btn btn-primary" title="Editar información del cliente">
                                                    <i className="far fa-edit"></i>
                                                </Link>                                                
                                               : ''
                    }
                    <Link to={`/admin-client-agents/${row._id}`} className="btn btn-light" title="Ver Referentes del cliente">
                                                    <i className="fas fa-handshake"></i>
                                                </Link>

                    {row.status === "ACTIVO" ?   <a onClick={e => askDelete(row.name, row._id)} className="btn btn-danger" title="Eliminar cliente">
                                                    <i className="far fa-trash-alt coloWhite"></i>
                                                </a> : 
                                        
                                            <a onClick={e => askReactive(row.name, row._id)} className="btn btn-warning my-1" title="Reactivar cliente">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }
                </Fragment>
                )
      }

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el cliente: <b>{nameComplete}</b>?
                    
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
             <Link onClick={e => deleteClient(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );


    const modalReactiveHtml = (
        <Modal show={showReactive} onHide={e => modalReactive()} >
            <Modal.Header closeButton title="Cerrar">
                <Modal.Title>Reactivar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de reactivar el cliente: <b>{nameComplete}</b>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => reactiveClient(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalReactive() } >
                Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );

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

                    <Link to="/admin-client/create-client"  className="btn btn-primary my-1">
                        Nuevo Cliente
                    </Link>

                </div>

                <div className="form-group col-lg-6 col-sm-6 selectStatus">
                    {/* <select name="status" className="form-control selectOption" onChange = {e => modifyStatus(e)}>
                        <option value="">Ver TODOS</option>
                        <option value="ACTIVO">Ver ACTIVOS</option>
                        <option value="INACTIVO">Ver INACTIVOS</option>
                    </select> */}
                </div>

            </div>

            <div className="col-lg-12 col-sm-12">
                    <div className="row row-hover">
                        <div className="col-lg-6 col-sm-6">    
                            <h2 className="mb-2">Administración de Clientes</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                        </div>                 
                    </div>
                </div>
                {client !== null ?
                <BootstrapTable data={ client }  pagination={ true } options={ options }  exportCSV={ false }>
                    <TableHeaderColumn dataField='name' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>
                    <TableHeaderColumn dataField='cuil'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un cuil'} }  width='10%' csvHeader='CUIL/CUIT'>CUIL/CUIT</TableHeaderColumn>
                    <TableHeaderColumn dataField='email'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un email'} } csvHeader='Email'>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameProvince'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un nombre de provincia'} } csvHeader='Provincia'>Provincia</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameLocation'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un nombre de localidad'} } csvHeader='Localidad'>Localidad</TableHeaderColumn>
                    <TableHeaderColumn dataField='status'  dataSort filterFormatted dataFormat={ enumFormatter } formatExtraData={ selectStatus } filter={ { type: 'SelectFilter', options: selectStatus, selectText: 'Todos los' } } width='10%'csvHeader='Estado'>Estado</TableHeaderColumn>
                    <TableHeaderColumn dataField='periodActivity' dataFormat={periodActivityFormmatter}  headerAlign='center'  csvHeader='Período de Actividad'  width='10%'>Período de Actividad</TableHeaderColumn>
                    <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='16%' export={ false } >Opciones <br/></TableHeaderColumn>
                </BootstrapTable>
                :""}
          {showSpinner && <Box/>}

            {modal}

            {modalReactiveHtml}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
        </Fragment>
    )
}

AdminClient.propTypes = {
    getAllClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    deleteClientById: PropTypes.func.isRequired,
    reactiveClientById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    auth: state.auth,
})

export default connect(mapStateToProps, {getAllClient, deleteClientById, reactiveClientById})(AdminClient)
