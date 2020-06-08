import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { OrderFormComponent } from '../order-form/order-form.component';
import { OrderViewComponent } from '../order-view/order-view.component';

interface OrderElement {  
  idordini: number,
  note: string,
  acconto: string,
  saldo: string,
  totale: string,
  consegnato: string,
  saldato: string,
  note_x_fasonista: string,
  mod_consegna: string,
  data_ordine: string,
  data_consegna: string,
  clienti_idclienti: string,
  fasonatori_idfasonatori: number,
  id_misure_ordinate: number
}

@Component({
  selector: 'app-order-grid',
  templateUrl: './order-grid.component.html',
  styleUrls: ['./order-grid.component.css']
})
export class OrderGridComponent implements OnInit {

  // Dati coinvolti nel binding
  orderTagFocused: string = "";
  dummy_data: string = "X,Y"
  testo_ricerca: string = ""; 
  
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
     'update', 'delete', 'view_orders', 'view_orders_subcontractor',
    ];
   dataSourceOrder;
 
   @ViewChild('table', { read: MatSort, static: true }) sortOrder: MatSort;
   @ViewChild(MatPaginator, {static: true}) paginatorOrder: MatPaginator;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getRemoteData();
    this.dataSourceOrder.sort = this.sortOrder;
    this.dataSourceOrder.paginator = this.paginatorOrder;    
  }

  // Get remote serve data using HTTP call
  getRemoteData() {
    
    const ORDERS_DATA: OrderElement[] = [
      {
        idordini: 1,
        note: 'nota',
        acconto: '€ 100',
        saldo: '€250',
        totale: '€350',
        consegnato: 'SI',
        saldato: 'NO',
        note_x_fasonista: 'nota fasonista',
        mod_consegna: 'consegna a mano',
        data_ordine: '10/05/2020',
        data_consegna: '30/05/2020',
        clienti_idclienti: "Carlo Magno",
        fasonatori_idfasonatori: 1,
        id_misure_ordinate: 1   
      }
    ];

    this.dataSourceOrder = new MatTableDataSource(ORDERS_DATA);  
  }  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceOrder.filter = filterValue.trim().toLowerCase();
    this.orderTagFocused = "";    
  }  

  clearSearch(){
    this.dataSourceOrder.filter = "";
    this.testo_ricerca = "";
    this.orderTagFocused = "";
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
      console.log('Dialog result: ${result}');
    });  
  }

 

}
