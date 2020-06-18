import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { I18nInterface } from 'ngx-image-drawing';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Customer } from 'src/app/customers/data.model';
import { QueryParameter } from 'src/app/backend-service/data.model';
import { Measure } from 'src/app/measurers/data.model';
import { isUndefined } from 'util';

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
export class MeasureFormComponent implements OnInit  {

  private resourceQuery: Array<any> = [];

  private measure: Measure;
  private formModal: string = 'inserimento';
  private customer: Customer;
  
  private flagA: boolean;
  private flagB: boolean;

  dummy_data: string = 'X,Y'

  // attributi della misura
  //colonna 1
  // collo: number = 45.0;  //valore di default noto
  // spalla: number = 0.0;
  // bicipite: number = 0.0;
  // lunghezza_bicipite: number = 0.0;
  // vita_dietro: number = 0.0;  
  // //colonna 2
  // polso: number = 18.0 //valore di default noto
  // lunghezza_camicia: number = 0.0;
  // avambraccio: number = 0.0;
  // lunghezza_avambraccio: number = 0.0;
  // bacino_dietro: number = 0.0;
  // //colonna 3
  // torace_1_bottone: number = 0.0;
  // torace_2_bottone: number = 0.0;
  // torace_3_bottone: number = 0.0;
  // //colonna 4
  // torace_4_bottone: number = 0.0;
  // torace_5_bottone: number = 0.0;
  // torace_6_bottone: number = 0.0;
  // torace_7_bottone: number = 0.0;
  // torace_8_bottone: number = 0.0;

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
        this.customer = new Customer();
        Object.assign(this.customer, data.customer)
        this.measure = new Measure();

        this.formModal = 'inserimento';
        
        this.flagA = false;
        this.flagB = false;

        //costruzione del reactive form
        this.reactiveForm = new FormGroup({
          
          idcliente: new FormControl(''),

          shirtIndicatorControl: new FormControl('', Validators.required),
          shirtIndicatorControlSize: new FormControl('', Validators.required),
          
          collo: new FormControl(''),
          spalla: new FormControl(''),
          lunghezza_manica: new FormControl(''),
          bicipite: new FormControl(''),
          vita_dietro: new FormControl(''),

          polso: new FormControl(''),
          lunghezza_camicia: new FormControl(''),
          avambraccio: new FormControl(''),
          lunghezza_avambraccio: new FormControl(''),
          bacino_dietro: new FormControl(''),

          torace_1_bottone: new FormControl(''),
          torace_2_bottone: new FormControl(''),
          torace_3_bottone: new FormControl(''),

          torace_4_bottone: new FormControl(''),
          torace_5_bottone: new FormControl(''),
          torace_6_bottone: new FormControl(''),
          torace_7_bottone: new FormControl(''),
          torace_8_bottone: new FormControl(''),

          note_grafiche: new FormControl(''),

          formModal: new FormControl('')

        });                
   }

  ngOnInit() {

    //Si recuperano i misuratori per popolare il combobox
    this.getRemoteDataForShirtIndicators('measurers');

    //Si cercano le ultime misure se presenti per popolare gli input  
    this.getRemoteDataQuery('measuresQuery',{idclienti: String(this.customer.idclienti)})

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
      'idclienti' + '=' + queryParameter.idclienti).subscribe(
      (data) => {

            this.reactiveForm.get('idcliente').setValue(this.customer.idclienti);                          
            
            this.resourceQuery = data;
            console.log(this.resourceQuery);

            if(this.resourceQuery.length > 0){

              console.log('misura esistente');        
               
              this.measure = this.resourceQuery[this.resourceQuery.length-1];
               
              this.formModal = 'aggiornamento';
  
              //si inizializzano i campi del form
              this.reactiveForm.controls['shirtIndicatorControl'].setValue(this.measure.misurometro);              
              this.reactiveForm.get('shirtIndicatorControlSize').setValue(this.measure.taglia_misurometro);   
  
              this.reactiveForm.get('collo').setValue(parseFloat(this.measure.collo).toFixed(1));   
              this.reactiveForm.get('spalla').setValue(parseFloat(this.measure.spalla).toFixed(1));   
              this.reactiveForm.get('lunghezza_manica').setValue(parseFloat(this.measure.lung_bicipite).toFixed(1));   
              this.reactiveForm.get('bicipite').setValue(parseFloat(this.measure.bicipite).toFixed(1));   
              this.reactiveForm.get('vita_dietro').setValue(parseFloat(this.measure.vita_dietro).toFixed(1));   
  
              this.reactiveForm.get('polso').setValue(parseFloat(this.measure.polso).toFixed(1));  
              this.reactiveForm.get('lunghezza_camicia').setValue(parseFloat(this.measure.lung_camicia).toFixed(1));  
              this.reactiveForm.get('avambraccio').setValue(parseFloat(this.measure.avambraccio).toFixed(1));  
              this.reactiveForm.get('lunghezza_avambraccio').setValue(parseFloat(this.measure.lung_avambraccio).toFixed(1));  
              this.reactiveForm.get('bacino_dietro').setValue(parseFloat(this.measure.bacino_dietro).toFixed(1));  
  
  
              if(!isNaN(parseFloat(this.measure.torace.split(';')[0])))
                this.reactiveForm.get('torace_1_bottone').setValue(parseFloat(this.measure.torace.split(';')[0]).toFixed(1));  
              else
                this.reactiveForm.get('torace_1_bottone').setValue(Number(0).toFixed(1));  
  
              if(isUndefined(this.measure.torace.split(';')[1]))
                this.reactiveForm.get('torace_2_bottone').setValue(Number(0).toFixed(1));                
              else
                this.reactiveForm.get('torace_2_bottone').setValue(parseFloat(this.measure.torace.split(';')[1]).toFixed(1));                            
  
                if(isUndefined(this.measure.torace.split(';')[2]))
                this.reactiveForm.get('torace_3_bottone').setValue(Number(0).toFixed(1));                
              else
                this.reactiveForm.get('torace_3_bottone').setValue(parseFloat(this.measure.torace.split(';')[2]).toFixed(1));                            
  
                if(isUndefined(this.measure.torace.split(';')[3]))
                this.reactiveForm.get('torace_4_bottone').setValue(Number(0).toFixed(1));                
              else
                this.reactiveForm.get('torace_4_bottone').setValue(parseFloat(this.measure.torace.split(';')[3]).toFixed(1));                            
  
                if(isUndefined(this.measure.torace.split(';')[4]))
                this.reactiveForm.get('torace_5_bottone').setValue(Number(0).toFixed(1));                
              else
                this.reactiveForm.get('torace_5_bottone').setValue(parseFloat(this.measure.torace.split(';')[4]).toFixed(1));                            
  
                if(isUndefined(this.measure.torace.split(';')[5]))
                this.reactiveForm.get('torace_6_bottone').setValue(Number(0).toFixed(1));                
              else
                this.reactiveForm.get('torace_6_bottone').setValue(parseFloat(this.measure.torace.split(';')[5]).toFixed(1));                            
  
                if(isUndefined(this.measure.torace.split(';')[6]))
                this.reactiveForm.get('torace_7_bottone').setValue(Number(0).toFixed(1));                
              else
                this.reactiveForm.get('torace_7_bottone').setValue(parseFloat(this.measure.torace.split(';')[6]).toFixed(1));                            
                       
              if(isUndefined(this.measure.torace.split(';')[7]))
                this.reactiveForm.get('torace_8_bottone').setValue(Number(0).toFixed(1));                
              else
                this.reactiveForm.get('torace_8_bottone').setValue(parseFloat(this.measure.torace.split(';')[7]).toFixed(1)); 
                                
              
              //si recupera il base64
              // var idmisure = this.measure.idmisure;
              // this.restBackendService.getResourceQuery(tagResourse,
              //   'idmisure' + '=' + idmisure).subscribe(data =>{
              //     this.reactiveForm.get('note_grafiche').setValue(data[0].note_grafiche);
              //   });                
              this.reactiveForm.get('note_grafiche').setValue(this.measure.note_grafiche);        
              
              this.reactiveForm.get('formModal').setValue(this.formModal); 
                
              this.flagA = true;
              this.flagB = true;

            } else {

              this.reactiveForm.get('collo').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('spalla').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('lunghezza_manica').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('bicipite').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('vita_dietro').setValue(Number(0).toFixed(1));   
  
              this.reactiveForm.get('polso').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('lunghezza_camicia').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('avambraccio').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('lunghezza_avambraccio').setValue(Number(0).toFixed(1));   
              this.reactiveForm.get('bacino_dietro').setValue(Number(0).toFixed(1));   

              this.reactiveForm.get('torace_1_bottone').setValue(Number(0).toFixed(1));  
              this.reactiveForm.get('torace_2_bottone').setValue(Number(0).toFixed(1));                
              this.reactiveForm.get('torace_3_bottone').setValue(Number(0).toFixed(1));                
              this.reactiveForm.get('torace_4_bottone').setValue(Number(0).toFixed(1));                
              this.reactiveForm.get('torace_5_bottone').setValue(Number(0).toFixed(1));                
              this.reactiveForm.get('torace_6_bottone').setValue(Number(0).toFixed(1));                
              this.reactiveForm.get('torace_7_bottone').setValue(Number(0).toFixed(1));                
              this.reactiveForm.get('torace_8_bottone').setValue(Number(0).toFixed(1));  
              
              this.reactiveForm.get('note_grafiche').setValue('');

              this.reactiveForm.get('formModal').setValue(this.formModal); 

            }        

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
        this.reactiveForm.get('collo').setValue(  (parseFloat(this.reactiveForm.get('collo').value) + 0.5).toFixed(1)  ); 
        break;
      case 'spalla':
        this.reactiveForm.get('spalla').setValue(  (parseFloat(this.reactiveForm.get('spalla').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'lunghezza_manica':
        this.reactiveForm.get('lunghezza_manica').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_manica').value) + 0.5).toFixed(1)  ); 
        break;          
      case 'bicipite':
        this.reactiveForm.get('bicipite').setValue(  (parseFloat(this.reactiveForm.get('bicipite').value) + 0.5).toFixed(1)  );  
        break;          
      case 'vita_dietro':
        this.reactiveForm.get('collo').setValue(  (parseFloat(this.reactiveForm.get('collo').value) + 0.5).toFixed(1)  ); 
        break;   
               
      case 'polso':
        this.reactiveForm.get('polso').setValue(  (parseFloat(this.reactiveForm.get('polso').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'lunghezza_camicia':
        this.reactiveForm.get('lunghezza_camicia').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_camicia').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'avambraccio':
        this.reactiveForm.get('avambraccio').setValue(  (parseFloat(this.reactiveForm.get('avambraccio').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'lunghezza_avambraccio':
        this.reactiveForm.get('lunghezza_avambraccio').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_avambraccio').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'bacino_dietro':
        this.reactiveForm.get('bacino_dietro').setValue(  (parseFloat(this.reactiveForm.get('bacino_dietro').value) + 0.5).toFixed(1)  ); 
        break; 
        
      case 'torace_1_bottone':
        this.reactiveForm.get('torace_1_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_1_bottone').value) + 0.5).toFixed(1)  ); 
        break;          
      case 'torace_2_bottone':
        this.reactiveForm.get('torace_2_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_2_bottone').value) + 0.5).toFixed(1)  ); 
        break; 
      case 'torace_3_bottone':
        this.reactiveForm.get('torace_3_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_3_bottone').value) + 0.5).toFixed(1)  ); 
        break; 
        
      case 'torace_4_bottone':
        this.reactiveForm.get('torace_4_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_4_bottone').value) + 0.5).toFixed(1)  ); 
        break; 
      case 'torace_5_bottone':
        this.reactiveForm.get('torace_5_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_5_bottone').value) + 0.5).toFixed(1)  ); 
        break;         
      case 'torace_6_bottone':
        this.reactiveForm.get('torace_6_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_6_bottone').value) + 0.5).toFixed(1)  ); 
        break; 
      case 'torace_7_bottone':
        this.reactiveForm.get('torace_7_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_7_bottone').value) + 0.5).toFixed(1)  ); 
        break; 
      case 'torace_8_bottone':
        this.reactiveForm.get('torace_8_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_8_bottone').value) + 0.5).toFixed(1)  ); 
        break;                         
      default:
        break;
    }

  }

  buttonDecrease(key: string){

    switch (key) {
      case 'collo':
        this.reactiveForm.get('collo').setValue(  (parseFloat(this.reactiveForm.get('collo').value) - 0.5).toFixed(1)  ); 
        break;
      case 'spalla':
        this.reactiveForm.get('spalla').setValue(  (parseFloat(this.reactiveForm.get('spalla').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'lunghezza_manica':
        this.reactiveForm.get('lunghezza_manica').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_manica').value) - 0.5).toFixed(1)  ); 
        break;          
      case 'bicipite':
        this.reactiveForm.get('bicipite').setValue(  (parseFloat(this.reactiveForm.get('bicipite').value) - 0.5).toFixed(1)  );  
        break;          
      case 'vita_dietro':
        this.reactiveForm.get('collo').setValue(  (parseFloat(this.reactiveForm.get('collo').value) - 0.5).toFixed(1)  ); 
        break;   
               
      case 'polso':
        this.reactiveForm.get('polso').setValue(  (parseFloat(this.reactiveForm.get('polso').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'lunghezza_camicia':
        this.reactiveForm.get('lunghezza_camicia').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_camicia').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'avambraccio':
        this.reactiveForm.get('avambraccio').setValue(  (parseFloat(this.reactiveForm.get('avambraccio').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'lunghezza_avambraccio':
        this.reactiveForm.get('lunghezza_avambraccio').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_avambraccio').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'bacino_dietro':
        this.reactiveForm.get('bacino_dietro').setValue(  (parseFloat(this.reactiveForm.get('bacino_dietro').value) - 0.5).toFixed(1)  ); 
        break; 
        
      case 'torace_1_bottone':
        this.reactiveForm.get('torace_1_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_1_bottone').value) - 0.5).toFixed(1)  ); 
        break;          
      case 'torace_2_bottone':
        this.reactiveForm.get('torace_2_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_2_bottone').value) - 0.5).toFixed(1)  ); 
        break; 
      case 'torace_3_bottone':
        this.reactiveForm.get('torace_3_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_3_bottone').value) - 0.5).toFixed(1)  ); 
        break; 
        
      case 'torace_4_bottone':
        this.reactiveForm.get('torace_4_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_4_bottone').value) - 0.5).toFixed(1)  ); 
        break; 
      case 'torace_5_bottone':
        this.reactiveForm.get('torace_5_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_5_bottone').value) - 0.5).toFixed(1)  ); 
        break;         
      case 'torace_6_bottone':
        this.reactiveForm.get('torace_6_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_6_bottone').value) - 0.5).toFixed(1)  ); 
        break; 
      case 'torace_7_bottone':
        this.reactiveForm.get('torace_7_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_7_bottone').value) - 0.5).toFixed(1)  ); 
        break; 
      case 'torace_8_bottone':
        this.reactiveForm.get('torace_8_bottone').setValue(  (parseFloat(this.reactiveForm.get('torace_8_bottone').value) - 0.5).toFixed(1)  ); 
        break;                         
      default:
        break;
    } 

  }


  catchAppuntiBase64(appuntiBase64: string){

    this.measure.note_grafiche = appuntiBase64;

    this.reactiveForm.get('note_grafiche').setValue(appuntiBase64);
    

  }
}
