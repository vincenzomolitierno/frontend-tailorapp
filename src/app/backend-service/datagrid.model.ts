import { HttpErrorResponse } from '@angular/common/http';
import { RESTBackendService } from './rest-backend.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';

export class GridModel {

    // Stringhe per i messaggi di errore
    errorMessage: string;
    errorHttpErrorResponse: HttpErrorResponse;  

    //Attributo contenente l'array dei dati ricevuti dal backend con la chiamata REST
    public resource: Array<any> = [];
    //Attributo contenente i dati utilizzati per popolare la tabella
    public dataSource;
    public testo_ricerca: string = "";  

    //Attributo che serve per ricevere il riferimento al servizio del 
    //backend iniettato nella classe derivata
    private restBackendService: RESTBackendService;

    //Attributi che servono alla classe derivata per 
    @ViewChild('table', { read: MatSort, static: true }) sortTable: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginatorTable: MatPaginator;  

    constructor(_restBackendService: RESTBackendService){
      this.restBackendService = _restBackendService;
    }

    public getRemoteData(tagResourse: string):any {
      //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
      this.restBackendService.getResource(tagResourse).subscribe(
        (data) => {
          
              this.resource = data;
              this.dataSource = new MatTableDataSource(this.resource);   
              // Si associano ordinamento e paginatore
              this.dataSource.sort = this.sortTable;
              this.dataSource.paginator = this.paginatorTable;              

             },
        (error) => {

           this.errorHttpErrorResponse = error;
           this.errorMessage = error.message;

        }
      );
    }
    

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
 
    }  
  
    public clearSearch(){
      this.dataSource.filter = "";
      this.testo_ricerca = "";
    }  


  }