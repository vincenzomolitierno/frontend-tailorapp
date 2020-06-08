import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-wristmodel-form',
  templateUrl: './wristmodel-form.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class WristmodelFormComponent implements OnInit {

  nome_catalogo: string = 'polso';
  descrizione: string = '';
  formModal: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.formModal = data.formModal;
   }

  ngOnInit() {
  }

}
