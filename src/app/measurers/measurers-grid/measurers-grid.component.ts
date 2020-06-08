import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MeasurerFormComponent } from '../measurer-form/measurer-form.component';
import { Measure } from '../measure.model';

@Component({
  selector: 'app-measurers-grid',
  templateUrl: './measurers-grid.component.html',
  styleUrls: ['./measurers-grid.component.css']
})
export class MeasurersGridComponent implements OnInit {

  tag_grid: string = 'misurometri';
  
  testo_ricerca: string = "";  

    // Colonne visualizzate in tabella
    displayedColumns: string[] = [
      'idmisurometri',
      'descrizione',
      'fasonatori_idfasonatori',
      'update',
      'delete'
    ];
    dataSourceMeasurer;  
  
    @ViewChild('table', { read: MatSort, static: true }) sortCatalog: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginatorCatalog: MatPaginator;   

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getRemoteData();
    this.dataSourceMeasurer.sort = this.sortCatalog;
    this.dataSourceMeasurer.paginator = this.paginatorCatalog;       
  }

  openDialog(formModal: string, idCatolog: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idordini: idCatolog, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(MeasurerFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  } 
  
  getRemoteData() {
    
    const CATALOG_DATA: Measure[] = [
      {
        idmisurometri: 1,
        descrizione: 'Misurometro 1',
        fasonatori_idfasonatori: 1
      },
      {
        idmisurometri: 2,
        descrizione: 'Misurometro 2',
        fasonatori_idfasonatori: 1
      }          
    ];

    this.dataSourceMeasurer = new MatTableDataSource(CATALOG_DATA);  
  }    

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMeasurer.filter = filterValue.trim().toLowerCase();

  }  

  clearSearch(){
    this.dataSourceMeasurer.filter = "";
    this.testo_ricerca = "";
  }    



}
