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
  private token: string = '';

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

  public setToken(_token: string): void{
    // console.log('Setting Token: ' + _token);  
    this.token = _token;
  }


/**
 *
 *
 * @param {string} tagResource
 * @returns {Observable<any>}
 * @memberof RESTBackendService
 */
public getResource(tagResource: string): Observable<any> {

  this.httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    })
  };

  return this._http.get<any>(
    this.server.getApiResource(tagResource),
    this.httpOptions
    ).pipe(catchError(this.handleError));

}

public getAwaitResource(tagResource: string){
  let p = new Promise((res, rej)=> {
    this._http.get( 
      this.server.getApiResource(tagResource),
      this.httpOptions
        ).subscribe(
        success => res(success), 
        error => rej(error))
  })
  return p
}

public getResourceQuery(tagQuery: string, tagParameter: string): Observable<any> {

  // console.log('Using Token: ' + this.token);  

  this.httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token,
    })
  };

  // console.log(this.server.getApiResource(tagQuery) + '?' + tagParameter);

  return this._http.get<any>(
    this.server.getApiResource(tagQuery) + '?' + tagParameter,
    this.httpOptions
    ).pipe(catchError(this.handleError));

}


  public postResource(tagResource: string, body: object): Observable<any> {

    // console.log(this.server.getApiResource(tagResource));
    // console.log(body);

    return this._http.post<HttpErrorResponse>(
      this.server.getApiResource(tagResource),
      body, 
      this.httpOptions
      ).pipe(catchError(this.handleError));

  }


  public delResource(tagResource: string, _body: object): Observable<HttpErrorResponse> {

    // console.log(this.server.getApiResource(tagResource));

    const localHttpOptions = { 
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      }),
       body: _body };  

       // console.log(localHttpOptions);

    return this._http.delete<HttpErrorResponse>(
      this.server.getApiResource(tagResource),
      localHttpOptions
      ).pipe(catchError(this.handleError));    
  }  

  public putResource(tagResource: string, body: object): Observable<HttpErrorResponse> {

    // console.log(this.server.getApiResource(tagResource));

    return this._http.put<HttpErrorResponse>(
      this.server.getApiResource(tagResource),
      body, 
      this.httpOptions
      ).pipe(catchError(this.handleError));

  }  

  public putResourceParams(tagResource: string, param: string): Observable<any> {

    console.log(this.server.getApiResource(tagResource) + param);

    var localHttpOptions = { 
         headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
        'responseType': 'text' })};  

    return this._http.put<HttpErrorResponse>(
      this.server.getApiResource(tagResource) + param,
      {}, 
      localHttpOptions
      ).pipe(catchError(this.handleError)); 

  }    

  //

  // ####################### UTILITY METHODS #######################
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
