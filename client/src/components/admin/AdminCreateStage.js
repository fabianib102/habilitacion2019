import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {registerStage, editStage} from '../../actions/stage';

const AdminCreateStage = ({match, registerStage, history, editStage, stage: {stage, loading}}) => {


    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    }); 

    const {name, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});


    var stageEdit = {};

    if(stage != null && match.params.idStage != undefined){
        for (let index = 0; index < stage.length; index++) {
            if(stage[index]._id == match.params.idStage){
                var stageEdit = stage[index];
            }
        }
    }


    useEffect(() => {
        SetFormData({
            name: loading || !stageEdit.name ? '' : stageEdit.name,
            description: loading || !stageEdit.description ? '' : stageEdit.description,
        });
    }, [loading]);


    const onSubmit = async e => {

        e.preventDefault();

        if(name === "" || description === ""){
                setAlert('Debes ingresar el nombre y la descripción', 'danger');
        }else{
            if(match.params.idStage != undefined){
                //edita una etapa
                let idStage = stageEdit._id;
                editStage({idStage, name, description, history});
            }else{
                //registra tarea
                registerStage({name, description, history});            
            }
        }
    }


    return (

        <Fragment>

            <Link to="/admin-stage" className="btn btn-secondary">
                Atrás
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> {match.params.idStage != undefined ? "Edición de Etapa": "Nueva Etapa"}</p>


            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="form-group">
                    <h5>Nombre (*)</h5>
                    <input 
                        type="text" 
                        placeholder="Nombre de la etapa" 
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
                        placeholder="Descripción de la etapa" 
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

                <input type="submit" className="btn btn-primary" value={ match.params.idStage != undefined ? "Modificar" : "Registrar" } />

                <Link to="/admin-stage" className="btn btn-danger">
                    Cancelar
                </Link>

            </form>

            
        </Fragment>

    )
}

AdminCreateStage.propTypes = {
    registerStage: PropTypes.func.isRequired,
    editStage: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    stage: state.stage
})

export default connect(mapStateToProps, {setAlert, registerStage, editStage})(AdminCreateStage)