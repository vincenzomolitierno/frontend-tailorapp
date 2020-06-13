import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { BackendServer } from './backend-server.model';


@Injectable({
  providedIn: 'root'
})
export class RESTBackendService {

  //Backend Server, oggetto che modella il server che offre il servizio con API REST
  private server: BackendServer;

  //Stringa per i messaggi di errore
  private errorMessage: string = '';
  private token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEwMCIsIm5iZiI6MTU5MTYxMjE0NywiZXhwIjoxNTkyMjE2OTQ3LCJpYXQiOjE1OTE2MTIxNDd9.WFR8ywORDpeMN3eFme8dJy6OwcS9FCWFBMYZrUF3-Cg';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    })
  };
   

  /**
   * Constructor method of the component
   * 
   * @param _http inject HttpClient service
   */
  constructor(private _http: HttpClient) {

    this.server = new BackendServer;

  }

  public loginToServer(username: string, password: string ){

    return this._http.get<any>(
      this.server.getApiResource('authenticate'),
      this.httpOptions
      ).pipe(catchError(this.handleError));

  }

  public setToken(_token: string): void{
    this.token = _token;
  }

  // ************* CRUD FOR CUSTOMERS *************

  public getCustomers(): Observable<any> {

    return this._http.get<any>(
      this.server.getApiResource('customers'),
      this.httpOptions
      ).pipe(catchError(this.handleError));

  }

// /**
//    * Method to add a new element in the company staff
//    * 
//    * @param newItem the item to add in the resource
//    * 
//    * @return An `Observable` of the response, with the response body
//    */
//   postAzienda(newItem: NuovaAzienda): Observable<HttpErrorResponse> {

//     console.log(newItem);

//     return this._http.post<HttpErrorResponse>(this.apiUrlAzienda, newItem, httpOptions).pipe(catchError(this.handleError));

//   }

//   /**
//    * Method to delete an item from the resource
//    * 
//    * @param itemToRemove  the item to remove from resource
//    * 
//    * @returns an observable object to pull up error information
//    */
//   deleteAzienda(itemToRemove: Azienda): Observable<HttpErrorResponse> {

//     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: itemToRemove };

//     return this._http.delete<HttpErrorResponse>(this.apiUrlAzienda, httpOptions).pipe(catchError(this.handleError));

//   }

//   /**
//    * Method to send put command to the REST backend in order to update
//    * a resource item
//    * 
//    * @param itemUpdated the item to update in the resource
//    */
//   putAzienda(itemUpdated: Azienda): Observable<HttpErrorResponse> {

//     return this._http.put<HttpErrorResponse>(this.apiUrlAzienda,
//       itemUpdated,
//       httpOptions).pipe(catchError(this.handleError));

//   } 

// ************* READ RESOURCE *************
public getResource(tagResource: string): Observable<any> {

  return this._http.get<any>(
    this.server.getApiResource(tagResource),
    this.httpOptions
    ).pipe(catchError(this.handleError));

}

 

// ************* UTILITY METHODS *************
  /**
   * Method to handling the issues from the backend service call
   * 
   * @param error response from backend service call in case of error detection
   */
  private handleError(error: HttpErrorResponse): Observable<HttpErrorResponse> {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
      this.errorMessage = 'An client error occurred:', error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.errorMessage = //`Backend returned code ${error.status}, ` + `body was: ${error.error}. ` + "\n" +
        // `Error message: ${error.message}. ` + "\n" +
        'An server error occurred:' + "\n" +
        `Error url: ${error.url}. ` + "\n" +
        `Error name: ${error.name}. ` + "\n" +
        `Error ok: ${error.ok}. ` + "\n" +
        `Error statusText: ${error.statusText}. ` + "\n" +
        `Error status: ${error.status}. ` + "\n" +
        `Error headers: ${error.headers}. ` + "\n" +
        `Error type: ${error.type}. ` + "\n" +
        `Error error: ${error.error}. ` + "\n" +
        `Error message: ${error.message}. `;
    }

    console.error(this.errorMessage);
    // return an observable with a user-facing error message
    // return throwError('Something bad happened; please try again later.');
    // return throwError(this.errorMessage);
    return throwError(error);

  }

}
