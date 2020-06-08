import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-cu-form',
  templateUrl: './cu-form.component.html',
  styleUrls: ['./cu-form.component.css']
})
export class CuFormComponent implements OnInit {

  formModal: string = "empty";
  name: string = "empty";

  constructor(@Inject(MAT_DIALOG_DATA) data) {

    this.formModal = data.formModal;
    this.name = data.nominativo;
   }

  ngOnInit() {
  }

}
