import React, {Fragment, useState} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { createProject } from '../../actions/project';

const CreateProject = ({createProject, history}) => {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        providedDate: ''
    });

    const {
        name,
        description,
        startDate,
        providedDate
    } = formData;
    
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        createProject(formData, history);
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Crear nuevo proyecto
            </h1>
            <p className="lead">
                <i className="fas fa-edit"></i> Ingresa los datos correspondientes respecto al proyecto
            </p>
            <small>* campos requeridos</small>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                
                <div className="form-group">
                <select name="status">
                    <option value="0">* Select Professional Status</option>
                    <option value="Developer">Developer</option>
                    <option value="Junior Developer">Junior Developer</option>
                    <option value="Senior Developer">Senior Developer</option>
                    <option value="Manager">Manager</option>
                    <option value="Student or Learning">Student or Learning</option>
                    <option value="Instructor">Instructor or Teacher</option>
                    <option value="Intern">Intern</option>
                    <option value="Other">Other</option>
                </select>
                <small className="form-text"
                    >Dejar para poner el tipo y subtipo</small
                >
                </div>

                <div className="form-group">
                <input type="text" placeholder="Nombre" name="name" value={name} 
                onChange={e => {onChange(e)}} />
                <small className="form-text">Nombre del proyecto</small>
                </div>

                <div className="form-group">
                <input type="text" placeholder="Fecha de comienzo" name="startDate" value={startDate}
                onChange={e => {onChange(e)}} />
                <small className="form-text">Comienzo de proyecto</small>
                </div>

                <div className="form-group">
                <input type="text" placeholder="Fecha de fin previsto" name="providedDate" value={providedDate}
                onChange={e => {onChange(e)}} />
                <small className="form-text">Fin previsto de proyecto</small>
                </div>

                <div className="form-group">
                <textarea placeholder="Una descripción del proyecto" name="description" value={description}
                onChange={e => {onChange(e)}} />
                <small className="form-text">Escribe una descripción</small>
                </div>

                <input type="submit" className="btn btn-primary my-1" />

                <a className="btn btn-light my-1" href="dashboard.html">Go Back</a>

            </form>
        </Fragment>
    )
}

CreateProject.propTypes = {
    createProject: PropTypes.func.isRequired
}


export default connect(null, {createProject})(withRouter(CreateProject));
