import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

const TeamMemberReportTask = ({match}) => {

   /* if(stage != null){
    
        
    var listWorkDone = stage.map((ls, item)=>

            <Card key={ls._id}>

                <Card.Header onClick={e => selectStage(ls._id, item, ls.name, ls.description, ls.startDateProvide, ls.endDateProvide)} className={item == itemStage ? "selectStage": ""}>
                    <Accordion.Toggle as={Button} variant="link" eventKey={item}>
                        {ls.name}
                    </Accordion.Toggle>
                </Card.Header>

                <Accordion.Collapse eventKey={item}>
                    <Card.Body>

                        Proyecto
                        
                        <a className="btn btn-success btnAddAct" onClick={e => addActivity()} title="
                        Agregar Actividad">
                            <i className="fas fa-plus-circle coloWhite"></i>
                        </a>

                        <Accordion>
                            {ls.arrayActivity.length > 0 ? 
                                ls.arrayActivity.map((act, itemAct)=>
                                    <Card key={act._id}>
                                        <Card.Header onClick={e => selectActivity(act.name, act.description, act._id)} className="cardAct">
                                            <Accordion.Toggle as={Button} variant="link" eventKey={act._id} >
                                                {act.name}
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={act._id}>
                                            <Card.Body>
                                                <div className="card-body">

                                                    Tareas

                                                    <a onClick={e => addTask(act.arrayTask)} className="btn btn-warning btnTask" title="Agregar Tarea">
                                                        <i className="fas fa-plus-circle coloWhite"></i>
                                                    </a>

                                                    <ul className="list-group">

                                                        {!(act.arrayTask.length > 0) ? "No tiene tareas" : ""}

                                                        {act.arrayTask.map((task,itemTaskSelect)=>
                                                            <li key={task._id} onClick={e => selectTask(task._id, task.name, task.description, task.startDateProvideTask, task.endDateProvideTask)} className={task._id == itemTask ? "list-group-item-action list-group-item selectTask":"list-group-item-action list-group-item"}>
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
                                "No tiene actividades"
                            }
                        </Accordion>

                    </Card.Body>
                </Accordion.Collapse>
                
            </Card>

        )
    
    }
    */

    return(

        <Fragment>

            <div class="row">
                <Link to="/team-member" className="btn btn-secondary">
                    Atrás
                </Link>
            </div>
                <div class="accordion" id="accordionExample">
                    <div class="card">
                            <div class="card-header" id="headingOne">
                                <div class="row">
                                    <div className="col-lg-6 col-sm-6">
                                        <h2 class="mb-0">
                                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                Implementacion de Sistema
                                            </button>
                                        </h2>
                                    </div>
                                    <div className="col-lg-6 col-sm-6">
                                            <p class="float-right"> 2h 30m</p>                    
                                    </div>
                                </div>
                        </div>
                        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <div class="card-body">
                                <div class="row">
                                    <div className="col-lg-6 col-sm-6">
                                        Tarea uno del proyecto     
                                    </div>
                                    <div className="col-lg-6 col-sm-6">
                                            <p class="float-right"> 1h</p>                    
                                    </div>
                                </div>
                                <div class="row">
                                    <div className="col-lg-6 col-sm-6">
                                        Tarea dos del proyecto     
                                    </div>
                                    <div className="col-lg-6 col-sm-6">
                                            <p class="float-right"> 1h 30m</p>                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header" id="headingTwo">
                        <h2 class="mb-0">
                            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Collapsible Group Item #2
                            </button>
                        </h2>
                        </div>
                        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div class="card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                        </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header" id="headingThree">
                        <h2 class="mb-0">
                            <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Collapsible Group Item #3
                            </button>
                        </h2>
                        </div>
                        <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                        <div class="card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                        </div>
                        </div>
                    </div>
                </div>
            <p>Hola mundo</p>
        </Fragment>
    ) 
    
}


TeamMemberReportTask.propTypes = {
    tasks: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    tasks: state.task,
    auth: state.auth
})

export default connect(mapStateToProps)(TeamMemberReportTask)
