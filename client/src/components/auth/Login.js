import React, {Fragment, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
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

  const popoverHelp = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Autenticación</Popover.Title>
      <Popover.Content>
        <p>Para ingresar al sistema, <b>utilice sus credenciales</b> que les fueron proporcionadas</p>
        <p>En caso de no recordarlas, <b>comuníquese con el Administrador</b></p>  
      </Popover.Content>
    </Popover>
  ); 

  return (
    <Fragment>
      {/* <h2 className="large text-primary">Autenticación</h2> */}
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="row">
          <div className="col-sm-3 col-md-3"></div>              
          <div className="col-sm-7 col-md-7">
            <div class="card">                      
              <div class="card-header"> <h5><i className="fas fa-user"></i> Ingresá a tu cuenta</h5></div>
                <div class="card-body">
                  <div className="form-group">
                  <h5>Email</h5>
                    <input 
                      type="email"
                      class="form-control" 
                      placeholder="Email"
                      onChange = {e => onChange(e)} 
                      name="email"
                      value={email}
                      required 
                    />
                  </div>
                  <div className="form-group">
                  <h5>Contraseña</h5>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Contraseña"
                      name="pass"
                      minLength="6"
                      onChange = {e => onChange(e)}
                      value={pass}
                      required
                    />
                  </div>
                  <div className="row">
                        <div className="form-group col-lg-12"> 
                            <div className="float-left">  
                              <input type="submit" className="btn btn-primary" value="Entrar" />
                            </div>
                            <div className="float-right"> 
                                <OverlayTrigger trigger="click" placement="left" overlay={popoverHelp}>
                                    <Link><i class="far fa-question-circle"></i></Link>
                                </OverlayTrigger>
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
      </div>
      </form>
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
