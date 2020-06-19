import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';

@Component({
  selector: 'app-neckmodel-form',
  templateUrl: './neckmodel-form.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class NeckmodelFormComponent implements OnInit {

  nome_catalogo: string = 'collo';
  descrizione: string = '';
  formModal: string = '';

  myControl = new FormControl();
  //vettore delle descrizioni esistenti da caricare
  options: string[];
  
  filteredOptions: Observable<string[]>;  

  constructor(@Inject(MAT_DIALOG_DATA) data,
      public restBackendService: RESTBackendService) 
      {
      this.formModal = data.formModal;

      //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
      this.restBackendService.getResource('neckmodel').subscribe(
        (data) => {

          
              this.options = data;    
              console.log(data)

              this.options = data.map(a => a.modello);
              console.log(this.options);

              // options: string[] = ['One', 'Two', 'Three'];
              
              //inizializzazione
              this.filteredOptions = this.myControl.valueChanges
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
