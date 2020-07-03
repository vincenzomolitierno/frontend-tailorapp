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

    for (let index = 0; index < shirts.length; index++) {
      
      console.log('camicia ' + index, shirts[index]);
      const element = shirts[index];

      // console.log('camicie', element.iniziali);

      console.log('element.iniziali index ' + index, element.iniziali);

      if ( element.presenza_iniziali == 'SI' ) {
        stringa = 
        'colore: ' + element.colore + ' | ' +
        'numero capi: ' + element.numero_capi + ' | ' +      
        // 'idcamicie: ' + element.idcamicie + ' | ' +
        'collo: ' + element.modellocollo + ' | ' +
        'polso: ' + element.modellopolso + ' | ' +
        'avanti: ' + element.avanti + ' | ' +
        'indietro: ' + element.indietro + ' | ' +             
        'stecche: ' + element.stecche_estraibili;
        
        
        if ( element.tipo_bottone != '' )
          stringa = stringa + ' | ' + 'tipo bottone: ' + element.tipo_bottone;
                
        stringa = stringa + ' | ' +      
        'tasca: ' + element.tasca + ' | ' +
        'cuciture: ' + element.cuciture + ' | ' +
        // 'ordini_idordini ' + element.idordini + ' | ' +
        'iniziali: ' + element.presenza_iniziali + ' | ' +      
        'let. iniziali: ' + element.iniziali + ' | ' +
        'pos. iniziali: ' + element.pos_iniziali + ' | ' +
        'corsivo: ' + element.stile_carattere + ' | ' +
        'maiuscolo: ' + element.maiuscolo;
        
        if ( element.note != '' )
          stringa = stringa + ' | ' + 'note: ' + element.note;        
        
      } else if ( element.presenza_iniziali == 'NO') {

          stringa = 
          'colore: ' + element.colore + ' | ' +
          'numero capi: ' + element.numero_capi + ' | ' +      
          // 'idcamicie: ' + element.idcamicie + ' | ' +
          'collo: ' + element.modellocollo + ' | ' +
          'polso: ' + element.modellopolso + ' | ' +
          'avanti: ' + element.avanti + ' | ' +
          'indietro: ' + element.indietro + ' | ' +             
          'stecche: ' + element.stecche_estraibili;
          
          
          if ( element.tipo_bottone != '' )
            stringa = stringa + ' | ' + 'tipo bottone: ' + element.tipo_bottone;
                  
          stringa = stringa + ' | ' +      
          'tasca: ' + element.tasca + ' | ' +
          'cuciture: ' + element.cuciture + ' | ' +
          // 'ordini_idordini ' + element.idordini + ' | ' +
          'iniziali: ' + element.presenza_iniziali;    
          // 'let. iniziali: ' + element.iniziali + ' | ' +
          // 'pos. iniziali: ' + element.pos_iniziali + ' | ' +
          // 'corsivo: ' + element.stile_carattere + ' | ' +
          // 'maiuscolo: ' + element.maiuscolo;
          
          if ( element.note != '' )
            stringa = stringa + ' | ' + 'note: ' + element.note;  

      }

      console.log('stringa formattata '+ index, stringa )
      obj.push([stringa.toUpperCase(),' ']);
      
    } // fine ciclo for per le camicie

    var refSize:number = 14;

    if ( order.note == '' )
      var noteCliente: string = 'nessuna';
    else  
      var noteCliente: string = order.note;

    if ( order.note_x_fasonista == '' )
      var noteFasonista: string = 'nessuna';
    else  
      var noteFasonista: string = order.note_x_fasonista;   
               
    var base64: string = Base64Utility.base64ShirtEmpty;
    
    // if ( !isUndefined(measure.note_grafiche) )
    if ( measure.note_grafiche != '' )
      base64 = 'data:image/png;base64,' + measure.note_grafiche;

     const documentCustomerDefinition = {
       
        content: [
          {
            text: 'STAMPA PER IL CLIENTE \n ORDINE N° ' + order.idordini + ' DEL ' + order.data_ordine,
            style: 'header'
          } ,
          {
            columns: [
              {
                text: 'Committente: ' + customer.nominativo + ' ( ' + customer.telefono +' )',
                style: 'subheader'
              },
              {
                text: 'Misurometro: ' + measure.misurometro,
                style: 'subheader'
              }
            ]
          },  
          {
            columns: [
              {
                text: 'Collo: '        + this.convertipositivi(measure.collo) + '\n' +
                      'Spalla: '       + this.convertipositivi(measure.spalla) + '\n' +
                      'Lun. Manica: '  + this.convertipositivi(measure.lung_bicipite) + '\n' +
                      'Bicipite Tot x Braccio: '     + this.convertipositivi(measure.bicipite) + '\n' +
                      'Avamb Tot x Braccio: '  + this.convertipositivi(measure.avambraccio) + '\n' ,
                style: 'name'
              },
              {
                text: 'Lun Camicia: '           + this.convertipositivi(measure.lung_camicia) + '\n' +
                      'Centro Schiena: '     + this.convertipositivi(measure.lung_avambraccio) + '\n' +
                      'Vita Dietro: '      + this.convertipositivi(measure.vita_dietro) + '\n' +
                      'Bacino Dietro: ' + this.convertipositivi(measure.bacino_dietro) + '\n' +
                      'Polso: '    + this.convertipositivi(measure.polso) + '\n',
                style: 'name'
              },
              {
                text: 'TORACE AVANTI' + '\n' +
                      '1° Bottone: '     + this.convertipositivi(measure.torace.split(';')[0]) + '\n' +
                      '2° Bottone: '     + this.convertipositivi(measure.torace.split(';')[1]) + '\n' +
                      '3° Bottone: '     + this.convertipositivi(measure.torace.split(';')[2]) + '\n',
                style: 'name'
              },
              {
                text: '4° Bottone: '     + this.convertipositivi(measure.torace.split(';')[3]) + '\n' +
                      '5° Bottone: '     + this.convertipositivi(measure.torace.split(';')[4]) + '\n' +
                      '6° Bottone: '     + this.convertipositivi(measure.torace.split(';')[5]) + '\n' +
                      '7° Bottone: '     + this.convertipositivi(measure.torace.split(';')[6]) + '\n' +
                      '8° Bottone: '     + this.convertipositivi(measure.torace.split(';')[7]) + '\n',
                style: 'name'
              }                                       
            ]
          },
          '\n',
          {
            image: base64,
            width: 250,
            alignment: 'center'
          },
          '\n',
          {
            text: 'ELENCO CAMICIE',
            style: 'subheader',
            alignment: 'left',
            margin: [0, 10, 0, 0]
          },
          {
            style: 'name',
            alignment: 'left',
            table: {
              heights: '*',
              widths: ['*', 100],
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
            text: 'NOTE PER IL CLIENTE',
            style: 'subheader',
            alignment: 'left',
            margin: [0, 10, 0, 0]
          },          
          {
            style: 'name',
            alignment: 'left',
            table: {
              widths: ['*'],
              body: [
                [noteCliente],
              ]
            }
          },
          {
            columns: [
              {
                text: 'Totale: ' +  order.totale + '\n'
                    + 'Acconto: ' + order.acconto + '\n'
                    + 'Saldo: ' + order.saldo + '\n',
                style: 'subheader'
              },
              {
                text: 'Saldato: ' + order.saldato,
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
          producer: 'vincenzo',
          creator: 'molitierno'         
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
            fontSize: refSize-4,
            alignment: 'center',
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

      const documentSubcontractorDefinition = {
       
        content: [
          {
            text: 'STAMPA PER IL FASONISTA ' + subcontractor.nome + ' ( ' + subcontractor.telefono + ' )\nORDINE N° ' + order.idordini + ' DEL ' + order.data_ordine,
            style: 'header'
          } ,
          {
            columns: [
              {
                text: 'Committente: ' + customer.nominativo ,
                style: 'subheader'
              },
              {
                text: 'Misurometro: ' + measure.misurometro,
                style: 'subheader'
              }
            ]
          },  
          {
            columns: [
              {
                text: 'Collo: '        + this.convertipositivi(measure.collo) + '\n' +
                      'Spalla: '       + this.convertipositivi(measure.spalla) + '\n' +
                      'Lun. Manica: '  + this.convertipositivi(measure.lung_bicipite) + '\n' +
                      'Bicipite Tot x Braccio: '     + this.convertipositivi(measure.bicipite) + '\n' +
                      'Avamb Tot x Braccio: '  + this.convertipositivi(measure.avambraccio) + '\n' ,
                style: 'name'
              },
              {
                text: 'Lun Camicia: '           + this.convertipositivi(measure.lung_camicia) + '\n' +
                      'Centro Schiena: '     + this.convertipositivi(measure.lung_avambraccio) + '\n' +
                      'Vita Dietro: '      + this.convertipositivi(measure.vita_dietro) + '\n' +
                      'Bacino Dietro: ' + this.convertipositivi(measure.bacino_dietro) + '\n' +
                      'Polso: '    + this.convertipositivi(measure.polso) + '\n',
                style: 'name'
              },
              {
                text: 'TORACE AVANTI' + '\n' +
                      '1° Bottone: '     + this.convertipositivi(measure.torace.split(';')[0]) + '\n' +
                      '2° Bottone: '     + this.convertipositivi(measure.torace.split(';')[1]) + '\n' +
                      '3° Bottone: '     + this.convertipositivi(measure.torace.split(';')[2]) + '\n',
                style: 'name'
              },
              {
                text: '4° Bottone: '     + this.convertipositivi(measure.torace.split(';')[3]) + '\n' +
                      '5° Bottone: '     + this.convertipositivi(measure.torace.split(';')[4]) + '\n' +
                      '6° Bottone: '     + this.convertipositivi(measure.torace.split(';')[5]) + '\n' +
                      '7° Bottone: '     + this.convertipositivi(measure.torace.split(';')[6]) + '\n' +
                      '8° Bottone: '     + this.convertipositivi(measure.torace.split(';')[7]) + '\n',
                style: 'name'
              }                                        
            ]
          },
          '\n',
          {
            image: base64,
            width: 250,
            alignment: 'center'
          },
          '\n',
          {
            text: 'ELENCO CAMICIE',
            style: 'subheader',
            alignment: 'left',
            margin: [0, 10, 0, 0]
          },
          {
            style: 'name',
            alignment: 'left',
            table: {
              heights: '*',
              widths: ['*', 100],
              body: obj
            }
          },                                       
          // {
          //   text: 'Fasonista: ' + order.fasonatori_idfasonatori,
          //   style: 'subheader',
          //   alignment: 'left',
          // },
          {
            text: 'NOTE PER IL FASONISTA',
            style: 'subheader',
            alignment: 'left',
            margin: [0, 10, 0, 0]
          },
          {
            style: 'name',            
            alignment: 'left',
            table: {
              widths: ['*'],              
              body: [
                [noteFasonista],
              ]
            }
          },          
          // {
          //   columns: [
          //     {
          //       text: 'Data consegna: ' + order.data_consegna,
          //       style: 'subheader',
          //       alignment: 'left'
          //     },
          //     {
          //       text: 'Modalità consegna: ' + order.mod_consegna,
          //       style: 'subheader',
          //       alignment: 'left'
          //     }
          //   ]
          // },  
          // 'NOTE PER IL CLIENTE ' ,
          // {
          //   style: 'subheader',
          //   alignment: 'left',
          //   table: {
          //     widths: ['*'],
          //     body: [
          //       [noteClinte],
          //     ]
          //   }
          // },
          // {
          //   columns: [
          //     {
          //       text: 'Totale: ' +  order.totale + '\n'
          //           + 'Acconto: ' + order.acconto + '\n'
          //           + 'Saldo: ' + order.saldo + '\n',
          //       style: 'subheader'
          //     },
          //     {
          //       text: 'Saldato: ' + order.saldato,
          //       style: 'subheader'
          //     }
          //   ]
          // }          
        ],       
        info: {
          title: 'STAMPA ORDINE N°' + order.idordini,
          author: 'idealprogetti.com',
          subject: 'Riepilogo Lavorazioni',
          keywords: 'RESUME, ONLINE RESUME', 
          producer: 'vincenzo',
          creator: 'molitierno'         
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
            fontSize: refSize-4,
            alignment: 'center',
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

    //  pdfMake.createPdf(documentDefinition).download();
      
      if ( type == 'for_customer') {
        pdfMake.createPdf(documentCustomerDefinition).open();
      } else if ( type == 'for_subcontractor' ) {
        pdfMake.createPdf(documentSubcontractorDefinition).open();
      }    
     
    }  

  public static generateEmptyOrderSheetPdf() {
    // NAZARO
  }

  public static convertipositivi(s: string): string
  {
	  if(s.substr(0, 1) != "-")
		{  
    	s = "+" + s;
	  }
	  return (s);
	  
  }

}
