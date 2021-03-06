import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {setAlert} from '../../actions/alert';
import { getAllProjectType, deleteProjectTypeById } from '../../actions/projectType';
import { getAllProjectSubType, registerProjectSubType, deleteProjectSubTypeById, editProjectSubTypeById } from '../../actions/projectSubType';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const AdminProjectType = ({registerProjectSubType, editProjectSubTypeById,setAlert, deleteProjectTypeById, deleteProjectSubTypeById, getAllProjectType, getAllProjectSubType, projectTypes: {projectTypes} ,projectSubTypes: {projectSubTypes}}) => {

    const [nameProjectType, setNameProjectType] = useState("");

    const [idProjectType, setIdProjectType] = useState("");

    const [idProjectSubType, setIdProjectSubType] = useState("");

    const [nameProjectSubType, setNameProjectSubType] = useState("");

    const [descriptionProjectSubType, setDescriptionProjectSubType] = useState("");

    const [itemIndex, setIndex] = useState(0);

    var idDefault = "";

    const [show, setShow] = useState(false);
    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    const modalAddProjectSubType = () => {
        if(show && projectTypes !== []){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    useEffect(() => {
        getAllProjectType();
        getAllProjectSubType();
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 2000);
          }
    }, [getAllProjectType, getAllProjectSubType, showSpinner]);

    // const [currentPage, setCurrent] = useState(1);
    // const [todosPerPage] = useState(4);

    // const changePagin = (event) => {
    //     setCurrent(Number(event.target.id));
    // }
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
    const loadProjectSubType = (name, idSelect, itemPass) => {
        setNameProjectType(name);
        setIdProjectType(idSelect);
        setIndex(itemPass);
        //se debe traer los sub tipos de proyectos
    }

    const askAddProjectSubType = () => {
        // console.log("dentro",projectTypes.length)
        if (projectTypes.length !== 0){
            modalAddProjectSubType();
        }else{
            setAlert('No hay ningún Tipo de Proyecto para añadir un Subtipo de Proyecto! ', 'danger');
        }
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

        // if (projectSubTypes.length === 0){
        //     // no hay subtipos de proyectos
        //     var whithItemsPST = false;
        //     var itemNonePST = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Subtipos de Proyectos</b></center></li>)
        // }

        // // hay subtipos de proyectos, proceso de tratamiento
        // var whithItemsPST = true;
        
        var projectSubTypeList = projectSubTypes;

        if(idProjectType === ""){
            projectSubTypeList = [];
        }else{
            projectSubTypeList = projectSubTypes.filter(function(lo) {
                return lo.type === idProjectType;
            });
        }

        // var listProjectSubType = projectSubTypeList.map((pst) =>

        //     <tr key={pst._id} >
        //         <td>{pst.name}</td> 
        //         <td>{pst.description}</td>
        //         <td className="hide-sm centerBtn">
        //             <Link onClick={e => callModalProjectSubTypeEdit(pst.name,pst.description, pst._id)} className="btn btn-primary" title="Editar">
        //                 <i className="far fa-edit"></i>
        //             </Link>

        //             <a onClick={e => callModalProjectSubTypeDelete(pst.name, pst._id)} className="btn btn-danger" title="Eliminar">
        //                 <i className="far fa-trash-alt coloWhite"></i>
        //             </a>
        //         </td>

        //     </tr>
        // );

    };
    
    if(projectTypes !== null){
        var lenT = projectTypes.length;
        if(projectSubTypes != null && idProjectType === ""){

            var projectSubTypeList = projectSubTypes.filter(function(pst) {
                //verificar si carga el id por defecto
                idDefault = projectTypes[0]._id;
                return pst.type === projectTypes[0]._id;
            });
            var lenST = projectSubTypeList.length;

        // if (projectSubTypeList.length === 0){
        //     // no hay subtipos de proyectos
        //     var whithItemsPST = false;
        //     var itemNonePST = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Subtipos de Proyectos</b></center></li>)
        // }
        
        // // hay subtipos de proyectos, proceso de tratamiento
        // var whithItemsPST = true;

        // if (projectTypes.length === 0){
        //     // no hay tipos de proyectos
        //     var whithItemsPT = false;
        //     var itemNonePT = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Tipos de Proyectos</b></center></li>)
        // }

        // // hay tipos de proyectos, proceso de tratamiento
        // var whithItemsPT = true;

        //     var listProjectSubType = projectSubTypeList.map((pst,item) =>
        //         <tr key={pst._id} >
        //             <td>{pst.name}</td> 
        //             <td>{pst.description}</td>
        //             <td className="hide-sm centerBtn">
        //                 <Link onClick={e => callModalProjectSubTypeEdit(pst.name,pst.description, pst._id)} className="btn btn-primary" title="Editar">
        //                     <i className="far fa-edit"></i>
        //                 </Link>

        //                 <a onClick={e => callModalProjectSubTypeDelete(pst.name, pst._id)} className="btn btn-danger"title="Eliminar">
        //                     <i className="far fa-trash-alt coloWhite"></i>
        //                 </a>
        //             </td>

        //         </tr>
        //     );
        }
        else{var lenST = 0}
        
        // const indexOfLastTodo = currentPage * todosPerPage;
        // const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        // const currentProjectType = projectTypes.slice(indexOfFirstTodo, indexOfLastTodo);

        // var listProjectType = currentProjectType.map((ri ,item) =>
            
        //     <tr key={ri._id} className={item == itemIndex ? "itemActive": ""}>
        //         <td>{ri.name}</td>
        //         <td>{ri.description}</td>
        //         <td className="hide-sm centerBtn">
                    // <Link to={`/admin-project-type/edit-project-type/${ri._id}`} className="btn btn-primary" title="Editar">
                    //     <i className="far fa-edit"></i>
                    // </Link>

                    // <a onClick={e => callModalDeleteProjectType(ri.name, ri._id)} className="btn btn-danger" title="Eliminar">
                    //     <i className="far fa-trash-alt coloWhite"></i>
                    // </a>

                    // <a onClick={e => loadProjectSubType(ri.name, ri._id, item)} className="btn btn-warning" title="Ver Tipo de Proyecto">
                    //     <i className="fas fa-arrow-circle-right"></i>
                    // </a>

        //         </td>

        //     </tr>

        // );

        // var pageNumbers = [];
        // for (let i = 1; i <= Math.ceil(projectTypes.length / todosPerPage); i++) {
        //     pageNumbers.push(i);
        // }

        // var renderPageNumbers = pageNumbers.map(number => {
        //     return (
        //       <li className="liCustom" key={number}>
        //         <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
        //       </li>
        //     );
        // });

    } else{var lenT = 0}

    const options = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'Todos', value: lenT
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

      function buttonFormatter(cell, row){
        return (<Fragment> 
                    <Link to={`/admin-project-type/edit-project-type/${row._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => callModalDeleteProjectType(row.name, row._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>

                    <a onClick={e => loadProjectSubType(row.name, row._id, cell)} className="btn btn-warning" title="Ver Subtipos">
                        <i className="fas fa-arrow-circle-right"></i>
                    </a>
                </Fragment>
                )
      }
      
      const options2 = {
        //--------- PAGINACION ---------
        page: 1, 
        sizePerPageList: [ {
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }], 
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

      function buttonFormatter2(cell, row){
        return (<Fragment> 
                    <Link onClick={e => callModalProjectSubTypeEdit(row.name,row.description, row._id)} className="btn btn-primary" title="Editar">
                            <i className="far fa-edit"></i>
                        </Link>

                        <a onClick={e => callModalProjectSubTypeDelete(row.name, row._id)} className="btn btn-danger"title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a>
                </Fragment>
                )
      }
    //#region modal para la insercion de subtipo de proyectos
    const modalProyectSubType = (
        <Modal show={show} onHide={e => modalAddProjectSubType()}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Subtipo de Proyecto para <b>{nameProjectType == "" && projectTypes != null && projectTypes[0] != undefined ? projectTypes[0].name : nameProjectType}</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                <form className="form">
                    <div className="form-group">
                        <h5>Nombre</h5>
                        <input 
                            type="text" 
                            class="form-control"
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
                            class="form-control"
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
                <Link onClick={e => saveProjectSubType()} className="btn btn-primary" >
                    Agregar
                </Link>
                <Button variant="secondary" onClick={e => modalAddProjectSubType()}>
                Cerrar
                </Button>

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
                    ¿Estás seguro de eliminar el Subtipo de Proyecto:<b> {nameProjectSubType}</b>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => deleteLocation(idProjectSubType)} className="btn btn-primary" >
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => deleteModalProyectSubType()}>
                Cerrar
                </Button>

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
                    ¿Estás seguro de eliminar el Tipo de Proyecto: <b>{nameProjectTypeDelete}</b>, con todas sus Subtipos?
                </p>

            </Modal.Body>
            <Modal.Footer>
                <Link className="btn btn-primary" onClick={e => deleteProjectType(idProjectTypeDelete)}>
                    Aceptar
                </Link>
                <Button variant="secondary" onClick={e => deleteModalProjectType()}>
                    Cerrar
                </Button>

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
                <Link  className="btn btn-primary" onClick={e => EditProyectSubTypeEdit(proyectSubTypeEdit,descProyectSubTypeEdit, proyectSubTypeEditId)}>
                    Modificar
                </Link>
                <Button variant="secondary" onClick={e => EditModalProyectSubType()}>
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

            <Link to="/admin-project-type/create-project-type" className="btn btn-primary my-1">
                Nuevo Tipo de Proyecto
            </Link>
            <h2 className="my-2">Administración de Tipos de Proyectos</h2>
            <div className="row">
                
                <div className="col-lg-6 col-md-6 col-sm-12">
                    {projectTypes !== null ?
                    <BootstrapTable data={ projectTypes }  pagination={ true } options={ options }  exportCSV={ false }>
                        <TableHeaderColumn dataField='name' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre Tipo de Proyecto'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>
                        <TableHeaderColumn dataField='description'   dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese una Descripción'} } csvHeader='Descripción'>Descripción</TableHeaderColumn>
                        <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='25%' export={ false } >Opciones <br/></TableHeaderColumn>
                    </BootstrapTable>
                    :""}
                    {showSpinner && <Box/>}

                    {/* <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="hide-sm headTable">Nombre</th>
                            <th className="hide-sm headTable">Descripción</th>
                            <th className="hide-sm headTable centerBtn">Opciones</th>
                        </tr>
                        </thead>
                        <tbody>{listProjectType}</tbody>
                    </table>
                    {!whithItemsPT ? '' : itemNonePT}
                    <div className="">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {renderPageNumbers}
                            </ul>
                        </nav>
                    </div> */}
                </div>


                <div className="col-lg-6 col-md-6 col-sm-12">                    
                    <div className="card">                        
                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Subtipos de Proyectos de {nameProjectType == "" && projectTypes != null && projectTypes[0] != undefined ? projectTypes[0].name : nameProjectType} </strong>
                            
                            <div className="float-right">
                                <a onClick={e => askAddProjectSubType()} className="btn btn-success" title="Agregar Subtipo de Proyecto">
                                    <i className="fas fa-plus-circle coloWhite"></i>
                                </a>
                            </div>
                        </div>

                        <div className="card-body ">
                            {projectSubTypeList !== null ?
                            <BootstrapTable data={ projectSubTypeList }  pagination={ true } options={ options2 }  exportCSV={ false }>
                                <TableHeaderColumn dataField='name' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre SubTipo de Proyecto'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>
                                <TableHeaderColumn dataField='description'   dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese una Descripción'} } csvHeader='Descripción'>Descripción</TableHeaderColumn>
                                <TableHeaderColumn dataField='options' dataFormat={buttonFormatter2} headerAlign='center'  width='25%' export={ false } >Opciones <br/></TableHeaderColumn>
                            </BootstrapTable>
                            :""}
                            {showSpinner && <Box/>}
                            {/* <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th className="hide-sm headTable">Nombre</th>
                                    <th className="hide-sm headTable">Descripción</th>
                                    <th className="hide-sm headTable centerBtn">Opciones</th>
                                </tr>
                                </thead>
                                <tbody>{listProjectSubType}</tbody>
                            </table>
                            {!whithItemsPST ? '' : itemNonePST} */}
                        </div>
                    </div>
                </div>
            </div>

            {modalProyectSubType}

            {modalDeleteProyectSubType}

            {modalDeleteProjectType}

            {modalEditProyectSubType}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
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
