import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, DateAdapter, MatSnackBar } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { Measure } from 'src/app/measurers/data.model';
import { Customer } from 'src/app/customers/data.model';
import { isString } from 'util';

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
  data_consegna = '01/01/2020';

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

        clienti_idclienti: new FormControl(''),
        id_misure_ordinate: new FormControl(''),

        fasonatori_idfasonatori: new FormControl('', Validators.required),
        
        totale: new FormControl('',Validators.required),
        saldo: new FormControl(''),
        acconto: new FormControl('',Validators.required),

        mod_consegna: new FormControl('',Validators.required),

        consegnato: new FormControl(''),
        saldato: new FormControl(''),

        data_ordine: new FormControl(''),
        
        note: new FormControl(''),
        note_x_fasonista: new FormControl(''),
   
      });       

    }

  ngOnInit() {

    this._adapter.setLocale('it');

    this.loadSubcontractor();

    this.nominativo = this.dataCustomer.nominativo + ' ( ' + this.dataCustomer.telefono + ' )' ;

    this.data_misura = this.lastMeasure.data_misure;
    this.data_misura = this.data_misura.split(' ')[0].split('/')[1] + '/' +
                                this.data_misura.split(' ')[0].split('/')[0] + '/' +             
                                this.data_misura.split(' ')[0].split('/')[2];

    this.reactiveForm.get('clienti_idclienti').setValue(this.dataCustomer.idclienti);          
    this.reactiveForm.get('id_misure_ordinate').setValue(this.lastMeasure.idmisure); 

    if ( this.formModal=='inserimento' ){
    
      this.reactiveForm.get('data_ordine').setValue(this.getCurrentDateFormatted());  

      this.reactiveForm.get('totale').setValue(Number(0).toFixed(2).replace('.',','));
      this.reactiveForm.get('acconto').setValue(Number(0).toFixed(2).replace('.',','));
      this.reactiveForm.get('saldo').setValue(Number(0).toFixed(2).replace('.',','));  
      
      this.reactiveForm.addControl('data_consegna',new FormControl('',Validators.required));

      
    
    } else if ( this.formModal=='aggiornamento' ) {

      this.reactiveForm.get('idordini').setValue(this.dataOrder.idordini);

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
      

      this.reactiveForm.get('data_ordine').setValue(this.dataOrder.data_ordine);

      // SI INIZIALIZZA LA DATA DI CONSEGNA
      var dataConsegna: string[] = this.dataOrder.data_consegna.split('/');
      this.reactiveForm.addControl('data_consegna',new FormControl(
        new Date(parseInt(dataConsegna[2]),parseInt(dataConsegna[1])-1,parseInt(dataConsegna[0])),
        Validators.required));

      this.reactiveForm.get('note').setValue(this.dataOrder.note);
      this.reactiveForm.get('note_x_fasonista').setValue(this.dataOrder.note_x_fasonista);

      // SI INIZIALIZZANO LE CAMICE
      

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
      descrizione: 'Corriere Semplice'
    },
    {
      descrizione: 'Corriere Espresso'
    },
    {
      descrizione: 'Ritiro in sede'
    }    
  ]; 


  openSnackBar(message: string) {
    this._snackBar.open(message, 'Chiudi', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  saveIdSubcontractor() {

  }

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



  calcoloTotale() {
    
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


    if( !(isNaN(totale) || isNaN(acconto)) ) {

      switch (totale > acconto) {
        case false:
          this.reactiveForm.get('totale').setValue('');
          this.reactiveForm.get('acconto').setValue('');
          this.reactiveForm.get('saldo').setValue('');

          this.openSnackBar('Inserimento annullato, totale inferiore all\'acconto. I campi sono azzerati');

          break;      
        default:
          this.reactiveForm.get('saldo').setValue( (totale - acconto).toFixed(2).replace('.',',') );  
          break;
      }      
    }      
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

  
}
