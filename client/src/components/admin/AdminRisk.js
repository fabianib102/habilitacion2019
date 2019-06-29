import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllRisk, deleteRiskById } from '../../actions/risk';

const AdminRisk = ({deleteRiskById, getAllRisk, risks: {risks}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(5);

    useEffect(() => {
        getAllRisk();
    }, [getAllRisk]);

    const deleteRisk = (id) => {
        deleteRiskById(id)
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(risks != null){

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentRisk = risks.slice(indexOfFirstTodo, indexOfLastTodo);

        var listRisks = currentRisk.map((ri) =>
            <tr key={ri._id}>
                <td>{ri.name}</td>
                <td className="hide-sm">{ri.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-risk/edit-risk/${ri._id}`} className="btn btn-primary">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => deleteRisk(ri._id)} className="btn btn-danger">
                        <i className="far fa-trash-alt"></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(risks.length / todosPerPage); i++) {
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

            <Link to="/admin-risk/create-risk" className="btn btn-primary my-1">
                Nuevo Riesgo
            </Link>

            <h2 className="my-2">Lista de riesgos</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre</th>
                    <th className="hide-sm headTable">Descripción</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listRisks}</tbody>
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

AdminRisk.propTypes = {
    getAllRisk: PropTypes.func.isRequired,
    deleteRiskById: PropTypes.func.isRequired,
    risks: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    risks: state.risk
})

export default connect(mapStateToProps, {getAllRisk, deleteRiskById})(AdminRisk);
