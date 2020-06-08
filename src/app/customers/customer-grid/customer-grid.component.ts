import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RESTBackendService } from '../service/rest-backend.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { CuFormComponent as CustomerFormComponent } from '../cu-form/cu-form.component';
import { CuFormComponent as TakeMeasureFormComponent } from '../../measure/cu-form/cu-form.component';
import { OrderFormComponent } from 'src/app/orders/order-form/order-form.component';


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
    public dialog: MatDialog) { }

  ngOnInit() {

    this.getRemoteData();
    this.dataSourceClient.sort = this.sortClient;
    this.dataSourceClient.paginator = this.paginatorClient;

    // Overrride default filter behaviour of Material Datatable
    // this.dataSourceClient.filterPredicate = this.createFilter();    
  }

  // Get remote serve data using HTTP call
  getRemoteData() {
  
    const CLIENTS_DATA: ClientElement[] = [
      {
        idclienti: 1,
        nominativo: 'Aversano Nazaro',
        telefono: 3395656854,
        // email: 'Aversano@Nazaro.it',
        // cf: 'CODICEFISCALE',
        // partita_iva: '01982233',
        // indirizzo: 'Via con i Baffi 9',
        // int_fattura: 'Fattura ....',
        note: 'note 1'    
      },
      {
        idclienti: 2,
        nominativo: 'Vincenzo Molitierno',
        telefono: 3287474598,
        // email: 'vincenzomolitierno@idealprogetti.it',
        // cf: 'CODICEFISCALE',
        // partita_iva: '36563299',
        // indirizzo: 'Via Masaniello 18',
        // int_fattura: 'Fattura ....',
        note: 'note 2'    
      },
      {
        idclienti: 3,
        nominativo: 'Carlo Magno',
        telefono: 3208654896,
        // email: 'carlo@magno.it',
        // cf: 'CODICEFISCALE',
        // partita_iva: '36563299',
        // indirizzo: 'Via Masaniello 18',
        // int_fattura: 'Fattura ....',
        note: 'note 3'    
      }
    ];

    this.dataSourceClient = new MatTableDataSource(CLIENTS_DATA);  


    //##############################

    //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getClienti().subscribe(
      (data) => {
        this.dataSourceClient = new MatTableDataSource(data);        
            },
      (error) => {
        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;
      },
    );

    //################################
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
    dialogConfig.data = {idCustomer: "vincenzo", formModal: formModal, nominativo: name };

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
