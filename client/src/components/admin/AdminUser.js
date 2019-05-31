import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllUsers, deleteUserByEmail } from '../../actions/user';

const AdminUser = ({deleteUserByEmail, getAllUsers, users: {users}}) => {

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const deleteUser = (email) => {
        deleteUserByEmail(email)
    }

    if(users !== null){
        var listUsers = users.map((us) =>
            {
                if(us.rol === "Admin"){
                    return <tr key={us._id}>
                                <td>{us.name}</td>
                                <td className="hide-sm">{us.surname}</td>
                                <td className="hide-sm">{us.email}</td>
                                <td className="hide-sm">{us.rol}</td>
                                <td className="hide-sm">
                                <Link to="/" className="btn btn-primary my-1">
                                    Editar
                                </Link>
                                </td>
                                <td className="hide-sm">
                                </td>
                            </tr>
                }
                return <tr key={us._id}>
                            <td>{us.name}</td>
                            <td className="hide-sm">{us.surname}</td>
                            <td className="hide-sm">{us.email}</td>
                            <td className="hide-sm">{us.rol}</td>
                            <td className="hide-sm">
                            <Link to="/" className="btn btn-primary my-1">
                                Editar
                            </Link>
                            </td>
                            <td className="hide-sm">
                            <a onClick={e => deleteUser(us.email)} className="btn btn-danger my-1">
                                Borrar
                            </a>
                            </td>
                        </tr>
            }
        );
    }

  return (
    <Fragment>

        <Link to="/admin" className="btn btn-secondary">
            Atras
        </Link>

        <Link to="/admin-user/create-user" className="btn btn-primary my-1">
            Nuevo Usuario
        </Link>

        <h2 className="my-2">Lista de usuarios</h2>
        <table className="table">
            <thead>
            <tr>
                <th>Nombre</th>
                <th className="hide-sm">Apellido</th>
                <th className="hide-sm">Email</th>
                <th className="hide-sm">Rol</th>
                <th className="hide-sm"></th>
                <th className="hide-sm"></th>
            </tr>
            </thead>
            <tbody>{listUsers}</tbody>
        </table>

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
