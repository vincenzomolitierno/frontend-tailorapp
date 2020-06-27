import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ShirtFormComponent } from '../shirt-form/shirt-form.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';

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
    public dialog: MatDialog ) { 
    super(restBackendService); // si innesca il costruttore della classe padre
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
    });    
    
  }   
 

}
