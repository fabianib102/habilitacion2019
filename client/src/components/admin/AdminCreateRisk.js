import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {registerRisk} from '../../actions/risk';

const AdminCreateRisk = ({setAlert, registerRisk, history}) => {

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
            registerRisk({name, description, history});
        }
    }
    

    return (
        <Fragment>

            <Link to="/admin-risk" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> Creación de un nuevo riesgo</p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Nombre del riesgo" 
                        name="name" 
                        value={name}
                        onChange = {e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Descripción del riesgo" 
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

AdminCreateRisk.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerRisk: PropTypes.func.isRequired
}

export default connect(null, {setAlert, registerRisk})(AdminCreateRisk);
