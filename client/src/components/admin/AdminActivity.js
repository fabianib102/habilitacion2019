import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllActivity } from '../../actions/activity';

const AdminActivity = ({ getAllActivity, activity: {activity}}) => {

    useEffect(() => {
        getAllActivity();
    }, [getAllActivity]);


    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }


    if(activity != null){

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentStage = activity.slice(indexOfFirstTodo, indexOfLastTodo);

        var listActivity = currentStage.map((ti) =>
            <tr key={ti._id}>
                <td>{ti.name}</td>
                <td className="hide-sm">{ti.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-stage/edit-stage/${ti._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    {ti.status === "ACTIVO" ? <a className="btn btn-danger" title="Eliminar">
                                                    <i className="far fa-trash-alt coloWhite"></i>
                                                </a>
                                            :
                                            <a className="btn btn-warning my-1" title="Reactivar">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }

                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(activity.length / todosPerPage); i++) {
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
                Atrás
            </Link>

            <Link to="" className="btn btn-primary my-1">
                Nueva Actividad
            </Link>

            <h2 className="my-2">Administración de Actividades</h2>


            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre de la etapa</th>
                    <th className="hide-sm headTable">Descripción</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listActivity}</tbody>
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

AdminActivity.propTypes = {
    getAllActivity: PropTypes.func.isRequired,
    activity: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    activity: state.activity
})

export default connect(mapStateToProps, {getAllActivity})(AdminActivity)
