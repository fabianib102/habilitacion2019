import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {registerTask} from '../../actions/task';

const AdminCreateTask = ({registerTask, history}) => {

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
            
            <Link to="/admin-task" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> Nueva tarea</p>

            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="form-group">
                    <h4>Ingrese el nombre de la tarea</h4>
                    <input 
                        type="text" 
                        placeholder="Nombre de la tarea" 
                        name="name" 
                        value={name}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <h4>Ingrese la descripción</h4>
                    <input 
                        type="text" 
                        placeholder="Descripción de la tarea" 
                        name="description" 
                        value={description}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <h4>Ingrese la fecha de comienzo prevista</h4>
                    <input 
                        type="date" 
                        placeholder="Fecha de comienzo" 
                        name="startDate" value={startDate}
                        onChange={e => {onChange(e)}} />
                </div>

                <div className="form-group">
                    <h4>Ingrese la fecha de fin prevista</h4>
                    <input 
                        type="date" 
                        placeholder="Fecha de fin" 
                        name="endDate" value={endDate}
                        onChange={e => {onChange(e)}} />
                </div>

                <input type="submit" className="btn btn-primary" value="Agregar tarea" />

            </form>


        </Fragment>
    )
}

AdminCreateTask.propTypes = {
    registerTask: PropTypes.func.isRequired
}

export default connect(null, {setAlert, registerTask})(AdminCreateTask)
