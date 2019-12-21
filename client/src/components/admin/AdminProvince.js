import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProvince, deleteProvinceById } from '../../actions/province';
import { getAllLocation, registerLocation, deleteLocationById, editLocationById } from '../../actions/location';
import { Modal, Button, Spinner} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const AdminProvince = ({registerLocation, editLocationById, deleteProvinceById, deleteLocationById, getAllProvince, getAllLocation, province: {province} ,location: {location}}) => {

    const [nameProvince, setNameProvince] = useState("");

    const [idProvince, setIdProvince] = useState("");

    const [idLocaly, setIdLocaly] = useState("");

    const [nameLocaly, setNameLocaly] = useState("");

    const [itemIndex, setIndex] = useState(0);

    var idDefault = "";

    const [show, setShow] = useState(false);

    const modalAddLocaly = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        getAllProvince();
        getAllLocation();
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 2500);
          }
    }, [getAllProvince, getAllLocation, showSpinner]);


    const loadLocation = (name, idSelect, itemPass) => {
        setNameProvince( " de " +name);
        setIdProvince(idSelect);
        setIndex(itemPass);
        //se debe traer las localidades
    }

    const askAddLocaly = () => {
        modalAddLocaly()
    }

    const onChange = e => setNameLocaly(e.target.value);

    //guarda la localidad
    const saveLocaly = () => {
        if(idDefault !== "" && idProvince === ""){
            registerLocation({name:nameLocaly, idProvince: idDefault});
        }else{
            registerLocation({name:nameLocaly, idProvince});
        }

        modalAddLocaly()
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

    if(location != null){
        var locationList = location;

        if(idProvince === ""){
            locationList = [];
        }else{

            locationList = location.filter(function(lo) {                
                return lo.idProvince === idProvince;
            });
        }
        var lenLoc = locationList.length
    }else{
        var lenLoc = 0
    };

    if(province != null){
        var lenPro =  province.length 
        if(location !== null && idProvince === ""  && province[0] !== undefined){            
            var locationList = location.filter(function(lo) {
                //verificar si carga el id por defecto
                idDefault = province[0]._id;
                return lo.idProvince === province[0]._id;
            });
            var lenLoc = locationList.length
        }
       
    }
    else{
        var lenPro = 0
        var lenLoc = 0
    }
    const optionsLocation = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'Todos', value: lenLoc
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

    const optionsProvince = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'Todos', value: lenPro
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

    function buttonFormatterLoc(cell, row){
    return (<Fragment> 
                    <Link onClick={e => callModalLocationEdit(row.name, row._id)} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>
                    <a onClick={e => callModalLocationDelete(row.name, row._id)} className="btn btn-danger"title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
            </Fragment>
            )
    }

    function buttonFormatterPro(cell, row){
        return (<Fragment> 
                    <Link to={`/admin-province/edit-province/${row._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => callModalDeleteProvince(row.name, row._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>

                    <a onClick={e => loadLocation(row.name, row._id, cell)} className="btn btn-warning" title="Ver Localidades">
                        <i className="fas fa-arrow-circle-right"></i>
                    </a>
                </Fragment>
                )
      }

    //#region modal para la insercion de localidades
    const modalLocaly = (
        <Modal show={show} onHide={e => modalAddLocaly()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Localidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <form className="form">
                    <div className="form-group">
                        <h5>Nombre de la localidad</h5>
                        <input 
                            type="text" 
                            class="form-control"
                            placeholder="Nombre" 
                            name="name"
                            minLength="3"
                            maxLength="50"
                            onChange = {e => onChange(e)}
                        />
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => saveLocaly()} className="btn btn-primary" >
                    Agregar
                </Link>
                <Button variant="secondary" onClick={e => modalAddLocaly()}>
                Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );
    //#endregion


    const [showDeleteLocation, setShowDeleteLocation] = useState(false);

    const deleteModalLocation = () => {
        if(showDeleteLocation){
            setShowDeleteLocation(false);
        }else{
            setShowDeleteLocation(true);
        }
    }

    const callModalLocationDelete = (nameComplete, idLocation) => {
        setNameLocaly(nameComplete)
        setIdLocaly(idLocation)
        deleteModalLocation();
    }

    const deleteLocation = (idLoc) => {
        deleteLocationById(idLoc);
        deleteModalLocation();
    }

    //#region modal para borrar la localidad
    const modalDeleteLocaly = (
        <Modal show={showDeleteLocation} onHide={e => deleteModalLocation()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Localidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar la localidad <b>{nameLocaly}</b>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => deleteLocation(idLocaly)} className="btn btn-primary" >
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => deleteModalLocation()}>
                Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );
    //#endregion



    const [nameProvinceToDelete, setNameProToDelete] = useState("");

    const [idProvinceToDelete, setIdProToDelete] = useState("");

    const [showDeleteProvince, setShowDeleteProvince] = useState(false);

    const deleteModalProvince= () => {
        if(showDeleteProvince){
            setShowDeleteProvince(false);
        }else{
            setShowDeleteProvince(true);
        }
    }

    const callModalDeleteProvince = (nameComplete, idLocation) => {
        setNameProToDelete(nameComplete)
        setIdProToDelete(idLocation)
        deleteModalProvince();
    }

    const deleteProvince= (idPro) => {
        deleteProvinceById(idPro);
        deleteModalProvince();
    }

    //#region  modal para eliminar la provincia
    const modalDeleteProvince = (
        <Modal show={showDeleteProvince} onHide={e => deleteModalProvince()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Provincia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    ¿Estás seguro de eliminar la provincia de <b>{nameProvinceToDelete}</b>, con todas sus localidades?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Link className="btn btn-primary" onClick={e => deleteProvince(idProvinceToDelete)}>
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => deleteModalProvince()}>
                    Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );
    //#endregion



    const [localyEdit, setEditLocaly] = useState("");

    const [localyEditId, setEditLocalyId] = useState("");

    const [showEditLocation, setShowEditLocation] = useState(false);

    const callModalLocationEdit = (nameComplete, idLocation) => {
        setEditLocaly(nameComplete)
        setEditLocalyId(idLocation)
        EditModalLocation();
    }

    const EditModalLocation = () => {
        if(showEditLocation){
            setShowEditLocation(false);
        }else{
            setShowEditLocation(true);
        }
    }

    const EditLocation= (nameEditLocaly, idLoc) => {
        editLocationById({name:nameEditLocaly, idLocation: idLoc});
        EditModalLocation();
    }

    const onChangeEditLocaly = e => setEditLocaly(e.target.value);

    //#region 

    const modalEditLocaly = (
        <Modal show={showEditLocation} onHide={e => EditModalLocation()}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Localidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <form className="form">
                    <div className="form-group">
                        <h5>Nombre</h5>
                        <input 
                            type="text" 
                            placeholder="Nombre" 
                            name="nameEdit"
                            minLength="3"
                            maxLength="50"
                            value={localyEdit}
                            onChange = {e => onChangeEditLocaly(e)}
                        />
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <Link  className="btn btn-primary" onClick={e => EditLocation(localyEdit, localyEditId)}>
                    Modificar
                </Link>
                <Button variant="secondary" onClick={e => EditModalLocation()}>
                    Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );

    //#endregion

   
    return (

        <Fragment>
        
            <Link to="/admin" className="btn btn-secondary">
                Atrás
            </Link>

            <Link to="/admin-province/create-province" className="btn btn-primary my-1">
                Nueva Provincia
            </Link>
            <h2 className="my-2">Administración de Provincias</h2>
            <div className="row">
            
                <div className="col-lg-6 col-md-6 col-sm-12">
                    {province !== null ?
                    <BootstrapTable data={ province }  pagination={ true } options={ optionsProvince }  exportCSV={ false }>
                        <TableHeaderColumn dataField='name' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre de Provincia'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>                        
                        <TableHeaderColumn dataField='options' dataFormat={buttonFormatterPro} headerAlign='center'  width='30%' export={ false } >Opciones <br/></TableHeaderColumn>
                    </BootstrapTable>
                    :""}
                    {showSpinner && <Box/>}
                </div>


                <div className="col-lg-6 col-md-6 col-sm-12">                    
                    <div className="card">                        
                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Localidades {nameProvince === "" && province !== null && province[0] !== undefined ? " de "+province[0].name : nameProvince} </strong>

                            <div className="float-right">
                                <a onClick={e => askAddLocaly()} className="btn btn-success" title="Agregar Localidad">
                                    <i className="fas fa-plus-circle coloWhite"></i>
                                </a>
                            </div>
                        </div>

                        <div className="card-body ">
                            {province !== null ?
                            <BootstrapTable data={ locationList }  pagination={ true } options={ optionsProvince }  exportCSV={ false }>
                                <TableHeaderColumn dataField='name' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre de una Localidad'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>                        
                                <TableHeaderColumn dataField='options' dataFormat={buttonFormatterLoc} headerAlign='center'  width='30%' export={ false } >Opciones <br/></TableHeaderColumn>
                            </BootstrapTable>
                            :""}
                                {showSpinner && <Box/>}                       
                                <br></br>
                                <br></br>
                                <br></br>
                        </div>
                    </div>
                </div>
            </div>

            {modalLocaly}

            {modalDeleteLocaly}

            {modalDeleteProvince}

            {modalEditLocaly}

        </Fragment>
    )
}

AdminProvince.propTypes = {
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
    editLocationById: PropTypes.func.isRequired,
    deleteLocationById: PropTypes.func.isRequired,
    deleteProvinceById: PropTypes.func.isRequired,
    registerLocation: PropTypes.func.isRequired,
    province: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    province: state.province,
    location: state.location
})

export default connect(mapStateToProps, {getAllProvince, editLocationById, deleteLocationById, deleteProvinceById, getAllLocation, registerLocation})(AdminProvince);
