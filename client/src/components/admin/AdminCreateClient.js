import React, {Fragment, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {connect} from 'react-redux';
import { registerClient } from '../../actions/client';

const AdminCreateClient = ({match, registerClient, setAlert, history, client: {client, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        cuil: '',
        condition: '',
        address: '',
        email: '',
        phone: ''
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
        });
    }, [loading]);

    const {name, cuil, condition, address, email, phone} = formData;

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
                //editRisk({name, description, idRisk, history});
            }else{
                registerClient({name, cuil, condition, address, email, phone, history});
            }
        }
        
    }


    return (

        <Fragment>

            <Link to="/admin-client" className="btn btn-secondary">
                Atras
            </Link>

            <p className="lead"><i className="fas fa-users"></i> Nuevo Cliente</p>


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
                    <span>(*) son campos obligatorios</span>
                </div>

                <input type="submit" className="btn btn-primary" value="Crear Cliente" />

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
}

const mapStateToProps = state => ({
    client: state.client
})

export default connect(mapStateToProps, {setAlert, registerClient})(AdminCreateClient);
