import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {registerTask, editTask} from '../../actions/task';

const AdminCreateTask = ({match, editTask,setAlert, registerTask, history, tasks: {tasks, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    }); 

    var taskEdit = {};

    if(tasks != null && match.params.idTask != undefined){
        for (let index = 0; index < tasks.length; index++) {
            if(tasks[index]._id === match.params.idTask){
                var taskEdit = tasks[index];
            }
        }
    }

    if(!taskEdit.name && match.params.idTask != undefined){
        history.push('/admin-task');
    }

    useEffect(() => {
        SetFormData({
            name: loading || !taskEdit.name ? '' : taskEdit.name,
            description: loading || !taskEdit.description ? '' : taskEdit.description,
        });
    }, [loading]);

    const {name, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {

        e.preventDefault();

        if(name === "" || description === ""){
                setAlert('Debes ingresar el nombre y la descripción', 'danger');
        }else{
            if(match.params.idTask != undefined){
                //edita una tarea
                let idTask = taskEdit._id;
                editTask({name, description, idTask, history});
            }else{
                //registra tarea
                registerTask({name, description, history});            
            }
        }
    }

    return (
        <Fragment>
            
            <Link to="/admin-task" className="btn btn-secondary">
                Atrás
            </Link>

            <p ></p>

            <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="row">
                    <div className="col-sm-3 col-md-3"></div>              
                    <div className="col-sm-7 col-md-7">
                        <div class="card">                      
                            <div class="card-header"> <h5><i className="fas fa-tasks"></i> {match.params.idTask != undefined ? "Edición de tarea": "Nueva tarea"}</h5></div>
                            <div class="card-body">
                                <div className="form-group">
                                    <h5>Nombre (*)</h5>
                                    <input 
                                        type="text" 
                                        class="form-control"
                                        placeholder="Nombre de la tarea" 
                                        name="name" 
                                        value={name}
                                        onChange = {e => onChange(e)}
                                        minLength="3"
                                        maxLength="50"
                                    />
                                </div>

                                <div className="form-group">
                                    <h5>Descripción (*)</h5>
                                    <input 
                                        type="text" 
                                        class="form-control"
                                        placeholder="Descripción de la tarea" 
                                        name="description" 
                                        value={description}
                                        onChange = {e => onChange(e)}
                                        minLength="3"
                                        maxLength="60"
                                    />
                                </div>

                                <div className="form-group">
                                    <span>(*) son campos obligatorios</span>
                                </div>

                                <input type="submit" className="btn btn-primary" value={ match.params.idTask != undefined ? "Modificar" : "Registrar" } />

                                <Link to="/admin-task" className="btn btn-danger">
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>


        </Fragment>
    )
}

AdminCreateTask.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerTask: PropTypes.func.isRequired,
    editTask: PropTypes.func.isRequired,
    tasks: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    tasks: state.task
})

export default connect(mapStateToProps, {setAlert, registerTask, editTask})(AdminCreateTask)
