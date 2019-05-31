import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import {connect} from 'react-redux';

const ListProjects = ({project}) => {

  console.log(project.project);

  const listProject = project.project;

  if(listProject !== null){
    var listItems = listProject.map((pro) =>
      <tr key={pro._id}>
        <td>{pro.name}</td>
        <td className="hide-sm">{pro.startDate}</td>
        <td className="hide-sm">{pro.providedDate}</td>
        <td className="hide-sm">
          <Link to="/" className="btn btn-primary my-1">
            Ingresar
          </Link>
        </td>
      </tr>
    );
  }

  return (
    <Fragment>
      <h2 className="my-2">Lista de proyectos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre del proyecto</th>
            <th className="hide-sm">Fecha de inicio</th>
            <th className="hide-sm">Fecha de Fin Previsto</th>
            <th className="hide-sm"></th>
          </tr>
        </thead>
        <tbody>{listItems}</tbody>
      </table>
    </Fragment>
  )
}

ListProjects.propTypes = {
  project: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  project: state.project
})

export default connect(mapStateToProps)(ListProjects);
