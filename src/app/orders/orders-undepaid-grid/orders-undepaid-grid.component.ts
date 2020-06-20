import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderViewComponent } from '../order-view/order-view.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { OrderConfirmComponent } from '../order-confirm/order-confirm.component';


@Component({
  selector: 'app-orders-undepaid-grid',
  templateUrl: './orders-undepaid-grid.component.html',
  styleUrls: ['./orders-undepaid-grid.component.css']
})
export class OrdersUndepaidGridComponent extends GridModel implements OnInit {

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
    'consegnato',
    'saldato',  
    'menu_button', //aggiunti
   //  'view', 'confirm',
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
  public getRemoteData(tagResourse: string):any {

    this.getCustomers();

    //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResource(tagResourse).subscribe(
      (data) => {

            //SI FILTRANO SOLO GLI ORDINI NON CONSEGNATI
            this.resource = data;
            this.resource = this.resource.filter(ordine => ordine.saldato === 'NO');
            // ###################################################
            var recorSet: Array<any> = [];
            recorSet = data;

            console.log(recorSet);

            for(let i = 0; i < recorSet.length; i++) {
              
              recorSet[i].data_consegna = recorSet[i].data_consegna.split(' ')[0];  //formattazione data consegna
              recorSet[i].data_ordine = recorSet[i].data_ordine.split(' ')[0];      //formattazione data ordine

              var idClienti: number = recorSet[i].idCliente;
              var nomeCliente = this.recorSetCustomer.find(x => x.idClienti === idClienti).nominativo + 
              ' ( ' + this.recorSetCustomer.find(x => x.idClienti === idClienti).telefono + ' )';
              recorSet[i].nome_cliente = nomeCliente;
              console.log(nomeCliente);

            }            

            // ###################################################
            this.resource = recorSet;
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
      // console.log('Dialog result: ${result}');
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
      // console.log('Dialog result: ${result}');
    });  
  }

  confirmPaymentOrder(idOrdine: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Contrassegnare l\'ordine come saldato?', 
      idOrdine: idOrdine
    };

    const dialogRef = this.dialog.open(OrderConfirmComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        // si invia la chiamata REST
        console.log(result);
        // /OrdiniValues/?idordini=102&operazione=C&negato=false

        this.restBackendService.putResource('ordersvalues',
            {
              // idordini=102&operazione=C&negato=false
            }).subscribe(
            (data) => {
                  console.log(data);
                              
                  },
            (error) => {
                console.error(error);
                console.error('Message: ' + error.message);
            }
          );
        //###################
      }

    });    
       
  }

}
