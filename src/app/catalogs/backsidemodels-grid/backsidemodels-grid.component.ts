import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { BacksidemodelFormComponent } from '../backsidemodel-form/backsidemodel-form.component';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { BacksideModel } from '../data.model';
import { isUndefined } from 'util';

@Component({
  selector: 'app-backsidemodels-grid',
  templateUrl: './backsidemodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class BacksidemodelsGridComponent extends GridModel implements OnInit  {

  nome_catalogo: string = 'dietro';

  constructor(
    restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog
  ) { 
    super(restBackendService); // si innesca il costruttore della classe padre
    this.resource = Array<BacksideModel>();
  }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('backsidemodel');     

  }

  //Metodo che permette di aprire la finestra di dialogo in modalità di inserimento o modifica della risorsa
  openResourceDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();

      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(BacksidemodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {      

        if(result){
            this.postData('backsidemodel',        
            {
              "modello": result
            });

          }

      });    
      
    } 

}