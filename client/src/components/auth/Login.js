import React, {Fragment, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {

  const [formData, SetFormData] = useState({
    email: '',
    pass: ''
  });

  const {email, pass} = formData;

  const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
    login(email, pass);
  }

  //redirecciona si está autenticado
  if(isAuthenticated){
    return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Autenticación</h1>
      <p className="lead"><i className="fas fa-user"></i> Ingresa a tu cuenta</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email"
            onChange = {e => onChange(e)} 
            name="email"
            value={email}
            required 
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
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Entrar" />
      </form>
      <p className="my-1">
        No tienes una cuenta? <Link to="/register"> Registrate</Link>
      </p>
    </Fragment>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
