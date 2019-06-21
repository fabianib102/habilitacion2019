import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllTask, deleteTaskById } from '../../actions/task';

const AdminTask = ({deleteTaskById, getAllTask, tasks: {tasks}}) => {

    useEffect(() => {
        getAllTask();
    }, [getAllTask]);

    const deleteTask = (id) => {
        deleteTaskById(id)
    }

    if(tasks != null){

        var listTasks = tasks.map((ti) =>
            <tr key={ti._id}>
                <td>{ti.name}</td>
                <td className="hide-sm">{ti.description}</td>
                <td className="hide-sm">
                    <Link to={`/admin-task/edit-task/${ti._id}`} className="btn btn-primary">
                        <i className="far fa-edit"></i>
                    </Link>
                </td>
                <td className="hide-sm">
                    <a onClick={e => deleteTask(ti._id)} className="btn btn-danger">
                        <i className="far fa-trash-alt"></i>
                    </a>
                </td>
            </tr>
            );
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
                    <th>Nombre de la tarea</th>
                    <th className="hide-sm">Descripción</th>
                    <th className="hide-sm"></th>
                    <th className="hide-sm"></th>
                </tr>
                </thead>
                <tbody>{listTasks}</tbody>
            </table>

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
