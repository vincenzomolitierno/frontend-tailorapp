import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { SubcontractorFormComponent } from '../subcontractor-form/subcontractor-form.component';
import { Subcontractor } from '../subcontractor.model';

@Component({
  selector: 'app-subcontractors-grid',
  templateUrl: './subcontractors-grid.component.html',
  styleUrls: ['./subcontractors-grid.component.css']
})
export class SubcontractorsGridComponent implements OnInit {

  tag_grid: string = 'fasonisti';
  
  testo_ricerca: string = "";
  
    // Colonne visualizzate in tabella
    displayedColumns: string[] = [
      // 'idcamicie',
      'nominativo',
      'telefono',
      'email',
      'update',
      'delete'
    ];
    dataSourceSubcontractor;  
  
    @ViewChild('table', { read: MatSort, static: true }) sortCatalog: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginatorCatalog: MatPaginator; 

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getRemoteData();
    this.dataSourceSubcontractor.sort = this.sortCatalog;
    this.dataSourceSubcontractor.paginator = this.paginatorCatalog;         
  }

  openDialog(formModal: string, idCatolog: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idordini: idCatolog, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(SubcontractorFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }
  
  getRemoteData() {
    
    const CATALOG_DATA: Subcontractor[] = [
      {
        idfasonatori: 1,
        nominativo: 'Ditta Rossi',
        telefono: '081865965',
        email: 'ditta@rossi.it'
      },
      {
        idfasonatori: 2,
        nominativo: 'Ditta Bianchi',
        telefono: '081865970',
        email: 'ditta@bianchi.it'
      }          
    ];

    this.dataSourceSubcontractor = new MatTableDataSource(CATALOG_DATA);  
  }     

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceSubcontractor.filter = filterValue.trim().toLowerCase();

  }  

  clearSearch(){
    this.dataSourceSubcontractor.filter = "";
    this.testo_ricerca = "";
  }    

}
