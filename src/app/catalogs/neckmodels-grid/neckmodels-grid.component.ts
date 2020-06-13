import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { NeckmodelFormComponent } from '../neckmodel-form/neckmodel-form.component';
import { Catalog } from '../catalog.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { NeckModel } from 'src/app/backend-service/data.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-neckmodels-grid',
  templateUrl: './neckmodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class NeckmodelsGridComponent implements OnInit {

  nome_catalogo: string = 'collo';

  testo_ricerca: string = "";  

  // Stringhe di messaggio per il debug
  errorMessage: string;     //Stringa di errore
  errorHttpErrorResponse: HttpErrorResponse;  

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
    private restBackendService: RESTBackendService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    this.getRemoteData();
    
  }

  openCatalogDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(NeckmodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result: ${result}');
      });    
      
    } 

    private resource: Array<NeckModel> = [];
    getRemoteData() {

          //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getNeckmodel().subscribe(
      (data) => {
        
        this.resource = data; 

        // Si carica la tabella con i clienti
        this.dataSourceCatalog = new MatTableDataSource(this.resource);   
        // Si associano ordinamento e paginatore
        this.dataSourceCatalog.sort = this.sortCatalog;
        this.dataSourceCatalog.paginator = this.paginatorCatalog;

            },
      (error) => {

        console.log("KO");     

        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;

        // Si associano ordinamento e paginatore
        this.resource = [
          {
            idmodello: 1,
            modello: 'tipo 1',
          },
          {
            idmodello: 2,
            modello: 'tipo 2',
          }      
        ];

        this.dataSourceCatalog = new MatTableDataSource(this.resource);   
        this.dataSourceCatalog.sort = this.sortCatalog;
        this.dataSourceCatalog.paginator = this.paginatorCatalog;

      }
    );
    
      // const CATALOG_DATA: Catalog[] = [
      //   {
      //     idcatalogo: 1,
      //     descrizione: 'tipo 1',
      //   },
      //   {
      //     idcatalogo: 2,
      //     descrizione: 'tipo 2',
      //   }          
      // ];
  
      // this.dataSourceCatalog = new MatTableDataSource(CATALOG_DATA);  


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
