import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getAllProjectType, deleteProjectTypeById } from '../../actions/projectType';

const AdminProjectType = ({deleteProjectTypeById, getAllProjectType, projectTypes: {projectTypes}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(5);

    const [nameType, setType] = useState("");
    

    const [idDelete, setId] = useState("");

    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }
    //--------

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    useEffect(() => {
        getAllProjectType();
    }, [getAllProjectType]);

    const deleteProjectType = (id) => {
        deleteProjectTypeById(id);
        modalAdmin();
    }

    const askDelete = (typeName, idToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setType(typeName)
        setId(idToDelete)
        modalAdmin();
    }

    if(projectTypes != null){

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentProjectType = projectTypes.slice(indexOfFirstTodo, indexOfLastTodo);

        var listTypes = currentProjectType.map((pro) =>
            <tr key={pro._id}>
                <td>{pro.name}</td>
                <td className="hide-sm">{pro.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-project-subtype/${pro._id}`} className="btn btn-success">
                        <i className="fas fa-stream"></i>
                    </Link>
                    <Link to={`/admin-project-type/edit-project-type/${pro._id}`} className="btn btn-primary">
                        <i className="far fa-edit"></i>
                    </Link>
                    <a onClick={e => askDelete(pro.name, pro._id)} className="btn btn-danger" >
                        <i className="far fa-trash-alt"></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(projectTypes.length / todosPerPage); i++) {
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

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Tipo de Proyecto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro eliminar el tipo de proyecto: {nameType}
                </p>
                <p>
                    Recuerda que se eliminaran los subtipos asociados a este tipo de proyectos.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
                <a onClick={e => deleteProjectType(idDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    )


    return (

        <Fragment>
            
            <Link to="/admin" className="btn btn-secondary">
                Atras
            </Link>

            <Link to="/admin-project-type/create-project-type" className="btn btn-primary my-1">
                Nuevo Tipo de proyecto
            </Link>

            <h2 className="my-2">Lista de tipos de proyectos</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre</th>
                    <th className="hide-sm headTable">Descripción</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listTypes}</tbody>
            </table>

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            {modal}

        </Fragment>
    )
}

AdminProjectType.propTypes = {
    getAllProjectType: PropTypes.func.isRequired,
    deleteProjectTypeById: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    projectTypes: state.projectType
})

export default connect(mapStateToProps, {getAllProjectType, deleteProjectTypeById})(AdminProjectType);
