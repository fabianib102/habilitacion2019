import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {registerProjectType, editProjectType} from '../../actions/projectType';

const AdminCreateProjectType = ({match, setAlert, registerProjectType, editProjectType, history, projectTypes: {projectTypes, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    });

    var projecTypeEdit = {};

    if(projectTypes != null && match.params.idProjecType != undefined){
        for (let index = 0; index < projectTypes.length; index++) {
            if(projectTypes[index]._id === match.params.idProjecType){
                var projecTypeEdit = projectTypes[index];
            }
        }
    }

    if(!projecTypeEdit.name && match.params.idProjecType != undefined){
        history.push('/admin-project-type');
    }

    useEffect(() => {
        SetFormData({
            name: loading || !projecTypeEdit.name ? '' : projecTypeEdit.name,
            description: loading || !projecTypeEdit.description ? '' : projecTypeEdit.description
        });
    }, [loading]);

    const {name, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {

        e.preventDefault();

        if(name === "" || description === ""){
            setAlert('Debes ingresar el nombre y la descripción', 'danger');
        }else{
            if(match.params.idProjecType != undefined){
                //edita un tipo de proyecto
                let idProjectType = projecTypeEdit._id;
                editProjectType({name, description, idProjectType, history});
            }else{
                //registra un tipo de proyecto        
                registerProjectType({name, description, history});
            }
        }
    }

    return (
        <Fragment>
            
            <Link to="/admin-project-type" className="btn btn-secondary">
                Atrás
            </Link>

            <p></p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="row">
                    <div className="col-sm-3 col-md-3"></div>              
                    <div className="col-sm-7 col-md-7">
                        <div class="card">                      
                            <div class="card-header"> <h5><i className="fas fa-tasks"></i> {match.params.idProjecType != undefined ? "Edición de Tipo de Proyecto": "Nuevo Tipo de Proyecto"}</h5></div>
                            <div class="card-body">
                            <div className="form-group">
                                <h5>Nombre (*)</h5>
                                <input 
                                    type="text" 
                                    placeholder="Nombre del tipo del proyecto" 
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
                                    placeholder="Descripción del tipo de proyecto" 
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

                            <input type="submit" className="btn btn-primary" value={ match.params.idProjecType != undefined ? "Modificar" : "Agregar" } />

                            <Link to="/admin-project-type" className="btn btn-danger">
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

AdminCreateProjectType.propTypes = {
    setAlert: PropTypes.func.isRequired,
    editProjectType: PropTypes.func.isRequired,
    registerProjectType: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    projectTypes: state.projectType
})

export default connect(mapStateToProps, {setAlert, registerProjectType, editProjectType})(AdminCreateProjectType)
