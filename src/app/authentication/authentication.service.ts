import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './data.model';
import { BackendServer } from '../backend-service/backend-server.model';
import { RESTBackendService } from '../backend-service/rest-backend.service';
import { RefreshTokenService } from './refresh-token.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private handlerBackendServer: BackendServer;
    private handlerRestBackendService: RESTBackendService;
    private handlerRefreshTokenService: RefreshTokenService;
    
    constructor(private http: HttpClient,
        restBackendService: RESTBackendService,
        refreshTokenService: RefreshTokenService
        ) {
         
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        this.handlerBackendServer = new BackendServer();
        this.handlerRestBackendService = restBackendService;

        this.handlerRefreshTokenService = refreshTokenService;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public login(username: string, password: string) {

        return this.http.post<any>(
            this.handlerBackendServer.getApiResource('authenticate'), 
            { username, password }
            )
            .pipe(map(
                user => {    
                    this.handlerRestBackendService.setToken(user.token);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes               
                    sessionStorage.setItem('currentUser', JSON.stringify(user));                
                    this.currentUserSubject.next(user);

                    // si inizializza il servizio di refresh del token
                    RefreshTokenService.observableTimer();

                    //
                    return user;
                },
                (error) => {
                    console.error('error');
                }
                ));
    }

    public logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    public setToken(_token: string){
        this.handlerRestBackendService.setToken(_token);
    }
}