import { Component, OnInit, Inject } from '@angular/core';
import { DateAdapter, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-action-confirm-dummy',
  templateUrl: './action-confirm-dummy.component.html',
  styleUrls: ['./action-confirm-dummy.component.css']
})
export class ActionConfirmDummyComponent implements OnInit {

  titol: string = "empty";

  constructor(
    public dialogRef: MatDialogRef<ActionConfirmDummyComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
    this.titol = data.message;    
   }

  ngOnInit() {
  }

}
