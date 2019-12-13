import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { editClient, registerClientAgent} from '../../actions/client';
import { getAllAgent} from '../../actions/agent';

import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';

const AdminCreateClient = ({match, registerClientAgent, editClient, setAlert, history, client: {client, loading},getAllAgent, getAllProvince, getAllLocation, province: {province} ,location: {location}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        cuil: '',
        condition: '',
        address: '',
        email: '',
        phone: '',
        provinceId: "",
        locationId: "",
        nameRef: '',
        surnameRef: '',
        cuilRef: '',
        addressRef: '',
        emailRef: '',
        phoneRef: '',
        provinceIdRef: "",
        locationIdRef: "",
        clientId:"-"
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
            locationId: loading || !clientEdit.locationId ? '' : clientEdit.locationId,
            nameRef: '',
            surnameRef: '',
            cuilRef: '',
            addressRef: '',
            emailRef: '',
            phoneRef: '',
            provinceIdRef: "",
            locationIdRef: "",
            clientId:"-"
        });

        getAllProvince();
        getAllLocation();
        getAllAgent();

    }, [loading, getAllProvince, getAllLocation,getAllAgent]);

    const {name, cuil, condition, address, email, phone, provinceId, locationId,
        nameRef, surnameRef, cuilRef, addressRef, emailRef, phoneRef, provinceIdRef, locationIdRef, clientId} = formData;

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

        if(name === "" || cuil === "" || condition === "" || address === "" || email === "" || phone === "", provinceId === "", locationId === ""){
            setAlert('Debes ingresar TODOS los datos del Cliente', 'danger');        
        }else{
            if(match.params.idClient != undefined){
                let idClient = clientEdit._id;
                editClient({name, cuil, condition, address, email, phone, provinceId, locationId, idClient, history});
                }else{
                    if(nameRef === "" || surnameRef === "" || cuilRef === "" || addressRef === "" || emailRef === "" || phoneRef === "", provinceIdRef === "", locationIdRef === ""){
                        setAlert('Debes ingresar TODOS los datos del Referente del Cliente', 'danger');

                    }else{
                        // console.log("seteoRef",nameRef, surnameRef, cuilRef, addressRef, emailRef, phoneRef, provinceIdRef, locationIdRef);
                        // console.log("seteoCLI:",name, cuil, condition, address, email, phone, provinceId, locationId);
                        registerClientAgent({name, cuil, condition, address, email, phone, provinceId, locationId, nameRef, surnameRef, cuilRef, addressRef, emailRef, phoneRef, provinceIdRef, locationIdRef, history});

                       
                    }
                }
        
        }
    }
    // list cliente
    if(province != null){
        var listProvince = province.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name}</option>
        );
    }
    // list Referente
      if(province != null){
        var listProvinceRef = province.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name}</option>
        );
    }

    const [isDisable, setDisable] = useState(true);
    const [isDisableRef, setDisableRef] = useState(true);

    var filterLocation;
    var filterLocationRef;

    // cliente
    const onChangeProvince = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisable(false);
    }
    // referente
    const onChangeProvinceRef = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisableRef(false);
    }

    //cliente
    if(location != null){

        filterLocation = location;

        if(provinceId !== ""){
            filterLocation = location.filter(function(lo) {
                return lo.idProvince === provinceId;
            });
        }

        var listLocation = filterLocation.map((loc) =>
            <option key={loc._id} value={loc._id}>{loc.name}</option>
        );
    }

    // referente
    if(location != null){

        filterLocationRef = location;
        if(provinceIdRef !== ""){
            filterLocationRef = location.filter(function(lo) {
                return lo.idProvince === provinceIdRef;
            });
        }

        var listLocationRef = filterLocationRef.map((loc) =>
            <option key={loc._id} value={loc._id}>{loc.name}</option>
        );
    }

    return (

        <Fragment>

            <Link to="/admin-client" className="btn btn-secondary">
                Atrás
            </Link>

            <p className="lead"></p>
    
    {match.params.idClient != undefined ?             
   
            <form className="form" onSubmit={e => onSubmit(e)}>
                    <div className="row">
                        <div className="col-sm-12 col-md-12">
                                <div class="card">
                                    <div class="card-header"><h5><i className="fas fa-user"></i> <b>Editar Cliente</b></h5></div>
                                    <div class="card-body">       

                                        <div className="form-group">
                                            <h5>Nombre o Razón Social (*)</h5>
                                            <input 
                                                type="text" 
                                                class="form-control"
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
                                                class="form-control"
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
                                            <select name="condition" class="form-control" value={condition} onChange = {e => onChange(e)}>
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
                                                class="form-control"
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
                                                class="form-control"
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
                                                class="form-control"
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
                                            <select name="provinceId" class="form-control" value={provinceId} onChange = {e => onChangeProvince(e)}>
                                                <option value="0">* Selección de Provincia</option>
                                                {listProvince}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <h5>Localidad (*)</h5>
                                            <select name="locationId" class="form-control" value={locationId} onChange = {e => onChange(e)} disabled={isDisable}>
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
                                    </div>
                                </div>
                        </div>                        
                    </div>
            </form>
        :  
                <form className="form" onSubmit={e => onSubmit(e)}>
                    <div className="row">                
                            <div className="col-sm-6 col-md-6">
                                <div class="card">
                                    <div class="card-header"> <h5><i className="fas fa-user"></i> Datos del Cliente </h5></div>
                                    <div class="card-body">                                

                                            <div className="form-group">
                                                <h5>Nombre o Razón Social (*)</h5>
                                                <input 
                                                    type="text" 
                                                    class="form-control"
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
                                                    class="form-control"
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
                                                <select name="condition" class="form-control" value={condition} onChange = {e => onChange(e)}>
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
                                                    class="form-control"
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
                                                    class="form-control"
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
                                                    class="form-control"
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
                                                <select name="provinceId" class="form-control" value={provinceId} onChange = {e => onChangeProvince(e)}>
                                                    <option value="0">* Selección de Provincia</option>
                                                    {listProvince}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <h5>Localidad (*)</h5>
                                                <select name="locationId" class="form-control" value={locationId} onChange = {e => onChange(e)} disabled={isDisable}>
                                                    <option value="0">* Selección de Localidad</option>
                                                    {listLocation}
                                                </select>
                                            </div>
                                            
                                    </div>                
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-6">
                               <div class="card">
                                    <div class="card-header"> <h5><i className="fas fa-user-tag"></i> Datos del Referente del Cliente </h5> </div>
                                        <div class="card-body"> 

                                            <div className="form-group">
                                                <h5>Nombres (*)</h5>
                                                <input 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Nombre del Referente" 
                                                    name="nameRef"
                                                    minLength="3"
                                                    maxLength="50"
                                                    onChange = {e => onChange(e)}
                                                    value={nameRef}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <h5>Apellidos (*)</h5>
                                                <input 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Apellido del Referente" 
                                                    name="surnameRef"
                                                    minLength="3"
                                                    maxLength="50"
                                                    onChange = {e => onChange(e)}
                                                    value={surnameRef}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <h5>CUIL (*)</h5>
                                                <input 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="CUIL" 
                                                    name="cuilRef"
                                                    maxLength="11"
                                                    minLength="11"
                                                    onChange = {e => onChange(e)}
                                                    value={cuilRef}
                                                />
                                            </div>


                                            <div className="form-group">
                                                <h5>Dirección (*)</h5>
                                                <input 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Dirección" 
                                                    name="addressRef"
                                                    maxLength="150"
                                                    minLength="5"
                                                    onChange = {e => onChange(e)}
                                                    value={addressRef}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <h5>Email (*)</h5>
                                                <input 
                                                    type="email" 
                                                    class="form-control"
                                                    placeholder="Email"
                                                    name="emailRef"
                                                    maxLength="30"
                                                    minLength="5"
                                                    onChange = {e => onChange(e)}
                                                    value={emailRef}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <h5>Teléfono (*)</h5>
                                                <input 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Teléfono" 
                                                    name="phoneRef"
                                                    maxLength="15"
                                                    minLength="10"
                                                    onChange = {e => onChangeNumber(e)}
                                                    value={phoneRef}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <h5>Provincia (*)</h5>
                                                <select name="provinceIdRef" class="form-control" value={provinceIdRef} onChange = {e => onChangeProvinceRef(e)}>
                                                    <option value="0">* Selección de Provincia</option>
                                                    {listProvinceRef}
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <h5>Localidad (*)</h5>
                                                <select name="locationIdRef" class="form-control" value={locationIdRef} onChange = {e => onChange(e)} disabled={isDisableRef}>
                                                    <option value="0">* Selección de Localidad</option>
                                                   {listLocationRef}
                                                </select>
                                            </div>
                                    </div>            
                                </div>
                            </div>
                            <div className="form-group">
                                <span>(*) son campos obligatorios</span>
                            </div>
                        
                    </div>

                    <input type="submit" className="btn btn-primary" value={ match.params.idClient != undefined ? "Modificar" : "Registrar" } />

                    <Link to="/admin-client" className="btn btn-danger">
                        Cancelar
                    </Link>
                </form>

        }
            
        </Fragment>
    )
}

AdminCreateClient.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerClientAgent: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    editClient: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
    getAllAgent:PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    client: state.client,
    province: state.province,
    location: state.location,
})

export default connect(mapStateToProps, {setAlert, registerClientAgent, editClient, getAllLocation, getAllProvince, getAllAgent})(AdminCreateClient);
