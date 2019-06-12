import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProjectSubType, deleteProjectSubTypeById } from '../../actions/projectSubType';

const AdminProjectSubType = ({deleteProjectSubTypeById, getAllProjectSubType, projectSubTypes: {projectSubTypes}}) => {

    useEffect(() => {
        getAllProjectSubType();
    }, [getAllProjectSubType]);

    const deleteProjectSubType = (id) => {
        deleteProjectSubTypeById(id);
    }

    if(projectSubTypes != null){
        var listSubTypes = projectSubTypes.map((pro) =>
            <tr key={pro._id}>
                <td>{pro.name}</td>
                <td className="hide-sm">{pro.type}</td>
                <td className="hide-sm">{pro.description}</td>
                <td className="hide-sm">
                    <Link to="/" className="btn btn-primary">
                        Editar
                    </Link>
                </td>
                <td className="hide-sm">
                    <a onClick={e => deleteProjectSubType(pro._id)} className="btn btn-danger">
                        Eliminar
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

            <Link to="/admin-project-subtype/create-project-subtype" className="btn btn-primary my-1">
                Nuevo SubTipo de proyecto
            </Link>

            <h2 className="my-2">Lista de Subtipos de proyectos</h2>

            <table className="table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th className="hide-sm">Tipo de Proyecto</th>
                    <th className="hide-sm">Descripción</th>
                    <th className="hide-sm"></th>
                    <th className="hide-sm"></th>
                </tr>
                </thead>
                <tbody>{listSubTypes}</tbody>
            </table>

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
