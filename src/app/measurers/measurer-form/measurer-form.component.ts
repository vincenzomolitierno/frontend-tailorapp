import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subcontractor } from 'src/app/subcontractors/subcontractor.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';

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

  subcontractors: Subcontractor[];

  constructor(@Inject(MAT_DIALOG_DATA) data,
    public restBackendService: RESTBackendService) {
    this.formModal = data.formModal;

    this.reactiveForm = new FormGroup({
      descrizione: new FormControl('', Validators.required),
      fasonista: new FormControl('', Validators.required)
    });
   }

  ngOnInit() {

   

    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {
        console.log(data);
            
            var result = data.map(a => a.nome);
            this.subcontractors = result;   
            console.log(data);   
            console.log(result);    
            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );

  }


}
