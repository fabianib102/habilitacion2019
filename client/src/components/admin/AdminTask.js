import React, {Fragment, useEffect, useState, Component} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { getAllTask, deleteTaskById } from '../../actions/task';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
//http://allenfang.github.io/react-bootstrap-table/index.html


const AdminTask = ({deleteTaskById, getAllTask, tasks: {tasks},auth:{user}}) => {

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");  


    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    //Hooks Spinner
    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        getAllTask();
        if (showSpinner) {
            setTimeout(() => {
              setShowSpinner(false);
            }, 1000);
          }
    }, [getAllTask,showSpinner]);

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    if (tasks !== null){
       var len =  tasks.length
    }else{
        var len = 0.
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
    
    function renderShowsTotal(start, to, total) {
        return (
            <div className="col-lg-6 col-sm-6">
          
            Desde <b> { start }</b> a <b>{ to }</b>, el total es <b>{ total }</b>
          
          </div>
        );
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
            // paginationShowsTotal: renderShowsTotal, 
            paginationPosition: 'bottom',
            // --------ORDENAMIENTO--------
            defaultSortName: 'name',  
            defaultSortOrder: 'asc',  //desc
            // ------- TITULO BOTONES ------
            // exportCSVText: 'Exportar en .CSV',
            //------------ BUSQUEDAS ------
            noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron coincidencias</b></center></li>)
          };

  
    const askDelete = (nameComplete, IdToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }  
      
    const deleteTask = (id) => {
        deleteTaskById(id);
        modalAdmin();
    }

    function buttonFormatter(cell, row){
        return (<Fragment> 
                <Link to={`/admin-task/edit-task/${row._id}`} className="btn btn-primary" title="Editar">
                    <i className="far fa-edit"></i>
                </Link>
                <a onClick={e => askDelete(row.name, row._id)} className="btn btn-danger" title="Eliminar">
                    <i className="far fa-trash-alt coloWhite"></i>
                </a>
                </Fragment>
                )
      }

      
    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar la tarea: <b>{nameComplete}</b>
                </p>
            </Modal.Body>
            <Modal.Footer>
            <Link onClick={e => deleteTask(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
    return (
        <Fragment>
            
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

            <Link to="/admin-task/create-task" className="btn btn-primary my-1">
                Nueva Tarea
            </Link>

            <div className="col-lg-12 col-sm-12">
                    <div className="row row-hover">
                        <div className="col-lg-6 col-sm-6">    
                            <h2 className="mb-2">Administración de Tareas</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                        </div>                 
                    </div>
                </div>
                {tasks !== null ?
                <BootstrapTable data={ tasks }  pagination={ true } options={ options }  exportCSV={ false }>
                    <TableHeaderColumn dataField='name' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre de Tarea'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>
                    <TableHeaderColumn dataField='description'  width='50%' dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese una Descripción'} } csvHeader='Descripción'>Descripción</TableHeaderColumn>
                    <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='10%' export={ false } >Opciones <br/></TableHeaderColumn>
                </BootstrapTable>
                :""}
                {showSpinner && <Box/>}

            {modal} 
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
        </Fragment>
    )
}

AdminTask.propTypes = {
    getAllTask: PropTypes.func.isRequired,
    deleteTaskById: PropTypes.func.isRequired,
    tasks: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    tasks: state.tasks,
    auth: state.auth,
})

export default connect(mapStateToProps, {getAllTask, deleteTaskById})(AdminTask)
