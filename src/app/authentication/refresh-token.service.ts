import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor() { }

  public static observableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      console.log(new Date(), '-');
      
    });
  }

}
