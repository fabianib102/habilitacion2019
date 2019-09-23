import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProject } from '../../actions/project';
import { ProgressBar } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';

const AdminProject = ({getAllProject, project: {project}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    useEffect(() => {
        getAllProject();
    }, [getAllProject]);

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(project != null){

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentRisk = project.slice(indexOfFirstTodo, indexOfLastTodo);

        var listProject = currentRisk.map((ri) =>
            <tr key={ri._id}>

                <td className="text-center">
                    <div className="avatar">
                        <img src="https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png" className="img-avatar"/>
                        {
                            ri.status === "ACTIVO" ? 
                            <span className="avatar-status badge-success"></span>
                            :
                            <span className="avatar-status badge-danger"></span>

                        }
                    </div>
                </td>
                
                <td>
                    <div>{ri.name}</div>
                    <div className="small text-muted">
                        Cliente: {ri.nombreCliente}
                    </div>
                </td>

                <td className="hide-sm">
                    
                    <div className="clearfix">
                        <div className="float-left">
                            <strong>50%</strong>
                        </div>
                        <div className="float-right">
                            <small className="text-muted">
                                Inicio: <Moment format="DD/MM/YYYY">{moment.utc(ri.startDate)}</Moment>
                                {" "}- 
                                Fin: <Moment format="DD/MM/YYYY">{moment.utc(ri.endDate)}</Moment>
                            </small>
                        </div>
                    </div>

                    <ProgressBar variant="success" now={60} />

                </td>


                <td className="hide-sm">
                    <div className="small text-muted">Estado del proyecto</div>
                    <strong>{ri.status}</strong>
                </td>

                <td className="hide-sm centerBtn">
                    
                    <Link to={`/admin-risk/edit-risk/${ri._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    {ri.status === "ACTIVO" ? 
                        <a className="btn btn-danger my-1" title="Eliminar">
                            <i className="far fa-trash-alt coloWhite"></i>
                        </a> : 
                        <a className="btn btn-warning my-1" title="Reactivar">
                            <i className="fas fa-arrow-alt-circle-up"></i>
                        </a>
                    }

                    <Link to={`/admin-project/project-activity/${ri._id}`} className={ri.status === "ACTIVO" ? "btn btn-success my-1" : "btn btn-success my-1 disabledCursor"} title="Ver">
                        <i className="fas fa-search coloWhite"></i>
                    </Link>

                </td>

            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(project.length / todosPerPage); i++) {
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

            <Link to="/admin-project/create-project" className="btn btn-primary my-1">
                Nuevo Proyecto
            </Link>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="text-center hide-sm headTable headClient">
                        <i className="fas fa-user-tie"></i>
                    </th>
                    <th className="hide-sm headTable">Nombre</th>
                    <th className="hide-sm headTable">Avances</th>
                    <th className="hide-sm headTable statusHead">Estado</th>
                    <th className="hide-sm headTable centerBtn optionHead">Opciones</th>
                </tr>
                </thead>
                <tbody>{listProject}</tbody>
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

AdminProject.propTypes = {
    getAllProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.project
})

export default connect(mapStateToProps, {getAllProject})(AdminProject)
