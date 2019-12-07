import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { getAllRisk, deleteRiskById } from '../../actions/risk';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const AdminRisk = ({deleteRiskById, getAllRisk, risks: {risks},auth:{user}}) => {

    const [nameComplete, setComplete] = useState("");
    const [IdDelete, setId] = useState("");


    //logica para mostrar el modal
    const [show, setShow] = useState(false);

    const modalAdmin = () => {
        if(show){
            setShow(false);
        }else{
            setShow(true);
        }
    }


    const askDelete = (nameComplete, IdToDelete) => {
        setComplete(nameComplete);
        setId(IdToDelete);
        modalAdmin();
    }

    useEffect(() => {
        getAllRisk();
    }, [getAllRisk]);

    const deleteRisk = (id) => {
        console.log("el",id)
        deleteRiskById(id);
        modalAdmin();
    }
    

    if(risks != null){
        var len =  risks.length
    }else{
        var len = 0.
    }
    
    function renderShowsTotal(start, to, total) {
        return (
            <div className="col-lg-6 col-sm-6">
          
            Desde <b> { start }</b> a <b>{ to }</b>, el total es <b>{ total }</b>
          
          </div>
        );
      }
        const options = {
            //--------- PAGINACION ---------
            page: 1, 
            sizePerPageList: [ {
              text: '5', value: 5
            }, {
              text: '10', value: 10
            }, {
              text: 'Todos', value: len
            } ], 
            sizePerPage: 5, 
            pageStartIndex: 1, 
            paginationSize: 3, 
            prePage: '<',
            nextPage: '>', 
            firstPage: '<<', 
            lastPage: '>>', 
            prePageTitle: 'Ir al Anterior', 
            nextPageTitle: 'Ir al Siguiente',
            firstPageTitle: 'ir al Primero', 
            lastPageTitle: 'Ir al último',
            // paginationShowsTotal: renderShowsTotal, 
            paginationPosition: 'bottom',
            // --------ORDENAMIENTO--------
            defaultSortName: 'name',  
            defaultSortOrder: 'asc',  //desc
            // ------- TITULO BOTONES ------
            // exportCSVText: 'Exportar en .CSV',
            //------------ BUSQUEDAS ------
            noDataText: (<li className='itemTeam list-group-item-action list-group-item'><center><b>No se encontraron coincidencias</b></center></li>)
          };


    function buttonFormatter(cell, row){
        return (<Fragment> 
                    <Link to={`/admin-risk/edit-risk/${row._id}`} className="btn btn-primary" title="Editar">
                        <i className="far fa-edit"></i>
                    </Link>

                    <a onClick={e => askDelete(row.name, row._id)} className="btn btn-danger" title="Eliminar">
                        <i className="far fa-trash-alt coloWhite"></i>
                    </a>
                </Fragment>
                )
      }

    const modal = (
        <Modal show={show} onHide={e => modalAdmin()}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Riesgo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    ¿Estás seguro de eliminar el riesgo: <b>{nameComplete}</b>?
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Link onClick={e => deleteRisk(IdDelete)} className="btn btn-primary" >
                    Si, estoy seguro.
                </Link>
                <Button variant="secondary" onClick={e => modalAdmin()}>
                    Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    );


    return (
        <Fragment>
            {user ? 
            user.rol === "Administrador General de Sistema" ?
                <Link to="/admin" className="btn btn-secondary">
                    Atrás
                </Link>
                :
                <Link to={`/project-manager/${user._id}`} className="btn btn-secondary">
                    Atrás
                </Link>
            :""}

            <Link to="/admin-risk/create-risk" className="btn btn-primary my-1">
                Nuevo Riesgo
            </Link>

            <div className="col-lg-12 col-sm-12">
                    <div className="row row-hover">
                        <div className="col-lg-6 col-sm-6">    
                            <h2 className="mb-2">Administración de Riesgos</h2>
                        </div>
                        <div className="col-lg-6 col-sm-6">                         
                        </div>                 
                    </div>
                </div>
                {risks !== null ?
                <BootstrapTable data={ risks }  pagination={ true } options={ options }  exportCSV={ false }>
                    <TableHeaderColumn dataField='name' isKey dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese un Nombre de Riesgo'} } csvHeader='Nombre'>Nombre</TableHeaderColumn>
                    <TableHeaderColumn dataField='description'  width='50%' dataSort filter={ { type: 'TextFilter', delay: 500 , placeholder: 'Ingrese una Descripción'} } csvHeader='Descripción'>Descripción</TableHeaderColumn>
                    <TableHeaderColumn dataField='options' dataFormat={buttonFormatter} headerAlign='center'  width='10%' export={ false } >Opciones <br/></TableHeaderColumn>
                </BootstrapTable>
                :""}


            {modal} 
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

        </Fragment>
    )
}

AdminRisk.propTypes = {
    getAllRisk: PropTypes.func.isRequired,
    deleteRiskById: PropTypes.func.isRequired,
    risks: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    risks: state.risk,
    auth: state.auth,
})

export default connect(mapStateToProps, {getAllRisk, deleteRiskById})(AdminRisk);
