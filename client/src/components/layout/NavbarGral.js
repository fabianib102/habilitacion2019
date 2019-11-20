import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Navbar, Nav } from 'react-bootstrap';

const NavbarGral = ({ auth: {isAuthenticated, loading, user}, logout }) => {
  
  
  
  const userLinks = (

    <Nav>

      <Link to="/dashboard">
          Inicio
      </Link>

      <a onClick={logout}>
        <i className="fas fa-sign-out-alt"></i>{' '}
        Salir
      </a>

    </Nav>

  );



  const authLinks = (
    <Nav>
      
      <Link to="/admin">
          Inicio
      </Link>

      <Link to="/admin-user">
        RRHH
      </Link>

      <Link to="/admin-project">
          Proyectos
      </Link>

      <Link to="/admin-project-type">
          Tipos de Proyectos
      </Link>
      <Link to="/admin-risk">
          Riesgos
      </Link>      

      <Link to="/admin-client">
          Clientes
      </Link>

      <Link to="/admin-agent">
          Referentes
      </Link>

      <Link to="/admin-team">
          Equipos
      </Link>

      <Link to="/admin-province">
          Provincias
      </Link>
      <Link to="/admin-task">
          Tareas
      </Link>


      <a onClick={logout}>
        <i className="fas fa-sign-out-alt"></i>{' '}
        Salir
      </a>

    </Nav>
  );

  const guestLinks = (
    <Nav>

      <Link to="/login">Entrar</Link>

    </Nav>
  );

  return (

    <Navbar expand="lg" bg="dark" variant="dark" fixed="top">
      
      <Link to="/">
        <i className="fas fa-tools"></i> Sistema de Gestión de Proyectos
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        
        <Nav className="mr-auto">
        </Nav>
        
        { !loading && (<Fragment>{ isAuthenticated ? user !== null && user.rol === "Integrante de Equipo de Proyecto" ? userLinks : authLinks : guestLinks }</Fragment>) }

      </Navbar.Collapse>
    </Navbar>

    
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logout})(NavbarGral);
