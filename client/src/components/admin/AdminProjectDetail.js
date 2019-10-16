import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';


const AdminProjectDetail = props => {
    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <div className="containerCustom">
                        <Card>
                            <Card.Header>
                                <div className="float-left">
                                    <h5 className="my-2">Información del Proyecto: Nombre del Proyecto</h5>
                                    <h6>Descripción del proyecto</h6>
                                </div>
                                <div className="float-right">
                                    <Link to={``} className="btn btn-primary" title="Editar Información">
                                        <i className="far fa-edit coloWhite"></i>
                                    </Link>
                                    
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-lg-6">   
                                        <Card.Title><b>Fecha de Inicio Prevista: </b></Card.Title>
                                        <Card.Title><b>Fecha de Inicio Real:</b> </Card.Title>
                                        <Card.Title><b>Tipo de Proyecto</b> </Card.Title>
                                        <Card.Title><b>Cliente:</b> </Card.Title>
                                        <Card.Title><b>Responsable del Proyecto:</b> </Card.Title>
                                 
                                    </div>
                                    <div className="col-lg-6">
                                        <Card.Title><b>Fecha de Fin Prevista:</b> </Card.Title>
                                        <Card.Title><b>Fecha de Fin Real:</b> </Card.Title>
                                        <Card.Title><b>Subtipo de Proyecto</b> </Card.Title> 
                                        <Card.Title><b>Referente del Cliente:</b> </Card.Title>                                                                               
                                    </div>
                                   
                                </div> 
                                
                            </Card.Body>
                        </Card>
                                  
                    <div className="form-group"></div>
                    
             </div>
             <div className="row">
             <div className="containerCustom col-lg-4">
                                    <Card>
                                        <Card.Header>
                                            <div className="float-left">
                                                <h5 className="my-2">Equipo a cargo</h5>
                                                                                            
                                            </div>
                                            
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="row">
                                                <div className="col-lg-5">   
                                                    <h6>Integrante 1</h6> 
                                                    <h6>Integrante 1</h6>                                                                                
                                                    <h6>Integrante 1</h6>                                                                                
                                                    <h6>Integrante 1</h6>                                                                               
                                                    
                                                </div>
                                            
                                            </div>
                                        </Card.Body>
                                    </Card>
                                        
                    
                                </div>
                        <div className="containerCustom col-lg-8 ">
                            <div className="card">

                                    <div className="card-header">
                                        <i className="fa fa-align-justify"></i>
                                        <strong> Riesgos del Proyecto</strong>
                                        <div className="float-right">
                                                <Link to={``} className="btn btn-success" title="Agregar Riesgos">
                                                    <i className="fas fa-plus-circle coloWhite"></i>
                                                </Link>
                                                
                                            </div>
                                    </div>
                                    <div className="card-body ">
                                    <table className="table table-hover">
                                        <thead>
                                        <tr>
                                            <th className="hide-sm headTable">Nombre del Riesgo</th>
                                            <th className="hide-sm headTable">Probabilidad de Ocurrencia</th>
                                            
                                        </tr>
                                        </thead>
                                        <tbody >
                                        <tr >
                                        <td>Riesgo1</td>
                                            <td className="hide-sm">
                                                <div className="form-group">
                                                    <select className="float-center" >
                                                        <option value="">25%</option>
                                                        <option value="">50%</option>
                                                        <option value="">75%</option>
                                                        <option value="">100%</option>
                                                        
                                                    </select>
                                                    <div className="float-right">
                                                    <Link to={``} className="btn btn-danger" title="Eliminar">
                                                        <i className="far fa-trash-alt coloWhite"></i>
                                                    </Link>
                                                    
                                                    </div>
                                                </div>
                                            </td>
                                        
                                        </tr>
                                        <tr >
                                            <td>Riesgo1</td>
                                            <td className="hide-sm">
                                                <div className="form-group">
                                                    <select className="float-center" >
                                                        <option value="">25%</option>
                                                        <option value="">50%</option>
                                                        <option value="">75%</option>
                                                        <option value="">100%</option>
                                                        
                                                    </select>
                                                    <div className="float-right">
                                                    <Link to={``} className="btn btn-danger" title="Eliminar">
                                                        <i className="far fa-trash-alt coloWhite"></i>
                                                    </Link>
                                                    
                                                    </div>
                                                </div>
                                            </td>
                                        
                                        </tr>
                                        <tr >
                                            <td>Riesgo1</td>
                                            <td className="hide-sm">
                                                <div className="form-group">
                                                    <select className="float-center" >
                                                        <option value="">25%</option>
                                                        <option value="">50%</option>
                                                        <option value="">75%</option>
                                                        <option value="">100%</option>
                                                        
                                                    </select>
                                                    <div className="float-right">
                                                    <Link to={``} className="btn btn-danger" title="Eliminar">
                                                        <i className="far fa-trash-alt coloWhite"></i>
                                                    </Link>
                                                    
                                                    </div>
                                                </div>
                                            </td>
                                        
                                        </tr>
                                        </tbody>
                                    </table>

                                </div>
                                </div>
                                </div>
            </div>
            
        </Fragment>
    )
}

AdminProjectDetail.propTypes = {

}

export default AdminProjectDetail
