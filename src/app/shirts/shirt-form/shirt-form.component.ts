import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Shirt } from '../shirt.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';

interface NeckModelIndicator {
  tag: string,
  descrizione: string;
}

interface WristModelIndicator {
  tag: string,
  descrizione: string;
}

interface listIndicator {
  tag: string,
  descrizione: string;
}

@Component({
  selector: 'app-shirt-form',
  templateUrl: './shirt-form.component.html',
  styleUrls: ['./shirt-form.component.css']
})
export class ShirtFormComponent implements OnInit {

  public reactiveForm: FormGroup; // oggetto per gestire il form con l'approccio reactive

  formModal: string = 'empty';
  name: string = 'empty';
  dummy_data: string = 'X,Y';

  pannello_iniziali: boolean = true;

  colour: string = '';
  tipo_bottone: string = '';

  // attributi della camicia
  shirt: Shirt;

  constructor(@Inject(MAT_DIALOG_DATA) data,
        public restBackendService: RESTBackendService) {
    
    this.formModal = data.formModal;
    console.log('inizio camicie');
    console.log(data);

    //costruzione del reactive form
    this.reactiveForm = new FormGroup({
        
      idcamicie: new FormControl(''),

      colore: new FormControl(''),
      stecche_estraibili: new FormControl(''),
      tasca: new FormControl(''),
      cuciture: new FormControl(''),
      tipo_bottone: new FormControl(''),
      iniziali: new FormControl(''),
      pos_iniziali: new FormControl(''),
      stile_carattere: new FormControl(''),
      maiuscolo: new FormControl(''),
      presenza_iniziali: new FormControl(''),
      note: new FormControl(''),
      numero_capi: new FormControl(''),
      modellopolso_idmodello: new FormControl(''),
      modellocollo_idmodello: new FormControl(''),
      avanti_idavanti: new FormControl(''),
      indietro_idindietro: new FormControl(''),
      ordini_idordini: new FormControl('')
     
    });

   }

  ngOnInit() {
  }

  // neckModelIndicatorControl = new FormControl('', Validators.required);
  // neckModelIndicators: NeckModelIndicator[] = [
  //   {tag: '1', descrizione: 'collo 1'},
  //   {tag: '2', descrizione: 'collo 2'},
  //   {tag: '3', descrizione: 'collo 3'},
  // ];   

  // wristModelIndicatorControl = new FormControl('', Validators.required);
  // wristModelIndicators: WristModelIndicator[] = [
  //   {tag: '1', descrizione: 'polso 1'},
  //   {tag: '2', descrizione: 'polso 2'},
  //   {tag: '3', descrizione: 'polso 3'},
  // ];   

  // listIndicatorControl = new FormControl('', Validators.required);
  // listIndicators: listIndicator[] = [
  //   {tag: '1', descrizione: 'valore 1'},
  //   {tag: '2', descrizione: 'valore 2'},
  //   {tag: '3', descrizione: 'valore 3'},
  // ];  

  private loadControlsForm(){
    //SI popola il combobox con l'elenco dei fasonatori
    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {

            var descrizione = data.map(a => a.nome + ' - ( tel: ' + a.telefono  + ' )');
            for (let index = 0; index < data.length; index++) {
              data[index].descrizione = descrizione[index];              
            }
            var result = data;
            console.log(result);

            // this.subcontractors = result;   

            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );    
  }  
  
  
  buttonIncreaseQty(){
    this.shirt.quantita = this.shirt.quantita + 1; 
  }

  buttonDecreaseQty(){
    this.shirt.quantita = this.shirt.quantita - 1; 
  }


}
