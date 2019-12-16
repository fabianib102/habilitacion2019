import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Spinner} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {deleteProjectById, cancelProjectById, suspenseProjectById, reactivateProjectById,getProjectByLider } from '../../actions/project';
import Moment from 'react-moment';
import moment from 'moment';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const ProjectManager = ({match,history, deleteProjectById, cancelProjectById, suspenseProjectById,reactivateProjectById,getProjectByLider,auth:{user},projectLider:{projectLider}}) => {
    

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");
    
    const [show, setShow] = useState(false);
    const [showCancel, setShowCancel] = useState(false);
    const [showReactivate, setShowReactivate] = useState(false);
    const [showSuspense, setShowSuspense] = useState(false);


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd ;

    // funcion para dada una fecha valida que este a 3 dias de la fecha actual, si no esta lo marca en amarillo
    var yellowDate = (date) => {
        var current = moment().locale('ar');
        current = current.add(3, 'days')        
        var date2 = moment.utc(date);

        if(current>=date2) return <Fragment><Moment format="DD/MM/YYYY" className='btn-warning' title="A 3 días, menos o pasado de la fecha">{moment.utc(date)}</Moment><span className="badge badge-warning"><i className="fas fa-exclamation-triangle fax2"></i></span>  </Fragment>
        else return <Moment format="DD/MM/YYYY">{moment.utc(date)}</Moment>
    }
    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        getProjectByLider(match.params.idUser);
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 3000);
          }
    }, [getProjectByLider, showSpinner]);

    
    const [reason, setReason] = useState("");

    const addReason = (e) => {
        setReason(e.target.value);
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

    // PARA ELIMINACION DEL PROYECTO
    const modalElim = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    const askDelete = (nameComplete, IdToDelete) => {        
        setComplete(nameComplete)
        setId(IdToDelete)
        modalElim();
    }

    const deleteProject = (idProject) => {
        deleteProjectById(idProject);
        modalElim();
    }


    //PARA CANCELACION DEL PROYECTO
    const modalCan = () => {
        if(showCancel){
            setShowCancel(false);
        }else{
            setShowCancel(true);
        }
    }

    const askCancel = (nameComplete, IdToCancel) => {
        setComplete(nameComplete)
        setId(IdToCancel)
        modalCan();
    }

    const cancelProject = (idProject) => {
        cancelProjectById(idProject, user._id, reason);        
        modalCan();
    }

    //PARA SUSPENCION DEL PROYECTO
    const modalSus = () => {
        if(showSuspense){
            setShowSuspense(false);
        }else{
            setShowSuspense(true);
        }
    }

    const askSuspense = (nameComplete, IdToSuspense) => {
        setComplete(nameComplete)
        setId(IdToSuspense)
        modalSus();
    }

    const suspenseProject = (idProject) => {
        suspenseProjectById(idProject, user._id, reason);        
        modalSus();
    }
    

    // PARA ELIMINACION DEL PROYECTO
    const modalReac = () => {
        if(showReactivate){
            setShowReactivate(false);
        }else{
            setShowReactivate(true);
        }
    }

    const askReactivate = (nameComplete, IdToReactivate) => {        
        setComplete(nameComplete)
        setId(IdToReactivate)
        modalReac();
    }
    
    // PARA REACTIVAR EL PROYECTO
    const reactivateProject = (idProject) => {
        reactivateProjectById(idProject, user._id);
        modalReac();
    }
    
    
    //buscar cliente, referente, responsable, equipo
    //filtro de estado
    if(projectLider != null){
        var len = projectLider.lenght;   
    }
    else{//no tengo nada
        var len = 0;
       
    }

    const selectStatus = {
        'FORMULANDO': 'FORMULANDO',
        'ACTIVO': 'ACTIVO',
        'TERMINADO': 'TERMINADO',
        'SUSPENDIDO': 'SUSPENDIDO',
        'CANCELADO': 'CANCELADO',
    };

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
        defaultSortName: 'name',  
        defaultSortOrder: 'asc',  //desc
        // ------- TITULO BOTONES ------
        // exportCSVText: 'Exportar en .CSV',
        //------------ BUSQUEDAS ------
        noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron coincidencias</b></center></li>)
      };

    function datesProvideFormatter(cell, row){
    return (<Fragment> 
                <div>
                    <b>Inicio:</b> <Moment format="DD/MM/YYYY">{moment.utc(row.startDateExpected)}</Moment>                       
                </div> 
                <div>
                    <b>Fin:</b> {yellowDate(row.endDateExpected)}
                </div>
            </Fragment>
            )
    }

    function buttonFormatter(cell, row){
    return (<Fragment> 
                <Link to={`/proyect-manager/project-detail/${row._id}`} className="btn btn-success my-1"title="Ver Información">
                        <i className="fas fa-search coloWhite"></i>
                    </Link>
                    <Link to={`/proyect-manager/project-activity/${row._id}`} className="btn btn-dark my-1" title="Gestión de Etapas, Actividades y Tareas">
                                <i className="fas fa-project-diagram coloWhite"></i>
                        </Link>
                    {row.status === "PREPARANDO" | row.status === "FORMULANDO" ? 
                        <React.Fragment>
                            <Link to={`/proyect-manager/edit-project/${row._id}`}  className="btn btn-primary" title="Editar Información">
                                <i className="far fa-edit"></i>
                            </Link>  
                            <a onClick={e => askDelete(row.name, row._id)} className="btn btn-danger my-1" title="Eliminar">
                                <i className="far fa-trash-alt coloWhite"></i>
                            </a> 
                        </React.Fragment>
                        : ""}
                    {row.status === "ACTIVO" ? 
                        <React.Fragment>
                            <a onClick={e => askCancel(row.name, row._id)} className="btn btn-danger my-1" title="Cancelar">
                                <i className="fas fa-times coloWhite"></i>
                            </a>
                            <a onClick={e => askSuspense(row.name, row._id)} className="btn btn-warning my-1" title="Suspender">
                                <i className="fas fa-stopwatch"></i>
                            </a> 
                        </React.Fragment>                        
                        : ""}

                    {row.status === "SUSPENDIDO" ? 
                        <React.Fragment>
                            <a onClick={e => askCancel(row.name, row._id)} className="btn btn-danger my-1" title="Cancelar">
                                <i className="fas fa-times coloWhite"></i>
                            </a>
                            <a onClick={e => askReactivate(row.name, row._id)} className="btn btn-warning my-1" title="Reactivar">
                                <i className="fas fa-arrow-alt-circle-up"></i>
                            </a>  
                        </React.Fragment>
                        :""}

            </Fragment>
            )
    }

    function enumFormatter(cell, row, enumObject) {
        return enumObject[cell];
    }

    function showAgent(cell, row) {
        return row.surnameAgent + ","+row.nameAgent;
    }
    
    function rowClassNameFormat(row, rowIdx) {
       
        return moment(today).isSame(moment(row.endDateExpected,"YYYY-MM-DD")) ?  "enLimite":(moment(today).isBefore(moment(row.endDateExpected)) ? "":"fueraLimite")
      }


    // modal de eliminacion de proyecto
    const modalEliminar = (
        <Modal show={show} onHide={e => modalElim()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el proyecto: <b>{nameComplete}</b>?
                    
                </p>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => deleteProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalElim()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    
    // modal de cancelación de proyecto
    const modalCancelar = (
        <Modal show={showCancel} onHide={e => modalCan()}>
            <Modal.Header closeButton>
                <Modal.Title>Cancelar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de cancelar el proyecto: <b>{nameComplete}</b>  ?                  
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label className="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div className="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de cancelación" 
                                name="reason"
                                minLength="3"
                                maxLength="300"
                                onChange = {e => addReason(e)}
                            />
                        </div>
                    </div>
                </form>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => cancelProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalCan()}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    
    // modal de suspención de proyecto
    const modalSuspense = (
        <Modal show={showSuspense} onHide={e => modalSus()}>
            <Modal.Header closeButton>
                <Modal.Title>Suspender Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de suspender el proyecto: <b>{nameComplete}</b>?                    
                </p>
                <form className="form">
                    <div className="form-group row">                    
                        <label className="col-md-3 col-form-label" for="text-input"><h5>Motivo:</h5></label>
                        <div className="col-md-9">
                            <input 
                                type="text" 
                                placeholder="Ingrese un motivo de cancelación" 
                                name="reason"
                                minLength="3"
                                maxLength="300"
                                onChange = {e => addReason(e)}
                            />
                        </div>
                    </div>
                </form>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => suspenseProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalSus()}>
                Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );

    // modal de reactivación de proyecto
    const modalReactivate = (
        <Modal show={showReactivate} onHide={e => modalReac()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de reactivar el proyecto: <b>{nameComplete}</b>?
                    
                </p>                
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => reactivateProject(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalReac()}>
                Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (

        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h4 className="my-2">Bienvenido/a, <b> {user && user.surname} { user && user.name}</b></h4>
                </div>
                
            </div>
 
            <div className="row">
                <div className="col-lg-6 col-sm-6">

                    <div className="row">
                        
                        <div className="col-lg-6 col-sm-6 taskTxtCustom">
                            <h3 className="my-2">Mis Proyectos</h3>
                        </div>                        
                    </div>

                </div>
                <div className="col-lg-6 col-sm-6">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12">
                            {/* <input type="text" className="form-control " placeholder="Buscar por nombre de: Proyecto/Cliente/Equipo" onChange = {e => changeTxt(e)} /> */}
                        </div>                 
                    </div>
                </div>
            </div>
            {projectLider !== null ?
                <BootstrapTable data={ projectLider }  pagination={ true } options={ options }  exportCSV={ false } trClassName={rowClassNameFormat}>
                    <TableHeaderColumn dataField='name' isKey  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre'} } csvHeader='Proyecto'>Proyecto</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameClient'   dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre'} } csvHeader='Cliente'>Cliente</TableHeaderColumn>
                    <TableHeaderColumn dataField='surnameAgent' dataFormat={showAgent}  dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre'} } csvHeader='Referente del Cliente'>Referente del Cliente</TableHeaderColumn>
                    <TableHeaderColumn dataField='nameTeam'   dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre'} } csvHeader='Equipo'>Equipo</TableHeaderColumn>
                    <TableHeaderColumn dataField='datesProvide' dataFormat={datesProvideFormatter} csvHeader='Fechas Previstas' width='12%' >Fechas Previstas</TableHeaderColumn>
                    <TableHeaderColumn dataField='status'  dataSort  filterFormatted dataFormat={ enumFormatter } formatExtraData={ selectStatus } filter={ { type: 'SelectFilter', options: selectStatus, selectText: 'Todos los' } } width='10%'csvHeader='Estado'>Estado</TableHeaderColumn>
                    <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='17%' export={ false } >Opciones <br/></TableHeaderColumn>
                </BootstrapTable>
                :""}
                {showSpinner && <Box/>}

         
            {modalEliminar}
            {modalCancelar}
            {modalSuspense}
            {modalReactivate}
                        <br></br>
            <br></br>
            <br></br>
            <br></br>
        </Fragment>

    )
}

ProjectManager.propTypes = {
    getProjectByLider: PropTypes.func.isRequired,
    projectLider: PropTypes.object.isRequired,
    deleteProjectById: PropTypes.func.isRequired,
    cancelProjectById: PropTypes.func.isRequired,
    suspenseProjectById: PropTypes.func.isRequired,
    reactivateProjectById: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    projectLider: state.project,
    auth: state.auth,
})

export default connect(mapStateToProps, {getProjectByLider, deleteProjectById, cancelProjectById, suspenseProjectById, reactivateProjectById})(ProjectManager)
