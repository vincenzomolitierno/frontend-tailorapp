import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import {  WirstModel } from '../data.model';
import { WristmodelFormComponent } from '../wristmodel-form/wristmodel-form.component';

@Component({
  selector: 'app-wristmodels-grid',
  templateUrl: './wristmodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class WristmodelsGridComponent extends GridModel implements OnInit {

  nome_catalogo: string = 'polso';

  // Colonne visualizzate in tabella
  // displayedColumns: string[] = [
  //   // 'idcamicie',
  //   'descrizione', 
  //   'update',
  //   'delete'
  // ];

  constructor(
    restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog
  ) { 
    super(restBackendService); // si innesca il costruttore della classe padre
    this.resource = Array<WirstModel>();
  }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('wirstmodel');     

  }

  openResourceDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(WristmodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result: ${result}');
      });    
      
    }   

}
