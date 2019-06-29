import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProjectSubType, deleteProjectSubTypeById } from '../../actions/projectSubType';

const AdminProjectSubType = ({match, deleteProjectSubTypeById, getAllProjectSubType, projectSubTypes: {projectSubTypes}, history}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(5);

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    useEffect(() => {
        getAllProjectSubType();
    }, [getAllProjectSubType]);

    const deleteProjectSubType = (id) => {
        deleteProjectSubTypeById(id);
    }

    if(match.params.idProjecType === undefined){
        history.push('/admin-project-type');
    }

    var arrayFilter = [];

    if(projectSubTypes != null){
        
        //filtrado de subtipos por id
        for (let index = 0; index < projectSubTypes.length; index++) {
            const subTypeObj = projectSubTypes[index];
            if(subTypeObj.type === match.params.idProjecType){
                arrayFilter.push(subTypeObj);
            }
        }

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentProjectSubType = arrayFilter.slice(indexOfFirstTodo, indexOfLastTodo);

        var listSubTypes = currentProjectSubType.map((pro) =>
            <tr key={pro._id}>
                <td>{pro.name}</td>
                <td className="hide-sm">{pro.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-project-subtype/edit-project-subtype/${pro._id}`} className="btn btn-primary">
                        <i className="far fa-edit"></i>
                    </Link>
                    <a onClick={e => deleteProjectSubType(pro._id)} className="btn btn-danger">
                        <i className="far fa-trash-alt"></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(projectSubTypes.length / todosPerPage); i++) {
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

            <Link to="/admin-project-type" className="btn btn-secondary">
                Atras
            </Link>

            <Link to="/admin-project-subtype/create-project-subtype" className="btn btn-primary my-1">
                Nuevo SubTipo de proyecto
            </Link>

            <h2 className="my-2">Lista de Subtipos de proyectos <span className="badge badge-warning">{arrayFilter.length > 0 ? "": "(No hay subtipos asociado)"}</span> </h2>

            <table className="table table-hover table-dark">
                <thead>
                <tr>
                    <th className="hide-sm headTable letterBlack">Nombre</th>
                    <th className="hide-sm headTable letterBlack">Descripción</th>
                    <th className="hide-sm headTable letterBlack centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listSubTypes}</tbody>
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

AdminProjectSubType.propTypes = {
    getAllProjectSubType: PropTypes.func.isRequired,
    deleteProjectSubTypeById: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    projectSubTypes: state.projectSubType
})

export default connect(mapStateToProps, {getAllProjectSubType, deleteProjectSubTypeById})(AdminProjectSubType)
