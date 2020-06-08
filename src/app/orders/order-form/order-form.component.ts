import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, DateAdapter } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

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
  orderNumber: string = "empty";  

  data_misura = "gg/mm/yyyy";
  misure_misurometro = "#,# - ##,#"

  totale: number = 0.0;
  acconto: number = 0.0;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private _adapter: DateAdapter<any>
    ) {
    this.formModal = data.formModal;
    this.orderNumber = data.idordini;    
   }

  ngOnInit() {
    this._adapter.setLocale('fr');
  }

  subcontractorControl = new FormControl('', Validators.required);
  subcontractors: Subcontractor[] = [
    {
      idfasonatori: 1,
      nominativo: 'Ditta Bianchi',
      telefono: '081892****',
      email: 'ditta@bianchi.it'
    }
  ];   

  deliveryModeControl = new FormControl('', Validators.required);
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

}
