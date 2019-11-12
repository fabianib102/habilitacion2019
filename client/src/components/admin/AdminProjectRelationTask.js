import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Accordion, Card } from 'react-bootstrap';
import {getFilterStage} from '../../actions/stage';
import {detailProjectById, relationTaskById} from '../../actions/project';

const AdminProjectRelationTask = ({match, getFilterStage, stage: {stage, loading}, detailProjectById, projectDetail: {projectDetail}, relationTaskById, relationsTask: {relationsTask}}) => {

    const [itemStage, setIndexStage] = useState(-1);
    const [idStageSelected, setIdStage] = useState(0);

    const [itemActivity, setItemAct] = useState(-1);
    const [idActivitySelected, setIdActivity] = useState(0);

    const [itemTask, setItemTask] = useState(-1);
    const [idTaskSelected, setIdTaskSeleted] = useState(-1);


    useEffect(() => {
        getFilterStage(match.params.idProject);
        detailProjectById(match.params.idProject);
        relationTaskById(match.params.idProject)
    }, [getFilterStage, detailProjectById, relationTaskById]);


    var stageBand = false

    if(stage !== null){

        if (stage.length !== 0){
            var stageBand = true
        }
        
        var listStageAcordion = stage.map((ls, item)=>

            <Card key={ls._id}>

                <Card.Header onClick={e => selectStage(ls._id, item, ls.name)} className={item === itemStage ? "selectStage": ""}>
                    <Accordion.Toggle as={Button} variant="link tree" eventKey={item}>
                        <div className="float-left">{ls.name}</div> 
                    </Accordion.Toggle>
                </Card.Header>

                <Accordion.Collapse eventKey={item}>
                    <Card.Body>

                        <Accordion>
                            {ls.arrayActivity.length > 0 ? 
                                ls.arrayActivity.map((act, itemAct)=>
                                    <Card key={act._id}>
                                        <Card.Header onClick={e => selectActivity(act.name, itemAct, act._id)} className={itemActivity === itemAct ? "cardAct": ""}>
                                            <Accordion.Toggle as={Button} variant="link tree" eventKey={act._id} >
                                                <div className="float-left">{act.name}</div>
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={act._id}>
                                            <Card.Body>
                                            <div className="card-body">
                                                <ul className="list-group">

                                                    {!(act.arrayTask.length > 0) ? <li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Tareas</b></center></li> : ""}

                                                    {act.arrayTask.map((task,itemTaskSelect)=>
                                                        <li key={task._id} onClick={e => selectTask(task._id, itemTaskSelect)} className={itemTaskSelect === itemTask ? "list-group-item-action list-group-item selectTask":"list-group-item-action list-group-item"}>
                                                            {task.name}
                                                        </li>
                                                    )}

                                                </ul>
                                            </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                )
                                : 
                                <li className='itemTeam list-group-item-action list-group-item'><center><b>Sin Actividades</b></center></li>
                            }
                        </Accordion>    
                    
                    </Card.Body>
                </Accordion.Collapse>


            </Card>

        )


    }


    console.log("relaciones : ", relationsTask)

    
    
    //#region  despliega el equipo 

    if(projectDetail != null){
        var listTeam = projectDetail.teamMember.map((te, item) =>

            <li key={te._id}  className="list-group-item-action list-group-item">
                {te.name}  {te.surname}

                <div className="float-right">
                    <a className="btn btn-success" title="Añadir" onClick={e => saveUserTask(te.idUser)}>
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>
                </div>

            </li>
        );
    }

    //#endregion

    //#region hace la relacion tarea con el usuario
    const saveUserTask = (idUser) => {
        console.log("el id del user: ", idUser)
        console.log("el id de la tarea: ", idTaskSelected)
        
    }
    //#endregion

    //#region control de datos de la etapa
    const selectStage = (idStage, itemPass, namePass) => {
        setIndexStage(itemPass);
        setIdStage(idStage)
    }
    //#endregion

    //#region control de datos de la actividad

    const selectActivity = (nameActPass, itemPass, idPassActivity) => {
        setItemAct(itemPass);
        setIdActivity(idPassActivity);
    }

    //#endregion

    //#region control de datos de la tarea

    const selectTask = (idTaskPass, itemPass) => {
        setItemTask(itemPass);
        setIdTaskSeleted(idTaskPass);
    }   

    //#endregion


    return (
        <Fragment>

            <div className="row rowProject">
                    <Link to="/admin-project" className="btn btn-secondary">
                            Atrás
                    </Link>

                    <h2>Proyecto: <strong>Nombre</strong></h2>  
            </div>

            <div className="row">
            
                <div className="col-lg-4">
                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Etapas</strong>
                        </div>

                        <div className="card-body bodyTeamStage">
                         
                            {stageBand ? 
                                
                                <Accordion>

                                    {listStageAcordion}
                                </Accordion>
                                : 
                                <li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Etapas</b></center></li>
                            }

                        </div>

                    </div>
                </div>
                
                <div className="col-lg-4">
                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Usuarios seleccionado</strong>
                        </div>

                        <div className="card-body bodyTeamStage">
                         
                            <ul className="list-group">
                            </ul>

                        </div>

                    </div>
                </div>

                
                <div className="col-lg-4">
                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong>{' '} Equipo (Debes seleccionar una tarea)</strong>
                        </div>

                        <div className="card-body bodyTeamStage">
                         
                            <ul className="list-group">
                                {listTeam}
                            </ul>

                        </div>

                    </div>
                </div>

                

            
            </div>
            
        </Fragment>
    )
}

AdminProjectRelationTask.propTypes = {
    getFilterStage: PropTypes.func.isRequired,
    detailProjectById: PropTypes.func.isRequired,
    relationTaskById: PropTypes.func.isRequired,
    stage: PropTypes.object.isRequired,
    projectDetail: PropTypes.object.isRequired,
}
 

const mapStateToProps = state => ({
    stage: state.stage,
    projectDetail: state.projectDetail,
    relationsTask: state.relationsTask
})

export default connect(mapStateToProps, {getFilterStage, detailProjectById, relationTaskById})(AdminProjectRelationTask)

