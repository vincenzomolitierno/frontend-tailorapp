import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subcontractor } from 'src/app/subcontractors/subcontractor.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Measurer } from '../data.model';

@Component({
  selector: 'app-measurer-form',
  templateUrl: './measurer-form.component.html',
  styleUrls: ['./measurer-form.component.css']
})
export class MeasurerFormComponent implements OnInit {

  tag_form: string = 'misurometri';
  formModal: string = '';

  nome_catalogo: string = '';
  descrizione: string = '';

  reactiveForm: FormGroup;

  subcontractors: Array<any> = new Array();

  measurer: Measurer;

  constructor(@Inject(MAT_DIALOG_DATA) data,
    public restBackendService: RESTBackendService) {
    this.formModal = data.formModal;

    this.reactiveForm = new FormGroup({
      descrizione: new FormControl('', Validators.required),
      idfasonatori: new FormControl('', Validators.required)
    });
   }

  ngOnInit() {

    //SI popola il combobox con l'elenco dei fasonatori
    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {   
            // console.log('misurometro',data);
            var result = data.map(a => a.nome + ' - ( tel: ' + a.telefono  + ' )');

            var i = 0;
            result.forEach(element => {
              this.subcontractors.push({
                'descrizione': element,
                'idfasonatori': data[i].idfasonatori 
              });
              i++; 
            });
            // this.subcontractors = result;   
            // console.log('misurometro',this.subcontractors);

            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );

  }


}
