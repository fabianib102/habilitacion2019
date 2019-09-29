import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { registerClient, editClient } from '../../actions/client';

import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';

const AdminCreateClient = ({match, registerClient, editClient, setAlert, history, client: {client, loading}, getAllProvince, getAllLocation, province: {province} ,location: {location}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        cuil: '',
        condition: '',
        address: '',
        email: '',
        phone: '',
        provinceId: "",
        locationId: ""
    });

    var clientEdit = {};

    if(client != null && match.params.idClient != undefined){
        for (let index = 0; index < client.length; index++) {
            if(client[index]._id == match.params.idClient){
                var clientEdit = client[index];
            }
        }
    }

    if(!clientEdit.name && match.params.idClient != undefined){
        history.push('/admin-client');
    }

    useEffect(() => {
        SetFormData({
            name: loading || !clientEdit.name ? '' : clientEdit.name,
            cuil: loading || !clientEdit.cuil ? '' : clientEdit.cuil,
            condition: loading || !clientEdit.condition ? '' : clientEdit.condition,
            address: loading || !clientEdit.address ? '' : clientEdit.address,
            email: loading || !clientEdit.email ? '' : clientEdit.email,
            phone: loading || !clientEdit.phone ? '' : clientEdit.phone,
            provinceId: loading || !clientEdit.provinceId ? '' : clientEdit.provinceId,
            locationId: loading || !clientEdit.locationId ? '' : clientEdit.locationId
        });

        getAllProvince();
        getAllLocation();

    }, [loading, getAllProvince, getAllLocation]);

    const {name, cuil, condition, address, email, phone, provinceId, locationId} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    //Función, solo permite ingresar números en el cuil
    const onChangeNumber = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            SetFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    const onSubmit = async e => {
        e.preventDefault();

        if(name === "" || cuil === "" || condition === "" || address === "" || email === "" || phone === ""){
            setAlert('Debes ingresar el nombre, cuil, condición, dirección, email y telefono', 'danger');
        }else{
            if(match.params.idClient != undefined){
                let idClient = clientEdit._id;
                editClient({name, cuil, condition, address, email, phone, provinceId, locationId, idClient, history});
            }else{
                registerClient({name, cuil, condition, address, email, phone, provinceId, locationId, history});
            }
        }
        
    }

    if(province != null){
        var listProvince = province.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name}</option>
        );
    }

    

    const [isDisable, setDisable] = useState(true);

    var filterLocation;

    const onChangeProvince = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisable(false);
    }

    if(location != null){

        filterLocation = location;

        if(provinceId != ""){
            filterLocation = location.filter(function(lo) {
                return lo.idProvince === provinceId;
            });
        }

        var listLocation = filterLocation.map((loc) =>
            <option key={loc._id} value={loc._id}>{loc.name}</option>
        );
    }


    return (

        <Fragment>

            <Link to="/admin-client" className="btn btn-secondary">
                Atrás
            </Link>

            <p className="lead"><i className="fas fa-user"></i> {match.params.idClient != undefined ? "Edición de cliente": "Nuevo Cliente"} </p>


            <form className="form" onSubmit={e => onSubmit(e)}>

                <div className="form-group">
                    <h5>Nombre o Razón Social (*)</h5>
                    <input 
                        type="text" 
                        placeholder="Nombre o Razón Social del cliente" 
                        name="name"
                        minLength="3"
                        maxLength="50"
                        onChange = {e => onChange(e)}
                        value={name}
                    />
                </div>

                <div className="form-group">
                    <h5>CUIL (*)</h5>
                    <input 
                        type="text" 
                        placeholder="CUIL" 
                        name="cuil"
                        maxLength="11"
                        minLength="11"
                        onChange = {e => onChange(e)}
                        value={cuil}
                    />
                </div>


                <div className="form-group">
                    <h5>Condición frente al IVA (*)</h5>
                    <select name="condition" value={condition} onChange = {e => onChange(e)}>
                        <option value="">* Seleccione la condición</option>
                        <option value="IVA Responsable Inscripto">IVA Responsable Inscripto</option>
                        <option value="IVA Responsable no Inscripto">IVA Responsable no Inscripto</option>
                        <option value="IVA no Responsable">IVA no Responsable</option>
                        <option value="IVA Sujeto Exento">IVA Sujeto Exento</option>
                        <option value="Consumidor Final">Consumidor Final</option>
                        <option value="Responsable Monotributo">Responsable Monotributo</option>
                        <option value="Sujeto no Categorizado">Sujeto no Categorizado</option>
                        <option value="Proveedor del Exterior">Proveedor del Exterior</option>
                        <option value="Cliente del Exterior">Cliente del Exterior</option>
                        <option value="IVA Liberado">IVA Liberado</option>
                        <option value="IVA Responsable Inscripto – Agente de Percepción">IVA Responsable Inscripto – Agente de Percepción</option>
                        <option value="Pequeño Contribuyente Eventual">Pequeño Contribuyente Eventual</option>
                        <option value="Monotributista Social">Monotributista Social</option>
                        <option value="Pequeño Contribuyente Eventual Social">Pequeño Contribuyente Eventual Social</option>
                    </select>
                </div>

                <div className="form-group">
                    <h5>Dirección (*)</h5>
                    <input 
                        type="text" 
                        placeholder="Dirección" 
                        name="address"
                        maxLength="150"
                        minLength="5"
                        onChange = {e => onChange(e)}
                        value={address}
                    />
                </div>

                <div className="form-group">
                    <h5>Email (*)</h5>
                    <input 
                        type="email" 
                        placeholder="Email"
                        name="email"
                        maxLength="30"
                        minLength="5"
                        onChange = {e => onChange(e)}
                        value={email}
                    />
                </div>

                <div className="form-group">
                    <h5>Teléfono (*)</h5>
                    <input 
                        type="text" 
                        placeholder="Teléfono" 
                        name="phone"
                        maxLength="15"
                        minLength="10"
                        onChange = {e => onChangeNumber(e)}
                        value={phone}
                    />
                </div>

                <div className="form-group">
                    <h5>Provincia (*)</h5>
                    <select name="provinceId" value={provinceId} onChange = {e => onChangeProvince(e)}>
                        <option value="0">* Selección de Provincia</option>
                        {listProvince}
                    </select>
                </div>

                <div className="form-group">
                    <h5>Localidad (*)</h5>
                    <select name="locationId" value={locationId} onChange = {e => onChange(e)} disabled={isDisable}>
                        <option value="0">* Selección de Localidad</option>
                        {listLocation}
                    </select>
                </div>


                <div className="form-group">
                    <span>(*) son campos obligatorios</span>
                </div>

                <input type="submit" className="btn btn-primary" value={ match.params.idClient != undefined ? "Modificar" : "Registrar" } />

                <Link to="/admin-client" className="btn btn-danger">
                    Cancelar
                </Link>


            </form>
            
        </Fragment>
    )
}

AdminCreateClient.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    editClient: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    province: state.province,
    location: state.location,
})

export default connect(mapStateToProps, {setAlert, registerClient, editClient, getAllLocation, getAllProvince})(AdminCreateClient);
