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
import { PdfPrinterService } from 'src/app/utilities/pdf-printer.service';

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
    this.getRemoteData('ordersValues');     

  }


  openResourceDialog(formModal: string, order?: Order ) {

    this.restBackendService.getResource('customers').subscribe(
      (data) => {
        var customers: Customer[] = data;
        var customer: Customer = customers.find(x => x.idclienti === order.clienti_idclienti);

        
          this.restBackendService.getResourceQuery('measuresQuery','idmisure=' + String(order.id_misure_ordinate)).subscribe(
          (data) => {    
            
            var measureInOrder: Measure = data[0]; // indica le misure del cliente associate all'ordine al momento della sua creazione

            // this.restBackendService.getResourceQuery('measuresQuery','idclienti=' + String(order.clienti_idclienti)).subscribe(
              this.restBackendService.getResource('measures').subscribe(
              (data) => {

                var measureByCustomer: Measure[] = data; // indica l'ultima misura fatta al cliente, potrebbe essere più recente di quella utilizzata nell'ordine
                console.log('misure esistenti',measureByCustomer);
                measureByCustomer = measureByCustomer.filter(m => m.clienti_idclienti == order.clienti_idclienti);
                console.log('misure filtrate per il cliente ' + order.clienti_idclienti, measureByCustomer);

                //INIZIO FORM ORDINE
                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                  customer: customer,
                  order: order, 
                  orderMeasure: measureInOrder,  // misura utilizzata al momento della creazione dell'ordine
                  latestMeasure: measureByCustomer[measureByCustomer.length-1], // ultima misura possibile del cliente, potrebbe anche essere successiva a quella con cui è fatto l'ordine
                  formModal: formModal, 
                };

                dialogConfig.autoFocus = true;
                dialogConfig.disableClose = true; 
            
                const dialogRef = this.dialog.open(OrderFormComponent, dialogConfig);
            
                dialogRef.afterClosed().subscribe(result => {
                    // si ha l'aggiornamento dell'ordine
                    if (result) {      
                      console.log('AGGIORNAMENTO ORDINE');

                      var shirtsToAdd: Shirt[] = result.shirts;
                      var updatedOrder: Order = result.order;                

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
                    // FINE formattazione della data di consegna

                      if( updatedOrder.saldato )
                        var saldato = 'SI';
                      else
                        var saldato = 'NO';

                      if( updatedOrder.consegnato )
                        var consegnato = 'SI';
                      else
                        var consegnato = 'NO';   

                        this.restBackendService.putResource('orders', {
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
                        }).subscribe(
                          (data)=>{
                            this.getRemoteData('ordersValues');   

                            this.openSnackBar('Ordine aggiornato con successo', 1500);

                          },
                        );

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

                      // //si aggiungono le nuove camicie
                      // console.log('CAMICIE DA INSERIRE');   
                      // console.log(shirtsToAdd);  
                      // if ( shirtsToAdd ) {
                      //   for (let index = 0; index < shirtsToAdd.length; index++) {                  
                      //     const shirtToAdd = shirtsToAdd[index];
                      //     console.log('INSERIMENTO CAMICIA ' + index);   
                      //     console.log(shirtToAdd);   
                      //     this.restBackendService.postResource('shirts',shirtToAdd).subscribe(
                      //       (data) => {},
                      //       (error) => {
                      //         console.error(error);
                      //         console.error('Message: ' + error.message);
                      //       },
                      //     );
                          
                      //   }
                      // }
                    }

                  }); //FINE FORM ORDINE
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

  // openView(subcontractorView: boolean){

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.data = {
  //     view: subcontractorView, 
  //   };

  //   const dialogRef = this.dialog.open(OrderViewComponent, dialogConfig);

  //   dialogRef.afterClosed().subscribe(result => {
  //     // console.log('Dialog result: ${result}');
  //   });  
  // }


  // public openViewOrderByCustomerId(cliente: Customer){

  //   var shirt: Shirt;

  //   this.restBackendService.getResourceQuery('measuresQuery',
  //   'idclienti' + '=' + cliente.idclienti).subscribe(
  //       (data) => {
  //         var misureArray: Array<Measure> = data;
  //         if ( misureArray.length > 0 ) { // c'è almento una misura
              
          
          
  //               // this.generatePdf(misureArray[0], cliente, shirt);

  //         } else {

  //             const dialogConfig = new MatDialogConfig();
  //             dialogConfig.data = {
  //               messaggio: 'Il cliente non ha alcuna misura in archivio. \rStampa dell\'ordine annullata!!', 
  //               titolo: 'NOTA BENE', 
  //             };
          
  //             const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);
  //             dialogRef.afterClosed().subscribe(result => {
  //               // console.log(result);
  //             });             

  //         }

  //       },
  //       (error) => {
  //         this.errorHttpErrorResponse = error;
  //         this.errorMessage = error.message;  
  //     });        


  // }

  // SEZIONE DEDICATA ALLE STAMPE

  generatePdfPrint(order: Order, key: string) {

    // console.log(order);  
    // console.log(key);  

    this.restBackendService.getResource('customers').subscribe(
      (data) => {
        var customers: Customer[] = data;
        var customer: Customer = customers.find(x => x.idclienti === order.clienti_idclienti);
        
        // console.log(customer);

        this.restBackendService.getResourceQuery('measuresQuery','idmisure=' + String(order.id_misure_ordinate)).subscribe(
          (data) => {   
            
            var measure: Measure = data[0];                       

            this.restBackendService.getResourceQuery('shirtsQuery', 'idordini=' + order.idordini ).subscribe(
              (data) => {

                var shirts: Shirt[] = data;            
                // console.log(shirts);    
                
                this.restBackendService.getResource('subcontractors').subscribe(
                  (data) => {

                      var subcontractors: Subcontractor[] = data;
                      var subcontractor: Subcontractor = subcontractors.find(x => x.idfasonatori === order.fasonatori_idfasonatori);

                      console.log('vincenzo');
                      console.log(measure);

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

  stampaModelloVuoto(){

    PdfPrinterService.generateEmptyOrderSheetPdf();

  }

 //OVERRIDE 
 public recorSetCustomer: Array<Customer> = [];
 public getRemoteData(tagResourse: string):any {

   //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
   this.restBackendService.getResource(tagResourse).subscribe(
     (data) => {

           this.resource = data;
           console.log('ordini esistenti',this.resource);
           console.log('numero ordini esistenti',this.resource.length);
           // ###################################################
           var recorSetOrders: Array<Order> = new Array<Order>();
           for (let index = 0; index < this.resource.length; index++) {
            recorSetOrders.push( this.resource[index].ordine );             
           }
           console.log('ordini esistenti',recorSetOrders);
           
           this.restBackendService.getResource('customers').subscribe(
             (data) => {

                   this.recorSetCustomer = data;                    
                   console.log('clienti',this.recorSetCustomer);

                   for(let i = 0; i < recorSetOrders.length; i++) {

                    console.log('ordine '+i,recorSetOrders[i]);
           
                    recorSetOrders[i].data_consegna = recorSetOrders[i].data_consegna.split(' ')[0];  //formattazione data consegna
                    recorSetOrders[i].data_ordine = recorSetOrders[i].data_ordine.split(' ')[0];      //formattazione data ordine
       
                     var idClienti: number = recorSetOrders[i].clienti_idclienti;
                     console.log('idClienti', idClienti);
                     
                    var nomeCliente: string;

                    var nomeCliente = this.recorSetCustomer.find(x => x.idclienti === idClienti).nominativo + 
                     ' ( ' + this.recorSetCustomer.find(x => x.idclienti === idClienti).telefono + ' )';
                    
                     recorSetOrders[i].nome_cliente = nomeCliente;                     
                    console.log(recorSetOrders[i]);
       
                   }            
       
                   // ###################################################
                   recorSetOrders.sort((a, b) => (a.idordini < b.idordini) ? 1 : -1);
                   this.resource = recorSetOrders;
                   //ordinamento in base a id decrescente
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
        this.restBackendService.delResource('orders',{
          "idordini": order.idordini
        }).subscribe(
          (data) => {
            this.getRemoteData('ordersValues');
          },
          (error) => {
            this.errorHttpErrorResponse = error;
            this.errorMessage = error.message;
          }
        );

      }
      
    });     

  }
 

}
