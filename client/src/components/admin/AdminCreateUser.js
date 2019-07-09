import React, {Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {registerUser, editUser} from '../../actions/user';


const AdminCreateUser = ({match, editUser, setAlert, registerUser, history, users: {users, loading}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        surname: '',
        cuil: '',
        birth: '',
        address: '',
        rol: '',
        province: '',
        phone: '',
        identifier: '',
        email: '',
        pass: '',
        repeatPass: ''
    });

    var d = new Date();
    d.setDate(d.getDate()-1);

    let dateMax = new Date(d.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];

    const [maxDate, setDate] = useState(dateMax);

    var userEdit = {};

    if(users != null && match.params.idUser != undefined){

        for (let index = 0; index < users.length; index++) {
            if(users[index]._id == match.params.idUser){
                var userEdit = users[index];

                const fecha = new Date(userEdit.birth);
    
                let mes = fecha.getMonth()+1;
                if(mes<10) mes='0'+mes;

                let dia = fecha.getDate();
                if(dia<10) dia='0'+dia

                let anio = fecha.getFullYear();
                var cumple = `${anio}-${mes}-${dia}`

                userEdit.birth = cumple

            }
        }
    }

    if(!userEdit.surname && match.params.idUser != undefined){
        history.push('/admin-user');
    }

    useEffect(() => {
        SetFormData({
            surname: loading || !userEdit.surname ? '' : userEdit.surname,
            name: loading || !userEdit.name ? '' : userEdit.name,
            cuil: loading || !userEdit.cuil ? '' : userEdit.cuil,
            birth: loading || !userEdit.birth ? '' :  userEdit.birth,
            address: loading || !userEdit.address ? '' : userEdit.address,
            province: loading || !userEdit.province ? '' : userEdit.province,
            phone: loading || !userEdit.phone ? '' : userEdit.phone,
            identifier: loading || !userEdit.identifier ? '' : userEdit.identifier,
            rol: loading || !userEdit.rol ? '' : userEdit.rol,
            email: loading || !userEdit.email ? '' : userEdit.email
        });
    }, [loading]);


    var {name, surname, cuil, birth, address, rol, province, phone, identifier, email, pass, repeatPass} = formData;

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

        //verifica que sea una edicion
        if(match.params.idUser != undefined){
            //realiza la edicion sin el pass
            let idUser = userEdit._id;
            editUser({name, surname, cuil, birth, address, rol, province, phone, identifier, email, idUser, history});

        }else{
            //nuevo usuario
            if(pass !== repeatPass){
                setAlert('Las contraseñas no coinciden.', 'danger');
            }else{
                registerUser({name, surname, cuil, birth, address, rol, province, phone, identifier, email, pass, history});
            }
        }
        
    }

    const divPass = (
        <div className="form-group">
            <h5>Contraseña (*)</h5>
            <input
                type="password"
                placeholder="Contraseña"
                name="pass"
                minLength="6"
                onChange = {e => onChange(e)}
                value={pass}
                maxLength="20"
            />
        </div>
    )

    const divRepeatPass = (
        <div className="form-group">
            <h5>Repetir la contraseña (*)</h5>
            <input
                type="password"
                placeholder="Confirmar contraseña"
                name="repeatPass"
                minLength="6"
                onChange = {e => onChange(e)}
                value={repeatPass}
                maxLength="20"
            />
        </div>
    )

  return (
    <Fragment>
        
        <Link to="/admin-user" className="btn btn-secondary">
            Atras
        </Link>

        <p className="lead"><i className="fas fa-user"></i> {match.params.idUser != undefined ? "Edición de usuario": "Creación de usuario"} </p>

        <form className="form" onSubmit={e => onSubmit(e)}>

            <div className="form-group">
                <h5>Apellido (*)</h5>
                <input 
                    type="text" 
                    placeholder="Apellido" 
                    name="surname" 
                    value={surname}
                    onChange = {e => onChange(e)}
                    maxLength="50"
                    minLength="3"
                />
            </div>
            
            <div className="form-group">
                <h5>Nombre (*)</h5>
                <input 
                    type="text" 
                    placeholder="Nombre" 
                    name="name" 
                    value={name}
                    onChange = {e => onChange(e)}
                    maxLength="50"
                    minLength="3"
                />
            </div>

            <div className="form-group">
                <h5>CUIL (*)</h5>
                <input 
                    type="text" 
                    placeholder="CUIL" 
                    name="cuil" 
                    value={cuil}
                    onChange = {e => onChangeNumber(e)}
                    maxLength="11"
                    minLength="11"
                />
            </div>

            <div className="form-group">
                <h5>Fecha de nacimiento (*)</h5>
                <input 
                    type="date" 
                    placeholder="" 
                    name="birth" 
                    value={birth}
                    onChange = {e => onChange(e)}
                    max={maxDate}
                />
            </div>

            <div className="form-group">
                <h5>Dirección (*)</h5>
                <input 
                    type="text" 
                    placeholder="Dirección" 
                    name="address" 
                    value={address}
                    onChange = {e => onChange(e)}
                    maxLength="150"
                    minLength="5"
                />
            </div>

            <div className="form-group">
                <h5>Provincia (*)</h5>
                <select name="province" value={province} onChange = {e => onChange(e)}>
                    <option value="">* Seleccione la Provincia</option>
                    <option value="Buenos Aires">Buenos Aires</option>
                    <option value="Catamarca">Catamarca</option>
                    <option value="Chaco">Chaco</option>
                    <option value="Chubut">Chubut</option>
                    <option value="Cordoba">Cordoba</option>
                    <option value="Corrientes">Corrientes</option>
                    <option value="Entre Rios">Entre Rios</option>
                    <option value="Formosa">Formosa</option>
                    <option value="Jujuy">Jujuy</option>
                    <option value="La Pampa">La Pampa</option>
                    <option value="La Rioja">La Rioja</option>
                    <option value="Mendoza">Mendoza</option>
                    <option value="Misiones">Misiones</option>
                    <option value="Neuquen">Neuquen</option>
                    <option value="Rio Negro">Rio Negro</option>
                    <option value="Salta">Salta</option>
                    <option value="San Juan">San Juan</option>
                    <option value="San Luis">San Luis</option>
                    <option value="Santa Cruz">Santa Cruz</option>
                    <option value="Santa Fe">Santa Fe</option>
                    <option value="Santiago del Estero">Santiago del Estero</option>
                    <option value="Tierra del Fuego">Tierra del Fuego</option>
                    <option value="Tucuman">Tucuman</option>
                </select>
            </div>

            <div className="form-group">
                <h5>Teléfono (*)</h5>
                <input 
                    type="text" 
                    placeholder="Teléfono" 
                    name="phone" 
                    value={phone}
                    onChange = {e => onChangeNumber(e)}
                    maxLength="15"
                    minLength="10"
                />
            </div>

            <div className="form-group">
                <h5>Rol (*)</h5>
                <select name="rol" value={rol} onChange = {e => onChange(e)}>
                    <option value="">* Seleccione el rol</option>
                    <option value="Admin">Administrador General de Sistema</option>
                    <option value="Responsable de Proyecto">Responsable de Proyecto</option>
                    <option value="Integrante de Equipo de Proyecto">Integrante de Equipo de Proyecto</option>
                    <option value="Supervisor">Supervisor de Programa</option>
                    <option value="Cliente">Cliente</option>
                </select>
            </div>

            <div className="form-group">
                <h5>Identificador (*)</h5>
                <input 
                    type="text" 
                    placeholder="Identificador" 
                    name="identifier" 
                    value={identifier}
                    onChange = {e => onChangeNumber(e)}
                    maxLength="5"
                    minLength="5"
                />
            </div>

            <div className="form-group">
                <h5>Email (*)</h5>
                <input 
                    type="email" 
                    placeholder="Email"
                    onChange = {e => onChange(e)} 
                    name="email"
                    value={email}
                    maxLength="30"
                    minLength="5"
                />
            </div>

            { match.params.idUser != undefined ? null : divPass }
            
            { match.params.idUser != undefined ? null : divRepeatPass }

            
            <div className="form-group">
                <span>(*) son campos obligatorios</span>
            </div>

            <input type="submit" className="btn btn-primary" value={ match.params.idUser != undefined ? "Modificar" : "Registrar" } />

            <Link to="/admin-user" className="btn btn-danger">
                Cancelar
            </Link>
             
        </form>
    </Fragment>
  )
}

AdminCreateUser.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    users: state.users
})

export default connect(mapStateToProps, {setAlert, registerUser, editUser})(AdminCreateUser)
