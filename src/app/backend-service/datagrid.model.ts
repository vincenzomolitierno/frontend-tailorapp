import { HttpErrorResponse } from '@angular/common/http';
import { RESTBackendService } from './rest-backend.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ViewChild } from '@angular/core';

import { QueryParameter } from './data.model';

// interface QueryParameter {
//   [key: string]: string;
// }

export class GridModel {
  
  // Stringhe per i messaggi di errore
  errorMessage: string;
  errorHttpErrorResponse: HttpErrorResponse;  

  //Attributo contenente l'array dei dati ricevuti dal backend con la chiamata REST
  public resource: Array<any> = [];
  public resourceQuery: Array<any> = [];
  //Attributo contenente i dati utilizzati per popolare la tabella
  public dataSource;
  public testo_ricerca: string = "";  

  //Attributo che serve per ricevere il riferimento al servizio del 
  //backend iniettato nella classe derivata
  public restBackendService: RESTBackendService;

  //Attributi che servono alla classe derivata per 
  // @ViewChild('table', { read: MatSort, static: true }) sortTable: MatSort;
  @ViewChild(MatSort, {static: true}) sortTable: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorTable: MatPaginator;  

  constructor(_restBackendService: RESTBackendService){
    this.restBackendService = _restBackendService;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }  

  public clearSearch(){
    this.dataSource.filter = "";
    this.testo_ricerca = "";
  }      
  
  /**
   * REST backend call to get the data of tagResource resource as a JSON data
   *
   * @param {string} tagResourse
   * @returns {*}
   * @memberof GridModel
   */
  public getRemoteData(tagResourse: string):any {
    //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResource(tagResourse).subscribe(
      (data) => {
            this.resource = data;
            this.dataSource = new MatTableDataSource(this.resource);   
                       
            this.dataSource.paginator = this.paginatorTable;    
            this.dataSource.sort = this.sortTable;            
            },
      (error) => {
          this.errorHttpErrorResponse = error;
          this.errorMessage = error.message;
      }
    );
  }

  public getRemoteDataQuery(tagResourse: string, queryParameter: QueryParameter):any {

    this.resourceQuery = [];

      // chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResourceQuery(tagResourse,
      'iclienti' + '=' + queryParameter.idclienti).subscribe(
      (data) => {
            console.log('misure esistenti');
            this.resourceQuery = data;
            },
      (error) => {
          this.errorHttpErrorResponse = error;
          this.errorMessage = error.message;
      }
    );
  }  


  /**
   * REST backend call to create new resource item of tagResource with body parameter
   *
   * @param {string} tagResourse
   * @param {object} body
   * @memberof GridModel
   */
  public postData(tagResource: string, body: object):void {

    this.errorMessage = '';

    this.restBackendService.postResource(tagResource, body).subscribe(
      (data) => {     
        this.getRemoteData(tagResource);        
      },
      (error) => {
        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;        
      });    

  }

  /**
   * REST backend call to delete resource item of tagResource with id passed through body parameter
   *
   * @param {string} tagResourse
   * @param {object} body
   * @memberof GridModel
   */
  public delData(tagResourse: string, body: object):void {

    this.errorMessage = '';
    this.restBackendService.delResource(tagResourse, body).subscribe(
      (data) => {     
        this.getRemoteData(tagResourse);        
      },
      (error) => {
        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;        
      });      

  }

  public putData(tagResource: string, body: object):void {

    this.errorMessage = '';

    this.restBackendService.putResource(tagResource, body).subscribe(
      (data) => {     
        this.getRemoteData(tagResource);        
      },
      (error) => {
        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;        
      });    

  }  



}