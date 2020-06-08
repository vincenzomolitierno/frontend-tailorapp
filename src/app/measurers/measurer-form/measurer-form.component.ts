import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Subcontractor } from 'src/app/subcontractors/subcontractor.model';

@Component({
  selector: 'app-measurer-form',
  templateUrl: './measurer-form.component.html',
  styleUrls: ['./measurer-form.component.css']
})
export class MeasurerFormComponent implements OnInit {

  tag_form: string = 'misurometri';
  formModal: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.formModal = data.formModal;
   }

  ngOnInit() {
  }

  subcontractorControl = new FormControl('', Validators.required);
  subcontractors: Subcontractor[] = [
    {
      idfasonatori: 1,
      nominativo: 'Ditta Bianchi',
      telefono: '081892****',
      email: 'ditta@bianchi.it'
    }
  ];    

}
