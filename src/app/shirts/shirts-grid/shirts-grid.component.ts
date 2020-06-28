import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatDialogConfig, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ShirtFormComponent } from '../shirt-form/shirt-form.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';

interface CamiciaElement {  
  idcamicie: number,
  colore: string,
  quantita: number,
  // stecche_estraibili: string,
  // tasca: string,
  // cuciture: string,
  // tipo_bottone: string,
  // iniziali: string,
  // posizione_iniziali: string,
  // stile_carattere: string,
  // maiuscolo: string,
  // note: string,
  // ordini_idordini: number,
  // modello_polso_idmodello_polso: number,
  // modelli_collo_idmodelli_collo: number,
  // avanti_idavanti: number,
  // indietro_idindietro: number,
}

@Component({
  selector: 'app-shirts-grid',
  templateUrl: './shirts-grid.component.html',
  styleUrls: ['./shirts-grid.component.css']
})
export class ShirtsGridComponent extends GridModel implements OnInit {

  @Input() ordini_idordini: number;

  // Dati coinvolti nel binding
  dummy_data: string = "dummy_data"
  testo_ricerca: string = "";  

  // Colonne visualizzate in tabella
  displayedColumns: string[] = [
    // 'idcamicie',
    'colore', 
    'quantita',
    'update',
    'delete'
  ];

  constructor( restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog,
    snackBar: MatSnackBar ) { 
    super(restBackendService, snackBar); // si innesca il costruttore della classe padre
  }

  ngOnInit() {
    this.getRemoteData('shirts');
  }

  openResourceDialog(formModal: string) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      indietro_idindietro: this.ordini_idordini, 
      formModal: formModal };

    const dialogRef = this.dialog.open(ShirtFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if(result) {
        console.log('insericso camicia');

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

     var obj = {    
        'avanti_idavanti': result.avanti_idavanti,
        "colore": result.colore,
        "cuciture": cuciture,
        // "idcamicie": result.idcamicie,
        "indietro_idindietro": result.indietro_idindietro,
        "iniziali": result.iniziali,
        "maiuscolo": result.maiuscolo,
        "modellocollo_idmodello": result.modellocollo_idmodello,
        "modellopolso_idmodello": result.modellopolso_idmodello,
        "note": result.note,
        "numero_capi": result.numero_capi,
        "ordini_idordini": 101, //result.ordini_idordini,
        "posizione_iniziali": result.posizione_iniziali.descrizione,
        "stecche_estraibili": stecche_estraibili,
        "stile_carattere": result.stile_carattere,
        "tasca": tasca,
        "tipo_bottone": result.tipo_bottone
      }

      console.log(obj);

      this.postData('shirts', obj); 


      }

    });    
    
  }   

  public openDeleteDialog(model: any){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titolo: 'ATTENZIONE!', 
      messaggio: 'Eliminare la camicia dall\'ordine corrente?',
    };

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delData('shirts',        
          {
            "idcamicie": model.idcamicie
          }
        );

      }
      
    });     

  }    
 

}
