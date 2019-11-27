import React, {Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {setAlert} from '../../actions/alert';
import {registerUser, editUser} from '../../actions/user';
import { getAllProvince } from '../../actions/province';
import { getAllLocation } from '../../actions/location';

const AdminCreateUser = ({match, editUser, setAlert, registerUser, history, users: {users, loading}, getAllProvince, getAllLocation, province: {province} ,location: {location}}) => {

    const [formData, SetFormData] = useState({
        name: '',
        surname: '',
        cuil: '',
        birth: '',
        address: '',
        rol: '',
        provinceId: "",
        locationId: "",
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

    if(users !== null && match.params.idUser !== undefined){

        for (let index = 0; index < users.length; index++) {
            if(users[index]._id === match.params.idUser){
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

    if(!userEdit.surname && match.params.idUser !== undefined){
        history.push('/admin-user');
    }

    useEffect(() => {
        SetFormData({
            surname: loading || !userEdit.surname ? '' : userEdit.surname,
            name: loading || !userEdit.name ? '' : userEdit.name,
            cuil: loading || !userEdit.cuil ? '' : userEdit.cuil,
            birth: loading || !userEdit.birth ? '' :  userEdit.birth,
            address: loading || !userEdit.address ? '' : userEdit.address,
            provinceId: loading || !userEdit.provinceId ? '' : userEdit.provinceId,
            locationId: loading || !userEdit.locationId ? '' : userEdit.locationId,
            phone: loading || !userEdit.phone ? '' : userEdit.phone,
            identifier: loading || !userEdit.identifier ? '' : userEdit.identifier,
            rol: loading || !userEdit.rol ? '' : userEdit.rol,
            email: loading || !userEdit.email ? '' : userEdit.email
        });
        getAllProvince();
        getAllLocation();

    }, [loading, getAllProvince, getAllLocation]);


    var {name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, pass, repeatPass} = formData;

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
        if(match.params.idUser !== undefined){
            //realiza la edicion sin el pass
            let idUser = userEdit._id;
            editUser({name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, idUser, history});

        }else{
            //nuevo usuario
            if(pass !== repeatPass){
                setAlert('Las contraseñas no coinciden.', 'danger');
            }else{
                registerUser({name, surname, cuil, birth, address, rol, provinceId, locationId, phone, identifier, email, pass, history});
            }
        }
        
    }

    if(province !== null){
        var listProvince = province.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name}</option>
        );
    }


    const divPass = (
        <div className=" form-group col-lg-6">
            <h5>Contraseña (*)</h5>
            <input
                type="password"
                class="form-control"
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
        <div className=" form-group col-lg-6">
            <h5>Repetir la contraseña (*)</h5>
            <input
                type="password"
                class="form-control"
                placeholder="Confirmar contraseña"
                name="repeatPass"
                minLength="6"
                onChange = {e => onChange(e)}
                value={repeatPass}
                maxLength="20"
            />
        </div>
    )

    const [isDisable, setDisable] = useState(true);

    var filterLocation;

    const onChangeProvince = e => {
        SetFormData({...formData, [e.target.name]: e.target.value});
        setDisable(false);
    }

    if(location !== null){

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


  return (
    <Fragment>
        
        <Link to="/admin-user" className="btn btn-secondary">
            Atrás
        </Link>

        <p></p>

        <form className="form" onSubmit={e => onSubmit(e)}>
            <div className="row">              
                <div className="col-sm-12 col-md-12">
                    <div class="card">
                        <div class="card-header"> <h5><i className="fas fa-user"></i> {match.params.idUser !== undefined ? "Edición de usuario": "Creación de usuario"} </h5></div>
                        <div class="card-body">
                            <div className="row">    
                                <div className=" form-group col-lg-6">                                    
                                    <h5>Apellido (*)</h5>
                                        <input 
                                            type="text" 
                                            class="form-control"
                                            placeholder="Apellido" 
                                            name="surname" 
                                            value={surname}
                                            onChange = {e => onChange(e)}
                                            maxLength="50"
                                            minLength="3"
                                        />
                                </div>
                                <div className=" form-group col-lg-6"> 
                                            <h5>Nombre (*)</h5>
                                            <input 
                                                type="text" 
                                                class="form-control"
                                                placeholder="Nombre" 
                                                name="name" 
                                                value={name}
                                                onChange = {e => onChange(e)}
                                                maxLength="50"
                                                minLength="3"
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
                                            value={address}
                                            onChange = {e => onChange(e)}
                                            maxLength="150"
                                            minLength="5"
                                        />
                                </div>
                                <div className=" form-group col-lg-6">
                                        <h5>Teléfono (*)</h5>
                                        <input 
                                            type="text" 
                                            class="form-control"
                                            placeholder="Teléfono" 
                                            name="phone" 
                                            value={phone}
                                            onChange = {e => onChangeNumber(e)}
                                            maxLength="15"
                                            minLength="10"
                                        />
                                </div>                                                    
                            </div>
                            <div className="row">              
                                <div className="form-group col-lg-6">
                                        <h5>CUIL (*)</h5>
                                        <input 
                                            type="text" 
                                            class="form-control"
                                            placeholder="CUIL" 
                                            name="cuil" 
                                            value={cuil}
                                            onChange = {e => onChangeNumber(e)}
                                            maxLength="11"
                                            minLength="11"
                                        />
                                </div>   
                                <div className=" form-group col-lg-6"> 
                                        <h5>Fecha de Nacimiento (*)</h5>
                                        <input 
                                            type="date" 
                                            class="form-control"
                                            placeholder="" 
                                            name="birth" 
                                            value={birth}
                                            onChange = {e => onChange(e)}
                                            max={maxDate}
                                        />
                                </div>                               
                            </div>
                            <div className="row">    
                                <div className=" form-group col-lg-6"> 
                                        <h5>Provincia (*)</h5>
                                        <select name="provinceId" class="form-control" value={provinceId} onChange = {e => onChangeProvince(e)}>
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
                           

                            <div className="row">    
                                <div className=" form-group col-lg-6"> 
                                        <h5>Email (*)</h5>
                                        <input 
                                            type="email" 
                                            class="form-control"
                                            placeholder="Email"
                                            onChange = {e => onChange(e)} 
                                            name="email"
                                            value={email}
                                            maxLength="30"
                                            minLength="5"
                                        />
                                </div>  

                                <div className=" form-group col-lg-6">
                                        <h5>Identificador (*)</h5>
                                        <input 
                                            type="text" 
                                            class="form-control"
                                            placeholder="Identificador" 
                                            name="identifier" 
                                            value={identifier}
                                            onChange = {e => onChangeNumber(e)}
                                            maxLength="5"
                                            minLength="5"
                                        />
                                </div> 
                            </div>
                            <div className="row"> 
                                { match.params.idUser != undefined ? null : divPass }
                                { match.params.idUser != undefined ? null : divRepeatPass } 
                            </div>
                            <div className="row">
                                <div className=" form-group col-lg-6">
                                        <h5>Rol (*)</h5>
                                        <select name="rol" class="form-control" value={rol} onChange = {e => onChange(e)}>
                                            <option value="">* Seleccione el rol</option>
                                            <option value="Administrador General de Sistema">Administrador General de Sistema</option>
                                            <option value="Responsable de Proyecto">Responsable de Proyecto</option>
                                            <option value="Integrante de Equipo de Proyecto">Integrante de Equipo de Proyecto</option>
                                            {/* <option value="Supervisor">Supervisor de Programa</option> */}
                                        </select>
                                </div>                               
                            </div>

   
                              
                            <div className="form-group">
                                <span>(*) son campos obligatorios</span>
                            </div>

                            <input type="submit" className="btn btn-primary" value={ match.params.idUser != undefined ? "Modificar" : "Registrar" } />

                            <Link to="/admin-user" className="btn btn-danger">
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

AdminCreateUser.propTypes = {
    setAlert: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    editUser: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    getAllLocation: PropTypes.func.isRequired,
    getAllProvince: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    users: state.users,
    province: state.province,
    location: state.location,

})

export default connect(mapStateToProps, {setAlert, registerUser, editUser, getAllLocation, getAllProvince})(AdminCreateUser)
