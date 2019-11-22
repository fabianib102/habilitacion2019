import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import PrintButton from './PrintButton';
import PropTypes from 'prop-types';
import { getTaskByUser } from '../../actions/user';
import Moment from 'react-moment';
import moment from 'moment';

const TeamMemberReportLayout = ({match, auth:{user}, getTaskByUser, userTask: {userTask}}) => {

    const [startFilter , setStartFilter] = useState();
    const [endFilter, setEndFilter] = useState("");
    
    const [taskByProject , setTaskByProject] = useState(userTask);

    useEffect(() => {
        setTaskByProject(userTask);
        getTaskByUser(match.params.idUser);
        setStartFilter(match.params.startFilter);
        setEndFilter(match.params.endFilter);
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
                                        else return totalHoras}, 0)} hs</p>
                                </div>        
                            </div>
                    }
        
                )

                return <Card>
                            <Card.Header>
                                <div className="row">
                                    <div className="col-lg-6 col-sm-6">
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            <p>{project}</p>            
                                        </Accordion.Toggle>
                                    </div>
                                    <div className="col-lg-6 col-sm-6 ">
                                        <p className="float-right ">{dedicationsByProject} hs</p>
                                    </div>        
                                </div>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
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
            <div class= "row">
                <Link to={`/team-member/team-member-work-done/${ user && user._id}`} className="btn btn-secondary">
                    Atrás
                </Link>
            </div>
            
            <br/>

            <div class= "row" style={{ }}>
                <div className="col-lg-5 col-sm-5">
                    <h5>Previsualización </h5>
                </div>
                <div className="col-lg-7 col-sm-7">
                    <PrintButton id='print-info' label='Imprimir PDF' className="float-right"> </PrintButton>
                </div>
            </div>

            <br/>

            <div id= 'print-info' className="border border-dark " style={{width:'200mm',padding:'10px'}}> 
                
                <br/>

                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <p className='float-right'>Fecha de Emision: <Moment format="DD/MM/YYYY" className='float-right'></Moment></p>
                    </div>
                </div>
                
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h3 className="text-center">Reporte de horas trabajas en tareas</h3>
                    </div>
                </div>
                
                <br/>

                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h5>Identificador(Leg.): {user && user.identifier}</h5>
                        <h5>Nombre: {user && user.name} {user && user.surname}</h5>
                        <h5>CUIL: {user && user.cuil}</h5>
                    </div>
                </div>

                <br/>   
                
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h4>Listado de Proyectos - Tareas entre: {moment(startFilter).format('DD-MM-YYYY')} - {moment(startFilter).format('DD-MM-YYYY')}</h4>
                    </div>
                </div>

                <div className= "row">          
                    <div className="col-lg-12 col-sm-12">
                    <Accordion defaultActiveKey="0">
                        {proyectAccordion}
                    </Accordion>
                    </div>
                </div>      
                
                <br/>

            </div>
        </Fragment>
    )

}


TeamMemberReportLayout.propTypes = {
    getTaskByUser: PropTypes.func.isRequired,
    userTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth
})

export default connect(mapStateToProps, {getTaskByUser})(TeamMemberReportLayout)