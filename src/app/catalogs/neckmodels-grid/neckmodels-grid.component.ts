import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { NeckModel } from '../data.model';
import { NeckmodelFormComponent } from '../neckmodel-form/neckmodel-form.component';
import { isUndefined } from 'util';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';

@Component({
  selector: 'app-neckmodels-grid',
  templateUrl: './neckmodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class NeckmodelsGridComponent extends GridModel implements OnInit {

  nome_catalogo: string = 'collo';
  
  constructor(
    restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog,
    snackBar: MatSnackBar
  ) { 
    super(restBackendService, snackBar); // si innesca il costruttore della classe padre
    this.resource = Array<NeckModel>();
  }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('neckmodels');     

  }

  openResourceDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(NeckmodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if(result){
           this.postData('neckmodels',        
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
        messaggio: 'Eliminare la voce ' + model.modello + ' dall\'archivio dei Modelli di Collo?',
      };
  
      const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.delData('neckmodels',        
            {
              "idmodello": model.idmodello
            }
          );
  
        }
        
      });     
  
    }    
 

  }