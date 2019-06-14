import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDetailUser } from '../../actions/user';


const AdminUserDetail = ({match, getDetailUser, userDetail:{userDetail}}) => {

    useEffect(() => {
        getDetailUser(match.params.idUser);
    }, [getDetailUser]);

    console.log("detalles: ", match.params.idUser);

    if(userDetail !== null){
        var DetailData = (

            <div className="containerCustom">
                <Card>
                    <Card.Body>
                        <div className="row">
                            <div className="col-lg-6">
                                <Card.Title>Nombre: {userDetail.name}</Card.Title>
                                <Card.Title>Apellido: {userDetail.surname}</Card.Title>
                                <Card.Title>CUIL: {userDetail.cuil}</Card.Title>
                                <Card.Title>Email: {userDetail.email}</Card.Title>
                                <Card.Title>Rol: {userDetail.rol}</Card.Title>
                            </div>
                            <div className="col-lg-6">
                                <Card.Title>Dirección: {userDetail.address}</Card.Title>
                                <Card.Title>Nacimiento: {userDetail.birth}</Card.Title>
                                <Card.Title>Telefóno: {userDetail.phone}</Card.Title>
                                <Card.Title>Provincia: {userDetail.province}</Card.Title>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
    
        );
    }

    return (

        <Fragment>

            <Link to="/admin-user" className="btn btn-secondary">
                Atras
            </Link>

            <h2 className="my-2">Detalles</h2>

            <Tabs defaultActiveKey="data" id="uncontrolled-tab-example">
                
                <Tab eventKey="data" title="Datos Personales">

                    {DetailData}

                </Tab>

                <Tab eventKey="project" title="Proyectos Asociados">
                    Acá tienen que ir los proyectos del usuario
                </Tab>

            </Tabs>
            
        </Fragment>

    )
}

AdminUserDetail.propTypes = {
    getDetailUser: PropTypes.func.isRequired,
    userDetail: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    userDetail: state.userDetail
})

export default connect(mapStateToProps,{getDetailUser})(AdminUserDetail)
