import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.css']
})
export class OrderConfirmComponent implements OnInit {

  message: string = '';
  idOrdine: string = '';
  titolo: string = 'ATTENZIONE'

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.message = data.message;
    this.idOrdine = data.idOrdine;
   }

  ngOnInit() {
  }

}
