import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTaskByUser } from '../../actions/user';
import moment, { isMoment } from 'moment';

const TeamMemberWorkDone = ({match, auth:{user}, getTaskByUser, userTask: {userTask}}) => {

    const [startFilter , setStartFilter] = useState();
    const [endFilter, setEndFilter] = useState("");
    
    const [taskByProject , setTaskByProject] = useState(userTask);

    useEffect(() => {
        getTaskByUser(match.params.idUser);
        setTaskByProject(userTask);
        setStartFilter(moment().startOf('month').format("YYYY-MM-DD"));
        setEndFilter(moment().format("YYYY-MM-DD"));
    }, [getTaskByUser]);


    if(userTask != null){

        var projects = [];

        for (let index = 0; index < userTask.length; index++) {
            const element = userTask[index];
            if(!projects.includes(element.nameProject)){
                projects.push(element.nameProject);
            }
        }

        var proyectAccordion = projects.map((project, item)=>{
                
                
                if(taskByProject != null && taskByProject !== undefined){
                    var dedicationsByProject = 0;
                    

                    for (let index = 0; index < taskByProject.length; index++) {
                        const element = taskByProject[index];
                        dedicationsByProject += element.dedications.reduce((totalHoras, dedication) => 
                        {if(!isNaN(dedication.hsJob) && dedication.date >= startFilter && dedication.date <= endFilter) 
                            return totalHoras + dedication.hsJob
                            else return totalHoras}, 0)
                    }

                    var tasksList = taskByProject.map((task)=> {
                        return  <div className="row">
                                    <div className="col-lg-6 col-sm-6">
                                            <p>{task.name}</p>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 ">
                                        <p className="float-right ">{task.dedications.reduce((totalHoras, dedication) => {
                                            if(!isNaN(dedication.hsJob) && dedication.date >= startFilter && dedication.date <= endFilter ) 
                                                return totalHoras + dedication.hsJob
                                                else return totalHoras}, 0)} Hs.</p>
                                    </div>        
                                </div>
                        }
            
                    )
                }
                return <Card>
                            <Card.Header>
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6">
                                        <Accordion.Toggle as={Button} variant="link" eventKey={item} title="Ver Dedicaciones">
                                            <p><strong>{project.toUpperCase()}</strong></p>            
                                        </Accordion.Toggle>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 ">
                                        <p className="float-right ">{dedicationsByProject} hs</p>
                                    </div>        
                                </div>
                            </Card.Header>
                            <Accordion.Collapse eventKey={item}>
                                <Card.Body>
                                    {tasksList}    
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
            }

        ) 
        

    }   

    const changeStart = e => {
        setStartFilter(e.target.value);
    }

    const changeEnd = e => {
        setEndFilter(e.target.value);
    }

    return (
        <Fragment>
            
            <Link to={`/team-member/${ user && user._id}`} className="btn btn-secondary">
                Atrás
            </Link>
            
            <div class= "row">
                <div className="col-lg-8 col-sm-8">
                    <h4 className="text-center"> Reporte de: <strong>{user && user.name} {user && user.surname}</strong></h4>
                    <h3 className="text-center">Horas Dedicadas a Tareas x Proyectos</h3>
                </div>
                
            </div>

            <br/>
                   
            <div className= "row">          
                <div className="col-lg-8 col-sm-8">
                <Accordion defaultActiveKey="0">
                        {proyectAccordion}
                </Accordion>
                </div>

                <div className="col-lg-4 col-sm-8 mb-4">
                    <Card>
                        <Card.Header>
                            <h5 className="my-2">Seleccionar Período</h5>
                        </Card.Header>
                        <Card.Body>
                        <div class= "row">
                            <div className="col-lg-6 col-sm-6">
                                <p><b>Desde: </b></p>
                                <input type="date" value={startFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" onChange = {e => changeStart(e)} ></input>
                            </div>
                            <div className="col-lg-6 col-sm-6">
                                <p><b>Hasta: </b></p>
                                <input type="date" value={endFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" onChange = {e => changeEnd(e)} ></input>
                            </div>
                        </div>
                        <div className="row mb-4">
                        <div className="col-lg-6 col-sm-8">
                                <Link to={`/team-member/team-member-Report-Layout/${ user && user._id}/${startFilter}/${endFilter}`}  className="btn btn-primary my-2">
                                    Imprimir Reporte
                                </Link>
                        </div>
                        </div>
                        
                        </Card.Body>
                    </Card>
            </div> 
            </div>
        </Fragment>
    )

}

 
TeamMemberWorkDone.propTypes = {
    getTaskByUser: PropTypes.func.isRequired,
    userTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth
})

export default connect(mapStateToProps, {getTaskByUser})(TeamMemberWorkDone)