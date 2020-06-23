import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-action-confirm-dummy',
  templateUrl: './action-confirm-dummy.component.html',
  styleUrls: ['./action-confirm-dummy.component.css']
})
export class ActionConfirmDummyComponent implements OnInit {

  titolo: string = "empty";
  messaggio: string = "empty";

  constructor(
    public dialogRef: MatDialogRef<ActionConfirmDummyComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
    this.titolo = data.titolo;    
    this.messaggio = data.messaggio;    

   }

  ngOnInit() {
  }

}
