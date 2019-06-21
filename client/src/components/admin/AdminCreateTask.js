import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {registerTask, editTask} from '../../actions/task';

const AdminCreateTask = ({match, editTask, registerTask, history, tasks: {tasks, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const formatDate = (fechaString) => {

        var fecha = new Date(fechaString);
        var dayAdd = fecha.setDate(fecha.getDate()+1);
        fecha = new Date(dayAdd);
    
        let mes = fecha.getMonth()+1;
        if(mes<10) mes='0'+mes;
        let dia = fecha.getDate();
        if(dia<10) dia='0'+dia
        let anio = fecha.getFullYear();
        var cumple = `${anio}-${mes}-${dia}`;

        return cumple;
    }

    var taskEdit = {};

    if(tasks != null && match.params.idTask != undefined){
        for (let index = 0; index < tasks.length; index++) {
            if(tasks[index]._id == match.params.idTask){
                var taskEdit = tasks[index];
            }
        }
    }

    if(!taskEdit.name && match.params.idTask != undefined){
        history.push('/admin-task');
    }

    taskEdit.startDate = formatDate(taskEdit.startDate);
    taskEdit.endDate = formatDate(taskEdit.endDate);

    useEffect(() => {
        SetFormData({
            name: loading || !taskEdit.name ? '' : taskEdit.name,
            description: loading || !taskEdit.description ? '' : taskEdit.description,
            startDate: loading || !taskEdit.startDate ? '' : taskEdit.startDate,
            endDate: loading || !taskEdit.endDate ? '' : taskEdit.endDate,
        });
    }, [loading]);

    const {name, description, startDate, endDate} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();

        if(match.params.idTask != undefined){
            //edita una tarea
            let idTask = taskEdit._id;
            editTask({name, description, startDate, endDate, idTask, history});
        }else{
            //crea una nueva tarea
            if(name === "" && description === "" && startDate === "" && endDate === ""){
                setAlert('Debes ingresar el nombre, la descripción, fecha de inicio y fin', 'danger');
            }else{
                registerTask({name, description, startDate, endDate, history});
            }
        }
    }

    return (
        <Fragment>
            
            <Link to="/admin-task" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> {match.params.idTask != undefined ? "Edición de tarea": "Nueva tarea"}</p>

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

                <Link to="/admin-task" className="btn btn-danger">
                    Cancelar
                </Link>

                <input type="submit" className="btn btn-primary" value={ match.params.idTask != undefined ? "Modificar" : "Agregar" } />

            </form>


        </Fragment>
    )
}

AdminCreateTask.propTypes = {
    registerTask: PropTypes.func.isRequired,
    editTask: PropTypes.func.isRequired,
    tasks: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    tasks: state.task
})

export default connect(mapStateToProps, {setAlert, registerTask, editTask})(AdminCreateTask)
