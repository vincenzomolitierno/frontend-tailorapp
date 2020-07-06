import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { CuFormComponent as CustomerFormComponent } from '../cu-form/cu-form.component';
// import { CuFormComponent as TakeMeasureFormComponent } from '../../measure/cu-form/cu-form.component';
import { OrderFormComponent } from 'src/app/orders/order-form/order-form.component';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { Customer } from '../data.model';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';
import { MeasureFormComponent } from 'src/app/measure/measure-form/measure-form.component';
// import { OrderViewComponent } from 'src/app/orders/order-view/order-view.component';
import { isUndefined, isNull } from 'util';
import { Measure } from 'src/app/measurers/data.model';
import { Observable, Observer } from 'rxjs';
import { ScriptService } from './script.service';
import { Order } from 'src/app/orders/data.model';
import { Shirt } from 'src/app/shirts/shirt.model';
import { MessageNotificationDummyComponent } from 'src/app/utilities/message-notification-dummy/message-notification-dummy.component';
import { Router } from '@angular/router';
import { Base64Utility } from 'src/app/measure/data.model';

@Component({
  selector: 'app-customer-grid',
  templateUrl: './customer-grid.component.html',
  styleUrls: ['./customer-grid.component.css']
})
export class CustomerGridComponent extends GridModel implements OnInit {

  // Dati coinvolti nel binding
  viewDetails: boolean = false;
  customerNameFocused: string = '';
  customerTelefonoFocused: string = '';

  torace_1_bottone: string = '';
  torace_2_bottone: string = '';
  torace_3_bottone: string = '';
  torace_4_bottone: string = '';
  torace_5_bottone: string = '';
  torace_6_bottone: string = '';
  torace_7_bottone: string = '';
  torace_8_bottone: string = '';

  // dummy_data: string = 'X,Y';

  item_empty: Customer; // per aprire il dialog per la creazione di un cliente

  measureCustomerDetailView: Measure;

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    'nominativo', 
    
    'idclienti',

    'telefono', 
    'cartamodello', 
    'note', 
    'update', 
    'delete', 
    'measure', 
    'new_order'
    // 'view_orders'
  ];

  constructor(
    restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog,
    public scriptService: ScriptService,
    _snackBar: MatSnackBar,
    private router: Router
  ) { 
    super(restBackendService,_snackBar); // si innesca il costruttore della classe padre
    this.resource = Array<Customer>();

    this.measureCustomerDetailView = new Measure();

    this.scriptService.load('pdfMake', 'vfsFonts');
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

    this.viewDetails = false;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true; 

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

          var CF: string = ''
          if (result.cf) CF = String(result.cf);

          console.log('cliente', {
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
          
          this.postData('customers',        
          {
            "nominativo": result.nominativo,
            "telefono": result.telefono,
            "email": result.email,
            "cf": CF,
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

        this.viewDetails = false;

      }      
    }); 
    
  }   
  

  public openDeleteDialog(customer: Customer){

    this.viewDetails = false;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titolo: 'ATTENZIONE!', 
      messaggio: 'Eliminare il cliente ' + customer.nominativo + ' (' + customer.telefono + ') dall\'archivio dei clienti?',
    };
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true; 
    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        // step 1 - si cancellano tutti gli ordini del cliente
        var ordersToDelete: Array<any>;
        this.restBackendService.getResourceQuery('ordersValues','idclienti=' + customer.idclienti).subscribe(
          (data) =>{
            ordersToDelete = data;
            console.log('ordini da cancellare',ordersToDelete);

            ordersToDelete.forEach(orderToDelete => {

              console.log('ordine da cancellare id: ' + orderToDelete.idordini);
              this.restBackendService.delResource('orders',{
                "idordini": orderToDelete.ordine.idordini
              }).subscribe(
                (data)=>{
                  console.log('ordine '+ orderToDelete.ordine.idordini +' cancellato');
                },
                (error)=>{
                  console.log('ordine non cancellato, errore '+ error);
                });              
            });
            // SI CANCELLA IL CLIENTE
            this.delData('customers',        
              {
                "idclienti": customer.idclienti
              }
            );
            
          },
          (error)=>{}
        );

        this.viewDetails = false;
      }
      
    });     

  }

  private openDetails(customer: Customer){

    //Recuperare i dati dell'ultima misura del cliente selezionato se esistono e visualizzarli
    this.restBackendService.getResourceQuery('measuresQuery',
      'idclienti' + '=' + customer.idclienti).subscribe(
      (data) => {

        this.resourceQuery = data;

        if(this.resourceQuery.length > 0){

          console.log('Ci sono n° ' + this.resourceQuery.length + ' misure per il cliente selezionato');          
           
          this.measureCustomerDetailView = this.resourceQuery[this.resourceQuery.length-1];

          this.measureCustomerDetailView.data_misure = this.measureCustomerDetailView.data_misure.split(' ')[0];

          console.log(this.measureCustomerDetailView);       
          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[0])))
                  this.torace_1_bottone = this.measureCustomerDetailView.torace.split(';')[0];

          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[1])))
                  this.torace_2_bottone = this.measureCustomerDetailView.torace.split(';')[1];

          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[2])))
                  this.torace_3_bottone = this.measureCustomerDetailView.torace.split(';')[2];

          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[3])))
                  this.torace_4_bottone = this.measureCustomerDetailView.torace.split(';')[3];

          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[4])))
                  this.torace_5_bottone = this.measureCustomerDetailView.torace.split(';')[4];

          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[5])))
                  this.torace_6_bottone = this.measureCustomerDetailView.torace.split(';')[5];

          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[6])))
                  this.torace_7_bottone = this.measureCustomerDetailView.torace.split(';')[6];

          if(!isNaN(parseFloat(this.measureCustomerDetailView.torace.split(';')[7])))
                  this.torace_8_bottone = this.measureCustomerDetailView.torace.split(';')[7];          
              
          
          if ( this.measureCustomerDetailView.note_grafiche != '' ){
            this.dataURItoBlob(this.measureCustomerDetailView.note_grafiche).subscribe(
              blob => {

              var blobUrl = URL.createObjectURL(blob);

              var img = document.createElement('img');
              var divBase64 = document.getElementById('base64')
              
              while (divBase64.hasChildNodes()) {
                divBase64.removeChild(divBase64.lastChild);
              }

              img.src = blobUrl;
              divBase64.appendChild(img);

            },
            (error) => {

            });  
        } else {
            this.dataURItoBlob(Base64Utility.base64ShirtEmpty.replace('data:image/png;base64,','')).subscribe(
              blob => {

              var blobUrl = URL.createObjectURL(blob);

              var img = document.createElement('img');
              var divBase64 = document.getElementById('base64')
              
              while (divBase64.hasChildNodes()) {
                divBase64.removeChild(divBase64.lastChild);
              }

              img.src = blobUrl;
              divBase64.appendChild(img);

            },
            (error) => {

            });
        }

          //se c'è almeno una misura si visualizza il pannello 
          this.customerNameFocused = customer.nominativo;
          this.customerTelefonoFocused = customer.telefono;
          this.viewDetails = true;

        } else {
          this.viewDetails = false;
        }   

      });

  }

    /* Method to convert Base64Data Url as Image Blob */
    dataURItoBlob(dataURI: string): Observable<Blob> {
      return Observable.create((observer: Observer<Blob>) => {
        const byteString: string = window.atob(dataURI);
        const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: "image/jpeg" });
        observer.next(blob);
        observer.complete();
      });
    }      

  /**
   * Open the Measure form dialog to take the measure fore the _customer
   *
   * @private
   * @param {Customer} _customer
   * @memberof CustomerGridComponent
   */
  private openTakeMeasureDialog(_customer: Customer){

    this.viewDetails = false;
    
    //Dati per la configurazione iniziale del form dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      customer: _customer,
    };
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true; 

    //Apertura del form dialog
    const dialogRef = this.dialog.open(MeasureFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

      // console.log(result);

      if( result ) {

        var base64: string = '';
        
        if(result.base64) {
          var base64: string = result.base64;
          base64 = base64.replace('data:image/png;base64,','');
        }
        
        result = result.controls;
        var torace: string = result.torace_1_bottone + ";"
                             + result.torace_2_bottone + ";" 
                             + result.torace_3_bottone + ";" 
                             + result.torace_4_bottone + ";" 
                             + result.torace_5_bottone + ";" 
                             + result.torace_6_bottone + ";" 
                             + result.torace_7_bottone + ";" 
                             + result.torace_8_bottone + ";" 

        console.log('misurometro: ' + result.shirtIndicatorControl);

        if(result.formModal == 'inserimento')  {
          console.log('inserimento');
          console.log('MISUROMETRO: ' + result.shirtIndicatorControl);

          //chiamata REST
          this.postDataLess('measures',        
          {
            "taglia_misurometro": result.shirtIndicatorControlSize,
            "collo": result.collo,
            "polso": result.polso,
            "spalla": result.spalla,
            "bicipite": result.bicipite,
            "lung_bicipite": result.lunghezza_manica,
            "vita_dietro": result.vita_dietro,
            "lung_camicia": result.lunghezza_camicia,
            "avambraccio": result.avambraccio,
            "lung_avambraccio": result.centro_schiena,
            "bacino_dietro": result.bacino_dietro,
            "bacino": '',
            "torace": torace,
            "misurometro": result.shirtIndicatorControl,
            "note_grafiche": base64,
            "clienti_idclienti": result.idcliente,
            "data_misure": ''            
          });          
          
        }
        else if (result.formModal == 'aggiornamento'){
          console.log('aggiornamento');

          //chiamata REST
          this.putDataLess('measures',        
          {
            "idmisure": result.idmisure,
            "taglia_misurometro": result.shirtIndicatorControlSize,
            "collo": result.collo,
            "polso": result.polso,
            "spalla": result.spalla,
            "bicipite": result.bicipite,
            "lung_bicipite": result.lunghezza_manica,
            "vita_dietro": result.vita_dietro,
            "lung_camicia": result.lunghezza_camicia,
            "avambraccio": result.avambraccio,
            "lung_avambraccio": result.centro_schiena,
            "bacino_dietro": result.bacino_dietro,
            "bacino": '',
            "torace": torace,
            "misurometro": result.shirtIndicatorControl,
            "note_grafiche": base64,
            "clienti_idclienti": result.idcliente,
            "data_misure": ''            
          });            

        } //fine PUT

      }

    });    
    
  }


  openOrderDialog(formModal: string, customer: Customer){

    this.viewDetails = false;

    this.restBackendService.getResourceQuery('measuresQuery',
    'idclienti' + '=' + customer.idclienti).subscribe(
        (data) => {
          var array: Array<Measure> = data;
          if ( array.length > 0 ) { // se c'è la misura si procede all'inserimento dell'ordine

              var measure: Measure = array[0];
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                customer: customer, 
                order: {},
                measure: measure,
                formModal: formModal, //inserimento
              };

              dialogConfig.autoFocus = true;
              dialogConfig.disableClose = true;   
          
              const dialogRef = this.dialog.open(OrderFormComponent, dialogConfig);
          
              dialogRef.afterClosed().subscribe(result => {
                // azioni dopo la chiusura della dialog
                if (result) {
                  //CHIAMATA REST PER L'INSERIMENTO DELL'ORDINE                 
                  console.log('SALVATAGGIO ORDINE');

                  var shirts: Shirt[] = result.shirts;
                  var order: Order = result.order;

                  var data_consegna = new Date(order.data_consegna);
                  // INIZIO formattazione della data di consegna
                  var giorno: number = data_consegna.getDate() ;
                  var strGiorno: string;
                  if ( giorno < 10 ) 
                    strGiorno = '0' + giorno.toFixed(0);
                  else
                    strGiorno = giorno.toFixed(0);    

                  var mese: number = data_consegna.getMonth() + 1 ;
                  var strMese: string;
                  if ( mese < 10 ) 
                    strMese = '0' + mese.toFixed(0);
                  else
                    strMese = mese.toFixed(0);                

                  var strDataConsegna = strGiorno + '/' +
                                        strMese + '/' +
                                        data_consegna.getFullYear().toFixed(0);
                  // FINE formattazione della data di consegna

                  if( order.saldato )
                    var saldato = 'SI';
                  else
                    var saldato = 'NO';

                  if( order.consegnato )
                    var consegnato = 'SI';
                  else
                    var consegnato = 'NO';    
                    
                  console.log('ordine',{
                    "note": order.note,
                    "acconto": order.acconto,
                    "saldo": order.saldo,
                    "totale": order.totale,
                    "data_consegna": strDataConsegna,
                    "consegnato": consegnato,
                    "saldato": saldato,
                    "note_x_fasonista": order.note_x_fasonista,
                    "mod_consegna": order.mod_consegna,
                    "data_ordine": order.data_ordine,
                    "clienti_idclienti": order.clienti_idclienti,
                    "fasonatori_idfasonatori": order.fasonatori_idfasonatori,
                    "id_misure_ordinate": order.id_misure_ordinate
                  });
              

                  // this.restBackendService.postResource('orders',                  
                  this.restBackendService.putResource('orders',                  
                  {
                    "idordini": order.idordini,
                    "note": order.note,
                    "acconto": order.acconto,
                    "saldo": order.saldo,
                    "totale": order.totale,
                    "data_consegna": strDataConsegna,
                    "consegnato": consegnato,
                    "saldato": saldato,
                    "note_x_fasonista": order.note_x_fasonista,
                    "mod_consegna": order.mod_consegna,
                    "data_ordine": order.data_ordine,
                    "clienti_idclienti": order.clienti_idclienti,
                    "fasonatori_idfasonatori": order.fasonatori_idfasonatori,
                    "id_misure_ordinate": order.id_misure_ordinate
                  }).subscribe(
                    (data) =>{

                      //   var orderAdded: Order = new Order();
                      //   orderAdded = data;
                      //   // si provvede ad inserire le camicie
                      //   var idordine = orderAdded.idordini;
                      //   console.log('ID ORDINE: ' + idordine);
                      // if(shirts){
                      //   for (let index = 0; index < shirts.length; index++) {
                          
                      //     const shirt = shirts[index];
                      //     console.log('INSERIMENTO CAMICIA')
                      //     console.log(shirt);
                      //     shirt.ordini_idordini = orderAdded.idordini;
                      //     this.postData('shirts', shirt);       
                          
                      //   }
                      // }

                        this.getRemoteData('customers');

                        this.openSnackBar('Ordine inserito con successo', 1500);

                        // routing verso il form ordini
                        this.router.navigateByUrl('/dashboard/orders');
                    },
                    (error) =>{
                      console.error(error);
                      console.error('Message: ' + error.message);                      
                    }
                  );
                
                }
              });                    

          } else { // non c'è una misura per il cliente

              const dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = true;
              dialogConfig.disableClose = true;
              dialogConfig.data = {
                messaggio: 'Il cliente non ha alcuna misura in archivio. \rCreazione dell\'ordine annullata!!', 
                titolo: 'NOTA BENE', 
              };          
              const dialogRef = this.dialog.open(MessageNotificationDummyComponent, dialogConfig);
              dialogRef.afterClosed().subscribe(result => {
                console.log(result);
              });             

          }

        },
        (error) => {
          console.error(error);
          console.error('Message: ' + error.message);
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

  openSnackBar(message: string, duration?: number) {
    this.snackBar.open(message.toUpperCase(), 'Chiudi', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
   

}
