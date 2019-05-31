import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {registerProjectType} from '../../actions/projectType';

const AdminCreateProjectType = ({setAlert, registerProjectType, history}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    });

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

            <p className="lead"><i className="fas fa-tasks"></i> Creación de un nuevo tipo de proyecto</p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Nombre del tipo del proyecto" 
                        name="name" 
                        value={name}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Descripción del tipo de proyecto" 
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

AdminCreateProjectType.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerProjectType: PropTypes.func.isRequired
}

export default connect(null, {setAlert, registerProjectType})(AdminCreateProjectType)
