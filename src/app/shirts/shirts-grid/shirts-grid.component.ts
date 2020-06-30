import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatDialogConfig, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ShirtFormComponent } from '../shirt-form/shirt-form.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';
import { Shirt } from '../shirt.model';
import { QueryParameter } from 'src/app/backend-service/data.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



@Component({
  selector: 'app-shirts-grid',
  templateUrl: './shirts-grid.component.html',
  styleUrls: ['./shirts-grid.component.css']
})
export class ShirtsGridComponent extends GridModel implements OnInit {

  @Input() ordini_idordini: string;

  shirtsAdded: Array<any> = new Array();
  @Output() shirtsAddEvent = new EventEmitter<Array<any>>();
  

  // Dati coinvolti nel binding
  dummy_data: string = "dummy_data"
  testo_ricerca: string = "";  

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    // 'idcamicie',
    'colore', 
    'numero_capi',

    'modellocollo',
    'modellopolso',
    'avanti',
    'indietro',

    'presenza_iniziali',
    // 'update',
    'view',
    'delete'
  ];


  constructor( restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog,
    snackBar: MatSnackBar ) { 
    super(restBackendService, snackBar); // si innesca il costruttore della classe padre       
  }

  ngOnInit() {
    
    console.log(this.ordini_idordini);
    
    if ( this.ordini_idordini ) {
      console.log('ordine preesistente');
      this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});

    } else {
      console.log('nuovo ordine');
    }

  }

  // OVERRIDE
  public getRemoteDataQuery(tagResourse: string, queryParameter: QueryParameter):any {

    // this.resourceQuery = [];

    var key = Object.keys(queryParameter);
    var value = Object.values(queryParameter);

    console.log(key);
    console.log(value);
    
   // chiamata RESTFul per ottenere la risorsa, cioè l'elenco di tutti gli item
   this.restBackendService.getResourceQuery(tagResourse,
     key + '=' + value).subscribe(
     (data) => {

            console.log('CAMICIE ASSOCIATE ALL\'ORDINE');
            console.log(data);

            // this.resourceQuery = data;
            this.shirtsAdded = data;

            this.resource = data;
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
      shirt: shirt,
      ordini_idordini: this.ordini_idordini, 
      formModal: formModal };

    dialogConfig.disableClose = true;      

    const dialogRef = this.dialog.open(ShirtFormComponent, dialogConfig);    

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if ( result ) { //INSERIMENTO DELLA NUOVA CAMICIA

        if(result.tasca)
          var tasca = 'SI';
        else  
          var tasca = 'NO';

        if(result.cuciture)
          var cuciture = 'SI';
        else  
          var cuciture = 'NO';    
          
        if(result.stecche_estraibili)
          var stecche_estraibili = 'SI';
        else  
          var stecche_estraibili = 'NO';   
          
        if(result.switchIniziali)
          var presenza_iniziali = 'SI';
        else  
          var presenza_iniziali = 'NO';   

        if(result.maiuscolo)
          var maiuscolo = 'SI';
        else  
          var maiuscolo = 'NO';    
          
        if(result.stile_carattere)
          var stile_carattere = 'SI';
        else  
          var stile_carattere = 'NO';             

        if(result.posizione_iniziali.descrizione)
          var posizione_iniziali: string = result.posizione_iniziali.descrizione;
        else  
          var posizione_iniziali: string = '';            
          
        var obj = {    
            'avanti_idavanti': result.avanti_idavanti,
            "colore": result.colore,
            "cuciture": cuciture,
            "indietro_idindietro": result.indietro_idindietro,
            "iniziali": result.iniziali,
            "maiuscolo": maiuscolo,
            "modellocollo_idmodello": result.modellocollo_idmodello,
            "modellopolso_idmodello": result.modellopolso_idmodello,
            "note": result.note,
            "numero_capi": parseInt(result.numero_capi),
            "ordini_idordini": this.ordini_idordini,
            "pos_iniziali": posizione_iniziali,
            "presenza_iniziali": presenza_iniziali,
            "stecche_estraibili": stecche_estraibili,
            "stile_carattere": stile_carattere,
            "tasca": tasca,
            "tipo_bottone": result.tipo_bottone
          }

        console.log('CAMICIA DA INSERIRE');
        console.log(obj);
        // this.postData('shirts', obj);       

        //SI AGGIUNGE L'OGGETTO CAMICIA ALLA RACCOLTA E LO SI NOTIFICA AL PARENT
        this.shirtsAdded.push(obj);
        this.shirtsAddEvent.emit(this.shirtsAdded);   

        //si aggiornano i dati in tabella
        this.dataSource = new MatTableDataSource(this.shirtsAdded);                 
        this.dataSource.paginator = this.paginatorTable;    
        this.dataSource.sort = this.sortTable;  
        //
        
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

        console.log(result);

        const index = this.shirtsAdded.indexOf('idcamicie', shirts.idcamicie);
        if (index > -1) {
          this.shirtsAdded.splice(index, 1);
        }  
        this.shirtsAddEvent.emit(this.shirtsAdded);      
       
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

    console.log(shirt);

    this.openSnackBar(this.creaStringaCamicia(shirt));
  }

  creaStringaCamicia(shirt: any): string {
    var element = shirt;
    var stringa: string;

    if ( element.iniziali == 'SI' ) {
      stringa = 
      // 'colore: ' + element.colore + ' | ' +
      // 'numero capi: ' + element.numero_capi + ' | ' +      
      // // 'idcamicie: ' + element.idcamicie + ' | ' +
      // 'collo: ' + element.modellocollo + ' | ' +
      // 'polso: ' + element.modellopolso + ' | ' +
      // 'avanti: ' + element.avanti + ' | ' +
      // 'indietro: ' + element.indietro + ' | ' +             
      'stecche: ' + element.stecche_estraibili;
      
      
      if ( element.tipo_bottone != '' )
        stringa = stringa + ' | ' + 'tipo bottone: ' + element.tipo_bottone;
              
      stringa = stringa + ' | ' +      
      'tasca: ' + element.tasca + ' | ' +
      'cuciture: ' + element.cuciture + ' | ' +
      // 'ordini_idordini ' + element.idordini + ' | ' +
      'iniziali: ' + element.presenza_iniziali + ' | ' +      
      'let. iniziali: ' + element.iniziali + ' | ' +
      'pos. iniziali: ' + element.pos_iniziali + ' | ' +
      'corsivo: ' + element.stile_carattere + ' | ' +
      'maiuscolo: ' + element.maiuscolo;
      
      if ( element.note != '' )
        stringa = stringa + ' | ' + 'note: ' + element.note;        
      
    } else if ( element.iniziali == 'NO' || element.iniziali == ''  ) {

        stringa = 
        // 'colore: ' + element.colore + ' | ' +
        // 'numero capi: ' + element.numero_capi + ' | ' +      
        // // 'idcamicie: ' + element.idcamicie + ' | ' +
        // 'collo: ' + element.modellocollo + ' | ' +
        // 'polso: ' + element.modellopolso + ' | ' +
        // 'avanti: ' + element.avanti + ' | ' +
        // 'indietro: ' + element.indietro + ' | ' +             
        'stecche: ' + element.stecche_estraibili;
        
        
        if ( element.tipo_bottone != '' )
          stringa = stringa + ' | ' + 'tipo bottone: ' + element.tipo_bottone;
                
        stringa = stringa + ' | ' +      
        'tasca: ' + element.tasca + ' | ' +
        'cuciture: ' + element.cuciture + ' | ' +
        // 'ordini_idordini ' + element.idordini + ' | ' +
        'iniziali: ' + element.presenza_iniziali;    
        // 'let. iniziali: ' + element.iniziali + ' | ' +
        // 'pos. iniziali: ' + element.pos_iniziali + ' | ' +
        // 'corsivo: ' + element.stile_carattere + ' | ' +
        // 'maiuscolo: ' + element.maiuscolo;
        
        if ( element.note != '' )
          stringa = stringa + ' | ' + 'note: ' + element.note;  

    }   

    return stringa;
  }



}
