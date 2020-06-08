import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { I18nInterface } from 'ngx-image-drawing';

interface ShirtIndicator {
  idmisurometri: string,
  descrizione: string,
  fasonatori_idfasonatori: string
}

interface ShirtIndicatorSize {
  taglia: string,
}

@Component({
  selector: 'app-cu-form',
  templateUrl: './cu-form.component.html',
  styleUrls: ['./cu-form.component.css']
})
export class CuFormComponent implements OnInit {

  formModal: string = 'empty';
  name: string = 'empty';
  dummy_data: string = 'X,Y'

  // attributi della misura
  //colonna 1
  collo: number = 45.0;  //valore di default noto
  spalla: number = 0.0;
  bicipite: number = 0.0;
  lunghezza_bicipite: number = 0.0;
  vita_dietro: number = 0.0;  
  //colonna 2
  polso: number = 18.0 //valore di default noto
  lunghezza_camicia: number = 0.0;
  avambraccio: number = 0.0;
  lunghezza_avambraccio: number = 0.0;
  bacino_dietro: number = 0.0;
  //colonna 3
  torace_1_bottone: number = 0.0;
  torace_2_bottone: number = 0.0;
  torace_3_bottone: number = 0.0;
  //colonna 4
  bacino_4_bottone: number = 0.0;
  bacino_5_bottone: number = 0.0;
  bacino_6_bottone: number = 0.0;
  bacino_7_bottone: number = 0.0;
  bacino_8_bottone: number = 0.0;

// ##############################
public locale: string = 'en';
    public width = window.innerWidth - 60;
    public height = window.innerHeight - 250;

    public i18n: I18nInterface = {
        saveBtn: 'Salva le modifiche!',
        sizes: {
            extra: 'Extra'
        }
    };
// ##############################  


  constructor(@Inject(MAT_DIALOG_DATA) data) {

    this.formModal = data.formModal;
    this.name = data.nominativo;
   }

  ngOnInit() {
  }

  shirtIndicatorControl = new FormControl('', Validators.required);
  shirtIndicators: ShirtIndicator[] = [
    {idmisurometri: '1', descrizione: 'misuratore 1', fasonatori_idfasonatori: '1'},
    {idmisurometri: '2', descrizione: 'misuratore 2', fasonatori_idfasonatori: '2'},
    {idmisurometri: '3', descrizione: 'misuratore 3', fasonatori_idfasonatori: '3'}
  ];  

  shirtIndicatorControlSize = new FormControl('', Validators.required);
  shirtIndicatorSizes: ShirtIndicatorSize[] = [
    {taglia: 'S'},
    {taglia: 'M'},
    {taglia: 'L'},
    {taglia: 'XL'},
    {taglia: 'XXL'},
    {taglia: '3XL'},                
  ];  

  buttonIncrease(key: string){
    switch (key) {
      case 'collo':
        this.collo = this.collo + 0.5; 
        break;
      case 'spalla':
        this.spalla = this.spalla + 0.5; 
        break;   
      case 'bicipite':
        this.bicipite = this.bicipite + 0.5; 
        break;          
      case 'lunghezza_bicipite':
        this.lunghezza_bicipite = this.lunghezza_bicipite + 0.5; 
        break;          
      case 'vita_dietro':
        this.vita_dietro = this.vita_dietro + 0.5; 
        break;   
               
      case 'polso':
        this.polso = this.polso + 0.5; 
        break;   
      case 'lunghezza_camicia':
        this.lunghezza_camicia = this.lunghezza_camicia + 0.5; 
        break;   
      case 'avambraccio':
        this.avambraccio = this.avambraccio + 0.5; 
        break;   
      case 'lunghezza_avambraccio':
        this.lunghezza_avambraccio = this.lunghezza_avambraccio + 0.5; 
        break;   
      case 'bacino_dietro':
        this.bacino_dietro = this.bacino_dietro + 0.5; 
        break; 
        
      case 'torace_1_bottone':
        this.torace_1_bottone = this.torace_1_bottone + 0.5; 
        break;          
      case 'torace_2_bottone':
        this.torace_2_bottone = this.torace_2_bottone + 0.5; 
        break; 
      case 'torace_3_bottone':
        this.torace_3_bottone = this.torace_3_bottone + 0.5; 
        break; 
        
      case 'bacino_4_bottone':
        this.bacino_4_bottone = this.bacino_4_bottone + 0.5; 
        break; 
      case 'bacino_5_bottone':
        this.bacino_5_bottone = this.bacino_5_bottone + 0.5; 
        break;         
      case 'bacino_6_bottone':
        this.bacino_6_bottone = this.bacino_6_bottone + 0.5; 
        break; 
      case 'bacino_7_bottone':
        this.bacino_7_bottone = this.bacino_7_bottone + 0.5; 
        break; 
      case 'bacino_8_bottone':
        this.bacino_8_bottone = this.bacino_8_bottone + 0.5; 
        break;                         
      default:
        break;
    }    
  }

  buttonDecrease(key: string){
    switch (key) {
      case 'collo':
        this.collo = this.collo - 0.5; 
        break;
      case 'spalla':
        this.spalla = this.spalla - 0.5; 
        break; 
      case 'bicipite':
        this.bicipite = this.bicipite - 0.5; 
        break; 
      case 'lunghezza_bicipite':
        this.lunghezza_bicipite = this.lunghezza_bicipite - 0.5; 
        break;          
      case 'vita_dietro':
        this.vita_dietro = this.vita_dietro - 0.5; 
        break;   
                
      case 'polso':
        this.polso = this.polso - 0.5; 
        break;   
      case 'lunghezza_camicia':
        this.lunghezza_camicia = this.lunghezza_camicia - 0.5; 
        break;   
      case 'avambraccio':
        this.avambraccio = this.avambraccio - 0.5; 
        break;   
      case 'lunghezza_avambraccio':
        this.lunghezza_avambraccio = this.lunghezza_avambraccio - 0.5; 
        break;   
      case 'bacino_dietro':
        this.bacino_dietro = this.bacino_dietro - 0.5; 
        break;  
        
      case 'torace_1_bottone':
        this.torace_1_bottone = this.torace_1_bottone - 0.5; 
        break;          
      case 'torace_2_bottone':
        this.torace_2_bottone = this.torace_2_bottone - 0.5; 
        break; 
      case 'torace_3_bottone':
        this.torace_3_bottone = this.torace_3_bottone - 0.5; 
        break; 
        
      case 'bacino_4_bottone':
        this.bacino_4_bottone = this.bacino_4_bottone - 0.5; 
        break; 
      case 'bacino_5_bottone':
        this.bacino_5_bottone = this.bacino_5_bottone - 0.5; 
        break;         
      case 'bacino_6_bottone':
        this.bacino_6_bottone = this.bacino_6_bottone - 0.5; 
        break; 
      case 'bacino_7_bottone':
        this.bacino_7_bottone = this.bacino_7_bottone - 0.5; 
        break; 
      case 'bacino_8_bottone':
        this.bacino_8_bottone = this.bacino_8_bottone - 0.5; 
        break;    

      default:
        break;
    }   
  }

}
