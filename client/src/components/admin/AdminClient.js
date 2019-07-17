import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getAllClient, deleteClientById, reactiveClientById } from '../../actions/client';

const AdminClient = ({getAllClient, reactiveClientById, deleteClientById, client: {client}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");

    const [statusFilter, setStatus] = useState("");

    const modifyStatus = (e) => {
        setStatus(e.target.value);
        setCurrent(1);
    }

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

    //pregunta si quiere volver a reactivar al usuario
    const [showReactive, setReactiveShow] = useState(false);

    const modalReactive = () => {
        if(showReactive){
            setReactiveShow(false);
        }else{
            setReactiveShow(true);
        }
    }
    
    const askReactive = (nameComplete, idToDelete) => {
        setComplete(nameComplete)
        setId(idToDelete)
        modalReactive();
    }
    //--------

    const askDelete = (nameComplete, IdToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setId(IdToDelete)
        modalAdmin();
    }

    useEffect(() => {
        getAllClient();
    }, [getAllClient]);

    const reactiveClient = (idClient) => {
        reactiveClientById(idClient);
        modalReactive();
    }

    const deleteClient = (idClient) => {
        deleteClientById(idClient);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(client != null){

        var clientFilter = client;

        if(statusFilter != ""){
            var clientFilter =  client.filter(function(usr) {
                return usr.status === statusFilter;
            });
        }

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTask = clientFilter.slice(indexOfFirstTodo, indexOfLastTodo);

        var listClient = currentTask.map((cli) =>
            <tr key={cli._id}>
                <td>{cli.name}</td>
                <td className="hide-sm">{cli.cuil}</td>
                <td className="hide-sm">{cli.email}</td>
                <td className="hide-sm centerBtn">

                    <Link to={`/admin-client/client-detail/${cli._id}`} className="btn btn-success my-1">
                        <i className="fas fa-info-circle"></i>
                    </Link>
                    
                    {cli.status === "ACTIVO" ?  <Link to={`/admin-client/edit-client/${cli._id}`} className="btn btn-primary">
                                                    <i className="far fa-edit"></i>
                                                </Link>
                                               : ""
                    }

                    {cli.status === "ACTIVO" ?   <a onClick={e => askDelete(cli.name, cli._id)} className="btn btn-danger">
                                                    <i className="far fa-trash-alt"></i>
                                                </a> : 
                                            <a onClick={e => askReactive(cli.name, cli._id)} className="btn btn-warning my-1">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }

                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(client.length / todosPerPage); i++) {
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
                <Modal.Title>Eliminar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar el cliente: {nameComplete}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
                <a onClick={e => deleteClient(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    );


    const modalReactiveHtml = (
        <Modal show={showReactive} onHide={e => modalReactive()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar Cliente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de reactivar el cliente: {nameComplete}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalReactive()}>
                Cerrar
                </Button>
                <a onClick={e => reactiveClient(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    )

    return (
        <Fragment>

            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin" className="btn btn-secondary">
                        Atras
                    </Link>

                    <Link to="/admin-client/create-client"  className="btn btn-primary my-1">
                        Nuevo Cliente
                    </Link>
                </div>

                <div className="form-group col-lg-6 col-sm-6 selectStatus">
                    <select name="status" className="form-control selectOption" onChange = {e => modifyStatus(e)}>
                            <option value="">TODOS</option>
                            <option value="ACTIVO">ACTIVOS</option>
                            <option value="INACTIVO">INACTIVOS</option>
                    </select>
                </div>
            </div>

            <h2 className="my-2">Lista de Clientes</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre del cliente</th>
                    <th className="hide-sm headTable">CUIL</th>
                    <th className="hide-sm headTable">Email</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listClient}</tbody>
            </table>

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            {modal}

            {modalReactiveHtml}
            
        </Fragment>
    )
}

AdminClient.propTypes = {
    getAllClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    deleteClientById: PropTypes.func.isRequired,
    reactiveClientById: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    client: state.client
})

export default connect(mapStateToProps, {getAllClient, deleteClientById, reactiveClientById})(AdminClient)
