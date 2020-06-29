import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatDialogConfig, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ShirtFormComponent } from '../shirt-form/shirt-form.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';
import { Shirt } from '../shirt.model';
import { isUndefined } from 'util';


@Component({
  selector: 'app-shirts-grid',
  templateUrl: './shirts-grid.component.html',
  styleUrls: ['./shirts-grid.component.css']
})
export class ShirtsGridComponent extends GridModel implements OnInit {

  
  @Input() ordini_idordini: string;

  // Dati coinvolti nel binding
  dummy_data: string = "dummy_data"
  testo_ricerca: string = "";  

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    // 'idcamicie',
    'colore', 
    'numero_capi',





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

  openResourceDialog(formModal: string, shirt?: Shirt) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      shirt: shirt,
      ordini_idordini: this.ordini_idordini, 
      formModal: formModal };

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
            // "idcamicie": result.idcamicie,
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

        console.log(obj);

        this.postData('shirts', obj); 

        

      }

    });    
    
  }   

  public openDeleteDialog(shirts: Shirt){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titolo: 'ATTENZIONE!', 
      messaggio: 'Eliminare la camicia dall\'ordine corrente?',
    };

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      
      if( result ) {       

        this.delData('shirts',        
          {
            "idcamicie": shirts.idcamicie
          }
        );

        this.getRemoteDataQuery('shirtsQuery',{idordini: String(this.ordini_idordini)});

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

  // OVERRIDE
  public delData(tagResourse: string, body: object):void {

    this.errorMessage = '';
    this.restBackendService.delResource(tagResourse, body).subscribe(
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



    this.openSnackBar(
        'avanti: ' +' ' + shirt.avanti + ' | ' + '\r' +
        'colore: ' +' ' + shirt.colore + ' | ' +
        'cuciture: ' +' ' + shirt.cuciture + ' | ' +
        'idcamicie: ' +' ' + shirt.idcamicie + ' | ' +
        'indietro: ' +' ' + shirt.indietro + ' | ' +
        'iniziali: ' +' ' + shirt.iniziali + ' | ' +
        'maiuscolo: ' +' ' + shirt.maiuscolo + ' | ' +
        'modello collo: ' +' ' + shirt.modellocollo + ' | ' +
        'modello polso: ' +' ' + shirt.modellopolso + ' | ' +
        'note: ' +' ' + shirt.note + ' | ' +
        'numero capi: ' +' ' + shirt.numero_capi + ' | ' +
        // 'ordini_idordini ' +' ' + shirt.idordini + ' | ' +
        'presenza iniziali: ' +' ' + shirt.presenza_iniziali + ' | ' +
        'posizione iniziali: ' +' ' + shirt.pos_iniziali + ' | ' +
        
        'stecche estraibili: ' +' ' + shirt.stecche_estraibili + ' | ' +
        'corsivo: ' +' ' + shirt.stile_carattere + ' | ' +
        'tasca: ' +' ' + shirt.tasca + ' | ' +
        'tipo bottone: ' +' ' + shirt.tipo_bottone     
    );
  }

}
