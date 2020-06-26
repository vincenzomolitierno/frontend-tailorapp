import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Subcontractor } from '../data.model';

@Component({
  selector: 'app-subcontractor-form',
  templateUrl: './subcontractor-form.component.html',
  styleUrls: ['./subcontractor-form.component.css']
})
export class SubcontractorFormComponent implements OnInit {

  tag_form: string = 'fasonista';
  formModal: string = '';

  subcontractor: Subcontractor;

  nominativo: string = '';
  telefono: string = '';
  email: string = '';
  nome_catalogo: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.formModal = data.formModal;

    if ( this.formModal=='inserimento' )
      this.subcontractor = new Subcontractor();
    else
      this.subcontractor = data.subcontractor;

   }

  ngOnInit() {
  }

}
