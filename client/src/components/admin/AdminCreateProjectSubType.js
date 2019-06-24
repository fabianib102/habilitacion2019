import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {registerProjectSubType, editProjectSubType} from '../../actions/projectSubType';

import { getAllProjectType } from '../../actions/projectType';

const AdminCreateProjectSubType = ({match, getAllProjectType, editProjectSubType, projectTypes: {projectTypes}, projectSubTypes: {projectSubTypes, loading}, setAlert, registerProjectSubType, history}) => {

    useEffect(() => {
        getAllProjectType();
    }, [getAllProjectType]);

    const [formData, SetFormData] = useState({
        name: '',
        type: '',
        description: ''
    });

    var projecSubTypeEdit = {};

    if(projectSubTypes != null && match.params.idProjecSubType != undefined){
        for (let index = 0; index < projectSubTypes.length; index++) {
            if(projectSubTypes[index]._id == match.params.idProjecSubType){
                projecSubTypeEdit = projectSubTypes[index];
            }
        }
    }

    if(!projecSubTypeEdit.name && match.params.idProjecSubType != undefined){
        history.push('/admin-project-subtype');
    }

    useEffect(() => {
        SetFormData({
            name: loading || !projecSubTypeEdit.name ? '' : projecSubTypeEdit.name,
            type: loading || !projecSubTypeEdit.type ? '' : projecSubTypeEdit.type,
            description: loading || !projecSubTypeEdit.description ? '' : projecSubTypeEdit.description
        });
    }, [loading]);

    const {name, type, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {

        e.preventDefault();

        if(match.params.idProjecSubType != undefined){
            //edita un tipo de proyecto
            let idProjectSubType = projecSubTypeEdit._id;
            editProjectSubType({name, description, type, idProjectSubType, history});
        }else{
            if(name === "" && description === "" && type === "0"){
                setAlert('Debes ingresar el nombre, la descripción y seleccionar el tipo', 'danger');
            }else{
                registerProjectSubType({name, type, description, history});
            }
        }

    }

    if(projectTypes != null){
        var listTypes = projectTypes.map((pro) =>
            <option key={pro._id} value={pro.name}>{pro.name}</option>
        );
    }

    return (
        
        <Fragment>

            <Link to="/admin-project-subtype" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> {match.params.idProjecSubType != undefined ? "Edición de subtipo de proyecto": "Nuevo subtipo de proyecto"}</p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                
                <div className="form-group">
                    <h5>Nombre (*)</h5>
                    <input 
                        type="text" 
                        placeholder="Nombre del Subtipo del proyecto" 
                        name="name" 
                        value={name}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <h5>Tipo de proyecto (*)</h5>
                    <select name="type" value={type} onChange = {e => onChange(e)}>
                        <option value="0">* Selecciona el tipo de proyecto</option>
                        {listTypes}
                    </select>
                </div>

                <div className="form-group">
                    <h5>Descripción (*)</h5>
                    <input 
                        type="text" 
                        placeholder="Descripción del Subtipo de proyecto" 
                        name="description" 
                        value={description}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <span>(*) son campos obligatorios</span>
                </div>

                <Link to="/admin-project-subtype" className="btn btn-danger">
                    Cancelar
                </Link>

                <input type="submit" className="btn btn-primary" value={ match.params.idProjecSubType != undefined ? "Modificar" : "Agregar" } />

            </form>
            
        </Fragment>
    )
}

AdminCreateProjectSubType.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerProjectSubType: PropTypes.func.isRequired,
    editProjectSubType: PropTypes.func.isRequired,
    getAllProjectType: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    projectTypes: state.projectType,
    projectSubTypes: state.projectSubType
})

export default connect(mapStateToProps, {setAlert, registerProjectSubType, getAllProjectType, editProjectSubType})(AdminCreateProjectSubType)
