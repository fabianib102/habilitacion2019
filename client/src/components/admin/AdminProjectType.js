import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {setAlert} from '../../actions/alert';
import { getAllProjectType, deleteProjectTypeById } from '../../actions/projectType';
import { getAllProjectSubType, registerProjectSubType, deleteProjectSubTypeById, editProjectSubTypeById } from '../../actions/projectSubType';
import { Modal, Button } from 'react-bootstrap';

const AdminProjectType = ({registerProjectSubType, editProjectSubTypeById,setAlert, deleteProjectTypeById, deleteProjectSubTypeById, getAllProjectType, getAllProjectSubType, projectTypes: {projectTypes} ,projectSubTypes: {projectSubTypes}}) => {

    const [nameProjectType, setNameProjectType] = useState("");

    const [idProjectType, setIdProjectType] = useState("");

    const [idProjectSubType, setIdProjectSubType] = useState("");

    const [nameProjectSubType, setNameProjectSubType] = useState("");

    const [descriptionProjectSubType, setDescriptionProjectSubType] = useState("");

    const [itemIndex, setIndex] = useState(0);

    var idDefault = "";

    const [show, setShow] = useState(false);

    const modalAddProjectSubType = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    useEffect(() => {
        getAllProjectType();
        getAllProjectSubType();
    }, [getAllProjectType, getAllProjectSubType]);

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    const loadProjectSubType = (name, idSelect, itemPass) => {
        setNameProjectType(name);
        setIdProjectType(idSelect);
        setIndex(itemPass);
        //se debe traer los sub tipos de proyectos
    }

    const askAddProjectSubType = () => {
        modalAddProjectSubType()
    }

    const onChangeNameProjectSubType = e => setNameProjectSubType(e.target.value);
    const onChangeDescriptionProjectSubType = e => setDescriptionProjectSubType(e.target.value);

    //guarda el subtipo de proyecto
    const saveProjectSubType = () => {
        if (nameProjectSubType === "" || descriptionProjectSubType === ""){
            setAlert('Debes ingresar el nombre y la descripción para el Subtipo de Proyecto', 'danger');
        }else{
            if(idDefault != "" && idProjectType == ""){
                //registro nuevo subtipo    de proyecto                  
                registerProjectSubType({name:nameProjectSubType, description:descriptionProjectSubType, type: idDefault});
            }else{
                // edito subtipo de proyecto
                registerProjectSubType({name:nameProjectSubType, description:descriptionProjectSubType, type: idProjectType});
            }
        }
        modalAddProjectSubType();
    }

    if(projectSubTypes != null){
        
        var projectSubTypeList = projectSubTypes;

        if(idProjectType == ""){
            projectSubTypeList = [];
        }else{

            projectSubTypeList = projectSubTypes.filter(function(lo) {
                return lo.type === idProjectType;
            });
        }

        var listProjectSubType = projectSubTypeList.map((pst) =>

            <tr key={pst._id} >
                <td>{pst.name}</td> 
                <td>{pst.description}</td>
                <td className="hide-sm centerBtn">
                    <Link onClick={e => callModalProjectSubTypeEdit(pst.name,pst.description, pst._id)} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => callModalProjectSubTypeDelete(pst.name, pst._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </td>

            </tr>
        );

    };

    if(projectTypes != null){

        if(projectSubTypes != null && idProjectType == ""){

            var projectSubTypeList = projectSubTypes.filter(function(pst) {
                //verificar si carga el id por defecto
                idDefault = projectTypes[0]._id;
                return pst.type === projectTypes[0]._id;
            });

            var listProjectSubType = projectSubTypeList.map((pst,item) =>
                <tr key={pst._id} >
                    <td>{pst.name}</td> 
                    <td>{pst.description}</td>
                    <td className="hide-sm centerBtn">
                        <Link onClick={e => callModalProjectSubTypeEdit(pst.name,pst.description, pst._id)} className="btn btn-primary" title="Editar">
                            <i className="far fa-edit"></i>
                        </Link>

                        <a onClick={e => callModalProjectSubTypeDelete(pst.name, pst._id)} className="btn btn-danger"title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                    </td>

                </tr>
            );
        }
        
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentProjectType = projectTypes.slice(indexOfFirstTodo, indexOfLastTodo);

        var listProjectType = currentProjectType.map((ri ,item) =>
            
            <tr key={ri._id} className={item == itemIndex ? "itemActive": ""}>
                <td>{ri.name}</td>
                <td>{ri.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-project-type/edit-project-type/${ri._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => callModalDeleteProjectType(ri.name, ri._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>

                    <a onClick={e => loadProjectSubType(ri.name, ri._id, item)} className="btn btn-warning" title="Ver Tipo de Proyecto">
                        <i className="fas fa-arrow-circle-right"></i>
                    </a>

                </td>

            </tr>

        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(projectTypes.length / todosPerPage); i++) {
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

    //#region modal para la insercion de subtipo de proyectos
    const modalProyectSubType = (
        <Modal show={show} onHide={e => modalAddProjectSubType()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Subtipo de Proyecto para <b>{nameProjectType == "" && projectTypes != null ? projectTypes[0].name : nameProjectType}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <form className="form">
                    <div className="form-group">
                        <h5>Nombre</h5>
                        <input 
                            type="text" 
                            placeholder="Nombre del Subtipo de Proyecto" 
                            name="name"
                            minLength="3"
                            maxLength="50"
                            onChange = {e => onChangeNameProjectSubType(e)}
                        />
                    </div>
                    <div className="form-group">
                        <h5>Descripción</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción del Subtipo de Proyecto" 
                            name="description"
                            minLength="3"
                            maxLength="50"
                            onChange = {e => onChangeDescriptionProjectSubType(e)}
                        />
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAddProjectSubType()}>
                Cerrar
                </Button>
                <a onClick={e => saveProjectSubType()} className="btn btn-primary" >
                    Agregar
                </a>
            </Modal.Footer>
        </Modal>
    );
    //#endregion


    const [showDeleteProyectSubType, setShowDeleteProyectSubType] = useState(false);

    const deleteModalProyectSubType = () => {
        if(showDeleteProyectSubType){
            setShowDeleteProyectSubType(false);
        }else{
            setShowDeleteProyectSubType(true);
        }
    }

    const callModalProjectSubTypeDelete = (nameComplete, idProyectSubType) => {
        setNameProjectSubType(nameComplete)
        setIdProjectSubType(idProyectSubType)
        deleteModalProyectSubType();
    }

    const deleteLocation = (idProSuTy) => {
        deleteProjectSubTypeById(idProSuTy);
        deleteModalProyectSubType();
    }

    //#region modal para borrar el subtipo de proyecto
    const modalDeleteProyectSubType = (
        <Modal show={showDeleteProyectSubType} onHide={e => deleteModalProyectSubType()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Subtipo de Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar el Subtipo de Proyecto:<b> {nameProjectSubType}</b>
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => deleteModalProyectSubType()}>
                Cerrar
                </Button>
                <a onClick={e => deleteLocation(idProjectSubType)} className="btn btn-primary" >
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );
    //#endregion



    const [nameProjectTypeDelete, setNameProToDelete] = useState("");

    const [idProjectTypeDelete, setIdProToDelete] = useState("");

    const [showdeleteProjectType, setShowdeleteProjectType] = useState(false);

    const deleteModalProjectType= () => {
        if(showdeleteProjectType){
            setShowdeleteProjectType(false);
        }else{
            setShowdeleteProjectType(true);
        }
    }

    const callModalDeleteProjectType = (nameComplete, idProyectSubType) => {
        setNameProToDelete(nameComplete)
        setIdProToDelete(idProyectSubType)
        deleteModalProjectType();
    }

    const deleteProjectType= (idPro) => {
        deleteProjectTypeById(idPro);
        deleteModalProjectType();
    }

    //#region  modal para eliminar el tipo de proyecto
    const modalDeleteProjectType = (
        <Modal show={showdeleteProjectType} onHide={e => deleteModalProjectType()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Tipo de Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <p>
                    Estas seguro de eliminar el Tipo de Proyecto: <b>{nameProjectTypeDelete}</b>, con todas sus Subtipos?.
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => deleteModalProjectType()}>
                    Cerrar
                </Button>
                <a className="btn btn-primary" onClick={e => deleteProjectType(idProjectTypeDelete)}>
                    Aceptar
                </a>
            </Modal.Footer>
        </Modal>
    );
    //#endregion



    const [proyectSubTypeEdit, setEditProyectSubTypeEdit] = useState("");

    const [descProyectSubTypeEdit, setEditDescProyectSubTypeEdit] = useState("");

    const [proyectSubTypeEditId, setEditProyectSubTypeEditId] = useState("");

    const [showEditProyectSubType, setshowEditProyectSubType] = useState(false);

    const callModalProjectSubTypeEdit = (nameComplete,description, idProyectSubType) => {
        setEditProyectSubTypeEdit(nameComplete);
        setEditProyectSubTypeEditId(idProyectSubType);
        setEditDescProyectSubTypeEdit(description);
        EditModalProyectSubType();
    }

    const EditModalProyectSubType = () => {
        if(showEditProyectSubType){
            setshowEditProyectSubType(false);
        }else{
            setshowEditProyectSubType(true);
        }
    }

    const EditProyectSubTypeEdit= (nameEditProyectSubTypeEdit, descEditProyectSubTypeEdit, idProSuTy) => {
        //alert(idProSuTy)
        if (nameEditProyectSubTypeEdit === "" || descEditProyectSubTypeEdit === ""){
            setAlert('Debes ingresar el nombre y la descripción para el Subtipo de Proyecto', 'danger');
        }else{
        editProjectSubTypeById({name:nameEditProyectSubTypeEdit, description:descEditProyectSubTypeEdit, idProjectSubType: idProSuTy});
        }
        EditModalProyectSubType();
    }

    const onChangeEditProyectSubType = e => setEditProyectSubTypeEdit(e.target.value);
    const onChangeEditDescProyectSubType = e => setEditDescProyectSubTypeEdit(e.target.value);

    //#region 

    const modalEditProyectSubType = (
        <Modal show={showEditProyectSubType} onHide={e => EditModalProyectSubType()}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Subtipo de Proyecto</Modal.Title>
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
                            value={proyectSubTypeEdit}
                            onChange = {e => onChangeEditProyectSubType(e)}
                        />
                    </div>
                    <div className="form-group">
                        <h5>Descripción</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción" 
                            name="descriptionEdit"
                            minLength="3"
                            maxLength="50"
                            value={descProyectSubTypeEdit}
                            onChange = {e => onChangeEditDescProyectSubType(e)}
                        />
                    </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => EditModalProyectSubType()}>
                    Cerrar
                </Button>
                <a  className="btn btn-primary" onClick={e => EditProyectSubTypeEdit(proyectSubTypeEdit,descProyectSubTypeEdit, proyectSubTypeEditId)}>
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

            <Link to="/admin-project-type/create-project-type" className="btn btn-primary my-1">
                Nuevo Tipo de Proyecto
            </Link>
            <h2 className="my-2">Administración de Tipos de Proyectos</h2>
            <div className="row">
                
                <div className="col-lg-6 col-md-6 col-sm-12">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="hide-sm headTable">Nombre</th>
                            <th className="hide-sm headTable">Descripción</th>
                            <th className="hide-sm headTable centerBtn">Opciones</th>
                        </tr>
                        </thead>
                        <tbody>{listProjectType}</tbody>
                    </table>

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
                            <strong> Subtipos de Proyectos de {nameProjectType == "" && projectTypes != null ? projectTypes[0].name : nameProjectType} </strong>
                            
                            <div className="float-right">
                                <a onClick={e => askAddProjectSubType()} className="btn btn-success" title="Agregar Subtipo de Proyecto">
                                    <i className="fas fa-plus-circle coloWhite"></i>
                                </a>
                            </div>
                        </div>

                        <div className="card-body bodyLocaly">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th className="hide-sm headTable">Nombre</th>
                                    <th className="hide-sm headTable">Descripción</th>
                                    <th className="hide-sm headTable centerBtn">Opciones</th>
                                </tr>
                                </thead>
                                <tbody>{listProjectSubType}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {modalProyectSubType}

            {modalDeleteProyectSubType}

            {modalDeleteProjectType}

            {modalEditProyectSubType}

        </Fragment>
    )
}

AdminProjectType.propTypes = {
    getAllProjectSubType: PropTypes.func.isRequired,
    getAllProjectType: PropTypes.func.isRequired,
    editProjectSubTypeById: PropTypes.func.isRequired,
    deleteProjectSubTypeById: PropTypes.func.isRequired,
    deleteProjectTypeById: PropTypes.func.isRequired,
    registerProjectSubType: PropTypes.func.isRequired,
    projectTypes: PropTypes.object.isRequired,
    projectSubTypes: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,

}

const mapStateToProps = state => ({
    projectTypes: state.projectType,
    projectSubTypes: state.projectSubType
})

export default connect(mapStateToProps, {getAllProjectType, editProjectSubTypeById,setAlert, deleteProjectSubTypeById, deleteProjectTypeById, getAllProjectSubType, registerProjectSubType})(AdminProjectType);
