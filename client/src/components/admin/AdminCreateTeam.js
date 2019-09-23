import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {setAlert} from '../../actions/alert';
import { getAllUsersActive } from '../../actions/user';
import { registerTeam, getAllTeam, editTeam} from '../../actions/team';


const AdminCreateTeam = ({match, getAllUsersActive, setAlert, editTeam, registerTeam, userActive: {userActive}, history, team: {team, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    });

    const [arrayUserTeam, setArrayTeam] = useState([]);

    const [itemIndex, setIndex] = useState("");

    useEffect(() => {
        getAllUsersActive();
        getAllTeam();
    }, [getAllUsersActive, getAllTeam]);

   
    var teamEdit = {};

    if(team !== null && match.params.idTeam !== undefined){
        for (let index = 0; index < team.length; index++) {
            if(team[index]._id === match.params.idTeam){
                var teamEdit = team[index];
            }
        }
    }

    if(!teamEdit.name && match.params.idTeam !== undefined){
        history.push('/admin-team');
    }


    useEffect(() => {
        SetFormData({
            name: loading || !teamEdit.name ? '' : teamEdit.name,
            description: loading || !teamEdit.description ? '' : teamEdit.description
        });
    }, [loading]);


    const {name, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    if(userActive !== null){

        var listUser = userActive.map((us, item) =>

            <li key={us._id} className={item == itemIndex ? "itemActive list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
                
                {us.surname} {us.name} 

                <div className="float-right">

                    <a onClick={e => quitToList(us._id, item)} className={us.addList ? "btn btn-danger": "hideBtn btn btn-danger"} title="Quitar">
                        <i className="fas fa-minus-circle coloWhite"></i>
                    </a> 

                    <a onClick={e => loadListTeam(us._id, item)} className={!us.addList ? "btn btn-success": "hideBtn btn btn-primary"} title="Añadir">
                        <i className="fas fa-plus-circle coloWhite"></i>
                    </a>
                    
                </div>

            </li>
        );

    }

    var listTeam = [];

    const loadListTeam = (idUser, itemPass) => {

        listTeam = arrayUserTeam;

        for (let index = 0; index < userActive.length; index++) {
            const element = userActive[index];

            if(element._id === idUser){
                listTeam.push(element);
                userActive[index].addList = true;
            }
        }

        setArrayTeam(listTeam);
        setIndex(itemPass);
    };

    const quitToList = (idUser, itemPass) => {

        listTeam = arrayUserTeam;

        for (let j = 0; j < userActive.length; j++) {
            const element = userActive[j];
            if(element._id === idUser){
                userActive[j].addList = false;
            }
        }

        for (let index = 0; index < listTeam.length; index++) {
            const element = listTeam[index];
            if(element._id === idUser){
                listTeam.splice(index, 1);
            }
        }

        setArrayTeam(listTeam);
        setIndex(itemPass);

    }

    const onSubmit = async e => {
        e.preventDefault();

        //arrayUserTeam.length == 0 ||  agregar
        if(name === "" || description === ""){
            setAlert('Debes completar el nombre, descripción y seleccionar un recurso como mínimo', 'danger');
        }else{

            if(match.params.idTeam !== undefined){

                editTeam({name, description, idTeam:match.params.idTeam, history});

            }else{

                if(arrayUserTeam.length > 0){
                    let arrayId = [];
                    for (let index = 0; index < arrayUserTeam.length; index++) {
                        const element = arrayUserTeam[index];
                        arrayId.push(element._id);
                    }
                    registerTeam({name, description, users:arrayId, history});
                }else{
                    setAlert('Debes seleccionar un recurso como minimo', 'danger');
                }
                
            }
            
        }

    }


    //#region html del formulario del equipo

    var formTeam = (
        <div className={!teamEdit.name ? "col-md-6" : "col-md-12"}>

                <form className="form" onSubmit={e => onSubmit(e)}>

                    <div className="form-group">
                        <h5>Nombre (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Nombre del equipo" 
                            name="name" 
                            value={name}
                            onChange = {e => onChange(e)}
                            minLength="3"
                            maxLength="50"
                        />
                    </div>

                    <div className="form-group">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción del equipo" 
                            name="description" 
                            value={description}
                            onChange = {e => onChange(e)}
                            minLength="3"
                            maxLength="60"
                        />
                    </div>

                    <div className="form-group">
                        <span>(*) son campos obligatorios</span>
                    </div>

                    <input type="submit" className="btn btn-primary" value={ match.params.idTeam != undefined ? "Modificar" : "Registrar" } />

                    <Link to="/admin-team" className="btn btn-danger">
                        Cancelar
                    </Link>

                </form>
            
            </div>
    )

    //#endregion

    //#region html de la seleccion de recusos humanos
    var formHumanResources = (
        <div className="col-md-6">

            <div className="card">

                <div className="card-header">
                    <i className="fa fa-align-justify"></i>
                    <strong> RRHH Disponibles</strong>
                </div>

                <div className="card-body bodyLocaly">
                    
                    <ul className="list-group">
                        {listUser}
                    </ul>

                </div>

            </div>
            
        </div>
    )
    //#endregion

    return (

        <Fragment>
            
            <Link to="/admin-team" className="btn btn-secondary">
                Atrás
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> {match.params.idTeam != undefined ? "Edición de equipo": "Nuevo equipo"}</p>
            
            <div className="row">

                {formTeam}

                {!teamEdit.name ? formHumanResources : ""}

            </div>

        </Fragment>

    )
}

AdminCreateTeam.propTypes = {
    getAllUsersActive: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired,
    userActive: PropTypes.object.isRequired,
    registerTeam: PropTypes.func.isRequired,
    getAllTeam: PropTypes.func.isRequired,    
    editTeam: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    userActive: state.userActive,
    team: state.team,
})

export default connect(mapStateToProps, {setAlert, getAllUsersActive, registerTeam, getAllTeam, editTeam})(AdminCreateTeam);


