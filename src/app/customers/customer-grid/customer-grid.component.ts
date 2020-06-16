import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CuFormComponent as CustomerFormComponent } from '../cu-form/cu-form.component';
import { CuFormComponent as TakeMeasureFormComponent } from '../../measure/cu-form/cu-form.component';
import { OrderFormComponent } from 'src/app/orders/order-form/order-form.component';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { Customer } from '../data.model';
import { isUndefined } from 'util';
import { stringify } from 'querystring';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';

@Component({
  selector: 'app-customer-grid',
  templateUrl: './customer-grid.component.html',
  styleUrls: ['./customer-grid.component.css']
})
export class CustomerGridComponent extends GridModel implements OnInit {

  // Dati coinvolti nel binding
  viewDetails: boolean = false;
  customerNameFocused: string = "";
  dummy_data: string = "X,Y"

  item_empty: Customer;

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    'nominativo', 
    'telefono', 
    'cartamodello', 
    'note', 
    'update', 
    'delete', 
    'measure', 
    'view_orders', 
    'new_order'];

    constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog
    ) { 
      super(restBackendService); // si innesca il costruttore della classe padre
      this.resource = Array<Customer>();
    }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('customers');   

  }
 
  
  /**
   * Open Dialog Form to create or update a resource item
   *
   * @param {string} formModal: 'inserimento'|'aggiornamento'
   * @param {string} name
   * @memberof CustomerGridComponent
   */
  public openResourceDialog(formModal: string, _customer: Customer){

    const dialogConfig = new MatDialogConfig();

    var customer: Customer;

    //Dati da passare alla finestra modale
    if(formModal=='inserimento'){
      customer = new Customer();
      console.log('inserimento');
    } else if(formModal=='aggiornamento'){
      console.log('aggiornamento');
      // customer = new Customer();
      customer = _customer;
    }
    
    //oggetto per configurare la finestra di dialogo
    dialogConfig.data = {formModal: formModal, customer: customer};
    dialogConfig.panelClass = 'custom-dialog-container';

    //riferimento alla finestra modale per aprirla
    const dialogRef = this.dialog.open(CustomerFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      console.log('result:' + result);

      if(result){

        if(formModal=='inserimento'){
          
          this.postData('customers',        
          {
            "nominativo": result.nominativo,
            "telefono": result.telefono,
            "email": result.email,
            "cf": result.cf,
            "partita_iva": result.partita_iva,
            "indirizzo": result.indirizzo,
            "int_fattura": result.int_fattura,
            "note": result.note,
            "cartamodello": result.cartamodello
          });

        } else if(formModal=='aggiornamento'){

          this.putData('customers',        
          {
            "idclienti": customer.idclienti,
            "nominativo": result.nominativo,
            "telefono": result.telefono,
            "email": result.email,
            "cf": result.cf,
            "partita_iva": result.partita_iva,
            "indirizzo": result.indirizzo,
            "int_fattura": result.int_fattura,
            "note": result.note,
            "cartamodello": result.cartamodello
          });      

        }


      }      
    }); 
    
  }   
  
  /**
   * Open Dialog Form to confirm the delete of the item with _idItem primary key
   *
   * @param {string} _idItem
   * @param {string} _nominativo
   * @memberof CustomerGridComponent
   */
  public openDeleteDialog(_idItem: string, _nominativo: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idItem: _idItem, 
      message: 'Eliminare ' + _nominativo +' dall\'archivio dei clienti?',
    };

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delData('customers',        
        {
          "idclienti": parseInt(_idItem)
        }
        )
      }
      
    });     

  }

  openDetails(inpunString: string){
    this.testo_ricerca = inpunString;
    const filterValue = inpunString;
    this.customerNameFocused = inpunString;
    this.dataSource.filter = filterValue.trim().toLowerCase()    
    this.viewDetails = true;
  }

  private openTakeMeasureDialog(formModal: string, name: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idCustomer: "vincenzo", 
      formModal: formModal, 
      nominativo: name ,
      base64: ''
    };

    dialogConfig.panelClass = 'custom-dialog-container';

    const dialogRef = this.dialog.open(TakeMeasureFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }

  openOrderDialog(formModal: string, idOrdine: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idordini: idOrdine, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(OrderFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }   

  /**
   * Override the parent's method to manage customer details too
   *
   * @memberof CustomerGridComponent
   */
  public clearSearch(){
    this.dataSource.filter = "";
    this.testo_ricerca = "";

    this.viewDetails = false;

  } 

}
