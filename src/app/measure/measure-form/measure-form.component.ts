import { Component, OnInit, Inject, AfterContentInit, Output, ViewChild, ɵConsole } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { I18nInterface, ImageDrawingComponent } from 'ngx-image-drawing';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Customer } from 'src/app/customers/data.model';
import { QueryParameter } from 'src/app/backend-service/data.model';
import { Measure, Measurer } from 'src/app/measurers/data.model';
import { isUndefined } from 'util';
import { Base64Utility } from '../data.model';

// interface ShirtIndicator {
//   idmisurometri: string,
//   descrizione: string,
//   fasonatori_idfasonatori: string
// }

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

  measure: Measure;
  formModal: string = 'inserimento';
  customer: Customer;
  
  flagA: boolean;
  flagB: boolean;

  dummy_data: string = 'X,Y'

   // ##############################  
  // COMPONENTE DISEGNO
  viewOldBase64: boolean = false;

  public locale: string = 'en';
  public width = window.innerWidth - 60;
  public height = window.innerHeight - 250;  
  public Aggiorna = false;
  public Appunti: string ;
  public AppuntiBase64;
    
  public i18n: I18nInterface = {
      saveBtn: 'Salva le modifiche!',
      sizes: {
          extra: 'Extra'
      }
  };

  @ViewChild(ImageDrawingComponent, { static: false })
  private IDC: ImageDrawingComponent;   


  // ##############################

  //Struttura dati per contenere i dati dei recuperati tramite chiamata REST
  shirtIndicators: Measurer[];

  //Dati cablati non recuperati con chiamata REST
  // 14.5, 15, 15.5, 16 ... 23
  // shirtIndicatorSizes: ShirtIndicatorSize[] = [    
  //   {taglia: '14 ½'},
  //   {taglia: '15'},
  //   {taglia: '15 ½'},
  //   {taglia: '15 ¾'},
  //   {taglia: '16'},
  //   {taglia: '16 ½'},
  //   {taglia: '17'},
  //   {taglia: '17 ½'},
  //   {taglia: '18'},
  //   {taglia: '18 ½'},
  //   {taglia: '19'},
  //   {taglia: '19 ½'},
  //   {taglia: '20'},
  //   {taglia: '20 ½'},
  //   {taglia: '21'},
  //   {taglia: '21 ½'},
  //   {taglia: '22'},
  //   {taglia: '22 ½'},
  //   {taglia: '23'}              
  // ]; 
  shirtIndicatorSizes: ShirtIndicatorSize[] = [    
    {taglia: '34'},
    {taglia: '35'},
    {taglia: '36'},
    {taglia: '36'},
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
    {taglia: '48'},
    {taglia: '49'},    
    {taglia: '50'}              
  ];   

  reactiveForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) data,
       public restBackendService: RESTBackendService) {

        // COMPONENTE DISEGNO
        this.locale = this.getNavigatorLanguage();
        this.viewOldBase64 = false;
        // COMPONENTE DISEGNO
         
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
          avambraccio: new FormControl(''),

          fondo_avambraccio: new FormControl(''),
          passaggi_a_mano: new FormControl(''),
          
          lunghezza_camicia: new FormControl(''),
          centro_schiena: new FormControl(''),
          vita_dietro: new FormControl(''),
          bacino_dietro: new FormControl(''),
          polso: new FormControl(''),          

          bacino: new FormControl(''),    //INPUT campo Lunghezza Camicia Dietro mappato sul campo bacino dell'entità del DB 

          torace_1_bottone: new FormControl(''),
          torace_2_bottone: new FormControl(''),
          torace_3_bottone: new FormControl(''),

          torace_4_bottone: new FormControl(''),
          torace_5_bottone: new FormControl(''),
          torace_6_bottone: new FormControl(''),
          torace_7_bottone: new FormControl(''),
          torace_8_bottone: new FormControl(''),

          note_grafiche: new FormControl(''),

          note: new FormControl(''),

          formModal: new FormControl('')

        });
        
        var obj = {'controls': this.reactiveForm.value, 'base64': this.AppuntiBase64};
   }

  ngOnInit() {

    //Si recuperano i misuratori per popolare il combobox

    this.restBackendService.getResource('measurers').subscribe(
      (data) => {
            // INIZIO - si eliminano i duplicati
            var measurers: Measurer[] = data;
            measurers.sort((a, b) => (a.descrizione > b.descrizione) ? 1 : -1);
            console.log('misurometri ordinati',measurers);

            var measurersDistinct = [measurers[0]];
            for (var i=1; i<measurers.length; i++) {
               if (measurers[i].descrizione!=measurers[i-1].descrizione) measurersDistinct.push(measurers[i]);
            }
            console.log('misurometri selezionati',measurersDistinct);
            // FINE

            this.shirtIndicators = measurersDistinct; 
            // console.log(data);
            //Si cercano le ultime misure se presenti per popolare gli input  
            this.getRemoteDataQuery('measuresQuery',{idclienti: String(this.customer.idclienti)})


            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );



  }

  // OVERRIDE

  public getRemoteDataQuery(tagResourse: string, queryParameter: QueryParameter):any {

    this.resourceQuery = [];
      // chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
    this.restBackendService.getResourceQuery(tagResourse,
      'idclienti' + '=' + queryParameter.idclienti).subscribe(
      (data) => {

            this.reactiveForm.get('idcliente').setValue(this.customer.idclienti);                          
            
            this.resourceQuery = data;

            // console.log('remoteData');
            // console.log(this.resourceQuery);

            if(this.resourceQuery.length > 0){

              console.log('misura esistente');                       
              this.measure = this.resourceQuery[this.resourceQuery.length-1];  
              console.log(this.measure);             
              
              // this.formModal = 'aggiornamento';
  
              //si inizializzano i campi del form
              console.log('MISUROMETRO: ' + this.measure.misurometro);
              this.reactiveForm.get('shirtIndicatorControl').setValue(this.measure.misurometro);              
              this.reactiveForm.get('shirtIndicatorControlSize').setValue(this.measure.taglia_misurometro);   
  
              this.reactiveForm.get('collo').setValue(parseFloat(this.measure.collo).toFixed(1));   
              this.reactiveForm.get('spalla').setValue(parseFloat(this.measure.spalla).toFixed(1));   
              this.reactiveForm.get('lunghezza_manica').setValue(parseFloat(this.measure.lung_bicipite).toFixed(1));   
              this.reactiveForm.get('bicipite').setValue(parseFloat(this.measure.bicipite).toFixed(1));   
              this.reactiveForm.get('avambraccio').setValue(parseFloat(this.measure.avambraccio).toFixed(1));  

              this.reactiveForm.get('fondo_avambraccio').setValue(parseFloat(this.measure.fondo_avambraccio).toFixed(1));   
              this.reactiveForm.get('passaggi_a_mano').setValue(parseFloat(this.measure.passaggi_a_mano).toFixed(1));   
                
              this.reactiveForm.get('lunghezza_camicia').setValue(parseFloat(this.measure.lung_camicia).toFixed(1));  
              this.reactiveForm.get('centro_schiena').setValue(parseFloat(this.measure.lung_avambraccio).toFixed(1));  
              this.reactiveForm.get('vita_dietro').setValue(parseFloat(this.measure.vita_dietro).toFixed(1));  
              this.reactiveForm.get('bacino_dietro').setValue(parseFloat(this.measure.bacino_dietro).toFixed(1));  
              this.reactiveForm.get('polso').setValue(parseFloat(this.measure.polso).toFixed(1));  

              this.reactiveForm.get('bacino').setValue(parseFloat(this.measure.bacino).toFixed(1));  
  
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
                                                           
              // INIZIO COMPONENTE DISEGNO
              if ( this.measure.note_grafiche == '' ) {
                this.Appunti = "../../assets/images/CamiciaCompleta.jpg";
              } else { 
                this.AppuntiBase64 = 'data:image/png;base64,' + this.measure.note_grafiche;
                this.Appunti = this.AppuntiBase64;
              }
              // FINE COMPONENTE DISEGNO

              this.reactiveForm.get('note').setValue(this.measure.note);  

              this.reactiveForm.get('formModal').setValue(this.formModal); 
                
              this.flagA = true;
              this.flagB = true;

            } else {

              this.setFormDefaultValue();
                          
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
        this.reactiveForm.get('spalla').setValue(  (parseFloat(this.reactiveForm.get('spalla').value) + 0.1).toFixed(1)  ); 
        break;   
      case 'lunghezza_manica':
        this.reactiveForm.get('lunghezza_manica').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_manica').value) + 0.5).toFixed(1)  ); 
        break;          
      case 'bicipite':
        this.reactiveForm.get('bicipite').setValue(  (parseFloat(this.reactiveForm.get('bicipite').value) + 0.5).toFixed(1)  );  
        break;          
      case 'avambraccio':
        this.reactiveForm.get('avambraccio').setValue(  (parseFloat(this.reactiveForm.get('avambraccio').value) + 0.5).toFixed(1)  ); 
        break;  

      case 'fondo_avambraccio':
        this.reactiveForm.get('fondo_avambraccio').setValue(  (parseFloat(this.reactiveForm.get('fondo_avambraccio').value) + 0.5).toFixed(1)  ); 
        break;                  
      case 'passaggi_a_mano':
        this.reactiveForm.get('passaggi_a_mano').setValue(  (parseFloat(this.reactiveForm.get('passaggi_a_mano').value) + 0.5).toFixed(1)  ); 
        break;            
                
      case 'lunghezza_camicia':
        this.reactiveForm.get('lunghezza_camicia').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_camicia').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'centro_schiena':
        this.reactiveForm.get('centro_schiena').setValue(  (parseFloat(this.reactiveForm.get('centro_schiena').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'vita_dietro':
        this.reactiveForm.get('vita_dietro').setValue(  (parseFloat(this.reactiveForm.get('vita_dietro').value) + 0.5).toFixed(1)  ); 
        break;   
      case 'bacino_dietro':
        this.reactiveForm.get('bacino_dietro').setValue(  (parseFloat(this.reactiveForm.get('bacino_dietro').value) + 0.5).toFixed(1)  ); 
        break; 
      case 'polso':
        this.reactiveForm.get('polso').setValue(  (parseFloat(this.reactiveForm.get('polso').value) + 0.5).toFixed(1)  ); 
        break;   
        
      case 'bacino':
        this.reactiveForm.get('bacino').setValue(  (parseFloat(this.reactiveForm.get('bacino').value) + 0.5).toFixed(1)  ); 
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
        this.reactiveForm.get('spalla').setValue(  (parseFloat(this.reactiveForm.get('spalla').value) - 0.1).toFixed(1)  ); 
        break;   
      case 'lunghezza_manica':
        this.reactiveForm.get('lunghezza_manica').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_manica').value) - 0.5).toFixed(1)  ); 
        break;          
      case 'bicipite':
        this.reactiveForm.get('bicipite').setValue(  (parseFloat(this.reactiveForm.get('bicipite').value) - 0.5).toFixed(1)  );  
        break;          
      case 'avambraccio':
        this.reactiveForm.get('avambraccio').setValue(  (parseFloat(this.reactiveForm.get('avambraccio').value) - 0.5).toFixed(1)  ); 
        break;  

      case 'fondo_avambraccio':
        this.reactiveForm.get('fondo_avambraccio').setValue(  (parseFloat(this.reactiveForm.get('fondo_avambraccio').value) - 0.5).toFixed(1)  ); 
        break; 
      case 'passaggi_a_mano':
        this.reactiveForm.get('passaggi_a_mano').setValue(  (parseFloat(this.reactiveForm.get('passaggi_a_mano').value) - 0.5).toFixed(1)  ); 
        break;                  
                
      case 'lunghezza_camicia':
        this.reactiveForm.get('lunghezza_camicia').setValue(  (parseFloat(this.reactiveForm.get('lunghezza_camicia').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'centro_schiena':
        this.reactiveForm.get('centro_schiena').setValue(  (parseFloat(this.reactiveForm.get('centro_schiena').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'vita_dietro':
        this.reactiveForm.get('vita_dietro').setValue(  (parseFloat(this.reactiveForm.get('vita_dietro').value) - 0.5).toFixed(1)  ); 
        break;   
      case 'bacino_dietro':
        this.reactiveForm.get('bacino_dietro').setValue(  (parseFloat(this.reactiveForm.get('bacino_dietro').value) - 0.5).toFixed(1)  ); 
        break; 
      case 'polso':
        this.reactiveForm.get('polso').setValue(  (parseFloat(this.reactiveForm.get('polso').value) - 0.5).toFixed(1)  ); 
        break; 

      case 'bacino':
        this.reactiveForm.get('bacino').setValue(  (parseFloat(this.reactiveForm.get('bacino').value) - 0.5).toFixed(1)  ); 
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

  shirtIndicatorChanged() {
    this.flagA = true;
    this.setFormDefaultValue();
  }

  setFormDefaultValue() {

    this.flagB = false;

    this.reactiveForm.get('shirtIndicatorControlSize').setValue('');   

    this.reactiveForm.get('collo').setValue(Number(45).toFixed(1));   
    this.reactiveForm.get('spalla').setValue(Number(0).toFixed(1));   
    this.reactiveForm.get('lunghezza_manica').setValue(Number(0).toFixed(1));   
    this.reactiveForm.get('bicipite').setValue(Number(0).toFixed(1));   
    this.reactiveForm.get('avambraccio').setValue(Number(0).toFixed(1));   
      
    this.reactiveForm.get('lunghezza_camicia').setValue(Number(0).toFixed(1));  
    this.reactiveForm.get('centro_schiena').setValue(Number(0).toFixed(1));  
    this.reactiveForm.get('vita_dietro').setValue(Number(0).toFixed(1));  
    this.reactiveForm.get('bacino_dietro').setValue(Number(0).toFixed(1));  
    this.reactiveForm.get('polso').setValue(Number(20).toFixed(1));  

    this.reactiveForm.get('bacino').setValue(Number(0).toFixed(1));  

    this.reactiveForm.get('torace_1_bottone').setValue(Number(0).toFixed(1));  
    this.reactiveForm.get('torace_2_bottone').setValue(Number(0).toFixed(1));                
    this.reactiveForm.get('torace_3_bottone').setValue(Number(0).toFixed(1));                
    this.reactiveForm.get('torace_4_bottone').setValue(Number(0).toFixed(1));                
    this.reactiveForm.get('torace_5_bottone').setValue(Number(0).toFixed(1));                
    this.reactiveForm.get('torace_6_bottone').setValue(Number(0).toFixed(1));                
    this.reactiveForm.get('torace_7_bottone').setValue(Number(0).toFixed(1));                
    this.reactiveForm.get('torace_8_bottone').setValue(Number(0).toFixed(1));  

    this.reactiveForm.get('note').setValue('');  
    
    this.Appunti = "../../assets/images/CamiciaCompleta.jpg";

    this.reactiveForm.get('formModal').setValue(this.formModal);     

  }


  // COMPONENTE DISEGNO
  private getNavigatorLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : (navigator as any).userLanguage || navigator.language || (navigator as any).browserLanguage || 'en';
  public notificaAppuntiBase64(){

    this.AppuntiBase64 =  this.IDC.getImage();	
    this.Appunti = this.AppuntiBase64;
    // console.log(this.AppuntiBase64);
    // console.log('invio degli appunti + base64 al parent');      
      
  }

  pulisci() {
    this.IDC.clearCanvas();
    //Aggiunto
    this.Appunti = "../../assets/images/CamiciaCompleta.jpg";       
    this.AppuntiBase64 = Base64Utility.base64ShirtEmpty;

 }    

  public catturadisegno() {
      console.log('catturadisegno');             
      this.AppuntiBase64 =  this.IDC.getImage();	
  }


  // CONPONENTE DISEGNO
}
