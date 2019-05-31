import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {registerUser} from '../../actions/user';

const AdminCreateUser = ({setAlert, registerUser, history}) => {

    const [formData, SetFormData] = useState({
        name: '',
        surname: '',
        rol: '',
        email: '',
        pass: '',
        repeatPass: ''
      });
    
    const {name, surname, rol, email, pass, repeatPass} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        if(pass !== repeatPass){
            setAlert('Las contraseñas no coinciden.', 'danger');
        }else{
            registerUser({name, surname, rol, email, pass, history});
        }
    }

  return (
    <Fragment>
        
        <Link to="/admin-user" className="btn btn-secondary">
            Atras
        </Link>

        <p className="lead"><i className="fas fa-user"></i> Creación de un nuevo usuario</p>
        <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="form-group">
            <input 
                type="text" 
                placeholder="Nombre" 
                name="name" 
                value={name}
                onChange = {e => onChange(e)}
            />
            </div>
            <div className="form-group">
            <input 
                type="text" 
                placeholder="Apellido" 
                name="surname" 
                value={surname}
                onChange = {e => onChange(e)}
            />
            </div>
            <div className="form-group">
            <input 
                type="text" 
                placeholder="Rol" 
                name="rol" 
                value={rol}
                onChange = {e => onChange(e)}
            />
            </div>
            <div className="form-group">
            <input 
                type="email" 
                placeholder="Email"
                onChange = {e => onChange(e)} 
                name="email"
                value={email}
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                placeholder="Contraseña"
                name="pass"
                minLength="6"
                onChange = {e => onChange(e)}
                value={pass}
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                placeholder="Confirmar contraseña"
                name="repeatPass"
                minLength="6"
                onChange = {e => onChange(e)}
                value={repeatPass}
            />
            </div>
            <input type="submit" className="btn btn-primary" value="Registrar" />
        </form>
    </Fragment>
  )
}

AdminCreateUser.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
}

export default connect(null, {setAlert, registerUser})(AdminCreateUser)
