import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, DateAdapter, MatSnackBar } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { Measure } from 'src/app/measurers/data.model';
import { Customer } from 'src/app/customers/data.model';

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

      

    } else if ( this.formModal=='aggiornamento' ) {


    }
  }


  private loadSubcontractor(){
    //SI popola il combobox con l'elenco dei fasonatori
    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {
        
            console.log(data);
            var result = data.map(a => a.nome + ' - ( tel: ' + a.telefono  + ' )');
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


  openSnackBar() {
    this._snackBar.open('Cannonball!!', 'End now', {
      duration: 1500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  
}
