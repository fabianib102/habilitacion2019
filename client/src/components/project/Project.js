import React, {Fragment, useEffect} from 'react';
import { Accordion, Card } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllTask } from '../../actions/task';

const Project = ({getAllTask, tasks: {tasks}}) => {

    useEffect(() => {
        getAllTask();
    }, [getAllTask]);

    if(tasks != null){

        var list = tasks.map((t) =>

            <Card key={t._id}>
                <Accordion.Toggle className="headerCustom" as={Card.Header} eventKey={t._id}>
                    {t.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={t._id}>
                    <Card.Body>
                        <div>Fecha de inicio Previsto: {t.startDate}</div>

                        <div>Fecha de Fin Previsto: {t.endDate}</div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

        );

    }

    const ListTask = (

        <div className="card-body">
            <Accordion>
                {list}
            </Accordion>
        </div>

    );


    return (

        <Fragment>

            <h4 className="text-primary">Nombre del proyecto</h4>

            <Link to="/create-task" className="btn btn-primary my-1">
                <i className="fas fa-plus-circle"></i>{'  '}
                Agregar tarea
            </Link>
            
            <div className="row rowProyect">

                <div className="col-lg-5">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i> Listado de tareas
                        </div>

                        {ListTask}

                    </div>

                </div>

                <div className="col-lg-7">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i> Descripción
                        </div>

                        <div className="card-body">
                            Descripción total del proyecto
                        </div>

                    </div>

                </div>

            </div>

        </Fragment>

    )
}

Project.propTypes = {
    getAllTask: PropTypes.func.isRequired

}

const mapStateToProps = state => ({
    tasks: state.task
})

export default connect(mapStateToProps, {getAllTask})(Project)
