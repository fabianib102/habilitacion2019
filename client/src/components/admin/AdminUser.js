import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUsers, deleteUserByEmail } from '../../actions/user';

const AdminUser = ({deleteUserByEmail, getAllUsers, users: {users}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const deleteUser = (email) => {
        deleteUserByEmail(email)
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(users !== null){

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentUsers = users.slice(indexOfFirstTodo, indexOfLastTodo);

        var listUsers = currentUsers.map((us) =>
            <tr key={us._id}>
                <td className="hide-sm">{us.surname}</td>
                <td className="hide-sm">{us.name}</td>
                <td className="hide-sm">{us.email}</td>
                <td className="hide-sm">{us.rol}</td>
                
                <td className="hide-sm">

                    <Link to={`/admin-user/user-detail/${us._id}`} className="btn btn-success my-1">
                        <i className="fas fa-info-circle"></i>
                    </Link>
                    
                    <Link to={`/admin-user/user-detail/${us._id}`} className="btn btn-warning my-1">
                        <i className="fas fa-key"></i>
                    </Link>

                    <Link to={`/admin-user/edit-user/${us._id}`} className="btn btn-primary my-1">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => deleteUser(us.email)} className="btn btn-danger my-1">
                        <i className="far fa-trash-alt"></i>
                    </a>

                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(users.length / todosPerPage); i++) {
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

            <Link to="/admin-user/create-user"  className="btn btn-primary my-1">
                Nuevo Usuario
            </Link>

            <h2 className="my-2">Lista de usuarios</h2>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Apellido</th>
                    <th className="hide-sm headTable">Nombre</th>
                    <th className="hide-sm headTable">Email</th>
                    <th className="hide-sm headTable">Rol</th>
                    <th className="hide-sm headTable">Opciones</th>
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

        </Fragment>
    )
}

AdminUser.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    deleteUserByEmail: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    users: state.users
})

export default connect(mapStateToProps, {getAllUsers, deleteUserByEmail})(AdminUser);
