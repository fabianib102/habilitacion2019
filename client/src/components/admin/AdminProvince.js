import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProvince, deleteProvinceById } from '../../actions/province';
import { getAllLocation, registerLocation, deleteLocationById, editLocationById } from '../../actions/location';
import { Modal, Button } from 'react-bootstrap';

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

    useEffect(() => {
        getAllProvince();
        getAllLocation();
    }, [getAllProvince, getAllLocation]);

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

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
        //alert(idDefault)
        //alert(idProvince)
        if(idDefault != "" && idProvince == ""){
            registerLocation({name:nameLocaly, idProvince: idDefault});
        }else{
            registerLocation({name:nameLocaly, idProvince});
        }

        modalAddLocaly()
        //alert(idProvince)
    }

    if(location != null){
        
        // si no hay localidades crea un aviso de que no hay usuarios        
        if (location.length === 0){
            var whithItemsLoc = false;
            var itemNoneLoc = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Localidades</b></center></li>)
        }

        // hay localidades, proceso de tratamiento
        var whithItemsLoc = true;

        var locationList = location;

        if(idProvince == ""){
            locationList = [];
        }else{

            locationList = location.filter(function(lo) {                
                return lo.idProvince === idProvince;
            });
        }

        var listLocation = locationList.map((loc) =>
            <li className="justify-content-between list-group-item" key={loc._id}>
                {loc.name}

                <div className="float-right">

                    <Link onClick={e => callModalLocationEdit(loc.name, loc._id)} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => callModalLocationDelete(loc.name, loc._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </div>

            </li>
        );

    };

    if(province != null){
        // si no hay provincias crea un aviso de que no hay usuarios        
        if (province.length === 0){
            var whithItemsPro = false;
            var itemNonePro = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Provincias</b></center></li>)
        }

        // hay provincias, proceso de tratamiento
        var whithItemsPro = true;

        if(location !== null && idProvince === ""  && province[0] !== undefined){

            var locationList = location.filter(function(lo) {
                //verificar si carga el id por defecto
                idDefault = province[0]._id;
                return lo.idProvince === province[0]._id;
            });

            var listLocation = locationList.map((loc) =>
                <li className="justify-content-between list-group-item" key={loc._id}>
                    {loc.name}

                    <div className="float-right">

                        <Link onClick={e => callModalLocationEdit(loc.name, loc._id)} className="btn btn-primary" title="Editar">
                            <i className="far fa-edit"></i>
                        </Link>

                        <a onClick={e => callModalLocationDelete(loc.name, loc._id)} className="btn btn-danger"title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                    </div>

                </li>
            );
        }
        
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentRisk = province.slice(indexOfFirstTodo, indexOfLastTodo);

        var listProvince = currentRisk.map((ri ,item) =>
            
            <tr key={ri._id} className={item == itemIndex ? "itemActive": ""}>
                <td>{ri.name}</td>
                <td className="hide-sm centerBtn">

                    <Link to={`/admin-province/edit-province/${ri._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => callModalDeleteProvince(ri.name, ri._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>

                    <a onClick={e => loadLocation(ri.name, ri._id, item)} className="btn btn-warning" title="Ver Provincia">
                        <i className="fas fa-arrow-circle-right"></i>
                    </a>

                </td>

            </tr>

        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(province.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        var renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className="liCustom" key={number}>
                <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
              </li>
            );
        });

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
                <Button variant="secondary" onClick={e => modalAddLocaly()}>
                Cerrar
                </Button>
                <a onClick={e => saveLocaly()} className="btn btn-primary" >
                    Agregar
                </a>
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
                    Estas seguro de eliminar la localidad <b>{nameLocaly}</b>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => deleteModalLocation()}>
                Cerrar
                </Button>
                <a onClick={e => deleteLocation(idLocaly)} className="btn btn-primary" >
                    Aceptar
                </a>
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
                    Estas seguro de eliminar la provincia de <b>{nameProvinceToDelete}</b>, con todas sus localidades.
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => deleteModalProvince()}>
                    Cerrar
                </Button>
                <a className="btn btn-primary" onClick={e => deleteProvince(idProvinceToDelete)}>
                    Aceptar
                </a>
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
        //deleteProvinceById(idPro);
        //alert(idLoc)
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
                <Button variant="secondary" onClick={e => EditModalLocation()}>
                    Cerrar
                </Button>
                <a  className="btn btn-primary" onClick={e => EditLocation(localyEdit, localyEditId)}>
                    Modificar
                </a>
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
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="hide-sm headTable">Nombre</th>
                            <th className="hide-sm headTable centerBtn">Opciones</th>
                        </tr>
                        </thead>
                        <tbody>{listProvince}</tbody>
                    </table>
                    {!whithItemsPro ? '' : itemNonePro}

                    <div className="">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {renderPageNumbers}
                            </ul>
                        </nav>
                    </div>
                </div>


                <div className="col-lg-6 col-md-6 col-sm-12">
                    
                    <div className="card">
                        
                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Localidades {nameProvince == "" && province != null && province[0] != undefined ? " de "+province[0].name : nameProvince} </strong>

                            <div className="float-right">
                                <a onClick={e => askAddLocaly()} className="btn btn-success" title="Agregar Localidad">
                                    <i className="fas fa-plus-circle coloWhite"></i>
                                </a>
                            </div>
                            

                        </div>

                        <div className="card-body bodyLocaly">

                            <ul className="list-group">
                                {listLocation}
                                {!whithItemsLoc ? '' : itemNoneLoc}
                            </ul>

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
