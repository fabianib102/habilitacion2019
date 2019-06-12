import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Card, Button, ProgressBar } from 'react-bootstrap';
import {connect} from 'react-redux';

const ListProjects = ({project, history}) => {

  console.log(project.project);

  const listProject = project.project;

  if(listProject !== null){
    var listItems = listProject.map((pro) =>

      <div className="col-md-4 card-proyect" key={pro._id}>

        <Card bg="dark" text="white">
          <Card.Header>{pro.name}</Card.Header>
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">Inicio: {pro.startDate}</Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">Fin previsto: {pro.providedDate}</Card.Subtitle>
            <Card.Text>
              {pro.description}
            </Card.Text>

            <Card.Title className="percentCustom">60%</Card.Title>
            <ProgressBar className="progressCustom" now={60} />

            <Button href="/proyect" variant="primary" className="btnin">Ingresar</Button>
            
          </Card.Body>

        </Card>

      </div>


    );
  }

  return (
    <Fragment>

      {/* <table className="table">
        <thead>
          <tr>
            <th>Nombre del proyecto</th>
            <th className="hide-sm">Fecha de inicio</th>
            <th className="hide-sm">Fecha de Fin Previsto</th>
            <th className="hide-sm"></th>
          </tr>
        </thead>
        <tbody>{listItems}</tbody>
      </table> */}

      <div className="row">

        {listItems}

      </div>

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
