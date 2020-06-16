import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { SubcontractorFormComponent } from '../subcontractor-form/subcontractor-form.component';
import { Subcontractor } from '../subcontractor.model';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';

@Component({
  selector: 'app-subcontractors-grid',
  templateUrl: './subcontractors-grid.component.html',
  styleUrls: ['./subcontractors-grid.component.css']
})
export class SubcontractorsGridComponent extends GridModel implements OnInit {

  tag_grid: string = 'fasonisti';
  
    // Colonne visualizzate in tabella
    displayedColumns: string[] = [
      // 'idcamicie',
      'nominativo',
      'telefono',
      'email',
      'update',
      'delete'
    ];

  constructor(
      restBackendService: RESTBackendService, // si inietta il servizio
      public dialog: MatDialog
    ) { 
      super(restBackendService); // si innesca il costruttore della classe padre
      this.resource = Array<Subcontractor>();
    }
  
    //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {
  
      //si invoca il metodo ereditato per caricare i dati dal backend, passando come
      //parametro in ingresso il tag che identifica la risorsa da recuperare
      this.getRemoteData('subcontractors');     
  
    }

  openResourceDialog(formModal: string, idCatolog: string){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      idordini: idCatolog, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(SubcontractorFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ${result}');
    });    
    
  }

}
