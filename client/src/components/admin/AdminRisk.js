import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getAllRisk, deleteRiskById } from '../../actions/risk';

const AdminRisk = ({deleteRiskById, getAllRisk, risks: {risks}}) => {

    const [currentPage, setCurrent] = useState(1);
    const [todosPerPage] = useState(4);

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");
    const [txtFilter, setTxtFilter] = useState("");

    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }
    //--------

    const askDelete = (nameComplete, IdToDelete) => {
        setComplete(nameComplete);
        setId(IdToDelete);
        modalAdmin();
    }

    useEffect(() => {
        getAllRisk();
    }, [getAllRisk]);

    const deleteRisk = (id) => {
        deleteRiskById(id);
        modalAdmin();
    }

    const changePagin = (event) => {
        setCurrent(Number(event.target.id));
    }

    if(risks != null){
        // si no hay riesgos crea un aviso de que no hay usuarios        
        if (risks.length === 0){
            var whithItems = false;
            var itemNone = (<li className='itemTeam list-group-item-action list-group-item'><center><b>No hay Riesgos</b></center></li>)
        }
        console.log("riesgos", risks);

        // hay riesgos, proceso de tratamiento 
        var riskFilter = risks;      
        var whithItems = true;
        console.log("filtro", riskFilter);


        if(txtFilter !== ""){
            var riskFilter =  risks.filter(function(ri) {
                return ri.name.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
                | ri.description.toLowerCase().indexOf(txtFilter.toLowerCase()) >= 0 
               
            });
           
            console.log("filtro",riskFilter)
        }


        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentRisk = riskFilter.slice(indexOfFirstTodo, indexOfLastTodo);

        var listRisks = currentRisk.map((ri) =>
            <tr key={ri._id}>
                <td>{ri.name}</td>
                <td className="hide-sm">{ri.description}</td>
                <td className="hide-sm centerBtn">
                    <Link to={`/admin-risk/edit-risk/${ri._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => askDelete(ri.name, ri._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </td>
            </tr>
        );

        var pageNumbers = [];
        for (let i = 1; i <= Math.ceil(risks.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        var renderPageNumbers = pageNumbers.map(number => {
            return (
              <li className="liCustom" key={number}>
                <a className="page-link" id={number} onClick={(e) => changePagin(e)}>{number}</a>
              </li>
            );
        });

    }
    
    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Riesgo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Estas seguro de eliminar el riesgo: {nameComplete}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                Cerrar
                </Button>
                <Link onClick={e => deleteRisk(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
            </Modal.Footer>
        </Modal>
    );

    const changeTxt = e => {
        setTxtFilter(e.target.value);
    }

    return (
        <Fragment>

            <Link to="/admin" className="btn btn-secondary">
                Atrás
            </Link>

            <Link to="/admin-risk/create-risk" className="btn btn-primary my-1">
                Nuevo Riesgo
            </Link>

            <div className="col-lg-12 col-sm-12">
                    <div className="row row-hover">
                        <div className="col-lg-6 col-sm-6">    
                            <h2 className="mb-2">Administración de Riesgos</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                            <input type="text" className="form-control " placeholder="Buscar Riesgos por Nombre o Descripción" onChange = {e => changeTxt(e)} />
                        </div>                 
                    </div>
                </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th className="hide-sm headTable">Nombre</th>
                    <th className="hide-sm headTable">Descripción</th>
                    <th className="hide-sm headTable centerBtn">Opciones</th>
                </tr>
                </thead>
                <tbody>{listRisks}</tbody>
            </table>

            {!whithItems ? '' : itemNone}
            
            <div className="">
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        {renderPageNumbers}
                    </ul>
                </nav>
            </div>

            {modal}

        </Fragment>
    )
}

AdminRisk.propTypes = {
    getAllRisk: PropTypes.func.isRequired,
    deleteRiskById: PropTypes.func.isRequired,
    risks: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    risks: state.risk
})

export default connect(mapStateToProps, {getAllRisk, deleteRiskById})(AdminRisk);
