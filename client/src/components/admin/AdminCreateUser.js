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
        email: '',
        pass: '',
        repeatPass: ''
    });

    var userEdit = {};

    if(users != null && match.params.idUser != undefined){

        for (let index = 0; index < users.length; index++) {
            if(users[index]._id == match.params.idUser){
                var userEdit = users[index];
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
            birth: loading || !userEdit.birth ? '' : userEdit.birth,
            address: loading || !userEdit.address ? '' : userEdit.address,
            province: loading || !userEdit.province ? '' : userEdit.province,
            phone: loading || !userEdit.phone ? '' : userEdit.phone,
            rol: loading || !userEdit.rol ? '' : userEdit.rol,
            email: loading || !userEdit.email ? '' : userEdit.email
        });
    }, [loading]);


    var {name, surname, cuil, birth, address, rol, province, phone, email, pass, repeatPass} = formData;

    const onChange = e => SetFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();

        //verifica que sea una edicion
        if(match.params.idUser != undefined){
            //realiza la edicion sin el pass
            let idUser = userEdit._id;
            editUser({name, surname, cuil, birth, address, rol, province, phone, email, idUser, history});

        }else{
            //nuevo usuario
            if(pass !== repeatPass){
                setAlert('Las contraseñas no coinciden.', 'danger');
            }else{
                registerUser({name, surname, cuil, birth, address, rol, province, phone, email, pass, history});
            }
        }
        
    }

  return (
    <Fragment>
        
        <Link to="/admin-user" className="btn btn-secondary">
            Atras
        </Link>

        <p className="lead"><i className="fas fa-user"></i> {match.params.idUser != undefined ? "Edición de usuario": "Creación de usuario"} </p>

        <form className="form" onSubmit={e => onSubmit(e)}>

            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Apellido" 
                    name="surname" 
                    value={surname}
                    onChange = {e => onChange(e)}
                />
            </div>
            
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Nombre" 
                    name="name" 
                    value={name}
                    onChange = {e => onChange(e)}
                />
            </div>

            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="CUIL" 
                    name="cuil" 
                    value={cuil}
                    onChange = {e => onChange(e)}
                />
            </div>

            <div className="form-group">
                <input 
                    type="date" 
                    placeholder="" 
                    name="birth" 
                    value={birth}
                    onChange = {e => onChange(e)}
                />
                <small className="form-text">Fecha de nacimiento</small>
            </div>

            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Dirección" 
                    name="address" 
                    value={address}
                    onChange = {e => onChange(e)}
                />
            </div>

            <div className="form-group">
                <select name="province" value={province} onChange = {e => onChange(e)}>
                    <option value="">* Seleccione la provincia</option>
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
                <input 
                    type="text" 
                    placeholder="Teléfono" 
                    name="phone" 
                    value={phone}
                    onChange = {e => onChange(e)}
                />
            </div>

            <div className="form-group">
                <select name="rol" value={rol} onChange = {e => onChange(e)}>
                    <option value="">* Seleccione el rol</option>
                    <option value="Admin">Administrador</option>
                    <option value="Operativo">Operativo</option>
                </select>
            </div>

            <div className="form-group">
            <input 
                type="email" 
                placeholder="Email"
                onChange = {e => onChange(e)} 
                name="email"
                value={email}
            />
            </div>
            
            <div className="form-group">
            <input
                type="password"
                placeholder="Contraseña"
                name="pass"
                minLength="6"
                onChange = {e => onChange(e)}
                value={pass}
            />
            </div>
            <div className="form-group">
            <input
                type="password"
                placeholder="Confirmar contraseña"
                name="repeatPass"
                minLength="6"
                onChange = {e => onChange(e)}
                value={repeatPass}
            />
            </div>
            <input type="submit" className="btn btn-primary" value="Registrar" />
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
