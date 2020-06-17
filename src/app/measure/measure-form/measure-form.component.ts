import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { I18nInterface } from 'ngx-image-drawing';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Customer } from 'src/app/customers/data.model';
import { QueryParameter } from 'src/app/backend-service/data.model';
import { Measure } from 'src/app/measurers/data.model';

interface ShirtIndicator {
  idmisurometri: string,
  descrizione: string,
  fasonatori_idfasonatori: string
}

interface ShirtIndicatorSize {
  taglia: string,
}

@Component({
  selector: 'app-measure-form',
  templateUrl: './measure-form.component.html',
  styleUrls: ['./measure-form.component.css']
})
export class MeasureFormComponent implements OnInit, AfterContentInit  {

  private resourceQuery: Array<any> = [];

  private measure: Measure;
  private formModal: string = 'empty';
  private customer: Customer;
  
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

  //Struttura dati per contenere i dati dei recuperati tramite chiamata REST
  shirtIndicators: ShirtIndicator[] = [];

  //Dati cablati non recuperati con chiamata REST
  shirtIndicatorSizes: ShirtIndicatorSize[] = [
    {taglia: '37'},
    {taglia: '38'},
    {taglia: '39'},
    {taglia: '40'},
    {taglia: '41'},
    {taglia: '42'},
    {taglia: '43'},
    {taglia: '44'},                
    {taglia: '45'},                
    {taglia: '46'},                
    {taglia: '47'},                
  ];  

  reactiveForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) data,
       public restBackendService: RESTBackendService) {
         
        //inizializzazione delle strutture dati
        this.formModal = data.formModal;     
        
        this.customer = new Customer();
        Object.assign(this.customer, data.customer)
        this.measure = new Measure();

        this.formModal = 'inserimento';

        //costruzione del reactive form
        this.reactiveForm = new FormGroup({
          shirtIndicatorControl: new FormControl('', Validators.required),
          shirtIndicatorControlSize: new FormControl('', Validators.required),
          collo: new FormControl(''),

        });        
   }

  ngOnInit() {

    //Si recuperano i misuratori per popolare il combobox
    this.getRemoteDataForShirtIndicators('measurers');

    //Si cercano le ultime misure se presenti per popolare gli input  
    this.getRemoteDataQuery('measuresQuery',{idclienti: String(this.customer.idclienti)})

  }

  ngAfterContentInit(): void {

    console.log('ngAfterContentInit');

    var value: number;

    if (this.formModal == 'aggiornamento') {  
          
      value = parseFloat(this.measure.collo);
    } else {
      value = 45.0;
    }
    this.reactiveForm.get('collo').setValue(value.toFixed(1));     
    
  }

  private getRemoteDataForShirtIndicators(tagResourse: string):any {
    //chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResource(tagResourse).subscribe(
      (data) => {
            this.shirtIndicators = data;          
            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );
  }

  public getRemoteDataQuery(tagResourse: string, queryParameter: QueryParameter):any {

    this.resourceQuery = [];
      // chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResourceQuery(tagResourse,
      'iclienti' + '=' + queryParameter.idclienti).subscribe(
      (data) => {

            //ordinamento decrescente in base alla data          
            this.resourceQuery = data;
            this.measure = this.resourceQuery[this.resourceQuery.length-1];
            this.formModal = 'aggiornamento';

            },
      (error) => {
        console.error(error);
        console.error('Message: ' + error.message);
      }
    );
  }
  
  

  buttonIncrease(key: string){
    switch (key) {
      case 'collo':
        this.reactiveForm.get('collo').setValue(  (parseFloat(this.reactiveForm.get('collo').value) + 0.5).toFixed(1)  ) ; 
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
        this.reactiveForm.get('collo').setValue(  (parseFloat(this.reactiveForm.get('collo').value) - 0.5).toFixed(1)  ) ; 
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
