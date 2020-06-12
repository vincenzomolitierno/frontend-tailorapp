import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { CuFormComponent as CustomerFormComponent } from '../cu-form/cu-form.component';
import { CuFormComponent as TakeMeasureFormComponent } from '../../measure/cu-form/cu-form.component';
import { OrderFormComponent } from 'src/app/orders/order-form/order-form.component';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';


interface ClientElement {  
  idclienti: number,
  nominativo: string,
  telefono: number,
  // email: string,
  // cf: string,
  // partita_iva: string,
  // indirizzo: string,
  // int_fattura: string,
  note: string
}

@Component({
  selector: 'app-customer-grid',
  templateUrl: './customer-grid.component.html',
  styleUrls: ['./customer-grid.component.css']
})
export class CustomerGridComponent implements OnInit {

  // Dati coinvolti nel binding
  viewDetails: boolean = false;
  customerNameFocused: string = "";
  dummy_data: string = "X,Y"
  testo_ricerca: string = "";

  // Stringhe di messaggio per il debug
  errorMessage: string;     //Stringa di errore
  errorHttpErrorResponse: HttpErrorResponse;

  // Colonne visualizzate in tabella
  displayedColumns: string[] = ['nominativo', 'telefono', 'note', 'update', 'delete', 'measure', 'view_orders', 'new_order'];
  // displayedColumns: string[] = ['nominativo', 'telefono', 'email', 'cf', 'partita_iva', 'indirizzo', 'int_fattura', 'note'];
  dataSourceClient;

  @ViewChild('table', { read: MatSort, static: true }) sortClient: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorClient: MatPaginator;

  constructor( 
    private restBackendService: RESTBackendService,
    public dialog: MatDialog) {

    }

  ngOnInit() {

    this.getResource();
 
  }

   /**
   * Metodo per ottenere l'elenco del personale dal backend REST
   */
  resource: Array<ClientElement> = [];   //Elenco delle persone recuperate dal backend

  getResource() {

    //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getCustomers().subscribe(
      (data) => {
        this.resource = data; 
        console.log(data);              
        // Si carica la tabella con i clienti
        this.dataSourceClient = new MatTableDataSource(this.resource);   
        // Si associano ordinamento e paginatore
        this.dataSourceClient.sort = this.sortClient;
        this.dataSourceClient.paginator = this.paginatorClient;

            },
      (error) => {

        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;

        // Si associano ordinamento e paginatore
        this.resource = [
          {
            idclienti: 1,
            nominativo: 'Vincenzo Molitierno',
            telefono: 3258879574,
            note: 'nota'
        },
        {
          idclienti: 2,
          nominativo: 'Nazaro Aversano',
          telefono: 3258879000,
          note: 'nota del cliente'
      }      ];

        this.dataSourceClient = new MatTableDataSource(this.resource);   
        this.dataSourceClient.sort = this.sortClient;
        this.dataSourceClient.paginator = this.paginatorClient;

      }
    );
    


  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceClient.filter = filterValue.trim().toLowerCase();
    this.viewDetails = false;
    this.customerNameFocused = "";    
  }  

  openDetails(inpunString: string){
    this.testo_ricerca = inpunString;
    const filterValue = inpunString;
    this.customerNameFocused = inpunString;
    this.dataSourceClient.filter = filterValue.trim().toLowerCase()    
    this.viewDetails = true;
  }

  clearSearch(){
    this.dataSourceClient.filter = "";
    this.testo_ricerca = "";
    this.viewDetails = false;
    this.customerNameFocused = "";
  }

  openCustomerDialog(formModal: string, name: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {idCustomer: "vincenzo", formModal: formModal, nominativo: name };

    const dialogRef = this.dialog.open(CustomerFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }    

  openTakeMeasureDialog(formModal: string, name: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idCustomer: "vincenzo", 
      formModal: formModal, 
      nominativo: name ,
      base64: ''
    };

    const dialogRef = this.dialog.open(TakeMeasureFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }

  openOrderDialog(formModal: string, idOrdine: string){

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

}
