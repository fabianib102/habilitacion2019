import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Navbar, Nav } from 'react-bootstrap';

const NavbarGral = ({ auth: {isAuthenticated, loading}, logout }) => {

  const authLinks = (
    <Nav>
      
      <Link to="/dashboard">
          Inicio
      </Link>

      <Link to="/admin-user">
          Usuarios
      </Link>

      <Link to="/admin-task">
          Tareas
      </Link>

      <Link to="/admin-risk">
          Riesgos
      </Link>

      <Link to="/admin-project-type">
          Tipos de proyecto
      </Link>

      <Link to="/admin-client">
          Cliente
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
        <i className="fas fa-tools"></i> Sistema de gestión de Proyectos
      </Link>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        
        <Nav className="mr-auto">
        </Nav>
        
        { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }

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
