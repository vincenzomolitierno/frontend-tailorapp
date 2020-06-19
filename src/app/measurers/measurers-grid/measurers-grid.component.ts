import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { MeasurerFormComponent } from '../measurer-form/measurer-form.component';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { Measurer } from '../data.model';

@Component({
  selector: 'app-measurers-grid',
  templateUrl: './measurers-grid.component.html',
  styleUrls: ['./measurers-grid.component.css']
})
export class MeasurersGridComponent extends GridModel implements OnInit {

  tag_grid: string = 'misurometri';

    // Colonne visualizzate in tabella
    displayedColumns: string[] = [
      // 'idmisurometri',
      'descrizione',
      'idfasonatori',
      // 'update',
      // 'delete'
    ];

    constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog
    ) { 
      super(restBackendService); // si innesca il costruttore della classe padre
      this.resource = Array<Measurer>();
    }
  
    //Si inizializza il componente caricando i dati nella tabella
    ngOnInit() {
  
      //si invoca il metodo ereditato per caricare i dati dal backend, passando come
      //parametro in ingresso il tag che identifica la risorsa da recuperare
      this.getRemoteData('measurers');     
  
    }

  openResourceDialog(formModal: string, idCatolog: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idordini: idCatolog, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(MeasurerFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  } 
  
}
