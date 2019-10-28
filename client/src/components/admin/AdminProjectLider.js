import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button, Tabs, Tab, Form } from 'react-bootstrap';
import {setAlert} from '../../actions/alert';
import Moment from 'react-moment';
import moment from 'moment';


const AdminProjectLider = ({match}) => {


    return (

        <Fragment>
            
            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <Link to={`/admin-project/project-detail/${match.params.idProject}`} className="btn btn-secondary">
                        Atrás
                    </Link>

                </div>
            </div>

            <h2 className="my-2">Gestión de Lider de Proyecto para  <b>-nombreProyecto-</b></h2>
            <div className="row">

                <div className="col-sm-12 col-lg-5">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"> </i>
                              Equipo<strong> -nombreEquipo-</strong>
                        </div>
                        <div className="card-body">


                        </div>

                    </div>

                </div>

                <div className="col-sm-12 col-lg-7">

                    <div className="card">

                        <div className="card-header">

                            <i className="fas fa-info-circle"> </i>
                              Historial de Movimientos  
                            
                        </div>

                        <div className="card-body">


                        </div>


                    </div>

                </div>

            </div>

            
        </Fragment>

    )
}

AdminProjectLider.propTypes = {

}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {})(AdminProjectLider)
