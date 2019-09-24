import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllClient} from '../../actions/client';
import { getAllRisk } from '../../actions/risk';
import { getAllProjectType } from '../../actions/projectType';
import { getAllProjectSubType } from '../../actions/projectSubType';

import { registerProject } from '../../actions/project';

const AdminCreateProject = ({registerProject,history, getAllProjectSubType, projectSubTypes: {projectSubTypes}, getAllClient, client: {client}, getAllRisk, risks: {risks}, getAllProjectType, projectTypes: {projectTypes}}) => {


    const [formData, SetFormData] = useState({
        name: '',
        description: '',
        clientId: '',
        riskId: '',
        startDateExpected: '',
        endDateExpected: '',
        typeProjectId: '',
        subTypeProjectId: '',
    });

    var {name, description, clientId, riskId, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    useEffect(() => {
        getAllClient();
        getAllRisk();
        getAllProjectType();
        getAllProjectSubType();
    }, [getAllClient, getAllRisk, getAllProjectType, getAllProjectSubType]);

    const [isDisable, setDisable] = useState(true);

    if(client != null){
        var clientActive =  client.filter(function(usr) {
            return usr.status === "ACTIVO";
        });
        var listClient = clientActive.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name.toUpperCase()}</option>
        );
    }

    if(risks != null){

        var listRisk = risks.map((ri) =>
            <option key={ri._id} value={ri._id}>{ri.name.toUpperCase()}</option>
        );
    }

    if(projectTypes != null){

        var listProjectType = projectTypes.map((ri) =>
            <option key={ri._id} value={ri._id}>{ri.name.toUpperCase()}</option>
        );
    }

    if(projectSubTypes != null){

        var filterType = projectSubTypes;

        if(typeProjectId != ''){
            filterType = projectSubTypes.filter(function(lo) {
                return lo.type === typeProjectId;
            });
        }

        var listProjectSubType = filterType.map((ri) =>
            <option key={ri._id} value={ri._id}>{ri.name.toUpperCase()}</option>
        );
    }

    const onChangeType = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisable(false);
    }

    const onSubmit = async e => {
        e.preventDefault();

        registerProject({name, description, clientId, riskId, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, history});
        
    }

    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <p className="lead"><i className="fas fa-user"></i> Nuevo proyecto </p>

            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Nombre del proyecto (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Nombre del proyecto" 
                            maxLength="50"
                            minLength="3"
                            name="name" 
                            value={name}
                            onChange = {e => onChange(e)}
                        />
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción" 
                            maxLength="50"
                            minLength="3"
                            name="description" 
                            value={description}
                            onChange = {e => onChange(e)}
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Cliente (*)</h5>
                        <select name="clientId" value={clientId} onChange = {e => onChange(e)}>
                            <option value="0">* Seleccione el Cliente</option>
                            {listClient}
                        </select>
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Riesgo (*)</h5>
                        <select name="riskId" value={riskId} onChange = {e => onChange(e)}>
                            <option value="0">* Seleccione el riesgo</option>
                            {listRisk}
                        </select>
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Fecha de Inicio previsto (*)</h5>
                        <input 
                            type="date" 
                            placeholder=""
                            name="startDateExpected" 
                            value={startDateExpected}
                            onChange = {e => onChange(e)}
                        />
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Fecha de Fin previsto (*)</h5>
                        <input 
                            type="date" 
                            placeholder=""
                            name="endDateExpected" 
                            value={endDateExpected}
                            onChange = {e => onChange(e)}
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Tipo de proyecto (*)</h5>
                        <select name="typeProjectId" value={typeProjectId} onChange = {e => onChangeType(e)}>
                            <option value="0">* Seleccione el tipo</option>
                            {listProjectType}
                        </select>
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Subtipo de proyecto (*)</h5>
                        <select name="subTypeProjectId" value={subTypeProjectId} onChange = {e => onChange(e)} disabled={isDisable}>
                            <option value="0">* Seleccione el subtipo</option>
                            {listProjectSubType}
                        </select>
                    </div>
                </div>


                <div className="form-group">
                    <span>(*) son campos obligatorios</span>
                </div>

                <input type="submit" className="btn btn-primary" value="Registrar" />

                <Link to="/admin-project" className="btn btn-danger">
                    Cancelar
                </Link>


            </form>
            
        </Fragment>

    )
}

AdminCreateProject.propTypes = {
    getAllClient: PropTypes.func.isRequired,
    getAllRisk: PropTypes.func.isRequired,
    getAllProjectType:  PropTypes.func.isRequired,
    getAllProjectSubType: PropTypes.func.isRequired,
    registerProject: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    risks: PropTypes.object.isRequired,
    projectTypes: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    risks: state.risk,
    projectTypes: state.projectType,
    projectSubTypes: state.projectSubType,
})

export default connect(mapStateToProps, {getAllClient, getAllRisk, getAllProjectType, getAllProjectSubType, registerProject})(AdminCreateProject)
