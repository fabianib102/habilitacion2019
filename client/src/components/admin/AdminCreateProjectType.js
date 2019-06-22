import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {registerProjectType} from '../../actions/projectType';

const AdminCreateProjectType = ({match, setAlert, registerProjectType, history, projectTypes: {projectTypes, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    });

    var projecTypeEdit = {};

    if(projectTypes != null && match.params.idProjecType != undefined){
        for (let index = 0; index < projectTypes.length; index++) {
            if(projectTypes[index]._id == match.params.idProjecType){
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
        if(name === "" && description === ""){
            setAlert('Debes ingresar el nombre y la descripción', 'danger');
        }else{
            registerProjectType({name, description, history});
        }
    }

    return (
        <Fragment>
            
            <Link to="/admin-project-type" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> {match.params.idProjecType != undefined ? "Edición de tipo de proyecto": "Nuevo tipo de proyecto"}</p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                
                <div className="form-group">
                    <h4>Ingrese el nombre del tipo de proyecto</h4>
                    <input 
                        type="text" 
                        placeholder="Nombre del tipo del proyecto" 
                        name="name" 
                        value={name}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <h4>Ingrese la descripción</h4>
                    <input 
                        type="text" 
                        placeholder="Descripción del tipo de proyecto" 
                        name="description" 
                        value={description}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <Link to="/admin-project-type" className="btn btn-danger">
                    Cancelar
                </Link>

                <input type="submit" className="btn btn-primary" value="Insertar" />

            </form>

        </Fragment>
    )
}

AdminCreateProjectType.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerProjectType: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    projectTypes: state.projectType
})

export default connect(mapStateToProps, {setAlert, registerProjectType})(AdminCreateProjectType)
