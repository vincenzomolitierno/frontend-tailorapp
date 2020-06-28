import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';

@Component({
  selector: 'app-wristmodel-form',
  templateUrl: './wristmodel-form.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class WristmodelFormComponent implements OnInit {

  nome_catalogo: string = 'polso';
  descrizione: string = '';
  formModal: string = '';

  reactiveForm: FormGroup;
  //vettore delle descrizioni esistenti da caricare
  options: string[];
  
  filteredOptions: Observable<string[]>;  

  constructor(@Inject(MAT_DIALOG_DATA) data,
      public restBackendService: RESTBackendService) 
      {
      this.formModal = data.formModal;

      this.reactiveForm = new FormGroup({
        modello: new FormControl('', Validators.required),
      });      

      //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
      this.restBackendService.getResource('wirstmodels').subscribe(
        (data) => {          
          this.options = data;    
          console.log(data)

          this.options = data.map(a => a.modello);
          console.log(this.options);
          
          //inizializzazione
          this.filteredOptions = this.reactiveForm.controls.modello.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );
                        
          },
        (error) => {
            console.error(error);
            console.error('Message: ' + error.message);
        }
      );
   }

  ngOnInit() {
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
