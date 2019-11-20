import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTaskByUser } from '../../actions/user';

const TeamMemberWorkDone = ({match, auth:{user}, getTaskByUser, userTask: {userTask}}) => {

    
    useEffect(() => {
        getTaskByUser(match.params.idUser);
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
                
                var taskByProject = userTask.filter(function(task) {
                        return task.nameProject === project;
                    }
                );
                

                var dedicationsByProject = 0;
                
                for (let index = 0; index < taskByProject.length; index++) {
                    const element = taskByProject[index];
                    dedicationsByProject = element.dedications.reduce((totalHoras, dedication) => {if(!isNaN(dedication.hsJob)) return totalHoras + dedication.hsJob
                        else return totalHoras}, 0)
                }

                var tasksList = taskByProject.map((task)=> {
                    return  <div className="row">
                                <div className="col-lg-6 col-sm-6">
                                        <p>{task.name}</p>
                                </div>
                                <div className="col-lg-6 col-sm-6 ">
                                    <p className="float-right ">{task.dedications.reduce((totalHoras, dedication) => {if(!isNaN(dedication.hsJob)) return totalHoras + dedication.hsJob
                                                                                                                    else return totalHoras}, 0)} hs</p>
                                </div>        
                            </div>
                    }
        
                )

                return <Card>
                            <Card.Header>
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6">
                                        <Accordion.Toggle as={Button} variant="link" eventKey={item}>
                                            <p>{project}</p>            
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

    return (
        <Fragment>
            
            <Link to={`/team-member/${ user && user._id}`} className="btn btn-secondary">
                Atrás
            </Link>
            
            <div class= "row">
                <div className="col-lg-12 col-sm-12">
                    <h3>Informe Personal de Horas en Proyectos Activos</h3>
                </div>
            </div>

            <br/>
            
            <div class= "row">
                <div className="col-lg-12 col-sm-12">
                    <h5>Rango de Fechas</h5>
                </div>
            </div>
            <div class= "row">
                <div className="col-lg-3 col-sm-3">
                    <p><b>Desde: </b></p>
                    <input type="date"></input>
                </div>
                <div className="col-lg-3 col-sm-3">
                    <p><b>Hasta: </b></p>
                    <input type="date"></input>
                </div>
                <div className="col-lg-2 col-sm-2">
                    <Button>Filtrar</Button>
                    <Link to={`/team-member/team-member-Report-Layout/${ user && user._id}`}  className="btn btn-primary my-2">
                        Imprimir Reporte
                    </Link>
                </div>
            </div>
            
            <br/>

            <div className= "row">          
                <div className="col-lg-8 col-sm-8">
                <Accordion defaultActiveKey="0">
                        {proyectAccordion}
                </Accordion>
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