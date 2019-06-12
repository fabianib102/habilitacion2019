import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {registerProjectSubType} from '../../actions/projectSubType';

import { getAllProjectType } from '../../actions/projectType';

const AdminCreateProjectSubType = ({getAllProjectType, projectTypes: {projectTypes}, setAlert, registerProjectSubType, history}) => {

    useEffect(() => {
        getAllProjectType();
    }, [getAllProjectType]);

    const [formData, SetFormData] = useState({
        name: '',
        type: '',
        description: ''
    });

    const {name, type, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {

        e.preventDefault();
        if(name === "" && description === "" && type === "0"){
            setAlert('Debes ingresar el nombre, la descripción y seleccionar el tipo', 'danger');
        }else{
            registerProjectSubType({name, type, description, history});
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

            <p className="lead"><i className="fas fa-tasks"></i> Creación de un nuevo subtipo de proyecto</p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Nombre del Subtipo del proyecto" 
                        name="name" 
                        value={name}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <select name="type" onChange = {e => onChange(e)}>
                        <option value="0">* Selecciona el tipo de proyecto</option>
                        {listTypes}
                    </select>
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Descripción del Subtipo de proyecto" 
                        name="description" 
                        value={description}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <input type="submit" className="btn btn-primary" value="Insertar" />

            </form>
            
        </Fragment>
    )
}

AdminCreateProjectSubType.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerProjectSubType: PropTypes.func.isRequired,
    getAllProjectType: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    projectTypes: state.projectType
})

export default connect(mapStateToProps, {setAlert, registerProjectSubType, getAllProjectType})(AdminCreateProjectSubType)
