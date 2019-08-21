import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { getAllTeam, getTeamUser } from '../../actions/team';
import { getAllUsers} from '../../actions/user';

const AdminTeam = ({getAllTeam, getAllUsers, getTeamUser, team: {team}, users: {users}, userTeam: {userTeam}}) => {

    useEffect(() => {
        getAllTeam();
        getAllUsers();
        getTeamUser();
    }, [getAllTeam, getAllUsers, getTeamUser]);

    const [arrayUserTeam, setArrayTeam] = useState([]);

    const [idTeamSelected, setIdTeam] = useState("");


    if(team != null){

        var listTeam = team.map((te) =>
            <li key={te._id} className=" list-group-item-action list-group-item">
                {te.name}

                <div className="float-right">

                    <a onClick={e => saveIdTeam(te._id)} className="btn btn-primary">
                        <i className="fas fa-arrow-circle-right"></i>
                    </a>
                    
                </div>

            </li>
        );
    }

    if(users !== null){

        var listUser = users.map((te) =>
            <li key={te._id} className=" list-group-item-action list-group-item">
                {te.surname} {te.name}
            </li>
        );
        
    }

    if(userTeam !== null){

        let idCompareTeam = team[0]._id;

        if(idTeamSelected !== ""){
            idCompareTeam = idTeamSelected
        }

        var test = userTeam;
        var arrayTemp = [];
        for (let index = 0; index < test.length; index++) {

            var element = test[index];
            
            let userTeam =  users.filter(function(usr) {
                return element.idUser == usr._id && idCompareTeam === element.idTeam;
            });

            if(userTeam[0] !== undefined){
                arrayTemp.push(userTeam[0]);
            }

        }

        var listUserTeam = arrayTemp.map((te) =>
            <li key={te._id} className=" list-group-item-action list-group-item">
                {te.surname} {te.name}
            </li>
        );

    }


    const saveIdTeam = (idSelecTeam) => {
        setIdTeam(idSelecTeam)
    }


    //#region 
    var bodyTeam = (
        <div className="card-body">
            <ul className="list-group">
                {listTeam}
            </ul>
        </div>
    )
    //#endregion

    //#region pestaña de los integrantes
    var htmlTabMember = (
        <div className="card">
            <div className="card-body">
                
                <div className="row">

                    <div className="col-md-6 bodyLocaly">
                        <ul className="list-group">
                            {listUserTeam}
                        </ul>
                    </div>

                    <div className="col-md-6 bodyLocaly">
                        <ul className="list-group">
                            {listUser}
                        </ul>
                    </div>

                </div>

            </div>
        </div>
    );
    //#endregion

    return (

        <Fragment>
            
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to="/admin" className="btn btn-secondary">
                        Atras
                    </Link>

                    <Link to="/admin-team/create-team"  className="btn btn-primary my-1">
                        Nuevo Equipo
                    </Link>
                </div>
            </div>


            <div className="row">

                <div className="col-sm-12 col-lg-5">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Lista de Equipos</strong>
                        </div>

                        {bodyTeam}

                    </div>

                </div>

                <div className="col-sm-12 col-lg-7">

                    <div className="card">

                        <div className="card-header">
                            <i class="fas fa-info-circle"></i>
                            <strong> Detalles</strong>
                        </div>

                        <div className="card-body">

                            <Tabs defaultActiveKey="team" id="uncontrolled-tab-example">

                                <Tab eventKey="team" title="Integrantes del equipo">
                                    {htmlTabMember}
                                </Tab>
                
                                <Tab eventKey="data" title="Proyecos asociados">
                                    <div className="tab-pane">Información de proyectos</div>
                                </Tab>

                            </Tabs>

                        </div>


                    </div>

                </div>

            </div>

            
        </Fragment>

    )
}

AdminTeam.propTypes = {
    getAllTeam: PropTypes.func.isRequired,
    getAllUsers: PropTypes.func.isRequired,
    getTeamUser: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    userTeam: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    team: state.team,
    users: state.users,
    userTeam: state.userTeam,
})

export default connect(mapStateToProps, {getAllTeam, getAllUsers, getTeamUser})(AdminTeam)
