import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import { getAllUsers, deleteUserByEmail, reactiveUserByEmail } from '../../actions/user';


const AdminUser = ({deleteUserByEmail, reactiveUserByEmail, getAllUsers, users: {users}}) => {

    const [nameComplete, setComplete] = useState("");
    const [emailDelete, setEmail] = useState("");

    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        getAllUsers();       
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 3000);
          }
    }, [getAllUsers, showSpinner]);

    //verificar
    if( users !== null){
        var len = users.length;       
     
        // console.log(users)     
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

  const selectStatus = {
    'INACTIVO': 'INACTIVO',
    'ACTIVO': 'ACTIVO',
};
function enumFormatter(cell, row, enumObject) {
    // console.log(cell,row,enumObject,enumObject[cell])
return enumObject[cell];
}

    const options = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'Todos', value: len
        } ], 
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
        defaultSortName: 'surname',  
        defaultSortOrder: 'asc',  //desc
        // ------- TITULO BOTONES ------
        // exportCSVText: 'Exportar en .CSV',
        //------------ BUSQUEDAS ------
        noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron coincidencias</b></center></li>)
      };

      function lastConectionFormmatter(cell, row){
        return (<Fragment> 
                    {row.last_connection !== undefined ?
                         <React.Fragment>
                            <Moment format="DD/MM/YYYY HH:mm">{row.last_connection}</Moment>
                         </React.Fragment>
                    :"Sin Ingresar"}
                </Fragment>
                )
      }

      function buttonFormatter(cell, row){
        return (<Fragment> 
                    <Link to={`/admin-user/user-detail/${row._id}`} className="btn btn-success my-1" title="Información">
                        <i className="fas fa-info-circle"></i>
                    </Link>

                    {row.status === "ACTIVO" ? <Link to={`/admin-user/edit-user/${row._id}`} className="btn btn-primary my-1" title="Editar">
                                                <i className="far fa-edit"></i>
                                               </Link>
                                               : ""
                    }

                    {row.status === "ACTIVO" ? <a onClick={e => askDelete(row.name + " " + row.surname, row.email)} className="btn btn-danger my-1" title="Eliminar">
                                                <i className="far fa-trash-alt coloWhite"></i>
                                            </a> : 
                                            <a onClick={e => askReactive(row.name + " " + row.surname, row.email)} className="btn btn-warning my-1" title="Reactivar">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }
                </Fragment>
                )
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
   

    const askDelete = (nameComplete, EmailToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setEmail(EmailToDelete)
        modalAdmin();
    }

    const [reason, setReason] = useState("");

    const addReason = (e) => {
        setReason(e.target.value);
    }
    //pregunta si quiere volver a reactivar al RRHH
    const [showReactive, setReactiveShow] = useState(false);

    const modalReactive = () => {
        if(showReactive){
            setReactiveShow(false);
        }else{
            setReactiveShow(true);
        }
    }
    
    const askReactive = (nameComplete, EmailToDelete) => {
        setComplete(nameComplete)
        setEmail(EmailToDelete)
        modalReactive();
    }
    


    const reactiveUser = (email) => {
        reactiveUserByEmail(email);
        modalReactive();
    }

    const deleteUser = (email) => {
        deleteUserByEmail(email,reason);
        modalAdmin();
    }

  

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar RRHH</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el RRHH:<b> {nameComplete}</b>?
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
                <Link  onClick={e => deleteUser(emailDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );

    const modalReactiveHtml = (
        <Modal show={showReactive} onHide={e => modalReactive()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar RRHH</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                ¿Estás seguro de reactivar el RRHH: <b>{nameComplete}</b>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                 <Link onClick={e => reactiveUser(emailDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalReactive()}>
                Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );


    return (

        <Fragment>

            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin" className="btn btn-secondary">
                        Atrás
                    </Link>

                    <Link to="/admin-user/create-user"  className="btn btn-primary my-1">
                        Nuevo RRHH
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
                            <h2 className="mb-2">Administración de RRHH</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                            {/* <input type="text" className="form-control " placeholder="Buscar RRHH por Nombre o CUIL" onChange = {e => changeTxt(e)} /> */}
                        </div>                 
                    </div>
                </div>
                {users !== null ?
                <BootstrapTable data={ users }  pagination={ true } options={ options }  exportCSV={ false }>
                    <TableHeaderColumn dataField='surname' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Apellido'} } csvHeader='Apellido'>Apellido</TableHeaderColumn>
                    <TableHeaderColumn dataField='name'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>
                    <TableHeaderColumn dataField='cuil'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un cuil'} }  width='10%' csvHeader='CUIL/CUIT'>CUIL/CUIT</TableHeaderColumn>
                    <TableHeaderColumn dataField='email'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un email'} } csvHeader='Email'>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameProvince'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un nombre de provincia'} } csvHeader='Provincia'>Provincia</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameLocation'  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un nombre de localidad'} } csvHeader='Localidad'>Localidad</TableHeaderColumn>
                    <TableHeaderColumn dataField='status'  dataSort  filterFormatted dataFormat={ enumFormatter } formatExtraData={ selectStatus } filter={ { type: 'SelectFilter', options: selectStatus, selectText: 'Todos los' } } width='10%'csvHeader='Estado'>Estado</TableHeaderColumn>
                    <TableHeaderColumn dataField='last_connection' dataFormat={lastConectionFormmatter}  headerAlign='center'  csvHeader='Última Conexión'  width='8%'>Última Conexión</TableHeaderColumn>
                    <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='13%' export={ false } >Opciones <br/></TableHeaderColumn>
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

AdminUser.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    deleteUserByEmail: PropTypes.func.isRequired,
    reactiveUserByEmail: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    users: state.users,
})

export default connect(mapStateToProps, {getAllUsers, deleteUserByEmail, reactiveUserByEmail})(AdminUser);
