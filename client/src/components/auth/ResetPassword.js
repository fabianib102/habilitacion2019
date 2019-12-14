import React, {Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {resetPass} from '../../actions/auth';
import PropTypes from 'prop-types';
import { getAllUsers } from '../../actions/user';


const ResetPassword = ({match,history, setAlert, resetPass,auth:{user}, users: {users}, getAllUsers}) => {

  const [formData, SetFormData] = useState({  
    pass: '',
    repeatPass: ''
  });

  const {pass, repeatPass} = formData; 

  const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

  useEffect(() => {
    getAllUsers();
}, [getAllUsers]);

if (users !== null){
  var userChange = users.filter(function(us) {
    return us._id ===  match.params.idUser; 
  });

  // console.log(userChange)
  if (userChange !== null){
    var name = userChange[0].name;
    var surname = userChange[0].surname; 
  }else{
    var name = "-";
    var surname = "-"
  }
  
}
  const onSubmit = async e => {
    e.preventDefault();
        
      if((pass === "" | repeatPass === "" | pass !== repeatPass)){
        setAlert('Las contraseñas deben coincidir y no deben ser vacias', 'danger');
      }else{
        resetPass({idUser:match.params.idUser,pass,firstConection:true,history});    
      }   
  }

  return (
    <Fragment>
      <form className="form" onSubmit={e => onSubmit(e)}>
      <div className="row">
          <div className="col-sm-3 col-md-3"></div>              
          <div className="col-sm-7 col-md-7">
            <div class="card">                      
              <div class="card-header"> <h5><i className="fas fa-user"></i> Reseteo de Contraseña para <b> {users ? surname: "-"},{users ? name: "-"}</b></h5></div>
                <div class="card-body">
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

ResetPassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  resetPass: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users
})

export default connect(mapStateToProps, {setAlert, resetPass, getAllUsers})(ResetPassword);
