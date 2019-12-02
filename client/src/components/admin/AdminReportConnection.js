import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { getAllUsers } from '../../actions/user';

const AdminReportConnection = ({match, auth:{user}, getAllUsers, users: {users}}) => {

    const [startFilter , setStartFilter] = useState();
    const [endFilter, setEndFilter] = useState("");    


    useEffect(() => {
        getAllUsers();
       
        setStartFilter(moment().startOf('month').format("YYYY-MM-DD"));
        setEndFilter(moment().format("YYYY-MM-DD"));
    }, [getAllUsers]);


    if(users != null){

        var projects = [];
        var whithItems = true;

      
        if (users.length !== 0){
        var listUsers = users.map((user, item)=>  
            <tr key={item}>
            <td className="hide-sm">{user.surname}, {user.name}</td>
            <td className="hide-sm">{user.email}</td>
            <td className="hide-sm">{user.status}</td>
            <td className="hide-sm">
                {user.last_connection !== undefined ?
                     <React.Fragment>
                        <Moment format="DD/MM/YYYY HH:mm">{user.last_connection}</Moment>
                     </React.Fragment>
                :"Sin Ingresar"}
            </td>            
        </tr>           

        )
        }else{
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center>Sin datos</center></li>)
        } 
        

    }   

    const changeStart = e => {
        setStartFilter(e.target.value);
    }

    const changeEnd = e => {
        setEndFilter(e.target.value);
    }

    return (
        <Fragment>
            
            <Link to={`/dashboard/`} className="btn btn-secondary">
                Atrás
            </Link>
            
            <div class= "row">
                <div className="col-lg-8 col-sm-8">
                    <h4 className="text-center"> Reporte de: <strong>{user && user.name} {user && user.surname}</strong></h4>
                    <h3 className="text-center">Usuarios en el Sistema</h3>
                </div>
                
            </div>

            <br/>
                   
            <div className= "row">          
                <div className="col-lg-8 col-sm-8">
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th className="hide-sm headTable">Apellidos y Nombres</th>
                        <th className="hide-sm headTable">Email</th>  
                        <th className="hide-sm headTable">Estado</th>                         
                        <th className="hide-sm headTable">Última conexión</th>
                    </tr>
                    </thead>
                    <tbody>{listUsers}</tbody>                
                </table>
                {!whithItems ? '' : itemNone}
                </div>

                <div className="col-lg-4 col-sm-8 mb-4">
                    <Card>
                        <Card.Header>
                            <h5 className="my-2">Filtrar</h5>
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
                            <br></br>
                            <div class= "row">
                                <div className="col-lg-3 col-sm-3">
                                    <p><b>Estado: </b></p>
                                </div>
                                <div className="col-lg-9 col-sm-9">
                                    <select name="statusTask" className="form-control ">
                                        <option value="">TODOS</option>
                                        <option value="ACTIVO">ACTIVOS</option>
                                        <option value="INACTIVO">INACTIVOS</option>                       
                                    </select>
                                </div>
                            </div>
                            <div class= "row">
                                <div className="col-lg-3 col-sm-3">
                                    <p><b>Estado de Conexión: </b></p>
                                </div>
                                <div className="col-lg-9 col-sm-9">
                                    <select name="statusTask" className="form-control ">
                                        <option value="">TODOS</option>
                                        <option value="ACTIVO">NO CONECTADOS</option>
                                        <option value="INACTIVO">CONECTADOS</option>                       
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-lg-6 col-sm-8">
                                {/* to={`/team-member/team-member-Report-Layout/${ user && user._id}/${startFilter}/${endFilter}`}  */}
                                    <Link  className="btn btn-primary my-2">
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

 
AdminReportConnection.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    users: state.userTask,
    auth: state.auth
})

export default connect(mapStateToProps, {getAllUsers})(AdminReportConnection)