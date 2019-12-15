import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import { Link} from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {changePass} from '../../actions/user';
import PropTypes from 'prop-types';


const ChangePassword = ({match,history,setAlert, changePass, auth:{user}}) => {
console.log(user)
  const [formData, SetFormData] = useState({
    passAct:'',
    pass: '',
    repeatPass: ''
  });

  const {pass,passAct, repeatPass} = formData; 

  const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

  const onSubmit = async e => {
    e.preventDefault();
    
    if((passAct==="" | pass === "" | repeatPass === "" | pass !== repeatPass)){
      setAlert('Las contraseñas deben coincidir y no deben ser vacias', 'danger');
    }else{
      changePass({idUser:match.params.idUser,pass,passAct,firstConection:false,history});    
    }   
  
  }


  return (
    <Fragment>
      <form className="form" onSubmit={e => onSubmit(e)}>
      <div className="row">
          <div className="col-sm-3 col-md-3"></div>              
          <div className="col-sm-7 col-md-7">
            <div class="card">                      
              <div class="card-header"> <h5><i className="fas fa-user"></i> Cambio de Contraseña</h5></div>
                <div class="card-body">                
                  <div className="form-group">
                  <h5>Contraseña Actual</h5>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Contraseña"
                      name="passAct"
                      minLength="6"
                      onChange = {e => onChange(e)}
                      value={passAct}
                    />
                  </div>
                  <div className="form-group">
                  <h5>Nueva Contraseña</h5>
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
                  <input type="submit" className="btn btn-primary" value="Cambiar" />
                  <Link to="/admin" className="btn btn-danger">
                      Cancelar
                  </Link>
                  </div>
              </div>
          </div>
      </div>
      </form>

    </Fragment>
  )
}

ChangePassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  changePass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, {setAlert, changePass})(ChangePassword);
