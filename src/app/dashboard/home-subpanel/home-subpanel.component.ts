import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-subpanel',
  templateUrl: './home-subpanel.component.html',
  styleUrls: ['./home-subpanel.component.css']
})
export class HomeSubpanelComponent implements OnInit {

  constructor() { 
   }

  ngOnInit() {
  }

  aggiorna(){
    alert('ciao');
  }

}
