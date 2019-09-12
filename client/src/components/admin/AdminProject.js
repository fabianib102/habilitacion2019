import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAllProject } from '../../actions/project';
import { Tabs, Tab } from 'react-bootstrap';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

const AdminProject = ({getAllProject, project: {project}, history}) => {

    useEffect(() => {
        getAllProject();
    }, [getAllProject]);


    const itemSelected = (itemPass) => {
        alert(itemPass)
    }

    if(project != null){

        var listProject = project.map((te, item) =>
            <NavItem key={te._id} eventKey={te._id}>
                <NavIcon onClick={e => itemSelected(te.name)}>
                    <i className="fas fa-file-import" style={{ fontSize: '1.75em' }} />
                </NavIcon>
                <NavText onClick={e => itemSelected(te.name)}>
                    {te.name}
                </NavText>
            </NavItem>
        );
    }

    return (


        <Fragment>


            <SideNav className="SideCustom"
                onSelect={(selected) => {

                    if(selected === "back"){
                        history.push('/admin');
                    }
                }}
            >
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="home">

                    <NavItem eventKey="back">
                        <NavIcon>
                            <i className="fas fa-arrow-circle-left" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Atras
                        </NavText>
                    </NavItem>
                    
                    {listProject}

                </SideNav.Nav>
            </SideNav>


            <div className="row">

                <div className="col-sm-12 col-lg-12">

                    <Tabs defaultActiveKey="info" id="uncontrolled-tab-example">

                        <Tab eventKey="info" title="Informacion del proyecto">
                            primer Html
                        </Tab>

                        <Tab eventKey="team" title="Conformación del equipo">
                            segundo html
                        </Tab>

                        <Tab eventKey="data" title="Estado del proyecto">
                            tercer html
                        </Tab>

                    </Tabs>
                    
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
