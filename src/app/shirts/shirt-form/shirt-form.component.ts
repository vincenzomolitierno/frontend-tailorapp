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

  pannello_iniziali: boolean = false;

  ordini_idordini: number;

  colour: string = '';
  tipo_bottone: string = '';

  // attributi della camicia
  shirt: Shirt;

  constructor(@Inject(MAT_DIALOG_DATA) data,
        public restBackendService: RESTBackendService) {
    
    this.formModal = data.formModal;    
    this.shirt = data.formModal;  
    this.ordini_idordini = data.formModal;  

    console.log('inizio camicie');
    console.log(data);

    this.ordini_idordini = data.ordini_idordini;

    //costruzione del reactive form
    this.reactiveForm = new FormGroup({
        
      idcamicie: new FormControl(''),

      colore: new FormControl('', Validators.required),
      stecche_estraibili: new FormControl(''),
      tasca: new FormControl(''),
      cuciture: new FormControl(''),
      tipo_bottone: new FormControl(''),
      iniziali: new FormControl(''),
      switchIniziali: new FormControl(''),
      stile_carattere: new FormControl(''),
      posizione_iniziali: new FormControl(''),
      maiuscolo: new FormControl(''),
      presenza_iniziali: new FormControl(''),
      note: new FormControl(''),
      numero_capi: new FormControl('',[Validators.required, Validators.min(1)]),
      modellopolso_idmodello: new FormControl('',Validators.required),
      modellocollo_idmodello: new FormControl('',Validators.required),
      avanti_idavanti: new FormControl('',Validators.required),
      indietro_idindietro: new FormControl('',Validators.required),
      ordini_idordini: new FormControl('')
     
    });

   }

  ngOnInit() {

    this.loadControlsForm();

    if ( this.formModal == 'inserimento' ) {

      this.reactiveForm.get('numero_capi').setValue('0'); 

    } else if ( this.formModal == 'aggiornamento' ) {

    }

    

  }

  neckModelIndicators;
  wristModelIndicators;
  backModelIndicators;
  forwardModelIndicators;
  listIndicators = [
    {descrizione: 'Davanti'},
    {descrizione: 'Collo'},
    {descrizione: 'Polso'},
    {descrizione: 'Tasca'}];

  private loadControlsForm(){

    // POPOLAZIONE DEL COMBOBOX MODELLI COLLO
    this.restBackendService.getResource('neckmodels').subscribe(
      (data) => {
             this.neckModelIndicators = data;   
            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );  
    
    // POPOLAZIONE DEL COMBOBOX MODELLI POLSO
    this.restBackendService.getResource('wristmodels').subscribe(
      (data) => {
             this.wristModelIndicators = data;   
            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );     

    // POPOLAZIONE DEL COMBOBOX MODELLI AVANTI
    this.restBackendService.getResource('forwardsidemodels').subscribe(
      (data) => {
             this.forwardModelIndicators = data;   
            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );        

    // POPOLAZIONE DEL COMBOBOX MODELLI DIETRO
    this.restBackendService.getResource('backsidemodels').subscribe(
      (data) => {
             this.backModelIndicators = data;   
            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );      

  }  
  
  
  buttonIncreaseQty(){
    this.reactiveForm.get('numero_capi').setValue(  (parseFloat(this.reactiveForm.get('numero_capi').value) + 1).toFixed(0) ); 
  }

  buttonDecreaseQty(){
    if ( this.reactiveForm.get('numero_capi').value > 0 )
    this.reactiveForm.get('numero_capi').setValue(  (parseFloat(this.reactiveForm.get('numero_capi').value) - 1).toFixed(0) ); 
  }

  switchPanel(){
    this.pannello_iniziali = !this.pannello_iniziali;
  }


}
