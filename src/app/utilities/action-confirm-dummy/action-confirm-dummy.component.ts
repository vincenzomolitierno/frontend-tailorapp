import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-action-confirm-dummy',
  templateUrl: './action-confirm-dummy.component.html',
  styleUrls: ['./action-confirm-dummy.component.css']
})
export class ActionConfirmDummyComponent implements OnInit {

  data: any;
  titolo: string = "empty";
  messaggio: string = "empty";

  messaggioOK = 'prova';
  messaggioDiscard = 'prova';

  constructor(
    public dialogRef: MatDialogRef<ActionConfirmDummyComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) {

      this.data = data;
   }

  ngOnInit() {
    this.titolo = this.data.titolo;    
    this.messaggio = this.data.messaggio;   
    
    this.messaggioOK = this.data.messaggioOK;
    this.messaggioDiscard = this.data.messaggioDiscard;
  }

}
