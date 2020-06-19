import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { ForwardModel } from '../data.model';
import { ForwardsidemodelFormComponent } from '../forwardsidemodel-form/forwardsidemodel-form.component';
import { isUndefined } from 'util';

@Component({
  selector: 'app-forwardsidemodels-grid',
  templateUrl: './forwardsidemodels-grid.component.html',
  styleUrls: ['../catalogs.style.css']
})
export class ForwardsidemodelsGridComponent extends GridModel implements OnInit {
  
  nome_catalogo: string = 'avanti';

  constructor(
    restBackendService: RESTBackendService, // si inietta il servizio
    public dialog: MatDialog
  ) { 
    super(restBackendService); // si innesca il costruttore della classe padre
    this.resource = Array<ForwardModel>();
  }

  //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {

    //si invoca il metodo ereditato per caricare i dati dal backend, passando come
    //parametro in ingresso il tag che identifica la risorsa da recuperare
    this.getRemoteData('forwardsidemodel');     

  }

  openResourceDialog(formModal: string, idCatolog: string){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        idordini: idCatolog, 
        formModal: formModal, 
      };
  
      const dialogRef = this.dialog.open(ForwardsidemodelFormComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {

        console.log(result);

        if(!result && !isUndefined(result)){

            this.postData('forwardsidemodel',        
            {
              "modello": result
            });
          }

      });     
      
    } 
  

}

