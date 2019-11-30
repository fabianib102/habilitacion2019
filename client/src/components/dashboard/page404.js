import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Page404 extends Component {

    
  render() {
    return (
      <div className="app flex-row align-items-center">
        <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="clearfix">
                <h1 className="float-left display-1 mr-3">404</h1>
                <h2 className="pt-3">Oops! Creo que estas perdido.</h2>
                <p className="text-muted float-left">La página que estás buscando no se encuentra.</p>
              </div> 
                <center> 
                    <Link to="/dashboard" className="btn btn-primary my-1">
                        <h4> Inicio</h4>
                    </Link>
                </center>     
              </div>
            </div>
       </div>
      </div>
    );
  }
}
export default Page404;