import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getAllUsers, deleteUserByEmail, reactiveUserByEmail } from '../../actions/user';

const AdminUser = ({deleteUserByEmail, reactiveUserByEmail, getAllUsers, users: {users}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [emailDelete, setEmail] = useState("");

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

    const askDelete = (nameComplete, EmailToDelete) => {
        //setea los valores del nombre del tipo de proyecto
        setComplete(nameComplete)
        setEmail(EmailToDelete)
        modalAdmin();
    }


    //pregunta si quiere volver a reactivar al usuario
    const [showReactive, setReactiveShow] = useState(false);

    const modalReactive = () => {
        if(showReactive){
            setReactiveShow(false);
        }else{
            setReactiveShow(true);
        }
    }
    
    const askReactive = (nameComplete, EmailToDelete) => {
        setComplete(nameComplete)
        setEmail(EmailToDelete)
        modalReactive();
    }
    //--------

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const reactiveUser = (email) => {
        reactiveUserByEmail(email);
        modalReactive();
    }

    const deleteUser = (email) => {
        deleteUserByEmail(email);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(users !== null){

        var usersFilter = users;

        if(statusFilter != ""){
            var usersFilter =  users.filter(function(usr) {
                return usr.status === statusFilter;
            });
        }

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentUsers = usersFilter.slice(indexOfFirstTodo, indexOfLastTodo);

        var listUsers = currentUsers.map((us) =>
            <tr key={us._id}>
                <td className="hide-sm">{us.surname}</td>
                <td className="hide-sm">{us.name}</td>
                <td className="hide-sm">{us.email}</td>
                <td className="hide-sm">{us.status}</td>
                <td className="hide-sm">{us.rol}</td>
                
                <td className="hide-sm centerBtn">

                    <Link to={`/admin-user/user-detail/${us._id}`} className="btn btn-success my-1">
                        <i className="fas fa-info-circle"></i>
                    </Link>
                    
                    {/* <Link to={`/admin-user/user-detail/${us._id}`} className="btn btn-warning my-1">
                        <i className="fas fa-key"></i>
                    </Link> */}

                    {/* <Link to={`/admin-user/edit-user/${us._id}`} className="btn btn-primary my-1">
                        <i className="far fa-edit"></i>
                    </Link> */}

                    {us.status === "ACTIVO" ? <Link to={`/admin-user/edit-user/${us._id}`} className="btn btn-primary my-1">
                                                <i className="far fa-edit"></i>
                                               </Link>
                                               : ""
                    }

                    {/* <a onClick={e => askDelete(us.name + " " + us.surname, us.email)} className="btn btn-danger my-1">
                        <i className="far fa-trash-alt"></i>
                    </a> */}

                    {us.status === "ACTIVO" ? <a onClick={e => askDelete(us.name + " " + us.surname, us.email)} className="btn btn-danger my-1">
                                                <i className="far fa-trash-alt"></i>
                                            </a> : 
                                            <a onClick={e => askReactive(us.name + " " + us.surname, us.email)} className="btn btn-warning my-1">
                                                <i className="fas fa-arrow-alt-circle-up"></i>
                                            </a>
                    }

                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(usersFilter.length / todosPerPage); i++) {
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
                <Modal.Title>Eliminar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar el usuario: {nameComplete}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
                <a onClick={e => deleteUser(emailDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </a>
            </Modal.Footer>
        </Modal>
    );

    const modalReactiveHtml = (
        <Modal show={showReactive} onHide={e => modalReactive()}>
            <Modal.Header closeButton>
                <Modal.Title>Reactivar Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de reactivar el usuario: {nameComplete}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalReactive()}>
                Cerrar
                </Button>
                <a onClick={e => reactiveUser(emailDelete)} className="btn btn-primary" >
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

                    <Link to="/admin-user/create-user"  className="btn btn-primary my-1">
                        Nuevo Usuario
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
            

            <h2 className="my-2">Lista de usuarios</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Apellido</th>
                    <th className="hide-sm headTable">Nombre</th>
                    <th className="hide-sm headTable">Email</th>
                    <th className="hide-sm headTable">Estado</th>
                    <th className="hide-sm headTable">Rol</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listUsers}</tbody>
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

AdminUser.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    deleteUserByEmail: PropTypes.func.isRequired,
    reactiveUserByEmail: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    users: state.users
})

export default connect(mapStateToProps, {getAllUsers, deleteUserByEmail, reactiveUserByEmail})(AdminUser);
