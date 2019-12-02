import React, {Fragment, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Button, Accordion, Card, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import PrintButton from '../teamMember/PrintButton';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';

import { getAllUsers } from '../../actions/user';


const AdminReportConnectionLayout = ({match, auth:{user}, getAllUsers, users: {users}}) => {

    const [startFilter , setStartFilter] = useState("");
    const [endFilter, setEndFilter] = useState("");
    const [statusFilter, setStatus] = useState("-");
    const [statusConnection, setConnection] = useState("-");
    const [cond, setCond] = useState(false); 
    const [showPeriod, setShowPeriod] = useState(false);

    useEffect(() => {
        getAllUsers();
        setStartFilter(match.params.startFilter);
        setEndFilter(match.params.endFilter);
        setStatus(match.params.statusFilter);

        if(match.params.statusConnection === "undefined"){
            setConnection(undefined);
            setCond(true);
            setShowPeriod(true);
        }
        if(match.params.statusConnection === "*"){   
            setConnection(match.params.statusConnection);
            setCond(false);
            setShowPeriod(false);
        }
        if(match.params.statusConnection === "-"){
            setConnection("-");
            setCond(false);
            setShowPeriod(false);

        }
    }, [getAllUsers]);


    if(users != null){

        var usersFilter = users;
        var whithItems = true;

      
        if (users.length !== 0){
            if(statusFilter !== "-"){
                usersFilter =  usersFilter.filter(function(usr) {
                    return usr.status === statusFilter;
                });
            }

            if(statusConnection !== "-"){
                usersFilter =  usersFilter.filter(function(usr) {
                    if(cond){
                        return usr.last_connection === undefined;
                    }else{
                        console.log("con",usr.last_connection,startFilter,usr.last_connection >= startFilter,endFilter,usr.last_connection <= endFilter)
                        return usr.last_connection !== undefined && usr.last_connection >= startFilter && usr.last_connection <= endFilter;
                    }
                });
            }
            if(usersFilter.length !== 0){
                
                var listUsers = usersFilter.map((user, item)=>  
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

        }else{
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center>Sin datos</center></li>)
        } 
        

    }   

    return (
        <Fragment>
            <div class= "row">
                <Link to={`/admin-project/connectionReport/${ user && user._id}`} className="btn btn-secondary">
                    Atrás
                </Link>
                <div >
                    <PrintButton id='Hs Dedicadas a Tareas x Proyectos' label='Descargar PDF' className="float-right"> </PrintButton>
                </div>
            </div>
            
            <br/>
         
            {/* "border border-dark " */}
            <div id= 'Hs Dedicadas a Tareas x Proyectos' className="" style={{width:'200mm',padding:'10px'}}> 
                
                <br/>

                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <p className='float-right'>Fecha de Emisión: <Moment format="DD/MM/YYYY" className='float-right'></Moment></p>
                    </div>
                </div>
                
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                    <h1 className="text-center"><strong>Reporte</strong></h1>
                    <h3 className="text-center">Usuarios en el Sistema</h3>
                    </div>
                </div>
                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h5 className="text-center">Período:</h5>
                        {!showPeriod ?
                        <h5 className="text-center"><strong>{moment(startFilter).format('DD/MM/YYYY')}</strong> - <strong>{moment(endFilter).format('DD/MM/YYYY')}</strong></h5>
                        :<h5 className="text-center"><strong>Sin Determinar</strong></h5>}   
                    </div>
                </div>
                
                <br/>

                <div class= "row">
                    <div className="col-lg-12 col-sm-12">
                        <h5>Identificador(Leg.): <strong>{user && user.identifier}</strong></h5>
                        <h5>Nombre: <strong>{user && user.name} {user && user.surname}</strong></h5>
                        <h5>CUIL: <strong>{user && user.cuil}</strong></h5>
                    </div>
                </div>

                <br/>                                 

                <div className= "row">          
                    <div className="col-lg-12 col-sm-12">
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
                        {whithItems ? '' : itemNone}
                    </div>
                </div>      
                
                <br/>

            </div>
        </Fragment>
    )

}


AdminReportConnectionLayout.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    users: state.users,
    auth: state.auth
})

export default connect(mapStateToProps, {getAllUsers})(AdminReportConnectionLayout)