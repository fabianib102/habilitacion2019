import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {setAlert} from '../../actions/alert';
import { getAllClient } from '../../actions/client';
import { getAllRisk } from '../../actions/risk';
import { getAllProjectType } from '../../actions/projectType';
import { getAllProjectSubType } from '../../actions/projectSubType';
import { getAllAgent } from '../../actions/agent';
import { getAllTeam, getTeamUser } from '../../actions/team';
import { registerProject, editProject } from '../../actions/project';
import { getAllUsers } from '../../actions/user';

const AdminCreateProject = ({match, setAlert,registerProject,editProject, history, getAllProjectSubType,project: {project, loading}, projectSubTypes: { projectSubTypes }, getAllClient, client: { client }, getAllRisk, risks: { risks }, getAllProjectType, projectTypes: { projectTypes }, agent: { agent }, getAllAgent, team: { team }, getAllTeam, userTeam: { userTeam }, getTeamUser, users: { users }, getAllUsers,auth:{user} }) => {


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

    var projectEdit = {};
    var editProjectBand = false;
    //console.log("->",project,match.params)
    if(project !== null && match.params.idProject !== undefined){
        for (let index = 0; index < project.length; index++) {
            if(project[index]._id === match.params.idProject){
                var projectEdit = project[index];
                editProjectBand = true; 

                //editando a  formato de fechas para inicio previsto y fin previsto
                const fechaStart = new Date(projectEdit.startDateExpected);
                let mesStart = fechaStart.getMonth()+1;
                if(mesStart<10) mesStart='0'+mesStart;

                let dia = fechaStart.getDate();
                if(dia<10) dia='0'+dia

                let anio = fechaStart.getFullYear();
                var dateStart = `${anio}-${mesStart}-${dia}`

                projectEdit.startDateExpected = dateStart

                //editando a  formato de fechas para inicio previsto y fin previsto
                const fechaEnd = new Date(projectEdit.endDateExpected);
                let mesEnd = fechaEnd.getMonth()+1;
                if(mesEnd<10) mesEnd='0'+mesEnd;

                let diaEnd = fechaEnd.getDate();
                if(diaEnd<10) diaEnd='0'+diaEnd

                let anioEnd = fechaEnd.getFullYear();
                var dateEnd = `${anioEnd}-${mesEnd}-${diaEnd}`

                projectEdit.endDateExpected = dateEnd

            }
        }
    }
    //console.log("EDIT",projectEdit,editProjectBand)
    if(!projectEdit.name && match.params.idProject !== undefined){
        history.push('/admin-project');
    }

    var { name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, riskId, teamId, clientId, agentId, liderProject } = formData;

    const onChange = e => SetFormData({ ...formData, [e.target.name]: e.target.value });
    
    useEffect(() => {
        SetFormData({
            name: loading || !projectEdit.name ? '' : projectEdit.name,
            description: loading || !projectEdit.description ? '' : projectEdit.description,
            startDateExpected: loading || !projectEdit.startDateExpected ? '' : projectEdit.startDateExpected,
            endDateExpected: loading || !projectEdit.endDateExpected ? '' : projectEdit.endDateExpected,
            typeProjectId: loading || projectEdit.projectType === undefined ? '' : projectEdit.projectType.typeProjectId,
            subTypeProjectId: loading || projectEdit.subTypeProject === undefined ? '' : projectEdit.subTypeProject.subTypeProjectId,
            riskId: loading,
            teamId: loading || projectEdit.team === undefined ? '' : projectEdit.team.teamId,
            agentId: loading || projectEdit.agent  === undefined ? '' : projectEdit.agent.agentId,
            clientId: loading || projectEdit.client  === undefined? '' : projectEdit.client.clientId,
            liderProject: loading || projectEdit.historyLiderProject  === undefined ? '0' : projectEdit.historyLiderProject[projectEdit.historyLiderProject.length - 1].liderProject, 
        });
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

    const [arrayRisk, setArrayRisk] = useState([]);

    const [itemIndex, setIndex] = useState("");

    var listRisk = [];
    
    var dateNow = new Date();

    let dateMin = new Date(dateNow.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    
    const [minDate, setDate] = useState(dateMin);

    if (client !== null) {
        var clientActive = client.filter(function (usr) {
            return usr.status === "ACTIVO";
        });
        var listClient = clientActive.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name.toUpperCase()}</option>
        );
    }

    if (projectTypes !== null) {

        var listProjectType = projectTypes.map((pt) =>
            <option key={pt._id} value={pt._id}>{pt.name.toUpperCase()}</option>
        );
    }

    if (team !== null) {
        // obtenemos solo activos
        var teamActivo = team.filter(function (te) {
            return te.status === "ACTIVO";
        });

        var listTeam = teamActivo.map((te) =>
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
        if (clientId !== '' && client !== null) { //cliente seleccionado
            filterCliAg = client.filter(function (cli) {
                return cli._id === clientId;
            });
            
            // busco referentes y sus datos
            for (let index = 0; index < filterCliAg[0].customerReferences.length; index++) {
                var eltoAg = agent.filter(function (ag) {
                    return ag._id === filterCliAg[0].customerReferences[index].idAgent && ag.status === "ACTIVO"
                });
                
                if (eltoAg.length !== 0) {
                    
                    filterAgents.push(eltoAg[0])
                }
            }
        }
        
        if(filterAgents.length !== 0){
            var listAgent = filterAgents.map((ag) =>
                <option key={ag._id} value={ag._id}>{ag.name.toUpperCase()}</option>
            );
        }
    }

    if (userTeam !== null) {

        var filterUserTeam = [];
        var membersGroup = [];

        if (teamId !== '' & users !== null) {
            // filtro de los equipos solo activos
            filterUserTeam = userTeam.filter(function (us) {
                return us.idTeam === teamId && us.status === "ACTIVO";
            });

            //filtro usuarios distintos.        
            for (let index = 0; index < filterUserTeam.length; index++) {
                var eltoMember = users.filter(function (us) {
                    return us._id === filterUserTeam[index].idUser && us.status === "ACTIVO";
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
        if (startDateExpected<=endDateExpected){
            if(match.params.idProject != undefined){
                let idProject = projectEdit._id;
                editProject({name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, teamId, clientId, agentId,liderProject, idProject, history});
            }else{
                registerProject({ name, description, startDateExpected, endDateExpected, typeProjectId, subTypeProjectId, riskId:arrayRisk, teamId, clientId, agentId,liderProject,idUserCreate:user._id, history });
            }
        }else{//fechas incorrectas
            setAlert('Peíodo de Fechas previstas incorrectas.', 'danger');
        }
    }

    if(risks !== null){

        var listRisks = risks.map((ri, item) =>
        
            <li key={ri._id} className={item === itemIndex ? "itemActive list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
                
                {ri.name} 

                <div className="float-right">

                    <a onClick={e => quitToList(ri._id, item)} className={ri.addList ? "btn btn-danger": "hideBtn btn btn-danger"} title="Quitar">
                        <i className="fas fa-minus-circle coloWhite"></i>
                    </a> 

                    <a onClick={e => loadListRisk(ri._id, item)} className={!ri.addList ? "btn btn-success": "hideBtn btn btn-primary"} title="Añadir">
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>
                    
                </div>

            </li>
        );

    }

    
    const loadListRisk = (id, itemPass) => {
        
        listRisk = arrayRisk;
        for (let index = 0; index < risks.length; index++) {
            const element = risks[index];

            if(element._id === id){
                listRisk.push(element);
                risks[index].addList = true;
            }
        }
        
        setArrayRisk(listRisk);
        setIndex(itemPass);
    };

    const quitToList = (id, itemPass) => {

        listRisk = arrayRisk;

        for (let j = 0; j < risks.length; j++) {
            const element = risks[j];
            if(element._id === id){
                risks[j].addList = false;
            }
        }

        for (let index = 0; index < listRisk.length; index++) {
            const element = listRisk[index];
            if(element._id === id){
                listRisk.splice(index, 1);
            }
        }
        
        setArrayRisk(listRisk);
        setIndex(itemPass);

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
                            <div class="card-header"> <h5><i className="fas fa-clipboard-list"></i>{editProjectBand ? " Editar Proyecto" :" Nuevo Proyecto"} </h5></div>
                            <div class="card-body">
                                <div className="row">
                                    <div className="form-group col-lg-6">
                                        <h5>Nombre del proyecto (*)</h5>
                                        <input
                                            type="text"
                                            class="form-control"
                                            placeholder="Nombre del proyecto"
                                            maxLength="100"
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
                                            maxLength="200"
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
                                            min={minDate}
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
                                            min={minDate}
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
                                {!editProjectBand ? 
                                <div className="row">
                                    <div className="form-group col-lg-6">
                                        <h5>Riesgos (*)</h5>
                                        <div className="card-body bodyLocaly">
                                            <ul className="list-group">
                                                {listRisks}
                                            </ul>
                                        </div>
                                
                                    </div>
                                </div>
                                :""}
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
    setAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    editProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    risks: state.risk,
    projectTypes: state.projectType,
    projectSubTypes: state.projectSubType,
    agent: state.agent,
    team: state.team,
    userTeam: state.userTeam,
    users: state.users,
    auth: state.auth,
    project: state.project
})

export default connect(mapStateToProps, { setAlert,getAllClient, getAllRisk, getAllProjectType, getAllProjectSubType, registerProject, editProject, getAllAgent, getAllTeam, getTeamUser, getAllUsers })(AdminCreateProject)
