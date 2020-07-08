import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './authentication/data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  private currentUserSubject: BehaviorSubject<User>;
  title = 'Tailor-App';


  ngOnDestroy(): void {

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    
  }

}
