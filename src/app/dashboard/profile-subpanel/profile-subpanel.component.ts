import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-subpanel',
  templateUrl: './profile-subpanel.component.html',
  styleUrls: ['./profile-subpanel.component.css']
})
export class ProfileSubpanelComponent implements OnInit {

  username: string = '';

  vecchia_password: string = '';
  nuova_password: string = '';
  nuova_password_2: string = '';

  hide: boolean = true;
  hide1: boolean = true;
  hide2: boolean = true;

  newPasswordDifferent = true;

  submitted = false;

  constructor() { }

  ngOnInit() {
  }

  onSubmit(){

    console.log('submit');

  }

  checkPassword(event: Event){

    console.log(event);
    

  }

  checkTwoPassword(){

    console.log('two');
    console.log(this.nuova_password);
    console.log(this.nuova_password_2);

    if( this.nuova_password == this.nuova_password_2 ){
      this.newPasswordDifferent = false;
    }  else {
      this.newPasswordDifferent = true;
    }

  }  

}
