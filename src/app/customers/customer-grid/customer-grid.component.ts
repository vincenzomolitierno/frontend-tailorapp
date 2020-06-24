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
import { isUndefined } from 'util';
import { Measure } from 'src/app/measurers/data.model';
import { Observable, Observer } from 'rxjs';
import { ScriptService } from './script.service';
import { Base64Utility } from 'src/app/measure/data.model';

declare let pdfMake: any ;


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

  dummy_data: string = 'X,Y';

  item_empty: Customer;

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
    'view_orders', 
    'new_order'];

    constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog,
      private scriptService: ScriptService,
      private _snackBar: MatSnackBar
    ) { 
      super(restBackendService); // si innesca il costruttore della classe padre
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

          console.log({
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

        this.viewDetails = false;

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

    this.viewDetails = false;

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

          // console.log(this.measureCustomerDetailView);       
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
          
          // //si inizializzano i campi del form
          // this.measureCustomerDetailView.misurometro;              
          // this.measureCustomerDetailView.taglia_misurometro;   

          // this.measureCustomerDetailView.collo;   
          // this.measureCustomerDetailView.spalla;   
          // this.measureCustomerDetailView.lung_bicipite;   
          // this.measureCustomerDetailView.bicipite;   
          // this.measureCustomerDetailView.vita_dietro;   

          // this.measureCustomerDetailView.polso;  
          // this.measureCustomerDetailView.lung_camicia;  
          // this.measureCustomerDetailView.avambraccio;  
          // this.measureCustomerDetailView.lung_avambraccio;  
          // this.measureCustomerDetailView.bacino_dietro;    
          
          this.dataURItoBlob(this.measureCustomerDetailView.note_grafiche).subscribe(blob => {
            
            var blobUrl = URL.createObjectURL(blob);
            var img = document.createElement('img');
            var divBase64 = document.getElementById('base64')
            
            while (divBase64.hasChildNodes()) {
              divBase64.removeChild(divBase64.lastChild);
            }

            img.src = blobUrl;
            divBase64.appendChild(img);
            // document.body.appendChild(img);

          });  

          //se c'è almeno una misura si visualizza il pannello 
          this.customerNameFocused = customer.nominativo;
          this.customerTelefonoFocused = customer.telefono;
          this.viewDetails = true;

        } else {
          this.viewDetails = false;
          window.alert('Il cliente non ha misure in archivio!!')
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

    //Apertura del form dialog
    const dialogRef = this.dialog.open(MeasureFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

      if(!(result==false) && !isUndefined(result) ){

        var base64: string = result.note_grafiche;
        base64 = base64.replace('data:image/png;base64,','');
        // console.log(base64);

        var torace: string = result.torace_1_bottone + ";"
                             + result.torace_2_bottone + ";" 
                             + result.torace_3_bottone + ";" 
                             + result.torace_4_bottone + ";" 
                             + result.torace_5_bottone + ";" 
                             + result.torace_6_bottone + ";" 
                             + result.torace_7_bottone + ";" 
                             + result.torace_8_bottone + ";" 

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
          "lung_avambraccio": result.lunghezza_avambraccio,
          "bacino_dietro": result.bacino_dietro,
          "bacino": '',
          "torace": torace,
          "misurometro": result.shirtIndicatorControl,
          "note_grafiche": base64,
          "clienti_idclienti": result.idcliente,
          "data_misure": ''            
        });

        if(result.formModal == 'inserimento')  {
          console.log('inserimento');

          // console.log( {
          //   "taglia_misurometro": result.shirtIndicatorControlSize,
          //   "collo": result.collo,
          //   "polso": result.polso,
          //   "spalla": result.spalla,
          //   "bicipite": result.bicipite,
          //   "lung_bicipite": result.lunghezza_manica,
          //   "vita_dietro": result.vita_dietro,
          //   "lung_camicia": result.lunghezza_camicia,
          //   "avambraccio": result.avambraccio,
          //   "lung_avambraccio": result.lunghezza_avambraccio,
          //   "bacino_dietro": result.bacino_dietro,
          //   "bacino": '',
          //   "torace": torace,
          //   "misurometro": result.shirtIndicatorControl,
          //   "note_grafiche": base64,
          //   "clienti_idclienti": result.idcliente,
          //   "data_misure": ''            
          // });          

        }
        else if (result.formModal == 'aggiornamento'){
          console.log('aggiornamento');

        } //fine PUT

      }

    });    
    
  }

  /**
   *
   *
   * @param {string} formModal
   * @param {string} idOrdine
   * @memberof CustomerGridComponent
   */
  openOrderDialog(formModal: string, customer: Customer){

    this.viewDetails = false;

    this.restBackendService.getResourceQuery('measuresQuery',
    'idclienti' + '=' + customer.idclienti).subscribe(
        (data) => {
          var array: Array<Measure> = data;
          if ( array.length > 0 ) {

              // c'è almento una misura
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                customer: customer, 
                measure: data[0],
                formModal: formModal, 
              };
          
              const dialogRef = this.dialog.open(OrderFormComponent, dialogConfig);
          
              dialogRef.afterClosed().subscribe(result => {
                console.log('Dialog result: ${result}');
              }); 
                          

          } else {

              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                messaggio: 'Il cliente non ha alcuna misura in archivio. \rCreazione dell\'ordine annullata!!', 
                titolo: 'NOTA BENE', 
              };
          
              const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);
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

  openViewOrder(subcontractorView: boolean){

    this.viewDetails = false;
    console.log(subcontractorView);
    this.generatePdf();
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = {
    //   view: subcontractorView, 
    // };

    // const dialogRef = this.dialog.open(OrderViewComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('Dialog result: ${result}');
    // });  

  }   


  public openViewOrderByCustomerId(idCliente: string){

    this.viewDetails = false;
  
      this.restBackendService.getResourceQuery('measuresQuery',
      'idclienti' + '=' + idCliente).subscribe(
          (data) => {
            var array: Array<Measure> = data;
            if ( array.length > 0 ) {
  
                // c'è almento una misura
                this.generatePdf();

            } else {
  
                const dialogConfig = new MatDialogConfig();
                dialogConfig.data = {
                  messaggio: 'Il cliente non ha alcuna misura in archivio. \rStampa dell\'ordine annullata!!', 
                  titolo: 'NOTA BENE', 
                };
            
                const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);
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

  private generatePdf(){

    var obj: Object;
    obj = [['dettaglio camicia 1', ' '],
          ['dettaglio camicia 2', ' '],
    ['dettaglio camicia 3', ' ']];
   

    var refSize:number = 14;

     const documentDefinition = {
       
        content: [
          {
            text: 'STAMPA ORDINE',
            style: 'header'
          } ,
          {
            columns: [
              {
                text: 'Committente: ' + 'nome e cognome',
                style: 'subheader'
              },
              {
                text: 'Misurometro:' + 'misurmetro scelto',
                style: 'subheader'
              }
            ]
          },  
          {
            columns: [
              {
                text: 'Collo: '        + 'dummy' + '\n' +
                      'Spalla: '       + 'dummy' + '\n' +
                      'Lun. Manica: '  + 'dummy' + '\n' +
                      'Bicipite: '     + 'dummy' + '\n' +
                      'Vita Dietro: '  + 'dummy' + '\n' ,
                style: 'name'
              },
              {
                text: 'Polso: '           + 'dummy' + '\n' +
                      'Lun. Camicia: '     + 'dummy' + '\n' +
                      'Avambraccio: '      + 'dummy' + '\n' +
                      'Lun. Avambraccio: ' + 'dummy' + '\n' +
                      'Bacino Dietro: '    + 'dummy' + '\n',
                style: 'name'
              },
              {
                text: 'TORACE AVANTI' + '\n' +
                      '1° Bottone: '     + 'dummy' + '\n' +
                      '2° Bottone: '     + 'dummy' + '\n' +
                      '3° Bottone: '     + 'dummy' + '\n',
                style: 'name'
              },
              {
                text: '4° Bottone: '     + 'dummy' + '\n' +
                      '5° Bottone: '     + 'dummy' + '\n' +
                      '6° Bottone: '     + 'dummy' + '\n' +
                      '7° Bottone: '     + 'dummy' + '\n' +
                      '8° Bottone: '     + 'dummy' + '\n',
                style: 'name'
              }                                        
            ]
          },
          '\n',
          {
            image: Base64Utility.base64ShirtEmpty,
            width: 250,
            alignment: 'center'
          },
          '\n',
          {
            text: 'ELENCO CAMICIE',
            style: 'subheader',
            alignment: 'left',
            margin: [0, 10, 0, 0]
          },
          {
            style: 'name',
            table: {
              heights: 50,
              widths: ['*', 150],
              body: obj
            }
          },                                       
          {
            text: 'Fasonista ' + 'nome fasonista',
            style: 'subheader',
            alignment: 'left',
          },
          'Note del fasonista',
          {
            style: 'name',
            table: {
              widths: ['*'],
              body: [
                [' '],
              ]
            }
          },          
          {
            columns: [
              {
                text: 'Data consegna: ' + 'gg/mm/aaaa',
                style: 'subheader',
                alignment: 'left'
              },
              {
                text: 'Modalità consegna:' + 'modalità consegna',
                style: 'subheader',
                alignment: 'left'
              }
            ]
          },  
          'Note per il cliente',
          {
            style: 'name',
            table: {
              widths: ['*'],
              body: [
                [' '],
              ]
            }
          },
          {
            columns: [
              {
                text: 'Totale: ' + '##,## €' + '\n'
                    + 'Acconto: ' + '##,## €' + '\n'
                    + 'Saldo: ' + '##,## €' + '\n',
                style: 'subheader'
              },
              {
                text: 'Saldato' + 'SI/NO',
                style: 'subheader'
              }
            ]
          }          
        ],       
        info: {
          title: 'STAMPA ORDINE',
          author: 'idealprogetti.com',
          subject: 'Riepilogo Lavorazioni',
          keywords: 'RESUME, ONLINE RESUME',          
        },
        
        styles: {
          header: {
            fontSize: refSize,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 10],
          },
          subheader: {
            fontSize: refSize-2,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 10],
          },
          name: {
            fontSize: refSize-4,
            alignment: 'center',
          },
          jobTitle: {
            fontSize: 14,
            bold: true,
            italics: true
          },
          sign: {
            margin: [0, 50, 0, 10],
            alignment: 'right',
            italics: true
          },
          tableExample: {
            margin: [0, 10, 0, 10]
          },
          tableHeader: {
            bold: true,
            fontSize: 11,
            color: 'black'
          }          
        }   // fine style 
      
      };

     pdfMake.createPdf(documentDefinition).download();
    }

    openSnackBar() {
      this._snackBar.open('Misure assenti, inserire una misura per il cliente', 'End now', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }

    

}
