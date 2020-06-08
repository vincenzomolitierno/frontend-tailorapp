import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-backsidemodel-form',
  templateUrl: './backsidemodel-form.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class BacksidemodelFormComponent implements OnInit {

  nome_catalogo: string = 'dietro';
  descrizione: string = '';
  formModal: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.formModal = data.formModal;
   }

  ngOnInit() {
  }

}