import { Component, OnInit, Inject, ɵConsole, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, DateAdapter, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Order } from '../data.model';
import { Measure, Measurer } from 'src/app/measurers/data.model';
import { Customer } from 'src/app/customers/data.model';
import { Shirt } from 'src/app/shirts/shirt.model';
import { isUndefined } from 'util';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';
import { ShirtsGridComponent } from 'src/app/shirts/shirts-grid/shirts-grid.component';

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

  editable: boolean = true; // per disabilitare l'inserimento nei campi totale ed acconto
  disableDeliveryControls: boolean = false; // per disabilitare l'inserimento nei campi modalità di consegna e data consegna

  public reactiveForm: FormGroup; // oggetto per gestire il form con l'approccio reactive
  public dataCustomer: Customer;
  public dataOrder: Order;
  public dataTemporaryOrder: Order; // l'ordine che in fase di inserimento consente di gestire la creazione di un ordine vuoto
                                    // che verrà poi assegnato a dataOrder a seconda dei casi da gestire
  
  public orderMeasure: Measure; ;
  public latestMeasure: Measure; 
  public shirtsInOrder: Shirt[];

  public subcontractors: Subcontractor[];

  constructor( @Inject(MAT_DIALOG_DATA) data,
    private _adapter: DateAdapter<any>,
    public restBackendService: RESTBackendService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar ) 
    {
      this.formModal = data.formModal; // inserimento / aggiornamento      
      this.dataCustomer = data.customer; // cliente per il quale si sta inserendo o aggiornando un ordine
      this.dataOrder = data.order; // ordine vuoto nel caso di inserimento dell'ordine o quello di cui si vuole fare l'aggironamento nel caso di aggionramento
      
      this.orderMeasure = data.orderMeasure; // tale misura è vuota nel caso di inserimento di nuovo ordine o è quella utilizzata nell'ordine nel caso di aggiornamento
      this.latestMeasure = data.latestMeasure; // l'ultima misura disponibile per il cliente

      this.shirtsInOrder = data.shirtsInOrder; // le camicie presenti nell'ultimo ordine se esiste, serve nel caso di precaricamento del form con un ordine avente camicie                    

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

    // # INIZIO # FASE DI PRERICARICAMENTO DEL FORM ORDINE COMUNE SIA LLA'INSERIMENTO CHE ALL'AGGIORNAMENTO DI UN ORDINE
    this._adapter.setLocale('it');

    this.loadSubcontractor(); // si caricano i fasonisti

    this.nominativo = this.dataCustomer.nominativo + ' ( ' + this.dataCustomer.telefono + ' )' ;

    this.data_misura = this.orderMeasure.data_misure;
    this.data_misura = this.data_misura.split(' ')[0].split('/')[1] + '/' +
                                this.data_misura.split(' ')[0].split('/')[0] + '/' +             
                                this.data_misura.split(' ')[0].split('/')[2];

    this.reactiveForm.get('clienti_idclienti').setValue(this.dataCustomer.idclienti);     
    
    // si valorizza il campo nascosco del form contenente l'id edlla misura
    if ( this.formModal == 'inserimento' ) {
      this.reactiveForm.get('id_misure_ordinate').setValue(this.orderMeasure.idmisure);   
    } else if ( this.formModal == 'aggiornamento' ) {
      this.reactiveForm.get('id_misure_ordinate').setValue(this.dataOrder.id_misure_ordinate); 
    }    
    // # FINE # FASE DI PRERICARICAMENTO DEL FORM ORDINE COMUNE SIA LLA'INSERIMENTO CHE ALL'AGGIORNAMENTO DI UN ORDINE

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
        "id_misure_ordinate": this.orderMeasure.idmisure
      }).subscribe(
        (data) =>{

          this.dataTemporaryOrder = data;
          
          this.reactiveForm.get('data_ordine').setValue(this.getCurrentDateFormatted());  
          this.reactiveForm.get('totale').setValue(Number(0).toFixed(2).replace('.',','));
          this.reactiveForm.get('acconto').setValue(Number(0).toFixed(2).replace('.',','));
          this.reactiveForm.get('saldo').setValue(Number(0).toFixed(2).replace('.',','));            
          this.reactiveForm.addControl('data_consegna',new FormControl('',Validators.required));    
          this.reactiveForm.get('mod_consegna').setValue('RITIRO IN SEDE');                
          this.reactiveForm.get('idordini').setValue(this.dataTemporaryOrder.idordini);

          this.idOrdineAperto = this.dataTemporaryOrder.idordini; // per comunicare al child shirts l'id del'ordine
          this.dataOrdineAperto = this.getCurrentDateFormatted('onlyDate');   // per stampare sul form l'etichetta della data

          // GESTIONE DELLA PRESENZA DI UN ORDINE PRECEDENTE
          if ( this.dataOrder ) {
            // IN INSERIMENTO SE dataOrder contiene un ordine questo passato è l'ultimo fatto dal cliente
            // in tal caso si precarica il form con i valori di questo ordine se confermato
            const dialogConfig = new MatDialogConfig();
            dialogConfig.data = {
              titolo: 'ATTENZIONE!', 
              messaggio: 'Per il cliente c\'è un ordine precedente. Partire dai dati di questo ordine?',
            };
            dialogConfig.autoFocus = true;
            dialogConfig.disableClose = true;
            const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);    
            dialogRef.afterClosed().subscribe(result => {
              if(result){
                // console.log('inserimento ordine, esiste un ordine precedente e si è scelto di usarlo come partenza');
                // console.log('camicie dell\'ultimo ordine', this.shirtsInOrder);
                // l 'utente vuole utilizzare i dati dell'ultimo ordine
                // STEP 1: si creano copie delle camicie                
                this.shirtsInOrder.forEach(shirt => {
                  console.log('camicia', shirt);
                  shirt.ordini_idordini = this.dataTemporaryOrder.idordini; // si cambia l'id con quello del nuovo ordine
                  this.restBackendService.postResource('shirts',shirt).subscribe(
                    (data) => {
                       // serve per indicare al componente figlio shirts l'id ordine per recuperare le camicie
                       console.log('si comunica al child, ordine n°', this.dataTemporaryOrder.idordini);
                       this.idOrdineAperto = this.dataTemporaryOrder.idordini;
                       this.onUpdateShirtGrid();
                    }
                  );
                });

                // this.idOrdineAperto = this.dataTemporaryOrder.idordini; // serve per indicare al componente figlio shirts l'id ordine per recuperare le camicie

                //si modificano i campi delldell'ultimo ordine che devono cambiare
                this.dataOrder.idordini = this.dataTemporaryOrder.idordini;                
                this.dataOrder.data_ordine = this.dataTemporaryOrder.data_ordine;
                
                //STEP 2: si precarica il form con i dati derivanti dall'ultimo ordine
                this.loadFormFields(); // caricano i campi

                // SI ANNULLA LA DATA DI CONSEGNA                
                this.reactiveForm.get('data_consegna').setValue('');
                this.reactiveForm.get('data_consegna').setErrors({ 'invalid': true });
                this.reactiveForm.get('data_consegna').markAsTouched();

                // SI ANNULLA LA PARTE ECONOMICA              
                this.reactiveForm.get('totale').setValue((0).toFixed(2).replace('.',','));
                this.reactiveForm.get('saldo').setValue((0).toFixed(2).replace('.',','));
                this.reactiveForm.get('acconto').setValue((0).toFixed(2).replace('.',','));

                // SI ANNULLA LA PARTE ECONOMICA    
                this.reactiveForm.get('saldato').setValue('');
                this.reactiveForm.get('consegnato').setValue('');                

                // SI ANNULLA LA NOTA    
                this.reactiveForm.get('note').setValue('');
                this.reactiveForm.get('note_x_fasonista').setValue('');

              } else {
                //se non si vuole utilizzare l'ordine vecchio non 
                console.log('inserimento ordine, esiste un ordine precedente ma NON si è scelto di usarlo come partenza');
                this.dataOrder = this.dataTemporaryOrder;                

              }    
            });              

          } else {
            // se non c'è un ordine precedente
            console.log('inserimento ordine, non esiste alcun ordine precedente');
            this.dataOrder = this.dataTemporaryOrder;
          }
        

        },
        (error) =>{
          console.error(error);
          console.error('Message: ' + error.message);                      
        }
      )        
    
    } else if ( this.formModal=='aggiornamento' ) {

      this.loadFormFields();

      // this.reactiveForm.get('fasonatori_idfasonatori').setValue(this.dataOrder.fasonatori_idfasonatori);

      // this.reactiveForm.get('totale').setValue(this.dataOrder.totale);
      // this.reactiveForm.get('acconto').setValue(this.dataOrder.acconto);
      // this.reactiveForm.get('saldo').setValue(this.dataOrder.saldo);

      // this.reactiveForm.get('mod_consegna').setValue(this.dataOrder.mod_consegna);

      // if ( this.dataOrder.consegnato == 'SI') 
      //   this.reactiveForm.get('consegnato').setValue(true);
      // else
      //   this.reactiveForm.get('consegnato').setValue(false);

      // if ( this.dataOrder.saldato == 'SI') 
      //   this.reactiveForm.get('saldato').setValue(true);
      // else
      //   this.reactiveForm.get('saldato').setValue(false);        

      // // SI VALORIZZA LA DATA DI CONSEGNA
      // var dataConsegna: string[] = this.dataOrder.data_consegna.split('/');
      // this.reactiveForm.get('data_consegna').setValue(new Date(parseInt(dataConsegna[2]),parseInt(dataConsegna[1])-1,parseInt(dataConsegna[0])));

      // this.reactiveForm.get('note').setValue(this.dataOrder.note);
      // this.reactiveForm.get('note_x_fasonista').setValue(this.dataOrder.note_x_fasonista);

      // this.reactiveForm.get('idordini').setValue(this.dataOrder.idordini);
      // this.idOrdineAperto = this.dataOrder.idordini; // serve per indicare al componente figlio shirts l'id ordine per recuperare le camicie
      // this.reactiveForm.get('data_ordine').setValue(this.dataOrder.data_ordine);
      // this.dataOrdineAperto = this.dataOrder.data_ordine; 
      
      // // SI controlla se esistono delle misure più recenti di quelle dell'ordine in modifica
      // if ( this.orderMeasure.idmisure != this.latestMeasure.idmisure ) {
      //   // l'ordine NON UTILIZZA la misura più recente disponibile per il cliente

      //     const dialogConfig = new MatDialogConfig();
      //     dialogConfig.data = {
      //       titolo: 'ATTENZIONE!', 
      //       messaggio: 'Per il clente esiste una misura più recente di quella utilizzata nell\'ordine che si vuole modificare.',
      //       messaggioOK: 'Clicca Conferma per utilizzare l\'ultima misura del cliente, sarà necessario riassegnare il fasonista.',
      //       messaggioDiscard: 'Clicca Annulla per utilizzare la misura vecchia dell\'ordine. '
      //     };
      //     dialogConfig.autoFocus = true;
      //     dialogConfig.disableClose = true;                 
      //     const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);
      //     dialogRef.afterClosed().subscribe(result => {
      //       if(result){
      //         // se si sceglie di utilizzare le ultime misure più recenti di quelle dell'ordine in modifica 
      //         this.dataOrder.id_misure_ordinate = this.latestMeasure.idmisure; // si aggiorna l'id della misura indicata nell'ordine
      //         this.orderMeasure = this.latestMeasure; // si rende la misura dell'ordine l'ultima disponibile
      //         this.loadSubcontractor(); // si ricarinao i fasonisti
      //         this.reactiveForm.get('fasonatori_idfasonatori').setValue(0); // si azzera il combo box
      //       }            
      //     });        
        
      // } else { // l'ordine UTILIZZA la misura più recente disponibile per il cliente
        
      // }
      
    }
  

  } // ngOnInit fine


  @ViewChild(ShirtsGridComponent, { static: false }) childHandler: ShirtsGridComponent;
  private onUpdateShirtGrid() {
    this.childHandler.update();
  }    


  private loadFormFields(){

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

    // SI VALORIZZA LA DATA DI CONSEGNA
    var dataConsegna: string[] = this.dataOrder.data_consegna.split('/');
    this.reactiveForm.get('data_consegna').setValue(new Date(parseInt(dataConsegna[2]),parseInt(dataConsegna[1])-1,parseInt(dataConsegna[0])));

    this.reactiveForm.get('note').setValue(this.dataOrder.note);
    this.reactiveForm.get('note_x_fasonista').setValue(this.dataOrder.note_x_fasonista);

    this.reactiveForm.get('idordini').setValue(this.dataOrder.idordini);
    this.idOrdineAperto = this.dataOrder.idordini; // serve per indicare al componente figlio shirts l'id ordine per recuperare le camicie
    this.reactiveForm.get('data_ordine').setValue(this.dataOrder.data_ordine);
    this.dataOrdineAperto = this.dataOrder.data_ordine; 
    
    // SI controlla se esistono delle misure più recenti di quelle dell'ordine in modifica
    console.log('id misure dell\'ordine',this.orderMeasure.idmisure);
    console.log('id misure dell\'ulitima misura',this.latestMeasure.idmisure);
    if ( this.orderMeasure.idmisure != this.latestMeasure.idmisure ) {
      // l'ordine NON UTILIZZA la misura più recente disponibile per il cliente

        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          titolo: 'ATTENZIONE!', 
          messaggio: 'Per il clente esiste una misura più recente di quella utilizzata nell\'ordine che si vuole modificare.',
          messaggioOK: 'Clicca Conferma per utilizzare l\'ultima misura del cliente, sarà necessario riassegnare il fasonista.',
          messaggioDiscard: 'Clicca Annulla per utilizzare la misura vecchia dell\'ordine. '
        };
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;                 
        const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            // se si sceglie di utilizzare le ultime misure più recenti di quelle dell'ordine in modifica 
            this.dataOrder.id_misure_ordinate = this.latestMeasure.idmisure; // si aggiorna l'id della misura indicata nell'ordine
            this.orderMeasure = this.latestMeasure; // si rende la misura dell'ordine l'ultima disponibile
            this.reactiveForm.get('id_misure_ordinate').setValue(this.latestMeasure.idmisure);             

            this.loadSubcontractor(); // si ricarinao i fasonisti
            this.reactiveForm.get('fasonatori_idfasonatori').setValue(0); // si azzera il combo box

            this.reactiveForm.get('fasonatori_idfasonatori').setErrors({ 'invalid': true });
            this.reactiveForm.get('fasonatori_idfasonatori').markAsTouched();            
            
          }            
        });        
      
    } else { // l'ordine UTILIZZA la misura più recente disponibile per il cliente
      
    }    

  }


  private loadSubcontractor(){
    //SI popola il combobox con l'elenco dei fasonatori
    this.restBackendService.getResource('subcontractors').subscribe(
      (data) => {

          var subcontractorsFromDB: Subcontractor[] = data; // tutti i fasonisti presenti in archivio

          var descrizione = data.map(a => a.nome + ' - ( tel: ' + a.telefono  + ' )');
          for (let index = 0; index < data.length; index++) {
            data[index].descrizione = descrizione[index];              
          }


          this.restBackendService.getResource('measurers').subscribe(
            (data) => {
              var measures: Measurer[] = data;             
              var measurersFiltered: Measurer[] = measures.filter(x => x.descrizione === this.orderMeasure.misurometro);

              // console.log('misurometri filtrati',measurersFiltered);

              //si filtrano i fasonisti
              var subcontractorsFromDBFiltered = new Array<Subcontractor>();
              subcontractorsFromDB.forEach(subcontractor => {

                measurersFiltered.forEach(measurer => {                  
                  if ( subcontractor.idfasonatori === measurer.idfasonatori ) {
                    subcontractorsFromDBFiltered.push(subcontractor);
                  }                  
                });                
              });

              // console.log('fasonisti filtrati', subcontractorsFromDBFiltered);
              this.subcontractors = subcontractorsFromDBFiltered; // si assegnano i fasonisti
              
            },
            (error) => {

            }
          );


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


  getCurrentDateFormatted(onlyDate?: string): string {
    var today = new Date();
    var dd = today.getDate();
    var MM = today.getMonth()+1; 
    const yyyy = today.getFullYear();

    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();

    var giorno, mese, oggi, ora, minuti, secondi: any;

    if( dd < 10 ) {
      giorno = `0${dd}`;
    } else {
      giorno = dd;
    }

    if( MM < 10 ) {
      mese = `0${MM}`;
    } else {
      mese = MM;
    }

    if( hh < 10 ) {
      ora = `0${hh}`;
    } else {
      ora = hh;
    }
    
    if( mm < 10 ) {
      minuti = `0${mm}`;
    } else {
      minuti = mm;
    }
    
    if( ss < 10 ) {
      secondi = `0${ss}`;
    } else {
      secondi = ss;
    }    
    
    if ( onlyDate ) {
      oggi = giorno + '/' + mese + '/' + yyyy  ;    
    } else {
      oggi = giorno + '/' + mese + '/' + yyyy + ' ' + ora + ':' + minuti + ':' + secondi ;
    }
  
    return oggi;
  }



  calcoloTotaleBlurTotale() {

    var totale = this.getValueTotaleAcconto().totale;
    var acconto = this.getValueTotaleAcconto().acconto;

    // if( isNaN(totale) ){
    //   this.reactiveForm.get('totale').setValue('0,00');
    // } else if ( totale < acconto) {              
    //   this.reactiveForm.get('totale').setValue(acconto.toFixed(2).replace('.',','));     
    //   this.reactiveForm.get('saldo').setValue( (0).toFixed(2).replace('.',',') );     
    //   this.openSnackBar('Errore, il totale è inferiore all\'acconto. Dato inserito annullato.\n Inserire un valore valido',1000);
    //   document.getElementById('totale').focus();
    // }  else {
    //   this.reactiveForm.get('saldo').setValue( (totale-acconto).toFixed(2).replace('.',',') ); 
    // }  

    if( isNaN(totale) ){
      this.reactiveForm.get('totale').setValue('0,00');
    } else if ( totale < acconto) {   
      this.reactiveForm.get('saldo').setValue('0,00');           
      // this.reactiveForm.get('totale').setValue(acconto.toFixed(2).replace('.',','));     
      // this.reactiveForm.get('saldo').setValue( (0).toFixed(2).replace('.',',') );     
      // this.openSnackBar('Errore, il totale è inferiore all\'acconto. Dato inserito annullato.\n Inserire un valore valido',1000);
      // document.getElementById('totale').focus();
    }  else {
      this.reactiveForm.get('saldo').setValue( (totale-acconto).toFixed(2).replace('.',',') ); 
    }    

  }

  calcoloTotaleBlurAcconto() {

    var totale = this.getValueTotaleAcconto().totale;
    var acconto = this.getValueTotaleAcconto().acconto;

    // if( isNaN(acconto) ){
    //   this.reactiveForm.get('acconto').setValue('0,00');
    // } else if ( totale < acconto) {              
    //   this.reactiveForm.get('acconto').setValue('0,00');      
    //   this.reactiveForm.get('saldo').setValue( (totale).toFixed(2).replace('.',',') );    
    //   this.openSnackBar('Errore, l\'acconto inserito è maggiore. Dato inserito annullato.\n Inserire un valore valido',1000);
    //   document.getElementById('acconto').focus();
    // } else {
    //   this.reactiveForm.get('saldo').setValue( (totale-acconto).toFixed(2).replace('.',',') ); 
    // }  

    if( isNaN(acconto) ){
      this.reactiveForm.get('acconto').setValue('0,00');
    } else if ( totale < acconto) {           
      this.reactiveForm.get('saldo').setValue('0,00');              
      // this.reactiveForm.get('acconto').setValue('0,00');      
      // this.reactiveForm.get('saldo').setValue( (totale).toFixed(2).replace('.',',') );    
      // this.openSnackBar('Errore, l\'acconto inserito è maggiore. Dato inserito annullato.\n Inserire un valore valido',1000);
      // document.getElementById('acconto').focus();
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

  addNote( event: any ) {
    // console.log(event.checked);
    if ( this.reactiveForm.get('note_x_fasonista').value )
    this.reactiveForm.get('note_x_fasonista').setValue(this.reactiveForm.get('note_x_fasonista').value + "\n1 bottone a 5.5 cm\nUltima asola al contrario");
    else
    this.reactiveForm.get('note_x_fasonista').setValue("1 bottone a 5.5 cm\nUltima asola al contrario");
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
    // console.log('ELENCO CAMICIE RICEVUTO');
    // console.log(shirts);
    this.shirtsInOrder = shirts;
  }


  ordineAnnullato() {
    

    if ( this.formModal == 'inserimento' ) {
      //si cancellano tutte le camice dell'ordine
      this.restBackendService.getResourceQuery('shirtsQuery', 'idordini=' + this.dataTemporaryOrder.idordini ). subscribe(
        (data) => {
          var shirtsToDelete: Shirt[] = data;
          // console.log('camicie da cacellare',shirtsToDelete);
          shirtsToDelete.forEach(shirt => {
            this.restBackendService.delResource('shirts',{
              'idcamicie': shirt.idcamicie
            }).subscribe();            
          });
        },
        (error) => {
          console.error(error);
          console.error('Message: ' + error.message);  
        }
      );

      this.restBackendService.delResource('orders',{'idordini': this.dataTemporaryOrder.idordini}).subscribe(
        (data) => {
          this.openSnackBar(this.formModal + ' Ordine Annullato', 2500);
        },
        (error) => {
          console.error(error);
          console.error('Message: ' + error.message);  
        }
      );

    }

  }

  openSnackBar(message: string, duration?: number) {

    if(isUndefined(duration)) duration = 3500;

    this._snackBar.open(message.toUpperCase(), 'Chiudi', {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
 
}
