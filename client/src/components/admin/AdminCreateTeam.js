import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {setAlert} from '../../actions/alert';
import { getAllUsers} from '../../actions/user';
import { registerTeam} from '../../actions/team';


const AdminCreateTeam = ({getAllUsers, registerTeam, users: {users}, history}) => {

    const [formData, SetFormData] = useState({
        name: '',
        description: ''
    });

    const [arrayUserTeam, setArrayTeam] = useState([]);

    const [itemIndex, setIndex] = useState("");

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const {name, description} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    if(users != null){

        var listUser = users.map((us, item) =>

            <li key={us._id} className={item == itemIndex ? "itemActive list-group-item-action list-group-item": "list-group-item-action list-group-item"}>
                
                {us.surname} {us.name} 

                <div className="float-right">


                <a onClick={e => quitToList(us._id, item)} className={us.addList ? "btn btn-danger": "hideBtn btn btn-danger"}>
                    <i className="fas fa-arrow-circle-left"></i>
                </a> 

                <a onClick={e => loadListTeam(us._id, item)} className={!us.addList ? "btn btn-primary": "hideBtn btn btn-primary"}>
                    <i className="fas fa-plus-circle"></i>
                </a>
                    
                </div>

            </li>
        );

    }

    var listTeam = [];

    const loadListTeam = (idUser, itemPass) => {

        listTeam = arrayUserTeam;

        for (let index = 0; index < users.length; index++) {
            const element = users[index];

            if(element._id === idUser){
                listTeam.push(element);
                users[index].addList = true;
            }
        }

        setArrayTeam(listTeam);
        setIndex(itemPass);
    };

    const quitToList = (idUser, itemPass) => {

        listTeam = arrayUserTeam;

        for (let j = 0; j < users.length; j++) {
            const element = users[j];
            if(element._id === idUser){
                users[j].addList = false;
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

        if(arrayUserTeam.length == 0 || name === "" || description === ""){
            setAlert('Debes completar el nombre, descripción y seleccionar un recurso como minimo', 'danger');
        }else{

            let arrayId = [];

            for (let index = 0; index < arrayUserTeam.length; index++) {
                const element = arrayUserTeam[index];
                arrayId.push(element._id);
            }

            registerTeam({name, description, users:arrayId, history});

        }

    }


    //#region html del formulario del equipo

    var formTeam = (
        <div className="col-md-6">

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

                    <input type="submit" className="btn btn-primary" value={"Agregar"} />

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
                    <strong> Lista de RRHH</strong>
                </div>

                <div className="card-body">
                    
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
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> Nuevo equipo</p>
            
            <div className="row">

                {formTeam}

                {formHumanResources}

            </div>

        </Fragment>

    )
}

AdminCreateTeam.propTypes = {
    getAllUsers: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    registerTeam: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    users: state.users
})

export default connect(mapStateToProps, {setAlert, getAllUsers, registerTeam})(AdminCreateTeam);


