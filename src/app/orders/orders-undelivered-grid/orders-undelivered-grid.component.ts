import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderViewComponent } from '../order-view/order-view.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';

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
     'clienti_idclienti', 
     'data_consegna',
     'mod_consegna',
     'totale',   
     'consegnato',
     'saldato',  
     'view', 'confirm',
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

  //OVERRIDE
  // private restBackendService: RESTBackendService;
  
  public getRemoteData(tagResourse: string):any {
    //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResource(tagResourse).subscribe(
      (data) => {

            //SI FILTRANO SOLO GLI ORDINI NON CONSEGNATI
            this.resource = data;
            console.log(this.resource);
            console.log(this.resource.filter(ordine => ordine.consegnato === 'NO'));
            this.dataSource = new MatTableDataSource(this.resource.filter(ordine => ordine.consegnato === 'NO'));   
                        
            this.dataSource.paginator = this.paginatorTable;    
            this.dataSource.sort = this.sortTable;            

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

  openViewOrder(){

    this.openView(false);

  }

  openView(subcontractorView: boolean){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      view: subcontractorView, 
    };

    const dialogRef = this.dialog.open(OrderViewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });  
  }

  confirm(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Contrassegnare ordine come consegnato?', 
    };

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:' + result);

      switch (result) {
        case true: //dialog OK
          
          break;
      
      case false: //dialog NOT OK
          break;

      default: //dialog escape
          break;
      }

    });    
       
  }

}
