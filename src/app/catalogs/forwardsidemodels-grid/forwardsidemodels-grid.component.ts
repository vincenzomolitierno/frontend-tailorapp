import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { ForwardModel } from '../data.model';
import { ForwardsidemodelFormComponent } from '../forwardsidemodel-form/forwardsidemodel-form.component';
import { isUndefined } from 'util';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';

@Component({
  selector: 'app-forwardsidemodels-grid',
  templateUrl: './forwardsidemodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class ForwardsidemodelsGridComponent extends GridModel implements OnInit {
  
  nome_catalogo: string = 'avanti';

  constructor(
    restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog,
    snackBar: MatSnackBar
  ) { 
    super(restBackendService, snackBar); // si innesca il costruttore della classe padre
    this.resource = Array<ForwardModel>();
    
    this.displayedCatalogColumns = [
      'idavanti',
      'modello', 
      // 'update',
      'delete'
    ];
   
  }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('forwardsidemodels');     

  }

  openResourceDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(ForwardsidemodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
            this.postData('forwardsidemodels',        
            {
              "modello": result
            });
          }

      });     
      
    } 

  public openDeleteDialog(model: any){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titolo: 'ATTENZIONE!', 
      messaggio: 'Eliminare la voce ' + model.descrizione + ' dall\'archivio dei Modelli Avanti?',
    };

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delData('forwardsidemodels',        
          {
            "idavanti": model.idavanti
          }
        );

      }
      
    });     

  }    
  

}

