import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';
import { getAllTask} from '../../actions/task';

const ProyectManagerTask = ({auth : {user}, getAllTask, tasks: {tasks}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");

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

    useEffect(() => {
        getAllTask();
    }, [getAllTask]);

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

    if(tasks != null){

        // si no hay tareas crea un aviso de que no hay usuarios        
        if (tasks.length === 0){
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No tiene tareas pendientes</b></center></li>)
        }

        // hay tareas, proceso de tratamiento
        var whithItems = true;

        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTask = tasks.slice(indexOfFirstTodo, indexOfLastTodo);

        var listTasks = currentTask.map((ti) =>
            <tr key={ti._id}>
                <td>{ti.name}</td>
                <td className="hide-sm">Implementacion de Sistema</td>
                <td className="hide-sm">Operaciones</td>
                <td className="hide-sm">En Proceso</td>
                <td className="hide-sm"><b>Inicio:</b> 20/10/2019 - <b>Fin:</b> 30/10/2019</td>
                <td className="hide-sm centerBtn">
                    <a onClick={e => askWorkRegister(ti.name, ti._id)} className="btn btn-primary" title="Registrar trabajo">
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>
                    <a onClick={e => askEnd(ti.name, ti._id)} className="btn btn-success" title="Finalizar">
                        <i className="far fa-check-square coloWhite"></i>
                    </a>
                    <a onClick={e => askSuspend(ti.name, ti._id)} className="btn btn-warning" title="Suspender">
                        <i className="fas fa-stopwatch coloWhite"></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(tasks.length / todosPerPage); i++) {
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
                <Modal.Title>Personas Trabajando en la Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div class="row">
                <div className="col-lg-4 col-sm-4">
                    <p><b>Proyecto:</b> Implementacion de sistema</p>
                </div>       
                
                <div className="col-lg-4 col-sm-4">
                    <p><b>Actividad:</b> Relevamiento</p>
                </div>

                <div className="col-lg-4 col-sm-4">
                    <p><b>Tarea:</b> Relevamiento de Infraestructura existente</p>
                </div>            
            </div>
            <div class="row">
                <div className="col-lg-4 col-sm-4">
                    <p><b>Inicio Previsto:</b> 10/10/2019</p>
                </div>

                <div className="col-lg-4 col-sm-4">
                    <p><b>Fin Previsto:</b> 20/10/2019</p>
                </div>           
            </div>
            <div class="row">
                <div className="col-lg-12 col-sm-12">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="hide-sm headTable">Equipo</th>
                            <th className="hide-sm headTable">Nombre</th>
                            <th className="hide-sm headTable">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="hide-sm">Analistas</td>
                                <td className="hide-sm">Jose Andres Sanchez</td>
                                <td className="hide-sm">
                                    <div className="float-right">
                                        <a className="btn btn-success" title="Asignar">
                                            <i class="fas fa-user-plus coloWhite"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="hide-sm">Desarrolladores</td>
                                <td className="hide-sm">Juan Pablo Ramires</td>
                                <td className="hide-sm">
                                    <div className="float-right">
                                        <a className="btn btn-danger" title="Remover Asignacion">
                                            <i class="fas fa-user-minus coloWhite"></i>
                                        </a>
                                    </div>
                                </td>
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
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalWorkRegister()}>
                Cerrar
                </Button>
            </Modal.Footer>
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
                    Estas seguro de finalizar la tarea: {nameComplete}
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
        <Modal show={show} onHide={e => modalRestart()}>
            <Modal.Header closeButton>
                <Modal.Title>Reanudar Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="form">
                    <div className="form-group">
                    <p>
                        Estas seguro de Reanudar la tarea: Analisis de Negocio
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
                        Estas seguro de finalizar la tarea: {nameComplete}
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



    return (
        <Fragment>
            
            <Link to="/admin" className="btn btn-secondary">
                        Atrás
            </Link>
            
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
                    <h3 className="my-2">Listado de Tareas por Actividad y Proyecto</h3>        
                </div>
            </div>

            <br/>

            <div className= "row">          
                <div className="col-lg-12 col-sm-12">
                <Accordion>
                    <Card>
                        <Card.Header>
                            <div className="row">
                                <div className="col-lg-6 col-sm-6">
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        <h5>Implementacion de sistemas</h5>
                                    </Accordion.Toggle>
                                </div>
                                <div className="col-lg-3 col-sm-3 ">
                                    <p className="float-right ">Total: 4</p>
                                </div>  
                                <div className="col-lg-3 col-sm- ">
                                    <p className="float-right ">sin asignacion: 1</p>
                                </div>        
                            </div>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <Card>
                                    <Card.Header>
                                        <div className="row">
                                            <div className="col-lg-6 col-sm-6">
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    <h5>Relevamiento</h5>
                                                </Accordion.Toggle>
                                            </div>
                                            <div className="col-lg-3 col-sm-3 ">
                                                <p className="float-right ">Total: 2</p>
                                            </div>  
                                            <div className="col-lg-3 col-sm- ">
                                                <p className="float-right ">sin asignacion: 1</p>
                                            </div>        
                                        </div>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6">
                                                        <p className="text-danger">Relevamiento de Infraestructura existente</p>
                                                </div>
                                                <div className="col-lg-2 col-sm-2 ">
                                                    <span class="badge badge-primary">Creada</span>
                                                </div>        
                                                <div className="col-lg-4 col-sm-4 ">
                                                    <a onClick={e => askWorkRegister()} className="btn btn-success float-right" title="Asignar RRHH">
                                                        <i class="fas fa-user-plus coloWhite"></i>
                                                    </a>
                                                </div>                
                                            </div>    
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6">
                                                        <p>Modelado de Arquitectura actual</p>
                                                </div>
                                                <div className="col-lg-2 col-sm-2 ">
                                                    <span class="badge badge-success">En Proceso</span>
                                                </div>        
                                                <div className="col-lg-4 col-sm-4 ">
                                                    <a onClick={e => askWorkRegister()} className="btn btn-success float-right" title="Ver transiciones">
                                                            <i class="fas fa-user-plus coloWhite"></i>
                                                    </a>
                                                    <a className="btn btn-warning float-right" title="Visualizar asignacion">
                                                            <i class="fas fa-search coloWhite"></i>
                                                    </a>
                                                </div>        
                                            </div>    
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <div className="row">
                                            <div className="col-lg-6 col-sm-6">
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    <h5>Analisis</h5>
                                                </Accordion.Toggle>
                                            </div>
                                            <div className="col-lg-3 col-sm-3 ">
                                                <p className="float-right ">Total: 2</p>
                                            </div>  
                                            <div className="col-lg-3 col-sm- ">
                                                <p className="float-right ">sin asignacion: 0</p>
                                            </div>        
                                        </div>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6">
                                                        <p>Analisis de Requerimientos</p>
                                                </div>
                                                <div className="col-lg-2 col-sm-2 ">
                                                    <span class="badge badge-success">En Proceso</span>
                                                </div>        
                                                <div className="col-lg-4 col-sm-4 ">
                                                    <a className="btn btn-success float-right" title="Ver transiciones">
                                                            <i class="fas fa-user-plus coloWhite"></i>
                                                    </a>
                                                    <a  onClick={e => askWorkRegister()} className="btn btn-warning float-right" title="Visualizar asignacion">
                                                            <i class="fas fa-search coloWhite"></i>
                                                    </a>
                                                </div>        
                                            </div>    
                                            <div className="row">
                                                <div className="col-lg-6 col-sm-6">
                                                        <p>Modelado Preliminar de Arquitectura Futura</p>
                                                </div>
                                                <div className="col-lg-2 col-sm-2 ">
                                                    <span class="badge badge-success">En Proceso</span>
                                                </div>        
                                                <div className="col-lg-4 col-sm-4 ">
                                                    <a className="btn btn-success float-right" title="Ver transiciones">
                                                            <i class="fas fa-user-plus coloWhite"></i>
                                                    </a>
                                                    <a className="btn btn-warning float-right" title="Visualizar asignacion">
                                                            <i class="fas fa-search coloWhite"></i>
                                                    </a>
                                                </div>        
                                            </div>    
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Card.Header>
                        <div className="row">
                            <div className="col-lg-6 col-sm-6">
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    <h5>Actualizacion de Equipos</h5>
                                </Accordion.Toggle>
                            </div>
                            <div className="col-lg-3 col-sm-3 ">
                                <p className="float-right ">Total: 0</p>
                            </div>  
                            <div className="col-lg-3 col-sm- ">
                                <p className="float-right ">sin asignacion: 0</p>
                            </div>                
                        </div>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                </div>
            </div>

            {modalWorkRegisterTask}

            {modalRestartTask}

            {modalSuspendTask}

            {modalEndTask}
            

        </Fragment>
    )
}

ProyectManagerTask.propTypes = {
    getAllTask: PropTypes.func.isRequired,
    tasks: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    tasks: state.task,
    auth: state.auth
})

export default connect(mapStateToProps, {getAllTask})(ProyectManagerTask)
