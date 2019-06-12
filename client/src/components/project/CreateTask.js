import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

import {registerTask} from '../../actions/task';

const CreateTask = ({registerTask, history}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const {name, description, startDate, endDate} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {

        e.preventDefault();
        if(name === "" && description === "" && startDate === "" && endDate === ""){
            setAlert('Debes ingresar el nombre, la descripción, fecha de inicio y fin', 'danger');
        }else{
            registerTask({name, description, startDate, endDate, history});
        }
    }

    return (

        <Fragment>

            <Link to="/proyect" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> Nueva tarea</p>

            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Nombre de la tarea" 
                        name="name" 
                        value={name}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Descripción de la tarea" 
                        name="description" 
                        value={description}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="date" 
                        placeholder="Fecha de comienzo" 
                        name="startDate" value={startDate}
                        onChange={e => {onChange(e)}} />
                    <small className="form-text">Comienzo de la tarea prevista</small>
                </div>

                <div className="form-group">
                    <input 
                        type="date" 
                        placeholder="Fecha de fin" 
                        name="endDate" value={endDate}
                        onChange={e => {onChange(e)}} />
                    <small className="form-text">Fin de la tarea prevista</small>
                </div>

                <input type="submit" className="btn btn-primary" value="Agregar tarea" />

            </form>

        </Fragment>

    )
}

CreateTask.propTypes = {
    registerTask: PropTypes.func.isRequired
}

export default connect(null, {setAlert, registerTask})(CreateTask)
