import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { NeckModel } from '../data.model';
import { NeckmodelFormComponent } from '../neckmodel-form/neckmodel-form.component';

@Component({
  selector: 'app-neckmodels-grid',
  templateUrl: './neckmodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class NeckmodelsGridComponent extends GridModel implements OnInit {

  nome_catalogo: string = 'collo';

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
    this.resource = Array<NeckModel>();
  }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('neckmodel');     

  }

  openResourceDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(NeckmodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result: ${result}');
      });    
      
    } 
 

  }