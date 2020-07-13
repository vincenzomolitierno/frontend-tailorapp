import { Component, OnInit, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatDialogConfig, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ShirtFormComponent } from '../shirt-form/shirt-form.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';
import { Shirt } from '../shirt.model';
import { QueryParameter } from 'src/app/backend-service/data.model';
import { MessageNotificationDummyComponent } from 'src/app/utilities/message-notification-dummy/message-notification-dummy.component';

@Component({
  selector: 'app-shirts-grid',
  templateUrl: './shirts-grid.component.html',
  styleUrls: ['./shirts-grid.component.css']
})
export class ShirtsGridComponent extends GridModel implements OnInit, OnChanges {

  @Input() ordini_idordini: string;
  // Dati coinvolti nel binding
  dummy_data: string = "dummy_data"
  testo_ricerca: string = "";  

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    // 'idcamicie',
    'numero_capi',
    'colore', 
    
    'modellocollo',
    'modellopolso',
    'avanti',
    'indietro',

    'presenza_iniziali',
    'update',
    'view',
    'delete'
  ];


  constructor( restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog,
    snackBar: MatSnackBar ) { 
    super(restBackendService, snackBar); // si innesca il costruttore della classe padre       
  }

  ngOnInit() {
       
    if ( this.ordini_idordini ) {
      console.log('ordine preesistente');
      this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});

    } else {
      console.log('nuovo ordine');
    }

  }

  ngOnChanges() {
    console.log('aggiornamento griglia');
    this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});    
  }  

  // OVERRIDE
  public getRemoteDataQuery(tagResourse: string, queryParameter: QueryParameter):any {

    var key = Object.keys(queryParameter);
    var value = Object.values(queryParameter);
    
   // chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
   this.restBackendService.getResourceQuery(tagResourse,
     key + '=' + value).subscribe(
     (data) => {

            var shirts: Shirt[] = data;
            shirts.sort((a, b) => (a.idcamicie < b.idcamicie) ? 1 : -1);

            this.resource = shirts;
            this.dataSource = new MatTableDataSource(this.resource);
                      
            this.dataSource.paginator = this.paginatorTable;    
            this.dataSource.sort = this.sortTable; 

           },
     (error) => {
         this.errorHttpErrorResponse = error;
         this.errorMessage = error.message;
     }
   );
  
 }    

  openResourceDialog(formModal: string, shirt?: Shirt) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      shirt: shirt, // camicia, parametro valorizzato nel caso di apertura in modalità aggiornamento
      ordini_idordini: this.ordini_idordini, // numero dell'ordine di riferimento
      formModal: formModal };
    dialogConfig.disableClose = true;      
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(ShirtFormComponent, dialogConfig);    
    dialogRef.afterClosed().subscribe(result => {

      if ( result ) { // si è scelto di confermare

        var shirt: Shirt = result;   

        if ( formModal == 'inserimento' ) { //INSERIMENTO DELLA NUOVA CAMICIA

          var tasca: string;
          if(result.tasca)
            tasca = 'SI';
          else  
            tasca = 'NO';
  
          var cuciture: string;
          if(result.cuciture)
            cuciture = 'SI';
          else  
            cuciture = 'NO';    
           
          var stecche_estraibili: string;
          if(result.stecche_estraibili)
            stecche_estraibili = 'SI';
          else  
            stecche_estraibili = 'NO';   
          
          var presenza_iniziali: string;
          if(result.switchIniziali)
            presenza_iniziali = 'SI';
          else  
            presenza_iniziali = 'NO';   
  
          var posizione_iniziali: string;
          if(result.posizione_iniziali.descrizione)
            posizione_iniziali = result.posizione_iniziali.descrizione;
          else  
            posizione_iniziali = '';            
            
          var obj = {    
            'avanti_idavanti': result.avanti_idavanti,
            "colore": result.colore,
            "cuciture": cuciture,
            "indietro_idindietro": result.indietro_idindietro,
            "iniziali": result.iniziali,
            "maiuscolo": result.maiuscolo,
            "modellocollo_idmodello": result.modellocollo_idmodello,
            "modellopolso_idmodello": result.modellopolso_idmodello,
            "note": result.note,
            "numero_capi": parseInt(result.numero_capi),
            "ordini_idordini": this.ordini_idordini,
            "pos_iniziali": posizione_iniziali,
            "presenza_iniziali": presenza_iniziali,
            "stecche_estraibili": stecche_estraibili,
            "stile_carattere": result.stile_carattere,
            "tasca": tasca,
            "tipo_bottone": result.tipo_bottone
          };
  
          this.postData('shirts', obj);           
          
        } else if ( formModal == 'aggiornamento' ) { //AGGIORNAMENTO DELLA CAMICIA

          var posizione_iniziali = '';
          if ( shirt.pos_iniziali ) posizione_iniziali = shirt.pos_iniziali;

          var tasca = 'NO';
          if ( shirt.tasca ) tasca = 'SI';

          var stecche_estraibili = 'NO';
          if ( shirt.stecche_estraibili ) stecche_estraibili = 'SI';     
          
          var cuciture = 'NO';
          if ( shirt.cuciture ) cuciture = 'SI';   

          var updatingShirt = {  
            "idcamicie": shirt.idcamicie,  
            "avanti_idavanti": shirt.avanti_idavanti,
            "colore": shirt.colore,
            "cuciture": cuciture,
            "indietro_idindietro": shirt.indietro_idindietro,
            "iniziali": shirt.iniziali,
            "maiuscolo": shirt.maiuscolo,
            "modellocollo_idmodello": shirt.modellocollo_idmodello,
            "modellopolso_idmodello": shirt.modellopolso_idmodello,
            "note": shirt.note,
            "numero_capi": Number(shirt.numero_capi),
            "ordini_idordini": shirt.ordini_idordini,
            "pos_iniziali": posizione_iniziali,
            "presenza_iniziali": shirt.presenza_iniziali,
            "stecche_estraibili": stecche_estraibili,
            "stile_carattere": shirt.stile_carattere,
            "tasca": tasca,
            "tipo_bottone": shirt.tipo_bottone
          };

          console.log('camicia da aggironare', updatingShirt);

          this.putDataLess('shirts', updatingShirt);            
          this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});    
          
        }
        
      }

    });    
    
  }   

  public openDeleteDialog(shirts: Shirt){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titolo: 'ATTENZIONE!', 
      messaggio: 'Eliminare la camicia dall\'ordine corrente? L\'operazione non potrà essere annullata',
    };

    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      
      if( result ) { 

        this.restBackendService.delResource('shirts',
        {
          "idcamicie": shirts.idcamicie
        }).subscribe(
          (data) => {                 
            this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});  
          },
          (error) => {
            this.errorHttpErrorResponse = error;
            this.errorMessage = error.message;        
          });         

      }
      
    });     

  }   
  
  // OVERRIDE
  public postData(tagResource: string, body: object):void {

    this.errorMessage = '';

    this.restBackendService.postResource(tagResource, body).subscribe(
      (data) => {  
        this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});    
      },
      (error) => {
        this.errorHttpErrorResponse = error;
        this.errorMessage = error.message;        
      });    

  }



  openView(shirt: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      messaggio: this.creaStringaCamicia(shirt).toUpperCase(), 
      titolo: 'DETTAGLI CAMICIA', 
    };          
    const dialogRef = this.dialog.open(MessageNotificationDummyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
    });  


  }

  creaStringaCamicia(shirt: any): string {
    var element = shirt;
    var stringa: string = '';

    if ( element.presenza_iniziali == 'SI' ) {

      stringa =      
      'numero capi: ' + element.numero_capi + '\n' +   
      'colore: ' + element.colore + '\n' +   
      // 'idcamicie: ' + element.idcamicie + '\n' +
      'modello collo: ' + element.modellocollo + '\n' +
      'modello polso: ' + element.modellopolso + '\n' +
      'modello avanti: ' + element.avanti + '\n' +
      'modello indietro: ' + element.indietro;             

      if ( element.stecche_estraibili == 'SI' )
        stringa = stringa + '\n' + 'stecche estraibili';
      else if ( element.stecche_estraibili == 'NO' )
        stringa = stringa + '\n' + 'stecche non estraibili';
            
      if ( element.tipo_bottone != '' )
        stringa = stringa + '\n' + 'tipo bottone: ' + element.tipo_bottone;
              
      stringa = stringa + '\n' + 'tasca: ' + element.tasca;
       
      if ( element.cuciture == 'SI' )
        stringa = stringa + '\n' + 'cuciture a mano';
      else if ( element.cuciture == 'NO' )
        stringa = stringa + '\n' + 'cuciture a macchina';

      stringa = stringa + '\n' +
      // 'ordini_idordini ' + element.idordini + '\n' +
      'iniziali: ' + element.presenza_iniziali + '\n' +      
      'lettere iniziali: ' + element.iniziali + '\n' +
      'posizioni iniziali: ' + element.pos_iniziali;
      
      if ( element.stile_carattere == 'SI' )
        stringa = stringa + '\n' + 'corsivo';
      else if ( element.stile_carattere == 'NO' )
        stringa = stringa + '\n' + 'stampato';      
      
      if ( element.maiuscolo == 'SI' )
        stringa = stringa + '\n' + 'maiuscolo';
      else if ( element.maiuscolo == 'NO' )
        stringa = stringa + '\n' + 'minuscolo';              
      
      if ( element.note != '' )
        stringa = stringa + '\n' + 'note: ' + element.note;        
      
    } else if ( element.presenza_iniziali == 'NO'  ) {

      stringa =      
      'numero capi: ' + element.numero_capi + '\n' +   
      'colore: ' + element.colore + '\n' +   
      // 'idcamicie: ' + element.idcamicie + '\n' +
      'modello collo: ' + element.modellocollo + '\n' +
      'modello polso: ' + element.modellopolso + '\n' +
      'modello avanti: ' + element.avanti + '\n' +
      'modello indietro: ' + element.indietro;             

      if ( element.stecche_estraibili == 'SI' )
        stringa = stringa + '\n' + 'stecche estraibili';
      else if ( element.stecche_estraibili == 'NO' )
        stringa = stringa + '\n' + 'stecche non estraibili';
            
      if ( element.tipo_bottone != '' )
        stringa = stringa + '\n' + 'tipo bottone: ' + element.tipo_bottone;
              
      stringa = stringa + '\n' + 'tasca: ' + element.tasca;
       
      if ( element.cuciture == 'SI' )
        stringa = stringa + '\n' + 'cuciture a mano';
      else if ( element.cuciture == 'NO' )
        stringa = stringa + '\n' + 'cuciture a macchina';
        
        if ( element.note != '' )
          stringa = stringa + '\n' + 'note: ' + element.note;  

    }   

    return stringa;
  }

  update(): void {
    // console.log('AGGIORNAMENTO GRIGLIA CAMICIE');
    this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});   
    }


}
