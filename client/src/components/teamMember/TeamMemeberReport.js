import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

const TeamMemberReportTask = ({match}) => {

    return(
        <p>Hola mundo{match.props.idUser}</p>
    ) 

}





TeamMemberReportTask.propTypes = {
    tasks: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    tasks: state.task,
    auth: state.auth
})

export default connect(mapStateToProps, {getAllTask})(TeamMemberReportTask)
