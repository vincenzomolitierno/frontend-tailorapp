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
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { Customer } from '../data.model';

@Component({
  selector: 'app-customer-grid',
  templateUrl: './customer-grid.component.html',
  styleUrls: ['./customer-grid.component.css']
})
export class CustomerGridComponent extends GridModel implements OnInit {

  // Dati coinvolti nel binding
  viewDetails: boolean = false;
  customerNameFocused: string = "";
  dummy_data: string = "X,Y"

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    'nominativo', 
    'telefono', 
    'note', 
    'update', 
    'delete', 
    'measure', 
    'view_orders', 
    'new_order'];

    constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog
    ) { 
      super(restBackendService); // si innesca il costruttore della classe padre
      this.resource = Array<Customer>();
    }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('customers');   

  }
 
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   this.viewDetails = false;
  //   this.customerNameFocused = "";    
  // }  



  // clearSearch(){
  //   this.dataSource.filter = "";
  //   this.testo_ricerca = "";
  //   this.viewDetails = false;
  //   this.customerNameFocused = "";
  // }

  openResourceDialog(formModal: string, name: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {idCustomer: "vincenzo", formModal: formModal, nominativo: name };

    const dialogRef = this.dialog.open(CustomerFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }    

  openDetails(inpunString: string){
    this.testo_ricerca = inpunString;
    const filterValue = inpunString;
    this.customerNameFocused = inpunString;
    this.dataSource.filter = filterValue.trim().toLowerCase()    
    this.viewDetails = true;
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
