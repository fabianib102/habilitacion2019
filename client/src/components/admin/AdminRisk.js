import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllRisk, deleteRiskById } from '../../actions/risk';

const AdminRisk = ({deleteRiskById, getAllRisk, risks: {risks}}) => {

    useEffect(() => {
        getAllRisk();
    }, [getAllRisk]);

    const deleteRisk = (id) => {
        deleteRiskById(id)
    }

    if(risks != null){

        var listRisks = risks.map((ri) =>
            <tr key={ri._id}>
                <td>{ri.name}</td>
                <td className="hide-sm">{ri.description}</td>
                <td className="hide-sm">
                    <Link to="/" className="btn btn-primary">
                        Editar
                    </Link>
                </td>
                <td className="hide-sm">
                    <a onClick={e => deleteRisk(ri._id)} className="btn btn-danger">
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

            <Link to="/admin-risk/create-risk" className="btn btn-primary my-1">
                Nuevo Riesgo
            </Link>

            <h2 className="my-2">Lista de riesgos</h2>

            <table className="table">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th className="hide-sm">Descripción</th>
                    <th className="hide-sm"></th>
                    <th className="hide-sm"></th>
                </tr>
                </thead>
                <tbody>{listRisks}</tbody>
            </table>

        </Fragment>
    )
}

AdminRisk.propTypes = {
    getAllRisk: PropTypes.func.isRequired,
    deleteRiskById: PropTypes.func.isRequired,
    risks: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    risks: state.risk
})

export default connect(mapStateToProps, {getAllRisk, deleteRiskById})(AdminRisk);
