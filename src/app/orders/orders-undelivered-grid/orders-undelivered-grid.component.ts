import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatSnackBar } from '@angular/material';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderViewComponent } from '../order-view/order-view.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { OrderConfirmComponent } from '../order-confirm/order-confirm.component';
import { PdfPrinterService } from 'src/app/utilities/pdf-printer.service';
import { Customer } from 'src/app/customers/data.model';

@Component({
  selector: 'app-orders-undelivered-grid',
  templateUrl: './orders-undelivered-grid.component.html',
  styleUrls: ['./orders-undelivered-grid.component.css']
})
export class OrdersUndeliveredGridComponent extends GridModel implements OnInit {

  // Dati coinvolti nel binding
  orderTagFocused: string = "";
  dummy_data: string = "X,Y"
  
   // Colonne visualizzate in tabella
   displayedColumns: string[] = [
     'idordini', 
     'data_ordine', 
    //  'clienti_idclienti', 
     'nome_cliente',
     'data_consegna',
     'mod_consegna',
     'totale',   
    //  'consegnato',
    //  'saldato',  
     'menu_button', //aggiunti
    //  'view', 'confirm',
    ];
   
    constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog,
      snackBar: MatSnackBar
    ) { 
      super(restBackendService, snackBar); // si innesca il costruttore della classe padre
      this.resource = Array<Order>();
    }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('ordersValues');    
     

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
     //  recorSetOrders = data;
      for (let index = 0; index < this.resource.length; index++) {
       recorSetOrders.push( this.resource[index].ordine );             
      }
      //SI FILTRANO SOLO GLI ORDINI NON CONSEGNATI
      recorSetOrders = recorSetOrders.filter(ordine => ordine.consegnato === 'NO');        
      // console.log('ordini esistenti',recorSetOrders);
      
      this.restBackendService.getResource('customers').subscribe(
        (data) => {

              this.recorSetCustomer = data;                    
              console.log('clienti',this.recorSetCustomer);

              for(let i = 0; i < recorSetOrders.length; i++) {
      
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
    
  
  openResourceDialog(formModal: string, idOrdine: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idordini: idOrdine, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(OrderFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }  

  generatePdfPrint(order: Order, key: string){

    PdfPrinterService.generatePdfPrint(order, key, this.restBackendService);

  }


  confirmDeliveryOrder(idOrdine: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Contrassegnare l\'ordine come consegnato?',
      idOrdine: idOrdine
    };
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(OrderConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        // si invia la chiamata REST
        this.restBackendService.putResourceParams('ordersValues','/?idordini=' + idOrdine + '&operazione=C&negato=false').subscribe(
          (data) => {
                console.log('consegnato');

                this.getRemoteData('ordersValues'); 
                            
                },
          (error) => {
              // aggiornamento della tabella gestito nel ramo error per via della scorretta parserizzazione 
              // della risposta del put
              // console.error(error);
              // console.error('Message: ' + error.message);
              this.getRemoteData('ordersValues'); 
          }
        );

      }

    });    
       
  }

}
