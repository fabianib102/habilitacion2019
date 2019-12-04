// import React, {Fragment, useEffect, useState} from 'react';
// import { Link, Redirect } from 'react-router-dom';
// import { Button, Accordion, Card } from 'react-bootstrap';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

// const ProjectManagerReports = ({match}) => {

//     // useEffect(() => {
//     //     getTaskByUser(match.params.idUser);
//     //     setTaskByProject(userTask);
//     //     setStartFilter(moment().startOf('month').format("YYYY-MM-DD"));
//     //     setEndFilter(moment().format("YYYY-MM-DD"));
//     // }, [getTaskByUser]);


//     // if(userTask != null){

//     //     var projects = [];

//     //     for (let index = 0; index < userTask.length; index++) {
//     //         const element = userTask[index];
//     //         if(!projects.includes(element.nameProject)){
//     //             projects.push(element.nameProject);
//     //         }
//     //     }
//     //     if (projects.length !== 0){
//     //     var proyectAccordion = projects.map((project, item)=>{
                
                
//     //             if(taskByProject != null && taskByProject !== undefined){
//     //                 var dedicationsByProject = 0;
                    

//     //                 for (let index = 0; index < taskByProject.length; index++) {
//     //                     const element = taskByProject[index];
//     //                     dedicationsByProject += element.dedications.reduce((totalHoras, dedication) => 
//     //                     {if(!isNaN(dedication.hsJob) && dedication.date >= startFilter && dedication.date <= endFilter) 
//     //                         return totalHoras + dedication.hsJob
//     //                         else return totalHoras}, 0)
//     //                 }

//     //                 var tasksList = taskByProject.map((task)=> {
//     //                     return  <div className="row">
//     //                                 <div className="col-lg-6 col-sm-6">
//     //                                         <p>{task.name}</p>
//     //                                 </div>
//     //                                 <div className="col-lg-6 col-sm-6 ">
//     //                                     <p className="float-right ">{task.dedications.reduce((totalHoras, dedication) => {
//     //                                         if(!isNaN(dedication.hsJob) && dedication.date >= startFilter && dedication.date <= endFilter ) 
//     //                                             return totalHoras + dedication.hsJob
//     //                                             else return totalHoras}, 0)} Hs.</p>
//     //                                 </div>        
//     //                             </div>
//     //                     }
            
//     //                 )
//     //             }
//     //             return <Card>
//     //                         <Card.Header>
//     //                             <div className="row">
//     //                                 <div className="col-lg-6 col-sm-6">
//     //                                     <Accordion.Toggle as={Button} variant="link" eventKey={item} title="Ver Dedicaciones">
//     //                                         <p><strong>{project.toUpperCase()}</strong></p>            
//     //                                     </Accordion.Toggle>
//     //                                 </div>
//     //                                 <div className="col-lg-6 col-sm-6 ">
//     //                                     <p className="float-right ">{dedicationsByProject} hs</p>
//     //                                 </div>        
//     //                             </div>
//     //                         </Card.Header>
//     //                         <Accordion.Collapse eventKey={item}>
//     //                             <Card.Body>
//     //                                 {tasksList}    
//     //                             </Card.Body>
//     //                         </Accordion.Collapse>
//     //                     </Card>
                        
//     //         }

//     //     )
//     //     }else{
//     //         var proyectAccordion = (<li className='itemTeam list-group-item-action list-group-item'><center>Sin datos</center></li>)
//     //     } 
        

//     // }
    
//     return (
//         <Fragment>
            
//             <Link to={`/team-member/${ user && user._id}`} className="btn btn-secondary">
//                 Atrás
//             </Link>
            
//             <div class= "row">
//                     <div className="col-lg-8 col-sm-8">
//                         <h4 className="text-center"> Responsable de Proyecto: <strong>{user && user.name} {user && user.surname}</strong></h4>
//                     </div>
//                     <div className="col-lg-8 col-sm-8">
//                         <br></br>
//                         <center><h2>Reportes de Proyectos</h2></center>
//                     </div>
//                     <div className="col-lg-4 col-sm-8 mb-4">
//                         <Card>
//                             <Card.Header>
//                                 <h5 className="my-2">Seleccionar Período</h5>
//                             </Card.Header>
//                             <Card.Body>
//                             <div class= "row">
//                                 <div className="col-lg-6 col-sm-6">
//                                     <p><b>Desde: </b></p>
//                                     <input type="date" value={startFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" 
//                                     // onChange = {e => changeStart(e)} 
//                                     ></input>
//                                 </div>
//                                 <div className="col-lg-6 col-sm-6">
//                                     <p><b>Hasta: </b></p>
//                                     <input type="date" value={endFilter} max={moment().format('YYYY-MM-DD')} class="form-control" placeholder="Buscar por nombre de tarea" 
//                                     // onChange = {e => changeEnd(e)} 
//                                     ></input>
//                                 </div>
//                             </div>
//                             <div className="row mb-4">
//                             <div className="col-lg-6 col-sm-8">
//                                     <Link to={`/team-member/team-member-Report-Layout/${ user && user._id}/${startFilter}/${endFilter}`}  className="btn btn-primary my-2">
//                                         Imprimir Reporte
//                                     </Link>
//                             </div>
//                             </div>
                            
//                             </Card.Body>
//                         </Card>
//                 </div>
//             </div>
//             <div class="row">
//                 <div className="col-lg-8 col-sm-8">
//                         <h4>Seleccione Tipos de Reporte</h4>
//                 </div>
//             </div>
//             <div className="row">
//                     <div className="col-sm">
//                         <select name="Types" className="form-control" >
//                                 <option value="">Todos los Proyectos</option>
//                                 <option value="">IMPLEMENTACION DE UN NUEVO SISTEMA</option>
//                                 <option value="">BACKUP DE LA BASE DE DATOS DE CLIENTES</option>
//                                 {}
//                         </select>
//                     </div>
//                     <div className="col-sm">
//                         <select name="Clients" className="form-control" >
//                             <option value="">Todos los Clientes</option>
//                             <option value="">Star construcciones</option>
//                             <option value="">Seguros Litoral</option>
//                             {}
//                         </select>
//                     </div>

//                     <div className="col-sm">
//                         <select name="Teams" className="form-control" >
//                             <option value="">Todos los Equipos</option>
//                             <option value="">Desarrollo</option>
//                             {}
//                         </select>
//                     </div>
                    
//             </div>
//             <br></br>
//             <div className="row">
//                 <table className="table table-hover">
//                     <thead>
//                     <tr>
//                         <th className="hide-sm headTable">Proyecto</th>
//                         <th className="hide-sm headTable">Descripcion</th>
//                         <th className="hide-sm headTable">Tipo de Proyecto</th>
//                         <th className="hide-sm headTable headStatus2">Riesgo</th>
//                         <th className="hide-sm headTable headStatus2">Cliente</th>
//                         <th className="hide-sm headTable headStatus2">Equipo</th>
//                         <th className="hide-sm headTable headStatus2">Estado</th>
//                         <th className="hide-sm headTable headStatus2">Fechas Previstas</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <th>IMPLEMENTACION DE UN NUEVO SISTEMA</th>
//                             <td>Es una herramienta para soporte de negocios</td>
//                             <td>Desarrollo de Software</td>
//                             {/* <td>@mdo</td> */}
//                             <td>Aumento de costos de los recursos <b>(MEDIO)</b></td>
//                             <td>Star construcciones</td>
//                             <td>Desarrollo</td>
//                             <td>ACTIVO</td>
//                             <td><b>Inicio:</b> 11-02-2020 <br/><b>Fin:</b> 19-02-2020</td>
//                         </tr>
//                         <tr>
//                             <th>BACKUP DE LA BASE DE DATOS DE CLIENTES</th>
//                             <td>Resguardo de información referente de clientes</td>
//                             <td>Seguridad informática</td>
//                             {/* <td>@mdo</td> */}
//                             <td>Cambios de requerimientos no acordados <b>(MEDIO)</b></td>
//                             <td>Seguros Litoral</td>
//                             <td>Desarrollo</td>
//                             <td>ACTIVO</td>
//                             <td><b>Inicio:</b> 01-01-2020 <br/><b>Fin:</b> 31-01-2020</td>
//                         </tr>
//                         {/* {listTasks} */}
//                     </tbody>
//                 </table>
//             </div>
            
//         </Fragment>
//     )
// }


//     ProjectManagerReports.propTypes = {
//     getTaskByUser: PropTypes.func.isRequired,
//     userTask: PropTypes.object.isRequired,
//     auth: PropTypes.object.isRequired,
// }

// const mapStateToProps = state => ({
//     userTask: state.userTask,
//     auth: state.auth
// })

// export default connect(mapStateToProps, {getTaskByUser})(ProjectManagerReports)