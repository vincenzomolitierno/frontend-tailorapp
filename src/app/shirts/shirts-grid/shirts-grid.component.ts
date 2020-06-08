import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ShirtFormComponent } from '../shirt-form/shirt-form.component';

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
export class ShirtsGridComponent implements OnInit {

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
  dataSourceShirt;  

  @ViewChild('table', { read: MatSort, static: true }) sortShirts: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorShirts: MatPaginator;  

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getRemoteData();
    this.dataSourceShirt.sort = this.sortShirts;
    this.dataSourceShirt.paginator = this.paginatorShirts;    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceShirt.filter = filterValue.trim().toLowerCase();
  }  

  clearSearch(){
    this.dataSourceShirt.filter = "";
    this.testo_ricerca = "";
  }

  openShirtDialog(formModal: string, name: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {idshirt: "camicia 1", formModal: formModal };

    const dialogRef = this.dialog.open(ShirtFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }   
  
  getRemoteData() {
    
    const SHIRTS_DATA: CamiciaElement[] = [
      {
        idcamicie: 1,
        colore: 'rossa',
        quantita: 3
      },
      {
        idcamicie: 2,
        colore: 'gialla',
        quantita: 2
      }          
    ];

    this.dataSourceShirt = new MatTableDataSource(SHIRTS_DATA);  
  }    

}
