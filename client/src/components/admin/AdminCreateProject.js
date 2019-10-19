import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllClient } from '../../actions/client';
import { getAllRisk } from '../../actions/risk';
import { getAllProjectType } from '../../actions/projectType';
import { getAllProjectSubType } from '../../actions/projectSubType';
import { getAllAgent } from '../../actions/agent';
import { getAllTeam, getTeamUser } from '../../actions/team';
import { registerProject } from '../../actions/project';
import { getAllUsers } from '../../actions/user';

const AdminCreateProject = ({ registerProject, history, getAllProjectSubType, projectSubTypes: { projectSubTypes }, getAllClient, client: { client }, getAllRisk, risks: { risks }, getAllProjectType, projectTypes: { projectTypes }, agent: { agent }, getAllAgent, team: { team }, getAllTeam, userTeam: { userTeam }, getTeamUser, users: { users }, getAllUsers }) => {


    const [formData, SetFormData] = useState({
        name: '',
        description: '',
        startDateExpected: '',
        endDateExpected: '',
        typeProjectId: '',
        subTypeProjectId: '',
        riskId: '',
        teamId: '',
        clientId: '',
        agentId: '',
        liderProject: '',
    });

    var { name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, riskId, teamId, clientId, agentId, liderProject } = formData;

    const onChange = e => SetFormData({ ...formData, [e.target.name]: e.target.value });

    useEffect(() => {
        getAllClient();
        getAllRisk();
        getAllProjectType();
        getAllProjectSubType();
        getAllAgent();
        getAllTeam();
        getTeamUser();
        getAllUsers()
    }, [getAllClient, getAllRisk, getAllProjectType, getAllProjectSubType, getAllAgent, getAllTeam, getTeamUser, getAllUsers]);

    const [isDisableSubType, setDisableSubType] = useState(true);

    const [isDisableAgent, setDisableAgent] = useState(true);

    const [isDisableLider, setDisableLider] = useState(true);

    if (client !== null) {
        var clientActive = client.filter(function (usr) {
            return usr.status === "ACTIVO";
        });
        var listClient = clientActive.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name.toUpperCase()}</option>
        );
    }

    if (risks !== null) {

        var listRisk = risks.map((ri) =>
            <option key={ri._id} value={ri._id}>{ri.name.toUpperCase()}</option>
        );
    }

    if (projectTypes !== null) {

        var listProjectType = projectTypes.map((pt) =>
            <option key={pt._id} value={pt._id}>{pt.name.toUpperCase()}</option>
        );
    }
    if (team !== null) {

        var listTeam = team.map((te) =>
            <option key={te._id} value={te._id}>{te.name.toUpperCase()}</option>
        );
    }

    if (projectSubTypes !== null) {

        var filterType = projectSubTypes;

        if (typeProjectId !== '') {
            filterType = projectSubTypes.filter(function (ps) {
                return ps.type === typeProjectId;
            });
        }

        var listProjectSubType = filterType.map((ri) =>
            <option key={ri._id} value={ri._id}>{ri.name.toUpperCase()}</option>
        );
    }

    if (agent !== null) {

        var filterCliAg = [];
        var filterAgents = []
        //obtengo cliente e id de los referentes
        if (clientId !== '') { //cliente seleccionado
            filterCliAg = client.filter(function (cli) {
                return cli._id === clientId;
            });
            // busco referentes y sus datos
            for (let index = 0; index < filterCliAg[0].customerReferences.length; index++) {
                var eltoAg = agent.filter(function (ag) {
                    return ag._id === filterCliAg[0].customerReferences[index].idAgent;
                });
                if (filterAgents !== []) {
                    filterAgents.push(eltoAg[0])
                }
            }
        }
        var listAgent = filterAgents.map((ag) =>
            <option key={ag._id} value={ag._id}>{ag.name.toUpperCase()}</option>
        );
    }

    if (userTeam !== null) {

        var filterUserTeam = [];
        var membersGroup = [];

        if (teamId !== '') {

            filterUserTeam = userTeam.filter(function (us) {
                return us.idTeam === teamId && us.status === "ACTIVO";
            });

            //filtro usuarios distintos.        
            for (let index = 0; index < filterUserTeam.length; index++) {
                var eltoMember = users.filter(function (us) {
                    return us._id === filterUserTeam[index].idUser;
                });
                if (membersGroup !== []) {
                    membersGroup.push(eltoMember[0])
                }
            }
        }
        var listUserTeam = membersGroup.map((us) =>
            <option key={us._id} value={us._id}>{us.surname.toUpperCase()}, {us.name.toUpperCase()}</option>
        );
    }



    const onChangeType = e => {
        SetFormData({ ...formData, [e.target.name]: e.target.value });
        setDisableSubType(false);
    }
    const onChangeClient = e => {
        SetFormData({ ...formData, [e.target.name]: e.target.value });
        setDisableAgent(false);
    }
    const onChangeLider = e => {
        SetFormData({ ...formData, [e.target.name]: e.target.value });
        setDisableLider(false);
    }

    const onSubmit = async e => {
        e.preventDefault();
        console.log("GUARDO", name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, riskId, teamId, clientId, agentId,liderProject)
        registerProject({ name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, riskId, teamId, clientId, agentId,liderProject, history });

    }

    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <p ></p>

            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="row">
                    <div className="col-sm-12 col-md-12">
                        <div class="card">
                            <div class="card-header"> <h5><i className="fas fa-clipboard-list"></i> Nuevo Proyecto</h5></div>
                            <div class="card-body">
                                <div className="row">
                                    <div className="form-group col-lg-6">
                                        <h5>Nombre del proyecto (*)</h5>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Nombre del proyecto"
                                            maxLength="50"
                                            minLength="3"
                                            name="name"
                                            value={name}
                                            onChange={e => onChange(e)}
                                        />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <h5>Descripción (*)</h5>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Descripción del proyecto"
                                            maxLength="50"
                                            minLength="3"
                                            name="description"
                                            value={description}
                                            onChange={e => onChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-lg-6">
                                        <h5>Fecha de Inicio previsto (*)</h5>
                                        <input
                                            class="form-control"
                                            type="date"
                                            placeholder=""
                                            name="startDateExpected"
                                            value={startDateExpected}
                                            onChange={e => onChange(e)}
                                        />
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <h5>Fecha de Fin previsto (*)</h5>
                                        <input
                                            class="form-control"
                                            type="date"
                                            placeholder=""
                                            name="endDateExpected"
                                            value={endDateExpected}
                                            onChange={e => onChange(e)}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group col-lg-6">
                                        <h5>Tipo de proyecto (*)</h5>
                                        <select name="typeProjectId" class="form-control" value={typeProjectId} onChange={e => onChangeType(e)}>
                                            <option value="0">* Seleccione el tipo de proyecto</option>
                                            {listProjectType}
                                        </select>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <h5>Subtipo de proyecto</h5>
                                        <select name="subTypeProjectId" class="form-control" value={subTypeProjectId} onChange={e => onChange(e)} disabled={isDisableSubType}>
                                            <option value="0">* Seleccione el subtipo de proyecto</option>
                                            {listProjectSubType}
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="form-group col-lg-6">
                                        <h5>Cliente(*)</h5>
                                        <select name="clientId" class="form-control" value={clientId} onChange={e => onChangeClient(e)}>
                                            <option value="0">* Seleccione el cliente</option>
                                            {listClient}
                                        </select>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <h5>Referente del Cliente (*)</h5>
                                        <select name="agentId" class="form-control" value={agentId} onChange={e => onChange(e)} disabled={isDisableAgent}>
                                            <option value="0">* Seleccione el referente</option>
                                            {listAgent}
                                        </select>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="form-group col-lg-6">
                                        <h5>Equipo (*)</h5>
                                        <select name="teamId" class="form-control" value={teamId} onChange={e => onChangeLider(e)}>
                                            <option value="0">* Seleccione el equipo</option>
                                            {listTeam}
                                        </select>
                                    </div>

                                    <div className="form-group col-lg-6">
                                        <h5>Representante del Proyecto (*)</h5>
                                        <select name="liderProject" class="form-control" value={liderProject} onChange={e => onChange(e)} disabled={isDisableLider}>
                                            <option value="0">* Seleccione el representante</option>
                                            {listUserTeam}
                                        </select>
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="form-group col-lg-6">
                                        <h5>Riesgo (*)</h5>
                                        <select name="riskId" value={riskId} onChange={e => onChange(e)}>
                                            <option value="0">* Seleccione el riesgo</option>
                                            {listRisk}
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

                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </Fragment>

    )
}

AdminCreateProject.propTypes = {
    getAllClient: PropTypes.func.isRequired,
    getAllRisk: PropTypes.func.isRequired,
    getAllProjectType: PropTypes.func.isRequired,
    getAllProjectSubType: PropTypes.func.isRequired,
    getAllAgent: PropTypes.func.isRequired,
    getAllTeam: PropTypes.func.isRequired,
    registerProject: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    risks: PropTypes.object.isRequired,
    projectTypes: PropTypes.object.isRequired,
    agent: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    getTeamUser: PropTypes.func.isRequired,
    getAllUsers: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    risks: state.risk,
    projectTypes: state.projectType,
    projectSubTypes: state.projectSubType,
    agent: state.agent,
    team: state.team,
    userTeam: state.userTeam,
    users: state.users
})

export default connect(mapStateToProps, { getAllClient, getAllRisk, getAllProjectType, getAllProjectSubType, registerProject, getAllAgent, getAllTeam, getTeamUser, getAllUsers })(AdminCreateProject)
