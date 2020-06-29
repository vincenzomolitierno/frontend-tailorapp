import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialogConfig, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { SubcontractorFormComponent } from '../subcontractor-form/subcontractor-form.component';
import { Subcontractor } from '../subcontractor.model';
import { GridModel } from 'src/app/backend-service/datagrid.model';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { ActionConfirmDummyComponent } from 'src/app/utilities/action-confirm-dummy/action-confirm-dummy.component';

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
      public dialog: MatDialog,
      _snackBar: MatSnackBar
    ) { 
      super(restBackendService,_snackBar); // si innesca il costruttore della classe padre
      this.resource = Array<Subcontractor>();
    }
  
    //Si inizializza il componente caricando i dati nella tabella
  ngOnInit() {
  
      //si invoca il metodo ereditato per caricare i dati dal backend, passando come
      //parametro in ingresso il tag che identifica la risorsa da recuperare
      this.getRemoteData('subcontractors');     
  
    }

  openResourceDialog(formModal: string, subcontractor?: Subcontractor){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      subcontractor: subcontractor, 
      formModal: formModal, 
    };

    const dialogRef = this.dialog.open(SubcontractorFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if(result) {

        var subcontractor = new Subcontractor();
        subcontractor = result;

        if(formModal=='inserimento'){

          
        
          this.postData('subcontractors',        
          {
            "nome": subcontractor.nome,
            "telefono": subcontractor.telefono,
            "email": subcontractor.email
        });

        } else if(formModal=='aggiornamento'){

          this.putData('subcontractors',        
          {
            "idfasonatori": subcontractor.idfasonatori,
            "nome": subcontractor.nome,
            "telefono": subcontractor.telefono,
            "email": subcontractor.email
        });      

        }

      }

    });    
    
  }

  public openDeleteDialog(subcontractor: Subcontractor){

    console.log(subcontractor);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      titolo: 'ATTENZIONE!', 
      messaggio: 'Eliminare il fasonista ' + subcontractor.nome + ' ( ' + subcontractor.telefono  + ' ) dall\'archivio dei fasonisti?',
    };

    const dialogRef = this.dialog.open(ActionConfirmDummyComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.delData('subcontractors',        
          {
            "idfasonatori": subcontractor.idfasonatori
          }
        );

      }
      
    });     

  }

}
