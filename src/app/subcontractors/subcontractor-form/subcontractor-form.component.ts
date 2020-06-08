import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-subcontractor-form',
  templateUrl: './subcontractor-form.component.html',
  styleUrls: ['./subcontractor-form.component.css']
})
export class SubcontractorFormComponent implements OnInit {

  tag_form: string = 'fasonista';
  formModal: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.formModal = data.formModal;
   }

  ngOnInit() {
  }

}
