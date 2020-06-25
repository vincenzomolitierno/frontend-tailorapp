import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, DateAdapter, MatSnackBar } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { Measure } from 'src/app/measurers/data.model';
import { Customer } from 'src/app/customers/data.model';
import { ActionConfirm } from 'src/app/utilities/action-confirm';

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

  formModal: string = "empty";
  idCliente: number;  
  nominativo; string = 'nome cognome';
  data_misura = "gg/mm/yyyy";
  misure_misurometro = "#,# - ##,#"

  public reactiveForm: FormGroup; // oggetto per gestire il form con l'approccio reactive
  public dataCustomer: Customer;
  public lastMeasure: Measure; ;
  public dataOrder;
  public subcontractors: Subcontractor[];

  constructor( @Inject(MAT_DIALOG_DATA) data,
    private _adapter: DateAdapter<any>,
    public restBackendService: RESTBackendService,
    private _snackBar: MatSnackBar ) 
    {
      this.formModal = data.formModal; // inserimento / aggiornamento
      this.lastMeasure = data.measure;
      this.dataCustomer = data.customer;

      //costruzione del reactive form
      this.reactiveForm = new FormGroup({
        
        idordine: new FormControl(''),

        subcontractorControl: new FormControl('', Validators.required),
        
        totale: new FormControl(''),
        saldo: new FormControl(''),
        acconto: new FormControl(''),

        modalitaConsegna: new FormControl(''),

        consegnato: new FormControl(''),
        saldato: new FormControl(''),

        dataOrdine: new FormControl(''),
        dataConsegna: new FormControl(''),
        noteCliente: new FormControl(''),
        noteFasonista: new FormControl(''),

        formModal: new FormControl('')        
      });       

    }

  ngOnInit() {
    this._adapter.setLocale('it');

    this.loadSubcontractor();

    this.nominativo = this.dataCustomer.nominativo;
    this.data_misura = this.lastMeasure.data_misure;
    console.log(this.nominativo);
    console.log(this.data_misura);

    this.data_misura = this.data_misura.split(' ')[0].split('/')[1] + '/' +
                                this.data_misura.split(' ')[0].split('/')[0] + '/' +             
                                this.data_misura.split(' ')[0].split('/')[2];
      
      
    if ( this.formModal=='inserimento' ){

      this.reactiveForm.get('dataOrdine').setValue(this.getCurrentDateFormatted());  

      // this.reactiveForm.get('acconto').setValue('0,00');  
      // this.reactiveForm.get('saldo').setValue('0,00');  
    
    } else if ( this.formModal=='aggiornamento' ) {


    }
  }


  private loadSubcontractor(){
    //SI popola il combobox con l'elenco dei fasonatori
    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {

            var descrizione = data.map(a => a.nome + ' - ( tel: ' + a.telefono  + ' )');
            for (let index = 0; index < data.length; index++) {
              data[index].descrizione = descrizione[index];              
            }
            var result = data;
            console.log(result);

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
    this._snackBar.open(message, 'End now', {
      duration: 1500,
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
    console.log(totale);
    var acconto: number = parseFloat(this.reactiveForm.get('acconto').value.replace(',','.'));
    console.log(acconto);
    if( !(isNaN(totale) || isNaN(acconto)) ) {

      switch (totale > acconto) {
        case false:
          this.reactiveForm.get('totale').setValue('');
          this.reactiveForm.get('acconto').setValue('');
          this.reactiveForm.get('saldo').setValue('');

          ActionConfirm.openActionConfirmDialog('ATTENZIONE','Inserimento annullato, saldo inferiore all\'acconto. I campi sono azzarati');

          break;      
        default:
          this.reactiveForm.get('saldo').setValue( (totale - acconto).toFixed(2).replace('.',',') );  
          break;
      }

      
    }
      
  }  

  
}
