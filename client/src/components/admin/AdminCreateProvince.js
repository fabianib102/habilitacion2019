import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';

import {registerProvince} from '../../actions/province';

const AdminCreateProvince = ({setAlert, history, registerProvince}) => {
    
    const [formData, SetFormData] = useState({
        name: '',
        location: ''
    });

    const [nameProvince, SetNameProvince] = useState("");

    const {name, location} = formData;

    const [arrayLocaly, setLocaly] = useState([]);

    const [arrayGroup, setHtml] = useState([]);
    
    const addLocaly = () => {

        if(location != ""){
            
            setAlertShow(false);
            let letArray = arrayLocaly;
            letArray.push(location);
            SetFormData({
                location: ""
            });
            setLocaly(letArray);
            updateLocaly();

        }else{
            setAlertShow(true);
            //setAlert('Debes ingresar el nombre de la localidad', 'danger');
        }
    }

    const deleteLocaly = (item) => {
        let arrayDelete = arrayLocaly;
        arrayDelete.splice(item, 1);
        setLocaly(arrayDelete);
        updateLocaly();
    }

    const updateLocaly = () => {

        let updArr = [];

        for (let i = 0; i < arrayLocaly.length; i++) {
            updArr.push(
            <ListGroup.Item>
                {arrayLocaly[i]} 
                <a onClick={e => deleteLocaly(i)} className="btn btn-danger float-right">
                    <i className="far fa-trash-alt"></i>
                </a>
            </ListGroup.Item>);
        };

        setHtml(updArr);
    }

    const cardLocaly = (
        <Card>
            <ListGroup variant="flush" className="groupList">
                {arrayGroup}
            </ListGroup>
        </Card>
    )

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSet = e => SetNameProvince(e.target.value);

    const onSubmit = async e => {

        e.preventDefault();

        var results = [];
        for (var i = 0; i < arrayLocaly.length - 1; i++) {
            if (arrayLocaly[i + 1] == arrayLocaly[i]) {
                results.push(arrayLocaly[i]);
            }
        }

        if(results.length>0){
            setAlert('Existen localidadedes duplicadas, por favor elimínela', 'danger');
            return;
        }

        registerProvince({name: nameProvince, location: arrayLocaly, history});
        
    }

    const [showAlert, setAlertShow] = useState(false);

    const alertLocaly = (
        <div class="alert alert-danger" role="alert">
            Debes ingresar el nombre de la localidad
        </div>
    )


    return (

        <Fragment>

            <Link to="/admin-province" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-tasks"></i> Nueva Provincia</p>

            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="form-group">
                    <h5>Nombre de la provincia (*)</h5>
                    <input 
                        type="text" 
                        placeholder="Nombre de la provincia" 
                        name="nameProvince"
                        value={nameProvince}
                        onChange = {e => onSet(e)}
                        minLength="3"
                        maxLength="50"
                    />
                </div>

                <div className="form-group">
                    <Card className="cardCustom">
                        <Card.Body>
                            <Card.Title>Agregado de Localidad</Card.Title>
                            <Card.Text>

                                {cardLocaly}

                                <div className="form-group">
                                    <h5>Nombre (*)</h5>
                                    <input 
                                        type="text" 
                                        placeholder="Nombre de la Localidad" 
                                        name="location"
                                        minLength="3"
                                        maxLength="50"
                                        value={location}
                                        onChange = {e => onChange(e)}
                                    />
                                </div>

                            </Card.Text>
                            
                            <a onClick={e => addLocaly()} className="btn btn-outline-light">
                                Agregar
                            </a>

                            {showAlert ? alertLocaly : ""}

                        </Card.Body>
                    </Card>
                </div>

                <div className="form-group">
                    <span>(*) son campos obligatorios</span>
                </div>

                <input type="submit" className="btn btn-primary" value={"Guardar"} />

                <Link to="/admin-province" className="btn btn-danger">
                    Cancelar
                </Link>

            </form>

        </Fragment>
    )
}

AdminCreateProvince.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerProvince: PropTypes.func.isRequired,
}

export default connect(null, {setAlert, registerProvince})(AdminCreateProvince);