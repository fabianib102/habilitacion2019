import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
require('jspdf-autotable');

const pxToMm = (px) => {
  return Math.floor(px/document.getElementById('myMm').offsetHeight);
};

const mmToPx = (mm) => {
  return document.getElementById('myMm').offsetHeight*mm;
};

const range = (start, end) => {
    return Array(end-start).join(0).split(0).map(function(val, id) {return id+start});
};


const PrintButton2 = ({id, label, title, auth:{user}, filter, filterType, filterTeam}) => (<div className="tc mb4 mt2">
  
  <div id="myMm" style={{height: "1mm"}} />

  <div
    className="btn btn-primary"
    onClick={() => {
      const input = document.getElementById(id);
      
      const pdf = new jsPDF('l');
      
      var date = moment().format("DD-MM-YYYY");
      
      
      pdf.setFontSize(18);
      
      var type = "";

      switch(title){
        case "client":
            type = "Cliente"
            break;
        case "typeProject":
            type = "Tipo de Proyecto";
            break;
        case "team":
            type = "Equipo";
            break;
        default:
            break;
      }

      pdf.text(`Listado de Proyectos por ${type}`, 95, 22);

      pdf.setFontSize(11);
      pdf.text("Fecha de emision: " + date, 232, 12);
      // pdf.text("Responsable: " + user.name + " " +  user.surname, 14, 35);
      // pdf.text("CUIL: " + user.cuil, 14, 42);
      // pdf.text("Legajo: " + user.identifier, 14, 49);

      if(filter !== ""){
        pdf.text("Filtrado por: " + filter, 14, 35);
      }

      if(filterType !== ""){
        pdf.text("Filtrado por: " + filterType, 14, 35);
      }

      if(filterTeam !== ""){
        pdf.text("Filtrado por: " + filterTeam, 14, 35);
      }
      
      pdf.autoTable({html: input,
                    startY: 40, 
                    showHead: 'firstPage'});
      pdf.save(`${id}.pdf`);
      
    }}
  >
    {label}
  </div>
</div>);

PrintButton2.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PrintButton2);