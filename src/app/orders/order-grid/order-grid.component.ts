import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
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
      public dialog: MatDialog
    ) { 
      super(restBackendService); // si innesca il costruttore della classe padre
      this.resource = Array<Order>();
    }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('orders');     

  }


  openResourceDialog(formModal: string, order: Order ) {

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
        
            const dialogRef = this.dialog.open(OrderFormComponent, dialogConfig);
        
            dialogRef.afterClosed().subscribe(result => {
      
              if (result) {
                var updatedOrder: Order = result;
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

                if( result.saldato )
                  var saldato = 'SI';
                else
                  var saldato = 'NO';

                if( result.consegnato )
                  var consegnato = 'SI';
                else
                  var consegnato = 'NO';   
                // FINE formattazione della data di consegna
                console.log({
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

                // console.log(               {
                //   "idordini": result.idordini, 
                //   "note": result.note,
                //   "acconto": result.acconto,
                //   "saldo": result.saldo,
                //   "totale": result.totale,
                //   "data_consegna": strDataConsegna,
                //   "consegnato": consegnato,
                //   "saldato": saldato,
                //   "note_x_fasonista": result.note_x_fasonista,
                //   "mod_consegna": result.mod_consegna,
                //   "data_ordine": result.data_ordine,
                //   "clienti_idclienti": result.clienti_idclienti,
                //   "fasonatori_idfasonatori": result.fasonatori_idfasonatori,
                //   "id_misure_ordinate": result.id_misure_ordinate
                // });

                this.putData('orders',                  
                {
                  "idordini": result.idordini, 
                  "note": result.note,
                  "acconto": result.acconto,
                  "saldo": result.saldo,
                  "totale": result.totale,
                  "data_consegna": strDataConsegna,
                  "consegnato": result.consegnato,
                  "saldato": result.saldato,
                  "note_x_fasonista": result.note_x_fasonista,
                  "mod_consegna": result.mod_consegna,
                  "data_ordine": result.data_ordine,
                  "clienti_idclienti": result.clienti_idclienti,
                  "fasonatori_idfasonatori": result.fasonatori_idfasonatori,
                  "id_misure_ordinate": result.id_misure_ordinate
                });
             
              }


              }); //FINE

          },
          (error) => {}
        );
      },
      (error) => {}
    );

       
    
  }  

  openViewOrder(){

    this.openView(false);

  }

  openViewOrderSubcontractor(){
     
    this.openView(true);

  }

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
              
          
          
                this.generatePdf(misureArray[0], cliente, shirt);

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
          console.error(error);
          console.error('Message: ' + error.message);
      });        


  }

  private generatePdf(measure: Measure, customer: Customer, shirts: Shirt){

    var obj: Object;
    obj = [['dettaglio camicia 1', ' '],
          ['dettaglio camicia 2', ' '],
          ['dettaglio camicia 3', ' ']];
   

    var refSize:number = 14;

     const documentDefinition = {
       
        content: [
          {
            text: 'STAMPA ORDINE',
            style: 'header'
          } ,
          {
            columns: [
              {
                text: 'Committente: ' + 'nome e cognome',
                style: 'subheader'
              },
              {
                text: 'Misurometro:' + 'misurmetro scelto',
                style: 'subheader'
              }
            ]
          },  
          {
            columns: [
              {
                text: 'Collo: '        + 'dummy' + '\n' +
                      'Spalla: '       + 'dummy' + '\n' +
                      'Lun. Manica: '  + 'dummy' + '\n' +
                      'Bicipite: '     + 'dummy' + '\n' +
                      'Vita Dietro: '  + 'dummy' + '\n' ,
                style: 'name'
              },
              {
                text: 'Polso: '           + 'dummy' + '\n' +
                      'Lun. Camicia: '     + 'dummy' + '\n' +
                      'Avambraccio: '      + 'dummy' + '\n' +
                      'Lun. Avambraccio: ' + 'dummy' + '\n' +
                      'Bacino Dietro: '    + 'dummy' + '\n',
                style: 'name'
              },
              {
                text: 'TORACE AVANTI' + '\n' +
                      '1° Bottone: '     + 'dummy' + '\n' +
                      '2° Bottone: '     + 'dummy' + '\n' +
                      '3° Bottone: '     + 'dummy' + '\n',
                style: 'name'
              },
              {
                text: '4° Bottone: '     + 'dummy' + '\n' +
                      '5° Bottone: '     + 'dummy' + '\n' +
                      '6° Bottone: '     + 'dummy' + '\n' +
                      '7° Bottone: '     + 'dummy' + '\n' +
                      '8° Bottone: '     + 'dummy' + '\n',
                style: 'name'
              }                                        
            ]
          },
          '\n',
          {
            image: Base64Utility.base64ShirtEmpty,
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
            table: {
              heights: 50,
              widths: ['*', 150],
              body: obj
            }
          },                                       
          {
            text: 'Fasonista ' + 'nome fasonista',
            style: 'subheader',
            alignment: 'left',
          },
          'Note del fasonista',
          {
            style: 'name',
            table: {
              widths: ['*'],
              body: [
                [' '],
              ]
            }
          },          
          {
            columns: [
              {
                text: 'Data consegna: ' + 'gg/mm/aaaa',
                style: 'subheader',
                alignment: 'left'
              },
              {
                text: 'Modalità consegna:' + 'modalità consegna',
                style: 'subheader',
                alignment: 'left'
              }
            ]
          },  
          'Note per il cliente',
          {
            style: 'name',
            table: {
              widths: ['*'],
              body: [
                [' '],
              ]
            }
          },
          {
            columns: [
              {
                text: 'Totale: ' + '##,## €' + '\n'
                    + 'Acconto: ' + '##,## €' + '\n'
                    + 'Saldo: ' + '##,## €' + '\n',
                style: 'subheader'
              },
              {
                text: 'Saldato' + 'SI/NO',
                style: 'subheader'
              }
            ]
          }          
        ],       
        info: {
          title: 'STAMPA ORDINE',
          author: 'idealprogetti.com',
          subject: 'Riepilogo Lavorazioni',
          keywords: 'RESUME, ONLINE RESUME',          
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

     pdfMake.createPdf(documentDefinition).download();
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
