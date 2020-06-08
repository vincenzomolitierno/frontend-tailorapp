import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-neckmodel-form',
  templateUrl: './neckmodel-form.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class NeckmodelFormComponent implements OnInit {

  nome_catalogo: string = 'collo';
  descrizione: string = '';
  formModal: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.formModal = data.formModal;
   }

  ngOnInit() {
  }

}
