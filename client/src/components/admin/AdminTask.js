import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllTask, deleteTaskById } from '../../actions/task';

const AdminTask = ({deleteTaskById, getAllTask, tasks: {tasks}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(5);

    useEffect(() => {
        getAllTask();
    }, [getAllTask]);

    const deleteTask = (id) => {
        deleteTaskById(id)
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(tasks != null){

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTask = tasks.slice(indexOfFirstTodo, indexOfLastTodo);

        var listTasks = currentTask.map((ti) =>
            <tr key={ti._id}>
                <td>{ti.name}</td>
                <td className="hide-sm">{ti.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-task/edit-task/${ti._id}`} className="btn btn-primary">
                        <i className="far fa-edit"></i>
                    </Link>
                    <a onClick={e => deleteTask(ti._id)} className="btn btn-danger">
                        <i className="far fa-trash-alt"></i>
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

    return (
        <Fragment>
            
            <Link to="/admin" className="btn btn-secondary">
                Atras
            </Link>

            <Link to="/admin-task/create-task" className="btn btn-primary my-1">
                Nueva Tarea
            </Link>

            <h2 className="my-2">Lista de tareas</h2>

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

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

        </Fragment>
    )
}

AdminTask.propTypes = {
    getAllTask: PropTypes.func.isRequired,
    deleteTaskById: PropTypes.func.isRequired,
    tasks: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    tasks: state.task
})

export default connect(mapStateToProps, {getAllTask, deleteTaskById})(AdminTask)
