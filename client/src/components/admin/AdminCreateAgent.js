import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { registerAgent, editAgent } from '../../actions/agent';

import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';
import { getAllClient} from '../../actions/client';

const AdminCreateAgent = ({match, registerAgent, editAgent, setAlert, history, agent: {agent, loading}, getAllProvince, getAllLocation,  getAllClient, province: {province} ,location: {location}, client:{client}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        surname: '',
        cuil: '',
        address: '',
        email: '',
        phone: '',
        provinceId: "",
        locationId: "",
        clientId:"-"
    });

    var agentEdit = {};
    var editAgentBand = false;

    if(agent !== null && match.params.idAgent !== undefined){
        for (let index = 0; index < agent.length; index++) {
            if(agent[index]._id === match.params.idAgent){
                
                var agentEdit = agent[index];
                editAgentBand = true; 
                var nameClient = "-"
                for (let i = 0; i< client.length; i++) {
                    for (let j = 0; j< client[i].customerReferences.length; j++) {
                        if (match.params.idAgent === client[i].customerReferences[j].idAgent){
                            nameClient = client[i].name;
                        }
                    }
                }

            }
        }
    }

    if(!agentEdit.name && match.params.idAgent !== undefined){
        history.push('/admin-client');
    }

    useEffect(() => {
        SetFormData({
            name: loading || !agentEdit.name ? '' : agentEdit.name,
            surname: loading || !agentEdit.surname ? '' : agentEdit.surname,
            cuil: loading || !agentEdit.cuil ? '' : agentEdit.cuil,
            condition: loading || !agentEdit.condition ? '' : agentEdit.condition,
            address: loading || !agentEdit.address ? '' : agentEdit.address,
            email: loading || !agentEdit.email ? '' : agentEdit.email,
            phone: loading || !agentEdit.phone ? '' : agentEdit.phone,
            provinceId: loading || !agentEdit.provinceId ? '' : agentEdit.provinceId,
            locationId: loading || !agentEdit.locationId ? '' : agentEdit.locationId,
            clientId: loading || !agentEdit.clientId ? '' : agentEdit.clientId,
        });

        getAllProvince();
        getAllLocation();
        getAllClient();
        

    }, [loading, getAllProvince, getAllLocation, getAllClient]);

    const {name, surname, cuil, address, email, phone, provinceId, locationId, clientId} = formData;

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

        if(name === "" || cuil === "" || surname === "" || address === "" || email === "" || phone === "" || location === "" || province ==="" ||clientId === "-"){
            setAlert('Debes ingresar el nombre, apellido, cuil, dirección, email,telefono, provincia, localidad y cliente', 'danger');
        }else{
            if(match.params.idAgent != undefined){
                let idAgent = agentEdit._id;
                editAgent({name, surname, cuil, address, email, phone, provinceId, locationId, clientId, idAgent, history});
            }else{
                registerAgent({name, surname, cuil, address, email, phone, provinceId, locationId, clientId: match.params.idClient, history});
                
            }
        }
        
    }

    if(province !== null){
        var listProvince = province.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name}</option>
        );
    }


    if(client !== null &&  match.params.idClient !== undefined){
        var clientFilter = client.filter(function(cli) {
            return cli._id === match.params.idClient;
        });
        var nameClient = clientFilter[0].name;
    }
    

    const [isDisable, setDisable] = useState(true);

    var filterLocation;

    const onChangeProvince = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisable(false);
    }

    const onChangeClient = e => {
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

            <Link to="/admin-agent" className="btn btn-secondary">
                Atrás
            </Link>
            <p></p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="row">              
                    <div className="col-sm-12 col-md-12">
                        <div class="card">                      
                            <div class="card-header"> <h5><i className="fas fa-handshake"></i> {match.params.idAgent != undefined ? "Edición del Referente ": "Nuevo Referente de "} <b>{nameClient}</b></h5></div>
                            <div class="card-body">
                                <div className="row">    
                                    <div className=" form-group col-lg-6">
                                            <h5>Apellidos (*)</h5>
                                            <input 
                                                type="text" 
                                                class="form-control"
                                                placeholder="Apellido del Referente" 
                                                name="surname"
                                                minLength="3"
                                                maxLength="50"
                                                onChange = {e => onChange(e)}
                                                value={surname}
                                            />
                                        </div>
                                        <div className=" form-group col-lg-6">
                                            <h5>Nombres (*)</h5>
                                            <input 
                                                type="text" 
                                                class="form-control"
                                                placeholder="Nombre del Referente" 
                                                name="name"
                                                minLength="3"
                                                maxLength="50"
                                                onChange = {e => onChange(e)}
                                                value={name}
                                            />
                                        </div>
                                    </div>
                                    <div className="row"> 
                                        <div className=" form-group col-lg-6">
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
                                        <div className=" form-group col-lg-6">
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
                                    </div>
                                    <div className="row"> 

                                        <div className=" form-group col-lg-6">
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
                                        <div className=" form-group col-lg-6">
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
                                    </div>
                                    <div className="row"> 
                                        <div className=" form-group col-lg-6">
                                            <h5>Provincia (*)</h5>
                                            <select name="provinceId"  class="form-control" value={provinceId} onChange = {e => onChangeProvince(e)}>
                                                <option value="0">* Selección de Provincia</option>
                                                {listProvince}
                                            </select>
                                        </div>
                                        <div className=" form-group col-lg-6">
                                            <h5>Localidad (*)</h5>
                                            <select name="locationId" class="form-control" value={locationId} onChange = {e => onChange(e)} disabled={isDisable}>
                                                <option value="0">* Selección de Localidad</option>
                                                {listLocation}
                                            </select>
                                        </div>
                                    </div>                                    
                            
                            <div className="form-group">
                                    <span>(*) son campos obligatorios</span>
                                </div>

                                <input type="submit" className="btn btn-primary" value={ match.params.idAgent != undefined ? "Modificar" : "Registrar" } />

                                <Link to="/admin-agent" className="btn btn-danger">
                                    Cancelar
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            
        </Fragment>
    )
}

AdminCreateAgent.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerAgent: PropTypes.func.isRequired,
    agent: PropTypes.object.isRequired,
    editAgent: PropTypes.func.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
    getAllClient: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    agent: state.agent,
    province: state.province,
    location: state.location,
    client: state.client,
})

export default connect(mapStateToProps, {setAlert, registerAgent, editAgent, getAllLocation, getAllProvince, getAllClient})(AdminCreateAgent);
