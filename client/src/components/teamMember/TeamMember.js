import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import { getTaskByUser } from '../../actions/user';


const TeamMemberTask = ({match, auth : {user}, getTaskByUser, userTask: {userTask}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");

    const [projectFilter, setProjectFilter] = useState("");

    var listProject = [];

    useEffect(() => {
        getTaskByUser(match.params.idUser);
    }, [getTaskByUser]);


    console.log("info del usuario: ", user);


    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    const modalTeamMember = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }

    
    // pregunta para suspender la tarea asiganada al team member
    const [showSuspend, setSuspendShow] = useState(false);

    const modalSuspend = () => {
        if(showSuspend){
            setSuspendShow(false);
        }else{
            setSuspendShow(true);
        }
    }

    // pregunta para registrar trabajo a la tarea asiganada al team member
    const [showWorkRegister, setWorkRegisterShow] = useState(false);

    const modalWorkRegister = () => {
        if(showWorkRegister){
            setWorkRegisterShow(false);
        }else{
            setWorkRegisterShow(true);
        }
    }

    const [showRestart, setRestartShow] = useState(false);
    
    const modalRestart = () =>{
        if(showRestart){
            setRestartShow(false);
        }else{
            setRestartShow(true);
        }
    }
    //--------
    const askEnd = (nameComplete, IdToDelete) => {
        setComplete(nameComplete)
        setId(IdToDelete)
        modalTeamMember();
    }

    const askSuspend = (nameComplete, IdToDelete) => {
        setComplete(nameComplete)
        setId(IdToDelete)
        modalSuspend();
    }

    const askRestart = () => {
        modalRestart();
    }

    const askWorkRegister = (nameComplete, IdToDelete) => {
        setComplete(nameComplete)
        setId(IdToDelete)
        modalWorkRegister();
    }


    const endTask = (id) => {
    //        endTaskById(id);
        modalTeamMember();
    }

    const suspendTask = (id) => {
        //        suspendTaskById(id);
        modalSuspend();
    }

    const restartTask = () => {
        //        suspendTaskById(id);
        modalRestart();
    }

    const workRegisterTask = (id) => {
        //        suspendTaskById(id);
        modalWorkRegister();
    }
    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(userTask != null){


        for (let index = 0; index < userTask.length; index++) {
            const element = userTask[index];
            if(!listProject.includes(element.nameProject)){
                listProject.push(element.nameProject);
            }
        }

        var listProjectHtml = listProject.map((pro) =>
            <option key={pro} value={pro}>{pro}</option>
        );


        // si no hay tareas crea un aviso de que no hay usuarios        
        if (userTask.length === 0){
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No tiene tareas pendientes</b></center></li>)
        }

        // hay tareas, proceso de tratamiento
        var whithItems = true;

        var listT = []

        if(projectFilter != ""){

            for (let i = 0; i < userTask.length; i++) {
                const taskElem = userTask[i];
                
                if(taskElem.nameProject == projectFilter){
                    listT.push(taskElem);
                }

            }


        }else{
            listT = userTask
        }



        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTask = listT.slice(indexOfFirstTodo, indexOfLastTodo);

        var listTasks = currentTask.map((ti) =>
            <tr key={ti._id}>

                <td className="hide-sm">{ti.nameStage}</td>
                <td className="hide-sm">{ti.nameActivity}</td>
                <td>
                    {ti.name}
                    <div className="small text-muted">
                        <b>Fecha de relación: </b><Moment format="DD/MM/YYYY">{moment.utc(ti.dateRegister)}</Moment> 
                    </div>
                </td>

                <td>
                    <div className="small text-muted">
                        <b>Inicio Previsto: </b><Moment format="DD/MM/YYYY">{moment.utc(ti.startProvider)}</Moment> 
                    </div>
                    <div className="small text-muted">
                        <b>Fin Previsto: </b><Moment format="DD/MM/YYYY">{moment.utc(ti.endProvider)}</Moment> 
                    </div>
                </td>

                <td className="hide-sm">{ti.nameProject}</td>

                {/* <td className="hide-sm">Implementacion de Sistema</td>
                <td className="hide-sm">Operaciones</td>
                <td className="hide-sm"><span class="badge badge-success">EN PROCESO</span></td>
                <td className="hide-sm"><b>Inicio:</b> 20/10/2019 - <b>Fin:</b> 30/10/2019</td>
                 */}

                <td className="hide-sm centerBtn">
                    <a onClick={e => askWorkRegister(ti.name, ti._id)} className="btn btn-primary" title="Registrar trabajo">
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>
                    <a onClick={e => askEnd(ti.name, ti._id)} className="btn btn-success" title="Finalizar">
                        <i className="far fa-check-square coloWhite"></i>
                    </a>
                    <a onClick={e => askSuspend(ti.name, ti._id)} className="btn btn-warning" title="Suspender">
                        <i className="fas fa-stopwatch "></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(listT.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        var renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className="liCustom" key={number}>
                <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
              </li>
            );
        });

    }

    //modal para la asignacion de horas a la tarea
    const modalWorkRegisterTask = (
        <Modal size='lg' show={showWorkRegister} onHide={e => modalWorkRegister()}>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Horas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div class="row">
                <div className="col-lg-4 col-sm-4">
                    <p><b>Proyecto:</b> Implementacion de sistema</p>
                </div>       
                
                <div className="col-lg-4 col-sm-4">
                    <p><b>Equipo:</b> Implementadores</p>
                </div>

                <div className="col-lg-4 col-sm-4">
                    <p><b>Tarea:</b> Restaurar BD</p>
                </div>            
            </div>
            <div class="row">
                <div className="col-lg-4 col-sm-4">
                    <p><b>Inicio Previsto:</b> 10/10/2019</p>
                </div>

                <div className="col-lg-4 col-sm-4">
                    <p><b>Fin Previsto:</b> 20/10/2019</p>
                </div>
                <div className="col-lg-4 col-sm-4">
                    <p><b>Total Registrado:</b> 03:00</p>
                </div>           
            </div>
            <div class="row">
                <div className="col-lg-8 col-sm-8">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="hide-sm headTable">Fecha de registro</th>
                            <th className="hide-sm headTable">Horas Registradas</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="hide-sm">10/10/2019</td>
                                <td className="hide-sm">1h 30m</td>
                            </tr>
                            <tr>
                                <td className="hide-sm">10/10/2019</td>
                                <td className="hide-sm">01:30</td>
                            </tr>
                            <tr>
                                <td className="hide-sm">11/10/2019</td>
                                <td className="hide-sm">30m</td>
                            </tr>
                            <tr>
                                <td className="hide-sm">11/10/2019</td>
                                <td className="hide-sm">00:30</td>
                            </tr>    
                        </tbody>
                    </table>
                    <div className="">
                        <nav aria-label="Page navigation example">
                            <ul className="pagination">
                                {renderPageNumbers}
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="col-lg-4 col-sm-4">
                    <form className="form">
                        <div className="form-group">
                            <h5>Horas a Registrar</h5>
                            <p>Ejemplo: 02:30, para 2h y 30m</p>
                            <input 
                                type="timestamp" 
                                placeholder="00:00"
                            />
                            <p>Ejemplo: 10/10/2019</p>
                            <input 
                                type="date" 
                                placeholder="00/00/0000"
                            />
                        </div>
                    </form>
                    <Button variant="secondary" onClick={e => modalWorkRegister()}>
                        Cerrar
                    </Button>
                    <a onClick={e => suspendTask(IdDelete)} className="btn btn-primary coloWhite" >
                        Registrar
                    </a>
                </div>
            </div>
            </Modal.Body>
        </Modal>
    )

    //modal para la finalizacion de la tarea
    const modalEndTask = (
        <Modal show={show} onHide={e => modalTeamMember()}>
            <Modal.Header closeButton>
                <Modal.Title>Finalizar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estas seguro de finalizar la tarea:<b> {nameComplete} </b> ?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalTeamMember()}>
                Cerrar
                </Button>
                <a onClick={e => endTask(IdDelete)} className="btn btn-success coloWhite" >
                    Si, estoy seguro
                </a>
            </Modal.Footer>
        </Modal>
    )
    
    const modalRestartTask = (
        <Modal show={showRestart} onHide={e => modalRestart()}>
            <Modal.Header closeButton>
                <Modal.Title>Reanudar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="form">
                    <div className="form-group">
                    <p>
                        ¿Estas seguro de Reanudar la tarea: <b> Análisis de Negocio </b>?
                    </p>
                    </div>
                    <div className="form-group">
                        <h5>Motivo</h5>
                        <input 
                            type="text" 
                            placeholder="Motivo de Suspension" 
                            name="description"
                            minLength="3"
                            maxLength="50"
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalRestart()}>
                    Cerrar
                </Button>
                <a onClick={e => restartTask()} className="btn btn-warning coloWhite" >
                    Si, estoy seguro
                </a>
            </Modal.Footer>
        </Modal>
    )

    //modal para la suspension de la tarea
    const modalSuspendTask = (
        <Modal show={showSuspend} onHide={e => modalSuspend()}>
            <Modal.Header closeButton>
                <Modal.Title>Suspender Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="form">
                    <div className="form-group">
                    <p>
                        ¿Estas seguro de suspender la tarea: <b>{nameComplete}</b>?
                    </p>
                    </div>
                    <div className="form-group">
                        <h5>Motivo</h5>
                        <input 
                            type="text" 
                            placeholder="Motivo de Suspension" 
                            name="description"
                            minLength="3"
                            maxLength="50"
                         //   onChange = {e => onChangeDescriptionProjectSubType(e)}
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalSuspend()}>
                    Cerrar
                </Button>
                <a onClick={e => suspendTask(IdDelete)} className="btn btn-warning coloWhite" >
                    Si, estoy seguro
                </a>
            </Modal.Footer>
        </Modal>
    )



    //#region Control de filtro de projectos
    const modifyProject = (e) => {
        setProjectFilter(e.target.value);
        setCurrent(1);
    }

    //#endregion



    return (
        <Fragment>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h3 className="my-2">Bienvenido { user && user.name} {user && user.surname}</h3>
                </div>
                <div className="col-lg-6 col-sm-6">
                    <Link to={`/team-member/team-member-detail/${ user && user._id}`}  className="btn btn-primary my-2 float-right">
                        Informacion Personal
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <h3 className="my-2">Mis Tareas</h3>        
                </div>
                <div className="col-lg-6 col-sm-6">
                    <Link to={`/team-member/team-member-work-done/${ user && user._id}`}  className="btn btn-primary my-2 float-right">
                        Reporte de Horas
                    </Link>
                </div>
            </div>

            <table className="table table-hover">
                <thead>
                <tr>

                    <th className="hide-sm headTable">Etapa</th>
                    <th className="hide-sm headTable">Actividad</th>
                    <th className="hide-sm headTable">Nombre de la tarea</th>
                    <th className="hide-sm headTable">Fechas Previstas</th>

                    <th className="hide-sm headTable">
                        <select name="Proyect" className="form-control" onChange = {e => modifyProject(e)}>
                            <option value="">PROYECTOS</option>
                            {listProjectHtml}
                        </select>
                    </th>

                    {/*
                    <th className="hide-sm headTable">
                        <select name="Equip" className="form-control" >
                            <option value="">EQUIPO</option>
                            <option value="">Implementaciones</option>
                            <option value="">Soporte Tecnico</option>
                            <option value="">Desarrollo</option>
                        </select>
                    </th>
                    <th className="hide-sm headTable">
                        <select name="status" className="form-control" >
                            <option value="">ESTADO</option>
                            <option value="">En proceso</option>
                            <option value="">Suspendida</option>
                            <option value="">Finalizada</option>
                        </select>
                    </th>
                    <th className="hide-sm headTable">Fecha Inicio - Fin</th>
                    */}
                    <th className="hide-sm headTable centerBtn">Opciones</th> 
                </tr>
                </thead>
                <tbody>
                    {listTasks}
                </tbody>
            </table>

            {!whithItems ? '' : itemNone}

            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            
            {modalWorkRegisterTask}

            {modalRestartTask}

            {modalSuspendTask}

            {modalEndTask}
            

        </Fragment>
    )
}

TeamMemberTask.propTypes = {
    getTaskByUser: PropTypes.func.isRequired,
    userTask: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    userTask: state.userTask,
    auth: state.auth
})

export default connect(mapStateToProps, {getTaskByUser})(TeamMemberTask)
