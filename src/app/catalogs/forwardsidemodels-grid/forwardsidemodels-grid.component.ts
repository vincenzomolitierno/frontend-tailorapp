import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ForwardsidemodelFormComponent } from '../forwardsidemodel-form/forwardsidemodel-form.component';
import { Catalog } from '../catalog.model';

@Component({
  selector: 'app-forwardsidemodels-grid',
  templateUrl: './forwardsidemodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class ForwardsidemodelsGridComponent implements OnInit {
  
  nome_catalogo: string = 'avanti';

  testo_ricerca: string = "";  

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    // 'idcamicie',
    'descrizione', 
    'update',
    'delete'
  ];
  dataSourceCatalog;  

  @ViewChild('table', { read: MatSort, static: true }) sortCatalog: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorCatalog: MatPaginator;  

  
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getRemoteData();
    this.dataSourceCatalog.sort = this.sortCatalog;
    this.dataSourceCatalog.paginator = this.paginatorCatalog;     
  }

  openCatalogDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(ForwardsidemodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result: ${result}');
      });    
      
    } 

    getRemoteData() {
    
      const CATALOG_DATA: Catalog[] = [
        {
          idcatalogo: 1,
          descrizione: 'tipo 1',
        },
        {
          idcatalogo: 2,
          descrizione: 'tipo 2',
        }          
      ];
  
      this.dataSourceCatalog = new MatTableDataSource(CATALOG_DATA);  
    }     

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceCatalog.filter = filterValue.trim().toLowerCase();
 
    }  
  
    clearSearch(){
      this.dataSourceCatalog.filter = "";
      this.testo_ricerca = "";
    }    

}

