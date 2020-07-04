import { Component, OnInit, Inject, ɵConsole } from '@angular/core';
import { MAT_DIALOG_DATA, DateAdapter, MatSnackBar } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { Measure } from 'src/app/measurers/data.model';
import { Customer } from 'src/app/customers/data.model';
import { Shirt } from 'src/app/shirts/shirt.model';
import { isUndefined } from 'util';

interface Subcontractor {
  idfasonatori: number,
  nominativo: string,
  telefono: string,
  email: string
}

interface DeliveryMode {
  descrizione: string
}

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {

  formModal: string = 'empty';
  nominativo: string = 'nome cognome';
  data_misura = 'gg/mm/yyyy';
  misure_misurometro = '#,# - ##,#'
  data_consegna = 'gg/mm/yyyy';

  public dataOrdineAperto: string = 'gg/mm/yyyy';
  public idOrdineAperto: number = 0;
  public shirtsInOrder: Shirt[];  

  editable: boolean = true; // per disabilitare l'inserimento nei campi totale ed acconto
  disableDeliveryControls: boolean = false; // per disabilitare l'inserimento nei campi modalità di consegna e data consegna

  public reactiveForm: FormGroup; // oggetto per gestire il form con l'approccio reactive
  public dataCustomer: Customer;
  public dataOrder: Order;
  public lastMeasure: Measure; ;
  public subcontractors: Subcontractor[];



  constructor( @Inject(MAT_DIALOG_DATA) data,
    private _adapter: DateAdapter<any>,
    public restBackendService: RESTBackendService,
    private _snackBar: MatSnackBar ) 
    {
      this.formModal = data.formModal; // inserimento / aggiornamento      
      this.dataCustomer = data.customer;
      this.dataOrder = data.order;
      this.lastMeasure = data.measure;

      //costruzione del reactive form
      this.reactiveForm = new FormGroup({
        
        idordini: new FormControl(''),
        data_ordine: new FormControl(''),          

        clienti_idclienti: new FormControl(''),
        id_misure_ordinate: new FormControl(''),

        fasonatori_idfasonatori: new FormControl('', Validators.required),
        
        totale: new FormControl('',Validators.required),
        saldo: new FormControl(''),
        acconto: new FormControl('',Validators.required),

        mod_consegna: new FormControl('',Validators.required),

        consegnato: new FormControl(''),
        saldato: new FormControl(''),

        data_consegna: new FormControl(''),
        
        note: new FormControl(''),
        note_x_fasonista: new FormControl(''),
   
      });       

    }

  ngOnInit() {

    this._adapter.setLocale('it');

    this.loadSubcontractor(); // si caricano i fasonisti

    this.nominativo = this.dataCustomer.nominativo + ' ( ' + this.dataCustomer.telefono + ' )' ;

    this.data_misura = this.lastMeasure.data_misure;
    this.data_misura = this.data_misura.split(' ')[0].split('/')[1] + '/' +
                                this.data_misura.split(' ')[0].split('/')[0] + '/' +             
                                this.data_misura.split(' ')[0].split('/')[2];

    this.reactiveForm.get('clienti_idclienti').setValue(this.dataCustomer.idclienti);          
    this.reactiveForm.get('id_misure_ordinate').setValue(this.lastMeasure.idmisure); 

    if ( this.formModal=='inserimento' ){      
    
      // SI CREA UN ORDINE VUOTO PER OTTENERE L'ID ORDINE
      this.restBackendService.postResource('orders',                  
      {
        "note": '',
        "acconto": '',
        "saldo": '',
        "totale": '',
        "data_consegna": '',
        "consegnato": '',
        "saldato": '',
        "note_x_fasonista": '',
        "mod_consegna": '',
        "data_ordine": this.getCurrentDateFormatted() ,
        "clienti_idclienti": this.dataCustomer.idclienti,
        "fasonatori_idfasonatori": 0,
        "id_misure_ordinate": this.lastMeasure.idmisure
      }).subscribe(
        (data) =>{

          this.dataOrder = data;

          this.reactiveForm.get('data_ordine').setValue(this.getCurrentDateFormatted());  

          this.reactiveForm.get('totale').setValue(Number(0).toFixed(2).replace('.',','));
          this.reactiveForm.get('acconto').setValue(Number(0).toFixed(2).replace('.',','));
          this.reactiveForm.get('saldo').setValue(Number(0).toFixed(2).replace('.',','));  
          
          this.reactiveForm.addControl('data_consegna',new FormControl('',Validators.required));    
    
          this.reactiveForm.get('mod_consegna').setValue('RITIRO IN SEDE');
          
          var order: Order = data;          
          this.reactiveForm.get('idordini').setValue(order.idordini);

          //si cambia la modalità del dialog
          // this.formModal=='aggiornamento'

          this.reactiveForm.get('idordini').setValue(this.dataOrder.idordini);
          this.idOrdineAperto = this.dataOrder.idordini;
          this.reactiveForm.get('data_ordine').setValue(this.dataOrder.data_ordine);
          this.dataOrdineAperto = this.dataOrder.data_ordine;          

        },
        (error) =>{
          console.error(error);
          console.error('Message: ' + error.message);                      
        }
      )        
    
    } else if ( this.formModal=='aggiornamento' ) {

      this.reactiveForm.get('fasonatori_idfasonatori').setValue(this.dataOrder.fasonatori_idfasonatori);

      this.reactiveForm.get('totale').setValue(this.dataOrder.totale);
      this.reactiveForm.get('acconto').setValue(this.dataOrder.acconto);
      this.reactiveForm.get('saldo').setValue(this.dataOrder.saldo);

      this.reactiveForm.get('mod_consegna').setValue(this.dataOrder.mod_consegna);

      if ( this.dataOrder.consegnato == 'SI') 
        this.reactiveForm.get('consegnato').setValue(true);
      else
        this.reactiveForm.get('consegnato').setValue(false);

      if ( this.dataOrder.saldato == 'SI') 
        this.reactiveForm.get('saldato').setValue(true);
      else
        this.reactiveForm.get('saldato').setValue(false);        

      // SI INIZIALIZZA LA DATA DI CONSEGNA
      var dataConsegna: string[] = this.dataOrder.data_consegna.split('/');
      // this.reactiveForm.get('data_consegna').setValue(dataConsegna[1]+'/'+dataConsegna[0]+'/'+dataConsegna[2]);
      this.reactiveForm.get('data_consegna').setValue(new Date(parseInt(dataConsegna[2]),parseInt(dataConsegna[1])-1,parseInt(dataConsegna[0])));

      this.reactiveForm.get('note').setValue(this.dataOrder.note);
      this.reactiveForm.get('note_x_fasonista').setValue(this.dataOrder.note_x_fasonista);

      this.reactiveForm.get('idordini').setValue(this.dataOrder.idordini);
      this.idOrdineAperto = this.dataOrder.idordini;
      this.reactiveForm.get('data_ordine').setValue(this.dataOrder.data_ordine);
      this.dataOrdineAperto = this.dataOrder.data_ordine;      

    }
  

  } // ngOnInit fine


  private loadSubcontractor(){
    //SI popola il combobox con l'elenco dei fasonatori
    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {

            var descrizione = data.map(a => a.nome + ' - ( tel: ' + a.telefono  + ' )');
            for (let index = 0; index < data.length; index++) {
              data[index].descrizione = descrizione[index];              
            }
            var result = data;
            // console.log(result);

            this.subcontractors = result;   

            },
      (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
      }
    );    
  }



  deliveryModes: DeliveryMode[] = [
    {
      descrizione: 'CORRIERE SEMPLICE'
    },
    {
      descrizione: 'CORRIERE ESPRESSO'
    },
    {
      descrizione: 'RITIRO IN SEDE'
    }    
  ]; 


  getCurrentDateFormatted(): string {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    const yyyy = today.getFullYear();

    var giorno, mese, oggi: string;

    if( dd < 10 ) {
      giorno = `0${dd}`;
    } else {
      giorno = dd;
    }

    if( mm < 10 ) {
      mese = `0${mm}`;
    } else {
      mese = mm;
    }
    
    oggi = giorno + '/' + mese + '/' + yyyy;
    return oggi;
  }



  calcoloTotaleBlurTotale() {

    var totale = this.getValueTotaleAcconto().totale;
    var acconto = this.getValueTotaleAcconto().acconto;

    if( isNaN(totale) ){
      this.reactiveForm.get('totale').setValue('0,00');
    } else if ( totale < acconto) {              
      this.reactiveForm.get('totale').setValue(acconto.toFixed(2).replace('.',','));     
      this.reactiveForm.get('saldo').setValue( (0).toFixed(2).replace('.',',') );     
      this.openSnackBar('Errore, il totale è inferiore all\'acconto. Dato inserito annullato.\n Inserire un valore valido',1000);
      document.getElementById('totale').focus();
    }  else {
      this.reactiveForm.get('saldo').setValue( (totale-acconto).toFixed(2).replace('.',',') ); 
    }  

  }

  calcoloTotaleBlurAcconto() {

    var totale = this.getValueTotaleAcconto().totale;
    var acconto = this.getValueTotaleAcconto().acconto;

    if( isNaN(acconto) ){
      this.reactiveForm.get('acconto').setValue('0,00');
    } else if ( totale < acconto) {              
      this.reactiveForm.get('acconto').setValue('0,00');      
      this.reactiveForm.get('saldo').setValue( (totale).toFixed(2).replace('.',',') );    
      this.openSnackBar('Errore, l\'acconto inserito è maggiore. Dato inserito annullato.\n Inserire un valore valido',1000);
      document.getElementById('acconto').focus();
    } else {
      this.reactiveForm.get('saldo').setValue( (totale-acconto).toFixed(2).replace('.',',') ); 
    }  

  }

  getValueTotaleAcconto() {
    
    var totale: number = parseFloat(this.reactiveForm.get('totale').value.replace('.',','));
    if( !isNaN(totale) )
      this.reactiveForm.get('totale').setValue(totale.toFixed(2).toString().replace('.',','));
    else
      this.reactiveForm.get('totale').setValue(Number(0).toFixed(2).toString().replace('.',','));

    var acconto: number = parseFloat(this.reactiveForm.get('acconto').value.replace(',','.'));
    if( !isNaN(acconto) )
      this.reactiveForm.get('acconto').setValue(acconto.toFixed(2).toString().replace('.',','));
    else{
      this.reactiveForm.get('acconto').setValue(Number(0).toFixed(2).toString().replace('.',','));            
      this.reactiveForm.get('saldo').setValue( (totale).toFixed(2).replace('.',',') ); 
    }

    return {'totale' : totale, 'acconto': acconto};
       
  }  

  setOrdineSaldato( event: any ) {
  
    switch (event.checked) {
      case true:
        {
          var totale: number = parseFloat(this.reactiveForm.get('totale').value.replace('.',','));
          var acconto: number = parseFloat(this.reactiveForm.get('acconto').value.replace(',','.'));
          
          if( !isNaN(totale) && !isNaN(acconto) ) {
            this.editable = false;
            this.reactiveForm.get('saldo').setValue( (totale - acconto).toFixed(2).replace('.',',') );       
          } else if ( !isNaN(totale) && isNaN(acconto)  ){
            this.reactiveForm.get('acconto').setValue(Number(0).toFixed(2).replace('.',','));
            this.reactiveForm.get('saldo').setValue( (totale).toFixed(2).replace('.',',') ); 
            this.editable = false;
          } else if ( isNaN(totale) && !isNaN(acconto)  ){
            this.openSnackBar('Saldo annullato, totale inferiore all\'acconto. Inserire l\'importo totale corretto');
            this.reactiveForm.get('saldato').setValue('');
          } else {  
            this.reactiveForm.get('saldato').setValue('');
            this.openSnackBar('Saldo annullato, Inserire importi di totale ed acconto');
          }
        }        
        break;
    
      case false:
        this.editable = true;
        break;
    }
 
  }

  setOrdineConsegnato( event: any ) {
    // console.log(event.checked);
    this.disableDeliveryControls = event.checked;
  }

  controllaDataConsegna(event: any) {
    
    var selectedDay = new Date(event.value);
    var today = new Date();

    var scelto = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate());
    var oggi = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if( scelto >= oggi ){

    } else {
      this.openSnackBar('Data consegna non valida. Inserire una data a partire da oggi');
      this.reactiveForm.get('data_consegna').setValue('');
    }

  }

  // METODO PER RICEVERE LA NOTIFICA DAL CHILD
  getShirts(shirts: any) {
    console.log('ELENCO CAMICIE RICEVUTO');
    console.log(shirts);
    this.shirtsInOrder = shirts;
  }


  ordineAnnullato() {
    this.openSnackBar(this.formModal + ' Ordine Annullato', 2500);

    if ( this.formModal == 'inserimento' )
      this.restBackendService.delResource('orders',{'idordini': this.dataOrder.idordini}).subscribe(
        (data) => {
          console.log('ins ordine annullato', data);
        },
        (error) => {
          console.error(error);
          console.error('Message: ' + error.message);  
        }
      );

  }

  openSnackBar(message: string, duration?: number) {

    if(isUndefined(duration)) duration = 3500;

    this._snackBar.open(message.toUpperCase(), '', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
 
}
