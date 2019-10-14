import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {setAlert} from '../../actions/alert';
import {registerRisk, editRisk} from '../../actions/risk';

const AdminCreateRisk = ({match, editRisk, setAlert, registerRisk, history, risks: {risks, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    });

    var riskEdit = {};

    if(risks !== null && match.params.idRisk !== undefined){
        for (let index = 0; index < risks.length; index++) {
            if(risks[index]._id === match.params.idRisk){
                var riskEdit = risks[index];
            }
        }
    }

    if(!riskEdit.name && match.params.idRisk !== undefined){
        history.push('/admin-risk');
    }

    useEffect(() => {
        SetFormData({
            name: loading || !riskEdit.name ? '' : riskEdit.name,
            description: loading || !riskEdit.description ? '' : riskEdit.description
        });
    }, [loading]);

    const {name, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {

        e.preventDefault();

        if(name === "" || description === ""){
            setAlert('Debes ingresar el nombre y la descripción', 'danger');
        }else{
            if(match.params.idRisk !== undefined){
                //edita riesgo
                let idRisk = riskEdit._id;
                editRisk({name, description, idRisk, history});
            }else{
                //registra riesgo
                registerRisk({name, description, history});
            }
        }
        
    }
    
    return (
        <Fragment>

            <Link to="/admin-risk" className="btn btn-secondary">
                Atrás
            </Link>
            <p></p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="row">
                    <div className="col-sm-3 col-md-3"></div>              
                    <div className="col-sm-7 col-md-7">
                        <div class="card">                      
                            <div class="card-header"> <h5><i className="fas fa-tasks"></i> {match.params.idRisk != undefined ? "Edición de riesgo": "Nuevo riesgo"}</h5></div>
                            <div class="card-body">
                                <div className="form-group">
                                    <h5>Nombre (*)</h5>
                                    <input 
                                        type="text" 
                                        placeholder="Nombre del riesgo" 
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
                                        placeholder="Descripción del riesgo" 
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

                                <input type="submit" className="btn btn-primary" value={ match.params.idRisk != undefined ? "Modificar" : "Registrar" } />

                                <Link to="/admin-risk" className="btn btn-danger">
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

AdminCreateRisk.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerRisk: PropTypes.func.isRequired,
    editRisk: PropTypes.func.isRequired,
    risks: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    risks: state.risk
})

export default connect(mapStateToProps, {setAlert, registerRisk, editRisk})(AdminCreateRisk);
