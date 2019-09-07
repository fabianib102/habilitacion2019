import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProject } from '../../actions/project';

const AdminProject = ({getAllProject, project: {project}}) => {

    useEffect(() => {
        getAllProject();
    }, [getAllProject]);

    console.log("los proyectos: ", project);


    if(project != null){

        var listProject = project.map((te, item) =>

            <li key={te._id} className="list-group-item-action list-group-item">
                
                {te.name}

            </li>
        );
    }

    return (

        <Fragment>

            <Link to="/admin" className="btn btn-secondary">
                Atrás
            </Link>


            <div className="row">

                <div className="col-sm-12 col-lg-5">

                    <div className="card">

                        <div className="card-header">
                            <i className="fa fa-align-justify"></i>
                            <strong> Lista de Proyectos</strong>
                        </div>

                        <div className="card-body bodyTeam">
                            <ul className="list-group">
                                {listProject}
                            </ul>
                        </div>

                    </div>

                </div>

            </div>

            
        </Fragment>

    )
}

AdminProject.propTypes = {
    getAllProject: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    project: state.project
})

export default connect(mapStateToProps, {getAllProject})(AdminProject)
