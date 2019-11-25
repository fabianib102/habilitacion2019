import React, {useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllUsers} from '../../actions/user';


const Landing = ({isAuthenticated,users: {users},getAllUsers}) => {
  var firstUser = false;
  
  useEffect(() => {
    getAllUsers();        
  }, [getAllUsers]);
  console.log(users)

  //redirecciona si está autenticado
  if(isAuthenticated){
    return <Redirect to="/dashboard" />
  }
    
  if(users === null){
    console.log("null")
    // firstUser = true;
  }else{
    console.log("else");
    if (users.length !== 0){
      console.log("con")
      firstUser = false;
    }else{
      firstUser = true;
    }
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Sistema de Gestión de Proyectos</h1>
          <p className="lead">
            Planifica, gestiona y supervisa incluso los proyectos más complejos. Colabora y comunícate con tu equipo en un solo lugar.
          </p>
          <div className="buttons">
            {firstUser ?
              <Link to="/register" className="btn btn-primary">Registrar Administrador</Link> :
              <Link to="/login" className="btn btn-primary">Entrar</Link>
              }
          </div>
        </div>
      </div>
    </section>
  )
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
  getAllUsers: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  users: state.users,
})

export default connect(mapStateToProps,{getAllUsers})(Landing);

