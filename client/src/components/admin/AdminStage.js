import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { getAllStage, deleteStageById, reactiveStageById } from '../../actions/stage';

const AdminStage = ({ getAllStage, deleteStageById, reactiveStageById, stage: {stage}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");

    useEffect(() => {
        getAllStage();
    }, [getAllStage]);


    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(stage != null){

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentStage = stage.slice(indexOfFirstTodo, indexOfLastTodo);

        var listStage = currentStage.map((ti) =>
            <tr key={ti._id}>
                <td>{ti.name}</td>
                <td className="hide-sm">{ti.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-stage/edit-stage/${ti._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    {ti.status === "ACTIVO" ? <a onClick={e => askDelete(ti.name, ti._id)} className="btn btn-danger" title="Eliminar">
                                                    <i className="far fa-trash-alt coloWhite"></i>
                                                </a>
                                            :
                                            <a onClick={e => askReactive(ti.name, ti._id)} className="btn btn-warning my-1" title="Reactivar">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }

                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(stage.length / todosPerPage); i++) {
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

    const askDelete = (nameComplete, IdToDelete) => {
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }

    const [show, setShow] = useState(false);

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    const deleteStage = (id) => {
        deleteStageById(id);
        modalAdmin();
    }

    //#region modal para eliminar la etapa

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Etapa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar la etapa: {nameComplete}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
                <a onClick={e => deleteStage(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    )

    //#endregion


    //#region reactivar la etapa

    const askReactive = (nameComplete, IdToReactive) => {
        setComplete(nameComplete)
        setId(IdToReactive)
        modalReactiveAdmin();
    }

    const [showReactive, setShowReactive] = useState(false);

    const modalReactiveAdmin = () => {
        if(showReactive){
            setShowReactive(false);
        }else{
            setShowReactive(true);
        }
    }

    const reactiveStage = (id) => {
        reactiveStageById(id);
        modalReactiveAdmin();
    }

    const modalReactive = (
        <Modal show={showReactive} onHide={e => modalReactiveAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar Etapa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de reactivar la etapa: {nameComplete}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalReactiveAdmin()}>
                Cerrar
                </Button>
                <a onClick={e => reactiveStage(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    )

    //#endregion


    return (

        <Fragment>

            <Link to="/admin" className="btn btn-secondary">
                Atrás
            </Link>

            <Link to="/admin-stage/create-stage" className="btn btn-primary my-1">
                Nueva Etapa
            </Link>

            <h2 className="my-2">Administración de Etapa</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre de la etapa</th>
                    <th className="hide-sm headTable">Descripción</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listStage}</tbody>
            </table>

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            {modal}

            {modalReactive}

        </Fragment>
    )
}

AdminStage.propTypes = {
    getAllStage: PropTypes.func.isRequired,
    deleteStageById: PropTypes.func.isRequired,
    reactiveStageById: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    stage: state.stage
})

export default connect(mapStateToProps, {getAllStage, deleteStageById, reactiveStageById})(AdminStage)
