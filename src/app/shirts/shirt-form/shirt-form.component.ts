import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Shirt } from '../shirt.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  
  colour: string = '';
  tipo_bottone: string = '';

  // attributi della camicia
  private dataShirt: Shirt;

  constructor(@Inject(MAT_DIALOG_DATA) data,
        public restBackendService: RESTBackendService) {
    
    this.formModal = data.formModal;       
    this.dataShirt = data.shirt;

    //costruzione del reactive form
    this.reactiveForm = new FormGroup({
      
      idcamicie: new FormControl(''),

      colore: new FormControl('', Validators.required),
      stecche_estraibili: new FormControl(''),
      tasca: new FormControl(''),
      cuciture: new FormControl(''),
      tipo_bottone: new FormControl(''),
      iniziali: new FormControl(''),
      switchIniziali: new FormControl(''),//apre il pannello per inserire le iniziali
      stile_carattere: new FormControl('SI'),
      pos_iniziali: new FormControl(''),
      maiuscolo: new FormControl('SI'),
      presenza_iniziali: new FormControl('NO'),
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

    this.loadControlsForm(); // si popolano gli elenchi dei modelli da catalogo

        console.log('controlli caricati');
        // **************
        if ( this.formModal == 'inserimento' ) { 
          // se la form è in modalità inserimento si inizializza solo il numero dei capi a zero
          // gli altri campi sono vuoti di default
          this.reactiveForm.get('numero_capi').setValue('0'); 
    
        } else if ( this.formModal == 'aggiornamento' ) {
          console.log('camicia da caricare', this.dataShirt);

          this.reactiveForm.controls['idcamicie'].setValue(this.dataShirt.idcamicie);
          // se la form è in modalità aggiornamento si caricano i valori della camicia aperta
          this.reactiveForm.controls['colore'].setValue(this.dataShirt.colore);
          
          if ( this.dataShirt.stecche_estraibili == 'SI' ) this.reactiveForm.controls['stecche_estraibili'].setValue(this.dataShirt.stecche_estraibili);                  
          if ( this.dataShirt.tasca == 'SI' ) this.reactiveForm.controls['tasca'].setValue(this.dataShirt.tasca);          
          if ( this.dataShirt.cuciture == 'SI' ) this.reactiveForm.controls['cuciture'].setValue(this.dataShirt.cuciture);

          this.reactiveForm.controls['tipo_bottone'].setValue(this.dataShirt.tipo_bottone);
          
          if ( this.dataShirt.presenza_iniziali == 'SI' ) { 
            this.reactiveForm.controls['switchIniziali'].setValue(this.dataShirt.presenza_iniziali);
            this.switchPanel();
          }

          this.reactiveForm.controls['iniziali'].setValue(this.dataShirt.iniziali);

          this.reactiveForm.controls['pos_iniziali'].setValue(this.dataShirt.pos_iniziali);
          this.reactiveForm.controls['stile_carattere'].setValue(this.dataShirt.stile_carattere);
          this.reactiveForm.controls['maiuscolo'].setValue(this.dataShirt.maiuscolo);

          this.reactiveForm.controls['note'].setValue(this.dataShirt.note);
          this.reactiveForm.controls['numero_capi'].setValue(this.dataShirt.numero_capi);
    
          this.reactiveForm.controls['modellocollo_idmodello'].setValue(this.dataShirt.modellocollo_idmodello);          
          this.reactiveForm.controls['modellopolso_idmodello'].setValue(this.dataShirt.modellopolso_idmodello);
          this.reactiveForm.controls['avanti_idavanti'].setValue(this.dataShirt.avanti_idavanti);
          this.reactiveForm.controls['indietro_idindietro'].setValue(this.dataShirt.indietro_idindietro);
          
          this.reactiveForm.controls['ordini_idordini'].setValue(this.dataShirt.ordini_idordini);
        }
        // *************

     

  }

  neckModelIndicators;
  wristModelIndicators;
  backModelIndicators;
  forwardModelIndicators;
  listIndicators = [
    {descrizione: 'DAVANTI'},
    // {descrizione: 'COLLO'},
    {descrizione: 'POLSO'},
    {descrizione: 'TASCA'}];

  private loadControlsForm(){

    console.log('INIZIO caricamento controlli');

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

    console.log('FINE caricamento controlli');
    
  }  // FINE loadControlsForm()
  
  
  buttonIncreaseQty(){    
    this.reactiveForm.get('numero_capi').setValue(  (parseFloat(this.reactiveForm.get('numero_capi').value) + 1).toFixed(0) ); 
  }

  buttonDecreaseQty(){
    if ( this.reactiveForm.get('numero_capi').value > 0 )
    this.reactiveForm.get('numero_capi').setValue(  (parseFloat(this.reactiveForm.get('numero_capi').value) - 1).toFixed(0) ); 
  }

  switchPanel(){
    this.pannello_iniziali = !this.pannello_iniziali;

    if( this.pannello_iniziali ) {
      this.reactiveForm.get('pos_iniziali').setValidators([Validators.required]);
      this.reactiveForm.get('pos_iniziali').updateValueAndValidity();
      this.reactiveForm.get('pos_iniziali').markAsTouched();
    } else {
      this.reactiveForm.get('pos_iniziali').clearValidators();
      this.reactiveForm.get('pos_iniziali').updateValueAndValidity();
    }

  }


}
