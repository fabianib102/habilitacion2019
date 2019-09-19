import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllClient} from '../../actions/client';

const AdminCreateProject = ({getAllClient, client: {client}}) => {

    useEffect(() => {
        getAllClient();
    }, [getAllClient]);

    if(client != null){
        var clientActive =  client.filter(function(usr) {
            return usr.status === "ACTIVO";
        });
        var listClient = clientActive.map((pro) =>
            <option key={pro._id} value={pro._id}>{pro.name.toUpperCase()}</option>
        );
    }


    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <p className="lead"><i className="fas fa-user"></i> Nuevo proyecto </p>

            <form className="form" >

                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Nombre del proyecto (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Nombre del proyecto" 
                            maxLength="50"
                            minLength="3"
                        />
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Descripción (*)</h5>
                        <input 
                            type="text" 
                            placeholder="Descripción" 
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Cliente (*)</h5>
                        <select>
                            <option value="0">* Seleccione el Cliente</option>
                            {listClient}
                        </select>
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Riesgo (*)</h5>
                        <select>
                            <option value="0">* Seleccione el riesgo</option>
                        </select>
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Fecha de Inicio previsto (*)</h5>
                        <input 
                            type="date" 
                            placeholder=""
                        />
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Fecha de Fin previsto (*)</h5>
                        <input 
                            type="date" 
                            placeholder=""
                        />
                    </div>
                </div>


                <div className="row">
                    <div className="form-group col-lg-6">
                        <h5>Tipo de proyecto (*)</h5>
                        <select>
                            <option value="0">* Seleccione el tipo</option>
                        </select>
                    </div>

                    <div className="form-group col-lg-6">
                        <h5>Subtipo de proyecto (*)</h5>
                        <select>
                            <option value="0">* Seleccione el subtipo</option>
                        </select>
                    </div>
                </div>


                <div className="form-group">
                    <span>(*) son campos obligatorios</span>
                </div>

                <input type="submit" className="btn btn-primary" value="Registrar" />

                <Link to="/admin-project" className="btn btn-danger">
                    Cancelar
                </Link>


            </form>
            
        </Fragment>

    )
}

AdminCreateProject.propTypes = {
    getAllClient: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    client: state.client
})

export default connect(mapStateToProps, {getAllClient})(AdminCreateProject)
