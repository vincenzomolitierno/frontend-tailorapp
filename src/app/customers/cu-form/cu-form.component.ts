import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";
import { Customer } from '../data.model';

@Component({
  selector: 'app-cu-form',
  templateUrl: './cu-form.component.html',
  styleUrls: ['./cu-form.component.css']
})
export class CuFormComponent implements OnInit {

  formModal: string = "empty";
  name: string = "empty";

  private customer: Customer;

  constructor(@Inject(MAT_DIALOG_DATA) data) {

    this.formModal = data.formModal;
    this.name = data.nominativo;
    
    this.customer = new Customer();

    Object.assign(this.customer, data.customer)
    // this.customer = data.customer;
    
   }

  ngOnInit() {
  }

}
