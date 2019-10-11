import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AdminProjectDetail = props => {
    return (

        <Fragment>

            <Link to="/admin-project" className="btn btn-secondary">
                Atrás
            </Link>

            <div className="row">
                MAQUETAR
            </div>
            
        </Fragment>
    )
}

AdminProjectDetail.propTypes = {

}

export default AdminProjectDetail
