import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getAllTask, deleteTaskById } from '../../actions/task';

const AdminTask = ({deleteTaskById, getAllTask, tasks: {tasks},auth:{user}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");
    const [txtFilter, setTxtFilter] = useState("");


    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }
    //--------

    const askDelete = (nameComplete, IdToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }

    useEffect(() => {
        getAllTask();
    }, [getAllTask]);

    const deleteTask = (id) => {
        deleteTaskById(id);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(tasks != null){
        console.log("tareas", tasks)
        // si no hay tareas crea un aviso de que no hay usuarios        
        if (tasks.length === 0){
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Tareas</b></center></li>)
        }
        
        // hay tareas, proceso de tratamiento
        var taskFilter = tasks;
        var whithItems = true;

        console.log("filtro", taskFilter);


        if(txtFilter !== ""){
            var taskFilter =  tasks.filter(function(ri) {
                return ri.name.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
                | ri.description.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
               
            });
           
            console.log("filtro",taskFilter)
        }

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTask = taskFilter.slice(indexOfFirstTodo, indexOfLastTodo);

        var listTasks = currentTask.map((ti) =>
            <tr key={ti._id}>
                <td>{ti.name}</td>
                <td className="hide-sm">{ti.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-task/edit-task/${ti._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>
                    <a onClick={e => askDelete(ti.name, ti._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(tasks.length / todosPerPage); i++) {
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

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar la tarea: {nameComplete}
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

    const changeTxt = e => {
        setTxtFilter(e.target.value);
    }

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
                            <input type="text" className="form-control " placeholder="Buscar Tareas por Nombre o Descripción" onChange = {e => changeTxt(e)} />
                        </div>                 
                    </div>
                </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre de la tarea</th>
                    <th className="hide-sm headTable">Descripción</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listTasks}</tbody>
            </table>

            {!whithItems ? '' : itemNone}

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            {modal}

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
