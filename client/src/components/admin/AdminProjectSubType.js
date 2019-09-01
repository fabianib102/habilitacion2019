import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProjectSubType, deleteProjectSubTypeById } from '../../actions/projectSubType';


const AdminProjectSubType = ({match, deleteProjectSubTypeById, getAllProjectSubType, projectSubTypes: {projectSubTypes}, projectTypes: {projectTypes}, history}) => {

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
    var nameType = "";

    if(projectSubTypes != null ){
        
        //filtrado de subtipos por id
        for (let index = 0; index < projectSubTypes.length; index++) {
            const subTypeObj = projectSubTypes[index];
            if(subTypeObj.type === match.params.idProjecType){
                arrayFilter.push(subTypeObj);
            }
        }

        //filtrado para buscar el nombre del tuipo de proyecto
        if(projectTypes != null){
            for (let i = 0; i < projectTypes.length; i++) {
                var elementType = projectTypes[i];
                if(elementType._id === match.params.idProjecType){
                    nameType = elementType.name;
                }
            }
        }
        //------

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
        for (let i = 1; i <= Math.ceil(arrayFilter.length / todosPerPage); i++) {
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

    var spanNoSubType = (
        <span className="badge badge-warning">No hay subtipos asociado</span>
    )

    //setNameTypeShow("Algo");
    if(arrayFilter.length > 0){
        spanNoSubType = (
            <span> - {nameType}</span>
        )
    }

    return (

        <Fragment>

            <Link to="/admin-project-type" className="btn btn-secondary">
                Atrás
            </Link>

            <Link to="/admin-project-subtype/create-project-subtype" className="btn btn-primary my-1">
                Nuevo SubTipo de proyecto
            </Link>

            
            <h2 className="my-2">Subtipos de proyectos {spanNoSubType}</h2>

            <table className="table table-hover">
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
    projectSubTypes: state.projectSubType,
    projectTypes: state.projectType
})

export default connect(mapStateToProps, {getAllProjectSubType, deleteProjectSubTypeById})(AdminProjectSubType)