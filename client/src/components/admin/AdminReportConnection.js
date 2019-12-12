import React, {Fragment, useEffect, useState} from 'react';
import { Link} from 'react-router-dom';
import { Card} from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { getAllUsers } from '../../actions/user';

const AdminReportConnection = ({match, auth:{user}, getAllUsers, users: {users}}) => {

    const [startFilter , setStartFilter] = useState();
    const [endFilter, setEndFilter] = useState();
    const [statusFilter, setStatus] = useState("-");
    const [statusConnection, setConnection] = useState("-");
    const [cond, setCond] = useState(false); 
    const [showFilterDates, setShowFilterDates] = useState(true);    


    useEffect(() => {
        getAllUsers();
       
        setStartFilter(moment().startOf('month').format("YYYY-MM-DD"));
        setEndFilter(moment().format("YYYY-MM-DD"));
    }, [getAllUsers]);

    const modifyStatus = (e) => {
        setStatus(e.target.value);
    }

    const modifyStatusConnection = (e) => {
        // console.log("ENTRA:",e.target.value)
        if(e.target.value === "undefined"){
            // console.log("entra undef")
            setConnection(undefined);
            setCond(true);
            setShowFilterDates(true);
        }
        if(e.target.value === "*"){   
            // console.log("entra con")         
            setConnection(e.target.value);
            setCond(false);
            setShowFilterDates(false);
        }
        if(e.target.value === "-"){
            // console.log(" entra all")
            setConnection("");
            setCond(false);
            setShowFilterDates(true);
        }
        
    }


    if(users != null){

        var usersFilter = users;
        var whithItems = true;

      
        if (users.length !== 0){
            if(statusFilter !== "-"){
                usersFilter =  usersFilter.filter(function(usr) {
                    return usr.status === statusFilter;
                });
                // console.log("u",usersFilter)
            }
            if(statusConnection !== "-"){
                // console.log("statusCon")
                usersFilter =  usersFilter.filter(function(usr) {
                    if(cond){
                        // console.log("undef")
                        return usr.last_connection === undefined;
                    }else{
                        //REVISAR LA COMPARACION DE LA FECHA DE HASTA, QUE LA TOMA SIEMPRE DE FALSO
                        console.log("con",usr.last_connection,startFilter,usr.last_connection >= startFilter,endFilter,usr.last_connection <= endFilter)
                        return usr.last_connection !== undefined && usr.last_connection >= startFilter && usr.last_connection <= endFilter;
                    }
                });
            }
            if(usersFilter.length !== 0){
                // console.log("aa",usersFilter)
                
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
                // console.log("aa.",usersFilter)
                var whithItems = false;
                var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center>Sin datos</center></li>)
            }

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
                    <h3 className="text-center">Estado de Usuarios en el Sistema</h3>
                </div>
                
            </div>

            <br/>
                   
            <div className= "row">          
                <div className="col-lg-8 col-sm-8">
                
                 <table className="table table-hover table-bordered">
                    <thead className="react-bs-container-header table-header-wrapper">                    
                    <tr>
                        <th className="hide-sm ">Apellidos y Nombres</th>
                        <th className="hide-sm ">Email</th>  
                        <th className="hide-sm ">Estado</th>                         
                        <th className="hide-sm ">Última conexión</th>
                    </tr>
                    </thead>
                    <tbody>{listUsers}</tbody>                
                </table>
                {whithItems ? '' : itemNone}
                </div>

                <div className="col-lg-4 col-sm-8 mb-4">
                    <Card>
                        <Card.Header>
                            <h5 className="my-2">Filtrar</h5>
                        </Card.Header>
                        <Card.Body>
                            <br></br>
                            <div class= "row">
                                <div className="col-lg-3 col-sm-3">
                                    <p><b>Estado: </b></p>
                                </div>
                                <div className="col-lg-9 col-sm-9">
                                    <select name="statusFilter" className="form-control " onChange = {e => modifyStatus(e)}>
                                        <option value="-">ACTIVOS E INACTIVOS</option>
                                        <option value="ACTIVO">SOLO ACTIVOS</option>
                                        <option value="INACTIVO">SOLO INACTIVOS</option>                     
                                    </select>
                                </div>
                            </div>
                            <div class= "row">
                                <div className="col-lg-3 col-sm-3">
                                    <p><b>Estado de Conexión: </b></p>
                                </div>
                                <div className="col-lg-9 col-sm-9">
                                    <select name="statusConnection" className="form-control " onChange = {e => modifyStatusConnection(e)}>
                                        <option value="-">CONECTADOS Y NO CONECTADOS</option>
                                        <option value="undefined">SOLO NO CONECTADOS</option>
                                        <option value="*">SOLO CONECTADOS</option>                       
                                    </select>
                                </div>
                            </div>
                            <div class= "row">
                                <div className="col-lg-6 col-sm-6">
                                    <p><b>Desde: </b></p>
                                    <input type="date" value={startFilter} max={moment().format('YYYY-MM-DD')} class="form-control"  onChange = {e => changeStart(e)} disabled={showFilterDates}></input>
                                </div>
                                <div className="col-lg-6 col-sm-6">
                                    <p><b>Hasta: </b></p>
                                    <input type="date" value={endFilter} max={moment().format('YYYY-MM-DD')} class="form-control" onChange = {e => changeEnd(e)} disabled={showFilterDates}></input>
                                
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                {/* to={`/team-member/team-member-Report-Layout/${ user && user._id}/${startFilter}/${endFilter}`}  */}
                                    <center>
                                    <Link to={`/admin-project/connection-report-layout/${ user && user._id}/${startFilter}/${endFilter}/${statusFilter}/${statusConnection}`}  className="btn btn-primary my-2">
                                        Imprimir Reporte
                                    </Link>
                                    </center>
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
    users: state.users,
    auth: state.auth
})

export default connect(mapStateToProps, {getAllUsers})(AdminReportConnection)