import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

interface CamiciaElement {  
  idcamicie: number,
  colore: string,
  quantita: number,
  stecche_estraibili: string,
  tasca: string,
  cuciture: string,
  tipo_bottone: string,
  iniziali: string,
  posizione_iniziali: string,
  stile_carattere: string,
  maiuscolo: string,
  note: string,
  ordini_idordini: number,
  idmodello_polso: number,
  idmodelli_collo: number,
  avanti_idavanti: number,
  indietro_idindietro: number,
}


@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {

  visibleProgressBar: boolean = false;

  subcontractorView: boolean = false;

  nome_cliente: string = 'nome e cognome';
  misurometro: string = 'misurometro';
  taglia: string = 'taglia';

    // attributi della misura
  //colonna 1
  collo: number = 0.0;  //valore di default noto
  spalla: number = 0.0;
  bicipite: number = 0.0;
  lunghezza_bicipite: number = 0.0;
  vita_dietro: number = 0.0;  
  //colonna 2
  polso: number = 0.0 //valore di default noto
  lunghezza_camicia: number = 0.0;
  avambraccio: number = 0.0;
  lunghezza_avambraccio: number = 0.0;
  bacino_dietro: number = 0.0;
  //colonna 3
  torace_1_bottone: number = 0.0;
  torace_2_bottone: number = 0.0;
  torace_3_bottone: number = 0.0;
  //colonna 4
  bacino_4_bottone: number = 0.0;
  bacino_5_bottone: number = 0.0;
  bacino_6_bottone: number = 0.0;
  bacino_7_bottone: number = 0.0;
  bacino_8_bottone: number = 0.0;

  nominativo_fasonista: string = 'nome fasonista';
  data_consegna: string = 'gg/mm/aaaa';
  modalita_consegna: string = 'mod. consegna';

  totale_ordine: number = 200;
  acconto: number = 50;

  checkedOrUnchecked: boolean = false;

  shirts: CamiciaElement[] = [
    {
      idcamicie: 1,
      colore: 'rossa',
      quantita: 3,
      stecche_estraibili: 'si',
      tasca: 'taschino',
      cuciture: 'cuciture',
      tipo_bottone: 'tipo bottone',
      iniziali: 'VM',
      posizione_iniziali: 'basso',
      stile_carattere: 'stampato',
      maiuscolo: 'si',
      note: 'nota ...',
      ordini_idordini: 1,
      idmodello_polso: 1,
      idmodelli_collo: 1,
      avanti_idavanti: 1,
      indietro_idindietro: 1      
    },
    {
      idcamicie: 2,
      colore: 'celeste',
      quantita: 2,
      stecche_estraibili: 'si',
      tasca: 'no',
      cuciture: 'lunghe',
      tipo_bottone: 'piatto',
      iniziali: 'VM',
      posizione_iniziali: 'alte',
      stile_carattere: 'corsivo',
      maiuscolo: 'no',
      note: 'nota nota...',
      ordini_idordini: 2,
      idmodello_polso: 2,
      idmodelli_collo: 3,
      avanti_idavanti: 4,
      indietro_idindietro: 2
    }          
  ];  

  constructor(@Inject(MAT_DIALOG_DATA) data,
  private dialogRef:MatDialogRef<OrderViewComponent>) {
    this.subcontractorView = data.view;
   }

  ngOnInit() {

  }

  public captureScreenToScreen()  
  {  
    var data = document.getElementById('htmlData');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  

      pdf.addTe

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.output('dataurlnewwindow'); // Live PDF   
    });  
  }  
  
  public captureScreen()  
  {  
    this.visibleProgressBar = true;

    var data = document.getElementById('htmlData');  
    
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  

      console.log(data.getAttribute('height'));   
      console.log(data.getAttribute('width'));   
      console.log(canvas.height);   
      console.log(canvas.width);   
      // var pageHeight = 295;    
      // var imgHeight = data.getAttribute('height');  
      // var heightLeft = imgHeight;  

      var imgWidth = 100;   
      // var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      // var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   


      console.log('fine');
      this.dialogRef.close();

    });  

  } 


}
