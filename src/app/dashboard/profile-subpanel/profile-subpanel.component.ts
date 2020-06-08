import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-subpanel',
  templateUrl: './profile-subpanel.component.html',
  styleUrls: ['./profile-subpanel.component.css']
})
export class ProfileSubpanelComponent implements OnInit {

  vecchia_password: string = '';
  nuova_password: string = '';

  hide1: boolean = true;
  hide2: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
