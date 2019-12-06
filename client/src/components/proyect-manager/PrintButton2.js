import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
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


const PrintButton2 = ({id, label}) => (<div className="tc mb4 mt2">
  {/*
    Getting pixel height in milimeters:
    https://stackoverflow.com/questions/7650413/pixel-to-mm-equation/27111621#27111621
  */}
  <div id="myMm" style={{height: "1mm"}} />

  <div
    className="btn btn-primary"
    onClick={() => {
      const input = document.getElementById(id);
      
      const pdf = new jsPDF('l');
      
      var date = moment().format("DD-MM-YYYY");
      
      pdf.setFontSize(18);
      pdf.text("Listado de Tareas por Equipo", 95, 22);

      pdf.setFontSize(11);
      pdf.text("Fecha de emision: " + date, 232, 12);
      pdf.text("Responsable: ", 14, 35);
      pdf.text("CUIL: ", 14, 42);
      pdf.text("Legajo: ", 14, 49);

      

      pdf.autoTable({html: input,
                    startY: 55, 
                    showHead: 'firstPage'});
      pdf.save(`${id}.pdf`);
      
    }}
  >
    {label}
  </div>
</div>);

export default PrintButton2;