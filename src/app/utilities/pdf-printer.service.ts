import { Injectable } from '@angular/core';
import { Order } from '../orders/data.model';
import { Measure } from '../measurers/data.model';
import { Customer } from '../customers/data.model';
import { Subcontractor } from '../subcontractors/data.model';
import { RESTBackendService } from '../backend-service/rest-backend.service';
import { Shirt } from '../shirts/shirt.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ScriptService } from '../customers/customer-grid/script.service';
import { Base64Utility } from '../measure/data.model';
import { isUndefined } from 'util';
import { isEmpty } from 'rxjs/operators';

declare let pdfMake: any ;


@Injectable({
  providedIn: 'root'
})
export class PdfPrinterService {
  
  // Stringhe per i messaggi di errore
  static errorMessage: string;
  static errorHttpErrorResponse: HttpErrorResponse;  

  constructor(
    public scriptService: ScriptService,
  ) { 
    this.scriptService.load('pdfMake', 'vfsFonts');
  }


  public static generatePdfPrint(order: Order, key: string, restBackendService: RESTBackendService) {

    // console.log(order);  
    // console.log(key);  

    restBackendService.getResource('customers').subscribe(
      (data) => {
        var customers: Customer[] = data;
        var customer: Customer = customers.find(x => x.idclienti === order.clienti_idclienti);
        
        // console.log(customer);

        restBackendService.getResourceQuery('measuresQuery','idclienti=' + String(order.clienti_idclienti)).subscribe(
          (data) => {   
            
            var measure: Measure = data[0];            
            // console.log(measure);

            restBackendService.getResourceQuery('shirtsQuery', 'idordini=' + order.idordini ).subscribe(
              (data) => {

                var shirts: Shirt[] = data;            
                // console.log(shirts);    
                
                restBackendService.getResource('subcontractors').subscribe(
                  (data) => {

                      var subcontractors: Subcontractor[] = data;
                      var subcontractor: Subcontractor = subcontractors.find(x => x.idfasonatori === order.fasonatori_idfasonatori);


                      // this.generatePdf(order, measure, customer, shirts, subcontractor, key);

                      PdfPrinterService.generatePdf(order, measure, customer, shirts, subcontractor, key);

                  },
                  (error) => {
                    this.errorHttpErrorResponse = error;
                    this.errorMessage = error.message;       
                  }
                );
              },
              (error) => {
                this.errorHttpErrorResponse = error;
                this.errorMessage = error.message;                  
              },
            );
            
          },
          (error) => {
            this.errorHttpErrorResponse = error;
            this.errorMessage = error.message;              
          }
        );
      },
      (error) => {
        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;          
      }
    );    

    

  }  
 

  public static generatePdf(order?: Order, measure?: Measure, customer?: Customer, shirts?: any[], subcontractor?: Subcontractor, type?: string){

    var obj: Array<any> = new Array();

    console.log('camicie da stampare', shirts);

    var stringa :string = '';
    var stringa2 :string = '';
    var stringa3 :string = '';
    var dicituracucitureNO :string = 'CUCITURE A MACCHINA';
    var dicituracucitureSI :string = 'CUCITURE A MANO';
    var dicituracorsivoNO :string = 'STAMPATO';
    var dicituracorsivoSI :string = 'CORSIVO';
    var dicituramaiuscoloNO :string = 'MINUSCOLO';
    var dicituramaiuscoloSI :string = 'MAIUSCOLO';

    for (let index = 0; index < shirts.length; index++) {
      
      console.log('camicia ' + index, shirts[index]);
      const element = shirts[index];


      // console.log('camicie', element.iniziali);

      console.log('element.iniziali index ' + index, element.iniziali);

      
        stringa = 
        'numero capi: ' + element.numero_capi + '\n' + 
        'colore: ' + element.colore + '\n' +
            
        // 'idcamicie: ' + element.idcamicie + '\n' +
        'collo: ' + element.modellocollo + '\n' +
        'polso: ' + element.modellopolso + '\n' +
        'avanti: ' + element.avanti ;
        
        stringa2 = 'dietro: ' + element.indietro + '\n' +             
        'tipo bottone: ' + element.tipo_bottone + '\n'+
        'stecche estraibili: ' + element.stecche_estraibili+ '\n' + 
       
         'tasca: ' + element.tasca + '\n'; 
        if (element.cuciture == 'SI')
        {
          stringa2 = stringa2 + dicituracucitureSI + '\n';
        }
        else
        {
          stringa2 = stringa2 + dicituracucitureNO + '\n';
        }
        stringa3 = '';
        if ( element.presenza_iniziali == 'SI' ) {
        stringa3 =
        // 'ordini_idordini ' + element.idordini + '\n' +
        'iniziali: ' + element.presenza_iniziali + '\n' +      
        'let. iniziali: ' + element.iniziali + '\n' +
        'pos. iniziali: ' + element.pos_iniziali + '\nstile:';
        if (element.stile_carattere == 'SI')
        {
          stringa3 = stringa3 + dicituracorsivoSI+ ' ';
        }
        else
        {
          stringa3 = stringa3 + dicituracorsivoNO + ' ';
        }
        if (element.maiuscolo == 'SI')
        {
          stringa3 = stringa3 + dicituramaiuscoloSI+ '\n';
        }
        else
        {
          stringa3 = stringa3 + dicituramaiuscoloNO + '\n';
        }
      } 
        
        if ( element.note != '' )
        stringa3 = stringa3 + 'note: ' + element.note;        
        
      

      console.log('stringa formattata '+ index, stringa )
      obj.push([stringa.toUpperCase(),stringa2.toUpperCase(),stringa3.toUpperCase(),' ']);
      
    } // fine ciclo for per le camicie
    
    if (shirts.length==0)   obj.push([' ',' ',' ',' ']);

    var refSize:number = 14;

    if ( order.note == '' )
      var noteCliente: string = '';
    else  
      var noteCliente: string = order.note;

    if ( order.note_x_fasonista == '' )
      var noteFasonista: string = '';
    else  
      var noteFasonista: string = order.note_x_fasonista;   

    if ( measure.note == '' )
      var noteMisura: string = '';
    else  
      var noteMisura: string = measure.note; 
               
    var base64: string = Base64Utility.base64ShirtEmpty;
  
    // if ( !isUndefined(measure.note_grafiche) )
    if ( measure.note_grafiche != '' )
      base64 = 'data:image/png;base64,' + measure.note_grafiche;

     const documentCustomerDefinition = {
       
      content: [
        { margin: [-20, -20, -30, 0],
              columns: [ 
                {
                      text: 'PORFIDIA CAMICIE',
                      style: 'header',
                alignment: 'left',
                fontSize: 20
                    } ,
        
            {
              text: 'STAMPA PER IL CLIENTE \n ORDINE N° ' + order.idordini + ' DEL ' + order.data_ordine,
              style: 'header'
            }
          ]} ,
            { margin: [-20, -20, -30, 0],
              columns: [
                {
                  text: 'Committente: ' + customer.nominativo + ' ( ' + customer.telefono +' )',
                  style: 'subheader'
                },
                {
                  text: 'Misurometro: ' + measure.misurometro + '\nTaglia Misurometro: ' +measure.taglia_misurometro,
                  style: 'subheader'
                }
              ]
            },  
            {  margin: [-12, 0, -30, 0],
              columns: [
                {
                  text: 'Collo: '        + measure.collo + '\n\n' +
                        'Spalla x Lato: '       + this.convertipositivi(measure.spalla) + '\n\n' +
                        'Lun. Manica: '  + this.convertipositivi(measure.lung_bicipite) + '\n\n' +
                        'Bicipite Tot x B.: '     + this.convertipositivi(measure.bicipite) + '\n\n' +
                        'Avamb Tot x B.: '  + this.convertipositivi(measure.avambraccio) + '\n' ,
                  style: 'name'
                },
                {
                  text: 'Lun Camicia Dietro: '           + this.convertipositivi(measure.bacino) + '\n\n' +
                        'Lun Camicia: '           + this.convertipositivi(measure.lung_camicia) + '\n\n' +
                        'Centro Schiena: '     + this.convertipositivi(measure.lung_avambraccio) + '\n\n' +
                        'Vita Dietro: '      + this.convertipositivi(measure.vita_dietro) + '\n\n' +
                        'Bacino Dietro: ' + this.convertipositivi(measure.bacino_dietro) + '\n\n' +
                        'Polso: '    + measure.polso + '\n',
                  style: 'name'
                },
                {
                  text: 'TORACE AVANTI' + '\n\n' +
                        '1° Bottone: '     + this.convertipositivi(measure.torace.split(';')[0]) + '\n\n' +
                        '2° Bottone: '     + this.convertipositivi(measure.torace.split(';')[1]) + '\n\n' +
                        '3° Bottone: '     + this.convertipositivi(measure.torace.split(';')[2]) + '\n',
                  style: 'name'
                },
                {
                  text: 'AUMENTARE SOLO AVANTI' + '\n\n' +
                        '4° Bottone: '     + this.convertipositivi(measure.torace.split(';')[3]) + '\n\n' +
                        '5° Bottone: '     + this.convertipositivi(measure.torace.split(';')[4]) + '\n\n' +
                        '6° Bottone: '     + this.convertipositivi(measure.torace.split(';')[5]) + '\n\n' +
                        '7° Bottone: '     + this.convertipositivi(measure.torace.split(';')[6]) + '\n\n' +
                        '8° Bottone: '     + this.convertipositivi(measure.torace.split(';')[7]) + '\n',
                  style: 'name'
                }                                       
              ]
          },
          ,
          {
            image: base64,
            width: 250,
            alignment: 'center'
          },
          ,
          {
            text: 'ELENCO CAMICIE',
            style: 'subheader',
            alignment: 'left',
            margin: [0, 10, 0, 0]
          },
          {
            margin: [-12, 0, -12, 0],
            style: 'name',
            layout: {
              hLineWidth: function (i, node) { return 1;},
              hLineColor: function (i, node) { return 'black';},
              vLineWidth: function (i, node) {
                return ( i === node.table.widths.length-1 || i === node.table.widths.length || i === 0) ? 1 : 0;
              },
              
              vLineColor: function (i, node) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
              },
              // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
              // paddingLeft: function(i, node) { return 4; },
              // paddingRight: function(i, node) { return 4; },
              // paddingTop: function(i, node) { return 2; },
              // paddingBottom: function(i, node) { return 2; },
              // fillColor: function (rowIndex, node, columnIndex) { return null; }
            },
            alignment: 'left',
            table: {
              heights: 70,
              widths: ['*','*','*', 70],
              body: obj
            }
          },                                       
          // {
          //   text: 'Fasonista: ' + order.fasonatori_idfasonatori,
          //   style: 'subheader',
          //   alignment: 'left',
          // },
          // 'NOTE PER IL FASONISTA',
          // {
          //   style: 'subheader',
          //   alignment: 'left',
          //   table: {
          //     widths: ['*'],              
          //     body: [
          //       [noteFasonista],
          //     ]
          //   }
          // },          
          {
            columns: [
              {
                text: 'Data consegna: ' + order.data_consegna,
                style: 'subheader',
                alignment: 'left'
              },
              {
                text: 'Modalità consegna: ' + order.mod_consegna,
                style: 'subheader',
                alignment: 'left'
              }
            ]
          },  
          {
            text: 'NOTE',
            style: 'subheader',
            alignment: 'left',
            margin: [0,0, 0, 0]
          },          
          {
            style: 'name',
            alignment: 'left',
           
            
            table: {
              widths: ['*'],
              body: [
                [noteCliente + ' ' + noteFasonista + ' ' + noteMisura],
              ]
            }
          },
          {
            columns: [
              {
                text: 'Totale: ' +  order.totale ,
                style: 'subheader'
              },
              {
                text:   'Acconto: ' + order.acconto  ,
                style: 'subheader'
              },
              {
                text: 'Saldo: ' + order.saldo ,
                style: 'subheader'
              }
            ]
          }          
        ],       
        info: {
          title: 'STAMPA ORDINE N°' + order.idordini,
          author: 'idealprogetti.com',
          subject: 'Riepilogo Lavorazioni',
          keywords: 'RESUME, ONLINE RESUME', 
          producer: 'porfidiacamicie.com',
          creator: 'porfidiacamicie.com'         
        },
        
        styles: {
          header: {
            fontSize: refSize,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 10],
          },
          subheader: {
            fontSize: refSize-2,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 10],
          },
          name: {
            fontSize: refSize-3,
            alignment: 'left',
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
          tableExample: {
            margin: [0, 10, 0, 10]
          },
          tableHeader: {
            bold: true,
            fontSize: 11,
            color: 'black'
          }          
        }   // fine style 
      
      };

      const documentSubcontractorDefinition  = {
       
        content: [
          { margin: [-20, -20, -30, 0],
                columns: [ 
                  {
                        text: 'PORFIDIA CAMICIE',
                        style: 'header',
                  alignment: 'left',
                  fontSize: 20
                      } ,
          
                      {
                        text: 'STAMPA PER IL FASONISTA\n' + subcontractor.nome + ' ( ' + subcontractor.telefono + ' )\nORDINE N° ' + order.idordini + ' DEL ' + order.data_ordine,
                        style: 'header'
                      } 
            ]} ,
              { margin: [-20, -20, -30, 0],
                columns: [
                  {
                    text: 'Committente: ' + customer.nominativo ,
                    style: 'subheader'
                  },
                  {
                    text: 'Misurometro: ' + measure.misurometro + '\nTaglia Misurometro: ' +measure.taglia_misurometro,
                    style: 'subheader'
                  }
                ]
              },  
              {  margin: [-12, 0, -30, 0],
                columns: [
                  {
                    text: 'Collo: '        + measure.collo + '\n\n' +
                          'Spalla x Lato: '       + this.convertipositivi(measure.spalla) + '\n\n' +
                          'Lun. Manica: '  + this.convertipositivi(measure.lung_bicipite) + '\n\n' +
                          'Bicipite Tot x B.: '     + this.convertipositivi(measure.bicipite) + '\n\n' +
                          'Avamb Tot x B.: '  + this.convertipositivi(measure.avambraccio) + '\n' ,
                    style: 'name'
                  },
                  {
                    text: 'Lun Camicia Dietro: '           + this.convertipositivi(measure.bacino) + '\n\n' +
                          'Lun Camicia: '           + this.convertipositivi(measure.lung_camicia) + '\n\n' +
                          'Centro Schiena: '     + this.convertipositivi(measure.lung_avambraccio) + '\n\n' +
                          'Vita Dietro: '      + this.convertipositivi(measure.vita_dietro) + '\n\n' +
                          'Bacino Dietro: ' + this.convertipositivi(measure.bacino_dietro) + '\n\n' +
                          'Polso: '    + measure.polso + '\n',
                    style: 'name'
                  },
                  {
                    text: 'TORACE AVANTI' + '\n\n' +
                          '1° Bottone: '     + this.convertipositivi(measure.torace.split(';')[0]) + '\n\n' +
                          '2° Bottone: '     + this.convertipositivi(measure.torace.split(';')[1]) + '\n\n' +
                          '3° Bottone: '     + this.convertipositivi(measure.torace.split(';')[2]) + '\n',
                    style: 'name'
                  },
                  {
                    text: 'AUMENTARE SOLO AVANTI' + '\n\n' +
                          '4° Bottone: '     + this.convertipositivi(measure.torace.split(';')[3]) + '\n\n' +
                          '5° Bottone: '     + this.convertipositivi(measure.torace.split(';')[4]) + '\n\n' +
                          '6° Bottone: '     + this.convertipositivi(measure.torace.split(';')[5]) + '\n\n' +
                          '7° Bottone: '     + this.convertipositivi(measure.torace.split(';')[6]) + '\n\n' +
                          '8° Bottone: '     + this.convertipositivi(measure.torace.split(';')[7]) + '\n',
                    style: 'name'
                  }                                       
                ]
            },
            ,
            {
              image: base64,
              width: 250,
              alignment: 'center'
            },
            ,
            {
              text: 'ELENCO CAMICIE',
              style: 'subheader',
              alignment: 'left',
              margin: [0, 10, 0, 0]
            },
            {
              margin: [-12, 0, -12, 0],
              style: 'name',
              layout: {
                hLineWidth: function (i, node) { return 1;},
                hLineColor: function (i, node) { return 'black';},
                vLineWidth: function (i, node) {
                  return ( i === node.table.widths.length-1 || i === node.table.widths.length || i === 0) ? 1 : 0;
                },
                
                vLineColor: function (i, node) {
                  return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                },
                // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                // paddingLeft: function(i, node) { return 4; },
                // paddingRight: function(i, node) { return 4; },
                // paddingTop: function(i, node) { return 2; },
                // paddingBottom: function(i, node) { return 2; },
                // fillColor: function (rowIndex, node, columnIndex) { return null; }
              },
              alignment: 'left',
              table: {
                heights: 70,
                widths: ['*','*','*', 70],
                body: obj
              }
            },                                       
            // {
            //   text: 'Fasonista: ' + order.fasonatori_idfasonatori,
            //   style: 'subheader',
            //   alignment: 'left',
            // },
            // 'NOTE PER IL FASONISTA',
            // {
            //   style: 'subheader',
            //   alignment: 'left',
            //   table: {
            //     widths: ['*'],              
            //     body: [
            //       [noteFasonista],
            //     ]
            //   }
            // },          
            {
              columns: [
                {
                  text: 'Data consegna: ' + order.data_consegna,
                  style: 'subheader',
                  alignment: 'left'
                }
               
              ]
            },  
            {
              text: 'NOTE',
              style: 'subheader',
              alignment: 'left',
              margin: [0,0, 0, 0]
            },          
            {
              style: 'name',
              alignment: 'left',
             
              
              table: {
                widths: ['*'],
                body: [
                  [ noteFasonista],
                ]
              }
            }         
          ],       
          info: {
            title: 'STAMPA ORDINE N°' + order.idordini,
            author: 'idealprogetti.com',
            subject: 'Riepilogo Lavorazioni',
            keywords: 'RESUME, ONLINE RESUME', 
            producer: 'porfidiacamicie.com',
            creator: 'porfidiacamicie.com'         
          },
          
          styles: {
            header: {
              fontSize: refSize,
              bold: true,
              alignment: 'center',
              margin: [0, 10, 0, 10],
            },
            subheader: {
              fontSize: refSize-2,
              bold: true,
              alignment: 'center',
              margin: [0, 10, 0, 10],
            },
            name: {
              fontSize: refSize-3,
              alignment: 'left',
            },
            jobTitle: {
              fontSize: 14,
              bold: true,
              italics: true
            },
            sign: {
              margin: [0, 50, 0, 10],
              alignment: 'right',
              italics: true
            },
            tableExample: {
              margin: [0, 10, 0, 10]
            },
            tableHeader: {
              bold: true,
              fontSize: 11,
              color: 'black'
            }          
          }   // fine style 
        
        };
     
      if ( type == 'for_customer') {
        pdfMake.createPdf(documentCustomerDefinition).open();
        // pdfMake.createPdf(documentCustomerDefinition).download('STAMPA ORDINE PER CLIENTE N° ' + order.idordini + ' DEL ' + order.data_ordine);
      } else if ( type == 'for_subcontractor' ) {
        pdfMake.createPdf(documentSubcontractorDefinition).open();
        // pdfMake.createPdf(documentSubcontractorDefinition).download('STAMPA ORDINE PER FASONISTA N° ' + order.idordini + ' DEL ' + order.data_ordine);
      }    
     
    }  
 
    public static generateEmptyOrderSheetPdf() {
      // NAZARO
  
      var refSize:number = 14;
      var base64:string = 'data:image/jpeg;base64,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';
      const documentEmptyDefinition  = {
         
        content: [
          { margin: [-20, -20, -30, 0],
                columns: [ 
                  {
                        text: 'PORFIDIA CAMICIE',
                        style: 'header',
                  alignment: 'left',
                  fontSize: 20
                      } ,
          
                      {
                        text: 'MODULO MISURE ' ,
                        style: 'header'
                      } 
            ]} , {
              text: 'Cliente: ' ,
              style: 'subheader',
              alignment: 'left'
            } ,
              { margin: [0, 10, 0, 0],
                columns: [
                  {
                    text: 'Misurometro: '  ,
                    style: 'subheader',
                    alignment: 'left'
                  },
                  {
                    text: 'Taglia Misurometro: ' ,
                    style: 'subheader',
                    alignment: 'left'
                  }
                ]
              },  
              {  margin: [-12, 0, -30, 0],
                columns: [
                  {
                    text: 'Collo: '         + '\n\n' +
                          'Spalla x Lato: '       + '\n\n' +
                          'Lun. Manica: '   + '\n\n' +
                          'Bicipite Tot x B.: '   + '\n\n' +
                          'Avamb Tot x B.: '  + '\n' ,
                    style: 'name'
                  },
                  {
                    text: 'Lun Camicia Dietro: ' + '\n\n' +
                          'Lun Camicia: '          + '\n\n' +
                          'Centro Schiena: '     + '\n\n' +
                          'Vita Dietro: '       + '\n\n' +
                          'Bacino Dietro: '  + '\n\n' +
                          'Polso: '     + '\n',
                    style: 'name'
                  }] },
  
                  {  margin: [-12, 20, -30,0],
                    columns: [
                  {
                    text:  'TORACE AVANTI',
                    style: 'name'
                  },
                  {
                    text: 'AUMENTARE SOLO AVANTI',
                    style: 'name'
                  }                                       
                ]
            },
                  {  margin: [-12, 0, -30,20],
                    columns: [
                  {
                    text: '1° Bottone: '     + '\n\n' +
                          '2° Bottone: '    + '\n\n' +
                          '3° Bottone: '      + '\n',
                    style: 'name'
                  },
                  {
                    text: '4° Bottone: '      + '\n\n' +
                          '5° Bottone: '      + '\n\n' +
                          '6° Bottone: '      + '\n\n' +
                          '7° Bottone: '      + '\n\n' +
                          '8° Bottone: '      + '\n',
                    style: 'name'
                  }                                       
                ]
            },
            ,
            {
              image: base64,
              width: 250,
              alignment: 'center'
            },
            
            
                                                  
                  
            {
              margin: [-12, 20, -30, 0],
              columns: [
                {
                  text: 'Data Misura: ' ,
                  style: 'subheader',
                  alignment: 'left'
                }
               
              ]
            },  
            // {  
            //   text: 'NOTE',
            //   style: 'subheader',
            //   alignment: 'left',
            //   margin: [0,0, 0, 0]
            // },          
            // {
            //   style: 'name',
            //   alignment: 'left',                           
            //   table: {
            //     widths: ['*'],
            //     body: [''],
                
            //   }
            // }         
          ],       
          info: {
            title: 'STAMPA MODULO',
            author: 'idealprogetti.com',
            subject: 'Riepilogo Lavorazioni',
            keywords: 'RESUME, ONLINE RESUME', 
            producer: 'profidiacamicie.com',
            creator: 'profidiacamicie.com'         
          },
          
          styles: {
            header: {
              fontSize: refSize,
              bold: true,
              alignment: 'center',
              margin: [0, 10, 0, 10],
            },
            subheader: {
              fontSize: refSize,
              bold: true,
              alignment: 'center',
              margin: [0, 10, 0, 10],
            },
            name: {
              fontSize: refSize,
              alignment: 'left',
            },
            jobTitle: {
              fontSize: 14,
              bold: true,
              italics: true
            },
            sign: {
              margin: [0, 50, 0, 10],
              alignment: 'right',
              italics: true
            },
            tableExample: {
              margin: [0, 10, 0, 10]
            },
            tableHeader: {
              bold: true,
              fontSize: 11,
              color: 'black'
            }          
          }   // fine style 
        
        };
    
        pdfMake.createPdf(documentEmptyDefinition).open();
        // pdfMake.createPdf(documentEmptyDefinition).download('STAMPA MODELLO ORDINE VUOTO');
        

      }
  
    public static convertipositivi(s: string): string
    {
      if(s.substr(0, 1) != "-" && s != "0.0" )
      {  
        s = "+" + s;
      }
      return (s);
      
    }

    public static generateMeasureSheetPdf(measure: Measure, nomeCliente: string, telefonoCliente: string) {
      // NAZARO
  
      var refSize:number = 14;

      if( measure.note_grafiche )
      var base64:string = 'data:image/jpeg;base64,' + measure.note_grafiche;
      else
      var base64:string = 'data:image/jpeg;base64,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';
      
      if ( measure.note == '' )
        var noteMisura: string = '';
      else  
        var noteMisura: string = measure.note; 

      const documentEmptyDefinition  = {
         
        content: [
          { margin: [-20, -20, -30, 0],
                columns: [ 
                  {
                        text: 'PORFIDIA CAMICIE',
                        style: 'header',
                  alignment: 'left',
                  fontSize: 20
                      } ,
          
                      {
                        text: 'MODULO MISURE ' ,
                        style: 'header'
                      } 
            ]} , {
              text: 'Cliente: ' + nomeCliente + ' ( ' + telefonoCliente + ' )' ,
              style: 'subheader',
              alignment: 'left'
            } ,
              { margin: [0, 10, 0, 0],
                columns: [
                  {
                    text: 'Misurometro: ' + measure.misurometro ,
                    style: 'subheader',
                    alignment: 'left'
                  },
                  {
                    text: 'Taglia Misurometro: ' + measure.taglia_misurometro ,
                    style: 'subheader',
                    alignment: 'left'
                  }
                ]
              },  
              {  margin: [-12, 0, -30, 0],
                columns: [
                  {
                    text: 'Collo: '   +  measure.collo      + '\n\n' +
                          'Spalla x Lato: '  + this.convertipositivi(measure.spalla)     + '\n\n' +
                          'Lun. Manica: ' + this.convertipositivi(measure.lung_bicipite)   + '\n\n' +
                          'Bicipite Tot x B.: ' + this.convertipositivi(measure.bicipite)   + '\n\n' +
                          'Avamb Tot x B.: ' + this.convertipositivi(measure.avambraccio)  + '\n' ,
                    style: 'name'
                  },
                  {
                    text: 'Lun Camicia Dietro: ' + this.convertipositivi(measure.bacino) + '\n\n' +
                          'Lun Camicia: '   + this.convertipositivi(measure.lung_camicia)       + '\n\n' +
                          'Centro Schiena: ' + this.convertipositivi(measure.lung_avambraccio)    + '\n\n' +
                          'Vita Dietro: '  + this.convertipositivi(measure.vita_dietro)     + '\n\n' +
                          'Bacino Dietro: ' + this.convertipositivi(measure.bacino_dietro)  + '\n\n' +
                          'Polso: ' + measure.polso + '\n',
                    style: 'name'
                  }] },
  
                  {  margin: [-12, 20, -30,0],
                    columns: [
                  {
                    text:  'TORACE AVANTI',
                    style: 'name'
                  },
                  {
                    text: 'AUMENTARE SOLO AVANTI',
                    style: 'name'
                  }                                       
                ]
            },
                  {  margin: [-12, 0, -30,20],
                    columns: [
                  {
                    text:  '1° Bottone: ' + this.convertipositivi(measure.torace.split(';')[0])    + '\n\n' +
                          '2° Bottone: ' + this.convertipositivi(measure.torace.split(';')[1])   + '\n\n' +
                          '3° Bottone: '  + this.convertipositivi(measure.torace.split(';')[2])   + '\n',
                    style: 'name'
                  },
                  {
                    text: '4° Bottone: ' + this.convertipositivi(measure.torace.split(';')[3])    + '\n\n' +
                          '5° Bottone: '  + this.convertipositivi(measure.torace.split(';')[4])    + '\n\n' +
                          '6° Bottone: '   + this.convertipositivi(measure.torace.split(';')[5])   + '\n\n' +
                          '7° Bottone: '   + this.convertipositivi(measure.torace.split(';')[6])   + '\n\n' +
                          '8° Bottone: '  + this.convertipositivi(measure.torace.split(';')[7])    + '\n',
                    style: 'name'
                  }                                       
                ]
            },
            ,
            {
              image: base64,
              width: 250,
              alignment: 'center'
            },
            {
              text: 'NOTE',
              style: 'subheader',
              alignment: 'left',
              margin: [0, 0, 0, 0]
            },               
            {
              style: 'name',
              alignment: 'left',
              table: {
                widths: ['*'],
                body: [
                  [noteMisura],
                ]
              }
            },                                                                                        
            {
              margin: [-12, 20, -30, 0],
              columns: [
                {
                  text: 'Data Misura: ' + measure.data_misure,
                  style: 'subheader',
                  alignment: 'left'
                }
               
              ]
            },  
            // {  
            //   text: 'NOTE',
            //   style: 'subheader',
            //   alignment: 'left',
            //   margin: [0,0, 0, 0]
            // },          
            // {
            //   style: 'name',
            //   alignment: 'left',                        
            //   table: {
            //     widths: ['*'],
            //     body: [''],
                
            //   }
            // }         
          ],       
          info: {
            title: 'STAMPA MODULO',
            author: 'idealprogetti.com',
            subject: 'Riepilogo Lavorazioni',
            keywords: 'RESUME, ONLINE RESUME', 
            producer: 'profidiacamicie.com',
            creator: 'profidiacamicie.com'         
          },
          
          styles: {
            header: {
              fontSize: refSize,
              bold: true,
              alignment: 'center',
              margin: [0, 10, 0, 10],
            },
            subheader: {
              fontSize: refSize,
              bold: true,
              alignment: 'center',
              margin: [0, 10, 0, 10],
            },
            name: {
              fontSize: refSize,
              alignment: 'left',
            },
            jobTitle: {
              fontSize: 14,
              bold: true,
              italics: true
            },
            sign: {
              margin: [0, 50, 0, 10],
              alignment: 'right',
              italics: true
            },
            tableExample: {
              margin: [0, 10, 0, 10]
            },
            tableHeader: {
              bold: true,
              fontSize: 11,
              color: 'black'
            }          
          }   // fine style 
        
        };
    
        pdfMake.createPdf(documentEmptyDefinition).open();
        // pdfMake.createPdf(documentEmptyDefinition).download('STAMPA MODELLO ORDINE VUOTO');
        

      }
  

}
