import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { getAllUsers} from '../../actions/user';

const NavbarGral = ({  users: {users}, getAllUsers,auth: {isAuthenticated, loading, user },logout}) => {
   
  useEffect(() => {
    getAllUsers();        
  }, [getAllUsers]);

  const userLinks = (
    <Nav>
      <Link to="/dashboard">
          Inicio
      </Link>

      <NavDropdown className="bg-dark" title="Reportes" id="collasible-nav-dropdown">
        <NavDropdown.Item href={`/team-member/team-member-work-done/${ user && user._id}`}>Reporte de Horas</NavDropdown.Item>
      </NavDropdown>

      <NavDropdown className="bg-dark" title={user ? user.surname + "," + user.name : "Yo"} id="collasible-nav-dropdown">
        <NavDropdown.Item href={`/team-member/team-member-detail/${ user && user._id}`}> <i className="fas fa-user"></i>{' '}Mi Perfil</NavDropdown.Item>
        <NavDropdown.Item onClick={logout}> <i className="fas fa-sign-out-alt"></i>{' '}Salir</NavDropdown.Item>
      </NavDropdown> 
    </Nav>
  );


  const authAdminLinks = (
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

      <Link to="/admin-task">
          Tareas
      </Link>      

      <Link to="/admin-client">
          Clientes
      </Link>

      <Link to="/admin-team">
          Equipos
      </Link>

      {/* <Link to="/admin-agent">
          Referentes
      </Link> */}

      <Link to="/admin-team">
          Equipos
      </Link>

      <Link to="/admin-province">
          Provincias
      </Link>
      

      {/* <NavDropdown className="bg-dark" title="Reportes" id="collasible-nav-dropdown">
        <NavDropdown.Item href={`/admin-project/connectionReport/${ user && user._id}`}>Estado de Usuarios en el Sistema</NavDropdown.Item>
      </NavDropdown> */}

      <NavDropdown className="bg-dark" title={user ? user.surname + "," + user.name : "Yo"} id="collasible-nav-dropdown">
        <NavDropdown.Item href={`/admin-user/user-detailAdmin/${ user && user._id}`}> <i className="fas fa-user"></i>{' '}Mi Perfil</NavDropdown.Item>
        <NavDropdown.Item onClick={logout}> <i className="fas fa-sign-out-alt"></i>{' '}Salir</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );

  const authLiderProjectLinks = (
    <Nav>
      
      <Link to="/admin">
          Inicio
      </Link>
      
      <Link to="/proyect-manager/create-project">
          Nuevo Proyecto
      </Link> 

      {/* <Link to={`/proyect-manager/${ user && user._id}`}>
          Avances
      </Link> */}

      <Link to="/admin-project-type">
          Tipos de Proyectos
      </Link>

      <Link to="/admin-risk">
          Riesgos
      </Link>

      <Link to="/admin-task">
          Tareas
      </Link>      

      <Link to="/admin-client">
          Clientes
      </Link>

      <Link to="/admin-team">
          Equipos
      </Link>

      <NavDropdown className="bg-dark" title="Reportes" id="collasible-nav-dropdown">
        <NavDropdown.Item target="_blank" href={`/proyect-manager/project-manager-reports/client/${ user && user._id}`}>Reporte por Cliente</NavDropdown.Item>
        <NavDropdown.Item target="_blank" href={`/proyect-manager/project-manager-reports/typeProject/${ user && user._id}`}>Reporte por Tipo de Proyectos</NavDropdown.Item>
        <NavDropdown.Item target="_blank" href={`/proyect-manager/project-manager-reports/team/${ user && user._id}`}>Reporte por Equipos</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.4">Reporte por Tareas</NavDropdown.Item>
      </NavDropdown>

      <NavDropdown className="bg-dark" title={user ? user.surname + "," + user.name : "Yo"} id="collasible-nav-dropdown">
        <NavDropdown.Item href={`/proyect-manager/proyect-manager-detail/${ user && user._id}`}> <i className="fas fa-user"></i>{' '}Mi Perfil</NavDropdown.Item>
        <NavDropdown.Item onClick={logout}> <i className="fas fa-sign-out-alt"></i>{' '}Salir</NavDropdown.Item>
      </NavDropdown>  

    </Nav>
  );

  const guestLinks = (
    <Nav>
      {users === null ? "" : users.length === 0 ? "":
      <Link to="/login">Entrar</Link>}
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
        
        { !loading && (<Fragment>{ isAuthenticated ? user !== null && user.rol === "Integrante de Equipo de Proyecto" ? userLinks : user !== null && user.rol === "Responsable de Proyecto" ? authLiderProjectLinks : authAdminLinks : guestLinks }</Fragment>) }

      </Navbar.Collapse>
    </Navbar>

    
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  users: state.users,

});

export default connect(mapStateToProps, {logout, getAllUsers})(NavbarGral);
