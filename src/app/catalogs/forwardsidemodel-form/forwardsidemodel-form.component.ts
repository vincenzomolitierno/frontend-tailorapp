import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-forwardsidemodel-form',
  templateUrl: './forwardsidemodel-form.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class ForwardsidemodelFormComponent implements OnInit {

  nome_catalogo: string = 'avanti';
  descrizione: string = '';
  formModal: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.formModal = data.formModal;
   }

  ngOnInit() {
  }

}
