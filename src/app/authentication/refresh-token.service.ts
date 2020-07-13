import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { RESTBackendService } from '../backend-service/rest-backend.service';
import { User } from './data.model';
import { AuthenticationService } from './authentication.service';
import { BackendServer } from '../backend-service/backend-server.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  private checkTimePeriod: number = 60000; //48 * 60 * 60 * 1000; // h * min/h * sec/min * mill/sec [millisec]
  private tolleranceTime: number = 24 * 60 * 60 * 1000; // h * min/h * sec/min * mill/sec [millisec]

  private handlerRestBackendService: RESTBackendService;

  constructor(
    restBackendService: RESTBackendService,
  ) { 
    this.handlerRestBackendService = restBackendService;
  
   }

  public startRefreshCheckService() {
    const source = timer(1000, this.checkTimePeriod);
    const abc = source.subscribe(val => {
      console.log('refresh del token');

      var user: User = JSON.parse(sessionStorage.getItem('currentUser'));
      console.log('scadenza del token',(new Date(user.expiration_date)).getTime());
      console.log('ora corrente',(new Date()).getTime());

      console.log('mancano alla scadenza', ( (new Date(user.expiration_date)).getTime() - (new Date()).getTime() )/(1000 * 60 * 60) );

      if ( ( (new Date(user.expiration_date)).getTime() - (new Date()).getTime() ) < this.tolleranceTime ) // se manca meno della tolleranza settata
      {
        
        this.handlerRestBackendService.postResource('authenticate',
        {
          'username': user.username,
          'password': user.password 
        }).subscribe(
          (data) => {
  
            console.log('aggiornamento del TOKEN riuscito');
            this.handlerRestBackendService.setToken(data.token);
            
          },
          (error) => {
            console.log('aggiornamento del TOKEN NON riuscito');
          }
          );
      }



      }); // fine sottoscrizione timer
  }

}
