import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './data.model';
import { BackendServer } from '../backend-service/backend-server.model';
import { RESTBackendService } from '../backend-service/rest-backend.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private handlerBackendServer: BackendServer;
    private handlerRestBackendService: RESTBackendService;
    
    constructor(private http: HttpClient,
        restBackendService: RESTBackendService
        ) {
        // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
         
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));

        this.currentUser = this.currentUserSubject.asObservable();

        this.handlerBackendServer = new BackendServer();
        this.handlerRestBackendService = restBackendService;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {

        // console.log('Username: ' + username);
        // console.log('Password: ' + password);

        return this.http.post<any>(
            this.handlerBackendServer.getApiResource('authenticate'), 
            { username, password }
            )
            .pipe(map(user => {
                // console.log('user mapping');
                // console.log('Token: ' + user.token);                
                this.handlerRestBackendService.setToken(user.token);
                // store user details and jwt token in local storage to keep user logged in between page refreshes

                sessionStorage.setItem('currentUser', JSON.stringify(user));
                // localStorage.setItem('currentUser', JSON.stringify(user));
                
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        
        // localStorage.removeItem('currentUser');

        this.currentUserSubject.next(null);
    }

    public setToken(_token: string){
        this.handlerRestBackendService.setToken(_token);
    }
}