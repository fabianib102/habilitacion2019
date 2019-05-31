import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
import PropTypes from 'prop-types';


const Register = ({setAlert, register, isAuthenticated}) => {

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
      register({name, surname, rol, email, pass});
    }
  }

  if(isAuthenticated){
     return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Crea tu cuenta</p>
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
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Ya tienes una cuenta <Link to="/login">Entrá</Link>
      </p>
    </Fragment>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {setAlert, register})(Register);
