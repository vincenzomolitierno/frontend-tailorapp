import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatSnackBar } from '@angular/material';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderViewComponent } from '../order-view/order-view.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { Customer } from 'src/app/customers/data.model';
import { Shirt } from 'src/app/shirts/shirt.model';
import { Measure } from 'src/app/measurers/data.model';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';
import { Base64Utility } from 'src/app/measure/data.model';
import { ScriptService } from 'src/app/customers/customer-grid/script.service';
import { Subcontractor } from 'src/app/subcontractors/data.model';

declare let pdfMake: any ;

@Component({
  selector: 'app-order-grid',
  templateUrl: './order-grid.component.html',
  styleUrls: ['./order-grid.component.css']
})
export class OrderGridComponent extends GridModel implements OnInit {

  // Dati coinvolti nel binding
  orderTagFocused: string = "";
  dummy_data: string = "X,Y"
  
   // Colonne visualizzate in tabella
   displayedColumns: string[] = [
     'idordini', 
     'data_ordine', 
     'clienti_idclienti', 
     'data_consegna',
     'mod_consegna',
     'totale',   
     'consegnato',
     'saldato',  
    //  'update', 'delete', 'view_orders', 'view_orders_subcontractor',
     'menu_button'
    ];
   
    constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog,
      public scriptService: ScriptService,
      snackBar: MatSnackBar
    ) { 
      super(restBackendService, snackBar); // si innesca il costruttore della classe padre
      this.resource = Array<Order>();

      this.scriptService.load('pdfMake', 'vfsFonts');
    }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('orders');     

  }


  openResourceDialog(formModal: string, order?: Order ) {

    this.restBackendService.getResource('customers').subscribe(
      (data) => {
        var customers: Customer[] = data;
        var customer: Customer = customers.find(x => x.idclienti === order.clienti_idclienti);

        this.restBackendService.getResourceQuery('measuresQuery','idclienti=' + String(order.clienti_idclienti)).subscribe(
          (data) => {          
            
            //INIZIO
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              customer: customer,
              order: order, 
              measure: data[0],
              formModal: formModal, 
            };

            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true; 
        
            const dialogRef = this.dialog.open(OrderFormComponent, dialogConfig);
        
            dialogRef.afterClosed().subscribe(result => {
      
              if (result) {      
                console.log('AGGIORNAMENTO ORDINE');
                console.log(result);

                var shirtsToAdd: Shirt[] = result.shirts;
                var updatedOrder: Order = result.order;                
                
                //CHIAMATA REST PER L'AGGIORNAMENTO DELL'ORDINE
                console.log('aggiorna');

                var data_consegna = new Date(updatedOrder.data_consegna);
                // INIZIO formattazione della data di consegna
                var giorno: number = data_consegna.getDate() ;
                var strGiorno: string;
                if ( giorno < 10 ) 
                  strGiorno = '0' + giorno.toFixed(0);
                else
                  strGiorno = giorno.toFixed(0);    

                var mese: number = data_consegna.getMonth() + 1 ;
                var strMese: string;
                if ( mese < 10 ) 
                  strMese = '0' + mese.toFixed(0);
                else
                  strMese = mese.toFixed(0);                

                var strDataConsegna = strGiorno + '/' +
                                      strMese + '/' +
                                      data_consegna.getFullYear().toFixed(0);

                if( updatedOrder.saldato )
                  var saldato = 'SI';
                else
                  var saldato = 'NO';

                if( updatedOrder.consegnato )
                  var consegnato = 'SI';
                else
                  var consegnato = 'NO';   
                // FINE formattazione della data di consegna

               this.putData('orders',                  
                {
                  "idordini": updatedOrder.idordini, 
                  "note": updatedOrder.note,
                  "acconto": updatedOrder.acconto,
                  "saldo": updatedOrder.saldo,
                  "totale": updatedOrder.totale,
                  "data_consegna": strDataConsegna,
                  "consegnato": consegnato,
                  "saldato": saldato,
                  "note_x_fasonista": updatedOrder.note_x_fasonista,
                  "mod_consegna": updatedOrder.mod_consegna,
                  "data_ordine": updatedOrder.data_ordine,
                  "clienti_idclienti": updatedOrder.clienti_idclienti,
                  "fasonatori_idfasonatori": updatedOrder.fasonatori_idfasonatori,
                  "id_misure_ordinate": updatedOrder.id_misure_ordinate
                });

                //AGGIORNAMENTO CAMICIE DELL'ORDINI
                // si eliminano prima tutte le camicie preesistenti
                // this.restBackendService.getResourceQuery('shirtsQuery', 'idordini=' + updatedOrder.idordini ).subscribe(
                //   (data) => {
    
                //     var shirtsToDelete: Shirt[] = data;            
                //     console.log('CAMICIE DA CANCELLARE');   
                //     console.log(shirtsToDelete);   
                    
                //     for (let index = 0; index < shirtsToDelete.length; index++) {
                //       const shirtToDelete = shirtsToDelete[index];

                //       this.restBackendService.delResource('shirts', {'idcamicie': shirtToDelete.idcamicie }).subscribe(
                //         (data) => {     
                             
                //         },
                //         (error) => {
                //           this.errorHttpErrorResponse = error;
                //           this.errorMessage = error.message;        
                //         });                           
                //     }                    
                //   },
                //   (error) => {},
                // );

                //si aggiungono le nuove camicie
                console.log('CAMICIE DA INSERIRE');   
                console.log(shirtsToAdd);   
                for (let index = 0; index < shirtsToAdd.length; index++) {                  
                  const shirtToAdd = shirtsToAdd[index];
                  console.log('INSERIMENTO CAMICIA ' + index);   
                  console.log(shirtToAdd);   
                  this.restBackendService.postResource('shirts',shirtToAdd).subscribe(
                    (data) => {},
                    (error) => {
                      console.error(error);
                      console.error('Message: ' + error.message);
                    },
                  );
                  
                }
              }

              }); //FINE
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

  // openViewOrder(){

  //   this.openView(false);

  // }

  // openViewOrderSubcontractor(){
     
  //   this.openView(true);

  // }

  openView(subcontractorView: boolean){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      view: subcontractorView, 
    };

    const dialogRef = this.dialog.open(OrderViewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog result: ${result}');
    });  
  }


  public openViewOrderByCustomerId(cliente: Customer){

    var shirt: Shirt;

    this.restBackendService.getResourceQuery('measuresQuery',
    'idclienti' + '=' + cliente.idclienti).subscribe(
        (data) => {
          var misureArray: Array<Measure> = data;
          if ( misureArray.length > 0 ) { // c'è almento una misura
              
          
          
                // this.generatePdf(misureArray[0], cliente, shirt);

          } else {

              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                messaggio: 'Il cliente non ha alcuna misura in archivio. \rStampa dell\'ordine annullata!!', 
                titolo: 'NOTA BENE', 
              };
          
              const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);
              dialogRef.afterClosed().subscribe(result => {
                // console.log(result);
              });             

          }

        },
        (error) => {
          this.errorHttpErrorResponse = error;
          this.errorMessage = error.message;  
      });        


  }

  // SEZIONE DEDICATA ALLE STAMPE

  generatePdfPrint(order: Order, key: string) {

    console.log(order);  
    console.log(key);  

    this.restBackendService.getResource('customers').subscribe(
      (data) => {
        var customers: Customer[] = data;
        var customer: Customer = customers.find(x => x.idclienti === order.clienti_idclienti);
        
        // console.log(customer);

        this.restBackendService.getResourceQuery('measuresQuery','idclienti=' + String(order.clienti_idclienti)).subscribe(
          (data) => {   
            
            var measure: Measure = data[0];            
            // console.log(measure);

            this.restBackendService.getResourceQuery('shirtsQuery', 'idordini=' + order.idordini ).subscribe(
              (data) => {

                var shirts: Shirt[] = data;            
                // console.log(shirts);    
                
                this.restBackendService.getResource('subcontractors').subscribe(
                  (data) => {

                      var subcontractors: Subcontractor[] = data;
                      var subcontractor: Subcontractor = subcontractors.find(x => x.idfasonatori === order.fasonatori_idfasonatori);


                      this.generatePdf(order, measure, customer, shirts, subcontractor, key);
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



  private generatePdf(order?: Order, measure?: Measure, customer?: Customer, shirts?: any[], subcontractor?: Subcontractor, type?: string){

    var obj: Array<any> = new Array();
    // obj = [['dettaglio camicia 1', ' '],
    //       ['dettaglio camicia 2', ' '],
    //       ['dettaglio camicia 3', ' ']];

    for (let index = 0; index < shirts.length; index++) {
      
      const element = shirts[index];

      var stringa :string = '';

      console.log(element.iniziali);

      if ( element.iniziali == 'SI' ) {
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
        
      } else if ( element.iniziali == 'NO' || element.iniziali == ''  ) {

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

      obj.push([stringa,' ']);
      
    }
    // ###############
    // var fasonatore: string;
    // //SI popola il combobox con l'elenco dei fasonatori
    // this.restBackendService.getResource('subcontractors').subscribe(
    //   (data) => {
    //     console.log(data);
            
            
    //         var result = data.map(a => a.nome + ' - ( tel: ' + a.telefono  + ' )');
    //         fasonatore = result;   

    //         },
    //   (error) => {
    //       console.error(error);
    //       console.error('Message: ' + error.message);
    //   }
    // );

    // ################
   

    var refSize:number = 14;

    if ( order.note == '' )
      var noteCliente: string = 'nessuna';
    else  
      var noteCliente: string = order.note;

    if ( order.note_x_fasonista == '' )
      var noteFasonista: string = 'nessuna';
    else  
      var noteFasonista: string = order.note_x_fasonista;      

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
                text: 'Collo: '        + measure.collo + '\n' +
                      'Spalla: '       + measure.spalla + '\n' +
                      'Lun. Manica: '  + measure.lung_bicipite + '\n' +
                      'Bicipite Tot x Braccio: '     + measure.bicipite + '\n' +
                      'Avamb Tot x Braccio: '  + measure.avambraccio + '\n' ,
                style: 'name'
              },
              {
                text: 'Lun Camicia: '           + measure.lung_camicia + '\n' +
                      'Centro Schiena: '     + measure.lung_avambraccio + '\n' +
                      'Vita Dietro: '      + measure.vita_dietro + '\n' +
                      'Bacino Dietro: ' + measure.bacino_dietro + '\n' +
                      'Polso: '    + measure.polso + '\n',
                style: 'name'
              },
              {
                text: 'TORACE AVANTI' + '\n' +
                      '1° Bottone: '     + measure.torace.split(';')[0] + '\n' +
                      '2° Bottone: '     + measure.torace.split(';')[1] + '\n' +
                      '3° Bottone: '     + measure.torace.split(';')[2] + '\n',
                style: 'name'
              },
              {
                text: '4° Bottone: '     + measure.torace.split(';')[3] + '\n' +
                      '5° Bottone: '     + measure.torace.split(';')[4] + '\n' +
                      '6° Bottone: '     + measure.torace.split(';')[5] + '\n' +
                      '7° Bottone: '     + measure.torace.split(';')[6] + '\n' +
                      '8° Bottone: '     + measure.torace.split(';')[7] + '\n',
                style: 'name'
              }                                        
            ]
          },
          '\n',
          {
            image: 'data:image/png;base64,' + measure.note_grafiche,
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
          // 'Note per il fasonista',
          // {
          //   style: 'name',
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
          'Note per il cliente: ' ,
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
                text: 'Collo: '        + measure.collo + '\n' +
                      'Spalla: '       + measure.spalla + '\n' +
                      'Lun. Manica: '  + measure.lung_bicipite + '\n' +
                      'Bicipite Tot x Braccio: '     + measure.bicipite + '\n' +
                      'Avamb Tot x Braccio: '  + measure.avambraccio + '\n' ,
                style: 'name'
              },
              {
                text: 'Lun Camicia: '           + measure.lung_camicia + '\n' +
                      'Centro Schiena: '     + measure.lung_avambraccio + '\n' +
                      'Vita Dietro: '      + measure.vita_dietro + '\n' +
                      'Bacino Dietro: ' + measure.bacino_dietro + '\n' +
                      'Polso: '    + measure.polso + '\n',
                style: 'name'
              },
              {
                text: 'TORACE AVANTI' + '\n' +
                      '1° Bottone: '     + measure.torace.split(';')[0] + '\n' +
                      '2° Bottone: '     + measure.torace.split(';')[1] + '\n' +
                      '3° Bottone: '     + measure.torace.split(';')[2] + '\n',
                style: 'name'
              },
              {
                text: '4° Bottone: '     + measure.torace.split(';')[3] + '\n' +
                      '5° Bottone: '     + measure.torace.split(';')[4] + '\n' +
                      '6° Bottone: '     + measure.torace.split(';')[5] + '\n' +
                      '7° Bottone: '     + measure.torace.split(';')[6] + '\n' +
                      '8° Bottone: '     + measure.torace.split(';')[7] + '\n',
                style: 'name'
              }                                        
            ]
          },
          '\n',
          {
            image: 'data:image/png;base64,' + measure.note_grafiche,
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
          'Note per il fasonista',
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
          // 'Note per il cliente: ' ,
          // {
          //   style: 'name',
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


 //OVERRIDE 
 public recorSetCustomer: Array<any> = [];
 public getRemoteData(tagResourse: string):any {

   //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
   this.restBackendService.getResource(tagResourse).subscribe(
     (data) => {

           //SI FILTRANO SOLO GLI ORDINI NON CONSEGNATI
           this.resource = data;
           // ###################################################
           var recorSet: Array<any> = [];
           recorSet = data;
           
           this.restBackendService.getResource('customers').subscribe(
             (data) => {
                   // console.log(data);
                   this.recorSetCustomer = data;   
                   
                   for(let i = 0; i < recorSet.length; i++) {
           
                     recorSet[i].data_consegna = recorSet[i].data_consegna.split(' ')[0];  //formattazione data consegna
                     recorSet[i].data_ordine = recorSet[i].data_ordine.split(' ')[0];      //formattazione data ordine
       
                     var idClienti: number = recorSet[i].idCliente;
                     var nomeCliente = this.recorSetCustomer.find(x => x.idClienti === idClienti).nominativo + 
                     ' ( ' + this.recorSetCustomer.find(x => x.idClienti === idClienti).telefono + ' )';
                     recorSet[i].nome_cliente = nomeCliente;
                     // console.log(nomeCliente);
       
                   }            
       
                   // ###################################################
                   this.resource = recorSet;
                   this.dataSource = new MatTableDataSource(this.resource);                           
                   this.dataSource.paginator = this.paginatorTable;    
                   this.dataSource.sort = this.sortTable;                      
                   
                   },
             (error) => {
                 console.error(error);
                 console.error('Message: ' + error.message);
             }
           );
           
          },
     (error) => {

        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;

     }
   );
 
  } 
  
  
  public openDeleteDialog(order: Order){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titolo: 'ATTENZIONE!', 
      messaggio: 'Eliminare l\'ordine n° ' + order.idordini + ' dall\'archivio degli ordini?',
    };

    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true; 

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delData('orders',        
          {
            "idordini": order.idordini
          }
        );

      }
      
    });     

  }
 

}
