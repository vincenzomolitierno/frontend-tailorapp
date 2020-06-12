import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Shirt } from '../shirt.model';

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

  formModal: string = 'empty';
  name: string = 'empty';
  dummy_data: string = 'X,Y';

  pannello_iniziali: boolean = false;

  colour: string = '';
  tipo_bottone: string = '';

  // attributi della camicia
  shirt: Shirt;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    
    this.formModal = data.formModal;
    this.name = data.nominativo;

    this.shirt = new Shirt();

   }

  ngOnInit() {
  }

  neckModelIndicatorControl = new FormControl('', Validators.required);
  neckModelIndicators: NeckModelIndicator[] = [
    {tag: '1', descrizione: 'collo 1'},
    {tag: '2', descrizione: 'collo 2'},
    {tag: '3', descrizione: 'collo 3'},
  ];   

  wristModelIndicatorControl = new FormControl('', Validators.required);
  wristModelIndicators: WristModelIndicator[] = [
    {tag: '1', descrizione: 'polso 1'},
    {tag: '2', descrizione: 'polso 2'},
    {tag: '3', descrizione: 'polso 3'},
  ];   

  listIndicatorControl = new FormControl('', Validators.required);
  listIndicators: listIndicator[] = [
    {tag: '1', descrizione: 'valore 1'},
    {tag: '2', descrizione: 'valore 2'},
    {tag: '3', descrizione: 'valore 3'},
  ];  
  
  
  buttonIncreaseQty(){
    this.shirt.quantita = this.shirt.quantita + 1; 
  }

  buttonDecreaseQty(){
    this.shirt.quantita = this.shirt.quantita - 1; 
  }


}
