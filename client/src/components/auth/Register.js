import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth';
import PropTypes from 'prop-types';


const Register = ({setAlert, register, isAuthenticated}) => {

  const [formData, SetFormData] = useState({
    // name: '',
    // surname: '',
    // rol: '',
    email: '',
    pass: '',
    repeatPass: ''
  });

  const {email, pass, repeatPass} = formData; //name, surname, rol,

  const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
    console.log("entra",email,pass,repeatPass)
    console.log("->",pass !== repeatPass, pass === "",repeatPass === "")
    if(email !== ""){
      if(pass !== repeatPass | (pass === "" | repeatPass === "")){
        setAlert('Las contraseñas deben coincidir y no deben ser vacias', 'danger');
      }else{
        register({name:"admin", surname:"Admin", rol:"Administrador General de Sistema", identifier:"00000", email, pass, isUserRoot:true});
    
    }
    }else{
      setAlert('No se ingresó un mail', 'danger');
    }
  }

  if(isAuthenticated){
     return <Redirect to="/dashboard" />
  }

  return (
    <Fragment>
      <form className="form" onSubmit={e => onSubmit(e)}>
      <div className="row">
          <div className="col-sm-3 col-md-3"></div>              
          <div className="col-sm-7 col-md-7">
            <div class="card">                      
              <div class="card-header"> <h5><i className="fas fa-user"></i> Registrar Cuenta de Administrador</h5></div>
                <div class="card-body">
                  {/* <div className="form-group">
                  <h5>Nombre</h5>
                    <input 
                      type="text"
                      class="form-control" 
                      placeholder="Nombre" 
                      name="name" 
                      value={name}
                      onChange = {e => onChange(e)}
                    />
                  </div>
                  <div className="form-group">
                  <h5>Apellido</h5>
                    <input 
                      type="text"
                      class="form-control" 
                      placeholder="Apellido" 
                      name="surname" 
                      value={surname}
                      onChange = {e => onChange(e)}
                    />
                  </div>
                  <div className="form-group">
                  <h5>Rol</h5>
                    <input 
                      type="text"
                      class="form-control" 
                      placeholder="Rol" 
                      name="rol" 
                      value={rol}
                      onChange = {e => onChange(e)}
                    />
                  </div> */}
                  <div className="form-group">
                  <h5>Email</h5>
                    <input 
                      type="email"
                      class="form-control" 
                      placeholder="Email"
                      onChange = {e => onChange(e)} 
                      name="email"
                      value={email}
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
                    />
                  </div>
                  <div className="form-group">
                  <h5>Confirmar Contraseña</h5>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Contraseña"
                      name="repeatPass"
                      minLength="6"
                      onChange = {e => onChange(e)}
                      value={repeatPass}
                    />
                  </div>
                  <input type="submit" className="btn btn-primary" value="Registrar" />
                  </div>
              </div>
          </div>
      </div>
      </form>

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
